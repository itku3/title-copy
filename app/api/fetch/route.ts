import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Spotify 이미지 도메인 allowlist
const ALLOWED_IMG_HOSTS = [
  'i.scdn.co',
  'mosaic.scdn.co',
  'lineup-images.scdn.co',
  'seeded-session-images.scdn.co',
  'image-cdn-ak.spotifycdn.com',
  'image-cdn-fa.spotifycdn.com',
];

// SSRF 방어: private/loopback/link-local 대역 패턴
const PRIVATE_IP_PATTERN =
  /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|127\.|0\.|169\.254\.|::1|fc|fd|fe80)/i;

function isAllowedUrl(raw: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return false;
  }
  // https만 허용
  if (parsed.protocol !== 'https:') return false;
  // Spotify 도메인만 허용
  const host = parsed.hostname.toLowerCase();
  if (host !== 'open.spotify.com') return false;
  // private IP 차단 (hostname이 IP인 경우)
  if (PRIVATE_IP_PATTERN.test(host)) return false;
  return true;
}

function sanitizeImgUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== 'https:') return null;
    const host = parsed.hostname.toLowerCase();
    if (!ALLOWED_IMG_HOSTS.some((allowed) => host === allowed || host.endsWith('.' + allowed))) return null;
    if (PRIVATE_IP_PATTERN.test(host)) return null;
    return raw;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  if (!isAllowedUrl(url)) {
    return NextResponse.json({ error: 'Invalid or disallowed URL' }, { status: 400 });
  }

  try {
    const { data, headers } = await axios.get(url, {
      timeout: 8000,
      maxContentLength: 2 * 1024 * 1024, // 2MB
      maxBodyLength: 2 * 1024 * 1024,
      maxRedirects: 3,
      responseType: 'text',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SpotifyCopyBot/1.0)',
      },
    });

    const contentType = headers['content-type'] ?? '';
    if (!contentType.includes('text/html')) {
      return NextResponse.json({ error: 'Unexpected content type' }, { status: 400 });
    }

    const $ = cheerio.load(data);

    const title = $('meta[property="og:title"]').attr('content');
    const artist = $('meta[property="og:description"]').attr('content')?.split('·')[0].trim();
    const rawImgUrl = $('meta[property="og:image"]').attr('content');
    const imgURL = sanitizeImgUrl(rawImgUrl);

    if (!title || !artist) {
      return NextResponse.json({ error: 'Unable to fetch song details' }, { status: 400 });
    }

    return NextResponse.json({ title, artist, imgURL });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return NextResponse.json({ error: 'Request timed out' }, { status: 504 });
      }
      if (error.response?.status === 429) {
        return NextResponse.json({ error: 'Rate limited by Spotify' }, { status: 429 });
      }
    }
    return NextResponse.json({ error: 'Failed to fetch title' }, { status: 500 });
  }
}
