import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const title = $('meta[property="og:title"]').attr('content');
    const artist = $('meta[property="og:description"]').attr('content')?.split('·')[1].trim();
    const imgURL = $('meta[property="og:image"]').attr('content');
    
    if (!title || !artist) {
      return NextResponse.json({ error: 'Unable to fetch song details' }, { status: 400 });
    }

    return NextResponse.json({ title, artist, imgURL });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch title' }, { status: 500 });
  }
}
