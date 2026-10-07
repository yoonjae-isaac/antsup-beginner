import { NextResponse } from 'next/server';
import { searchSymbols } from '@/domain/stocks/catalog';

/**
 * 종목 검색 — 브라우저가 자동완성을 그리려고 부른다.
 *
 * 카탈로그(symbols.json, 1MB)를 번들에 싣지 않으려고 둔 길이다.
 * 백엔드에는 가지 않는다 — 검색은 우리 파일만 보면 되는 일이라 바깥으로 나갈 이유가 없다.
 *
 * 저장소를 읽지 않고 입력에만 의존하므로 같은 q 는 늘 같은 답이다. 그래서 CDN 에도
 * 맡긴다(s-maxage) — 'ㅅ', '삼', '삼성' 처럼 앞글자는 모두가 같은 걸 친다.
 */
export const dynamic = 'force-dynamic';

const CACHE_SECONDS = 3600;

export function GET(request: Request): NextResponse {
  const query = new URL(request.url).searchParams.get('q') ?? '';
  const hits = searchSymbols(query);

  return NextResponse.json(hits, {
    headers: { 'Cache-Control': `public, max-age=60, s-maxage=${CACHE_SECONDS}` },
  });
}
