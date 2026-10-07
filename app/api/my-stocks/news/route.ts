import { NextResponse } from 'next/server';
import { backendGet } from '@/config/backend';
import { BACKEND_ROUTES, TICKER_NEWS_REVALIDATE_SECONDS } from '@/config/backendRoutes';
import { toArticles } from '@/domain/news/news';
import { findSymbol } from '@/domain/stocks/catalog';
import { tickerNewsQuery } from '@/domain/stocks/types';

/**
 * 담아 둔 종목 한 건의 관련 뉴스 — 목록에서 종목을 펼칠 때 부른다.
 *
 * 브라우저는 **코드만** 보낸다. 종목명과 시장은 서버 카탈로그에서 찾는다 —
 * 이 이름이 그대로 네이버 검색어로 나가고 (market, query) 로 캐시되기 때문에,
 * 브라우저가 준 문자열을 그대로 흘리면 남의 서버에 임의 검색을 대신 쏘는 길이 된다.
 *
 * 상대 시각은 여기서 만든다. 화면이 기사 목록 말고는 할 일이 없어야 한다.
 */
export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<NextResponse> {
  const code = new URL(request.url).searchParams.get('code') ?? '';
  const symbol = findSymbol(code);

  // 카탈로그에 없는 코드는 빈 목록이다. 404 를 줘 봐야 화면이 할 수 있는 일이 같다.
  if (symbol === null) {
    return NextResponse.json([]);
  }

  const rows = (await backendGet(BACKEND_ROUTES.newsTicker, tickerNewsQuery(symbol))) ?? [];

  return NextResponse.json(toArticles(rows, new Date()), {
    headers: { 'Cache-Control': `private, max-age=${TICKER_NEWS_REVALIDATE_SECONDS}` },
  });
}
