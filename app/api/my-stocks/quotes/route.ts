import { NextResponse } from 'next/server';
import { backendGet } from '@/config/backend';
import { BACKEND_ROUTES, QUOTE_REVALIDATE_SECONDS } from '@/config/backendRoutes';
import { MAX_MY_STOCKS } from '@/domain/stocks/types';

/**
 * 담아 둔 종목 묶음 시세 — 브라우저가 부르는 프록시.
 *
 * 이 앱에서 브라우저가 서버를 부르는 첫 자리다. 목록이 브라우저에만 있어서 서버 렌더
 * 시점에는 누가 뭘 담았는지 알 수 없고, 그렇다고 브라우저가 백엔드를 직접 부를 수도 없다 —
 * 이 레포는 공개라 API_BASE_URL·INTERNAL_API_KEY 를 번들에 실으면 그대로 드러난다.
 * 그래서 키를 아는 쪽은 여기까지이고, 브라우저는 이 경로만 안다.
 *
 * 캐시는 세 층이 전부 1분이다 — 브라우저(QUOTE_TTL_MS) · 여기(Next Data Cache) ·
 * 백엔드 Redis. 같은 종목을 여러 사람이 담으므로 맨 아래 Redis 가 제일 많이 막아 준다.
 */
export const dynamic = 'force-dynamic';

export async function GET(request: Request): Promise<NextResponse> {
  const raw = new URL(request.url).searchParams.get('symbols') ?? '';
  const symbols = raw
    .split(',')
    .map((symbol) => symbol.trim())
    .filter((symbol) => symbol !== '')
    .slice(0, MAX_MY_STOCKS);

  if (symbols.length === 0) {
    return NextResponse.json([]);
  }

  // 실패는 null 이다. 빈 배열로 내려보내면 화면이 '가격을 못 가져왔어요'로 그린다 —
  // 여기서 5xx 를 던져 봐야 브라우저가 할 수 있는 일이 똑같다.
  const quotes = (await backendGet(BACKEND_ROUTES.marketQuotes, { symbols })) ?? [];

  return NextResponse.json(quotes, {
    headers: { 'Cache-Control': `private, max-age=${QUOTE_REVALIDATE_SECONDS}` },
  });
}
