/**
 * 주어진 URL에서 노래 세부 정보를 가져오는 GET 요청을 처리합니다.
 *
 * @param {NextRequest} req - 들어오는 요청 객체.
 * @returns {Promise<NextResponse>} - 노래 세부 정보 또는 오류 메시지를 포함하는 JSON 응답으로 해결되는 약속.
 *
 * 함수는 다음 단계를 수행합니다:
 * 1. 요청에서 'url' 쿼리 매개변수를 추출합니다.
 * 2. 'url' 매개변수가 없으면 오류 메시지와 함께 400 응답을 반환합니다.
 * 3. axios를 사용하여 제공된 URL의 HTML 콘텐츠를 가져오려고 시도합니다.
 * 4. cheerio를 사용하여 HTML 콘텐츠를 구문 분석하여 Open Graph 메타 태그에서 노래 제목, 아티스트 및 이미지 URL을 추출합니다.
 * 5. 제목 또는 아티스트가 없으면 오류 메시지와 함께 400 응답을 반환합니다.
 * 6. 성공하면 추출된 노래 세부 정보와 함께 200 응답을 반환합니다.
 * 7. 가져오기 또는 구문 분석 과정에서 오류가 발생하면 오류 메시지와 함께 500 응답을 반환합니다.
 */
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
    const artist = $('meta[property="og:description"]').attr('content')?.split('·')[0].trim();
    const imgURL = $('meta[property="og:image"]').attr('content');
  
    if (!title || !artist) {
      return NextResponse.json({ error: 'Unable to fetch song details' }, { status: 400 });
    }

    return NextResponse.json({ title, artist, imgURL });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch title' }, { status: 500 });
  }
}
