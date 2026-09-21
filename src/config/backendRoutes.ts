import { defineEndpoint } from '@/config/backend';

/**
 * cash-bite-backend 엔드포인트 목록 — 호출을 추가할 때 여는 파일은 여기 하나다.
 *
 * 경로·신선도(ISR 창)·쿼리 모양·응답 타입을 한 자리에 모아 둔다.
 * 도메인 코드는 경로 문자열을 직접 쓰지 않고 BACKEND_ROUTES 의 이름으로만 부른다 —
 * 호출이 늘어나면 경로가 여기저기 흩어지고, 같은 엔드포인트를 서로 다른
 * revalidate 로 부르는 일이 반드시 생긴다.
 *
 * 응답 타입은 백엔드가 내려주는 생김새(wire) 그대로 적는다. 화면이 쓰는 모양으로
 * 바꾸는 일은 도메인 쪽(src/domain/...)이 한다. 이 파일만 열면 백엔드와 주고받는
 * 내용이 전부 보여야 한다.
 *
 * 엔드포인트 추가:
 *
 *   marketFinancials: defineEndpoint<FinancialsResponse, { ticker: string }>({
 *     path: '/market/financials',
 *     revalidate: 3600,
 *     query: ({ ticker }) => ({ ticker }),
 *   }),
 *
 * 호출: backendGet(BACKEND_ROUTES.marketFinancials, { ticker: '005930.KS' })
 */

/** `/market/fx` — USD/KRW. 조회 실패 시 백엔드가 usdKrw: null 을 준다. */
export interface FxResponse {
  usdKrw: number | null;
}

/** `/market/indices` 한 건. 백엔드는 나스닥·다우·코스피·코스닥·니케이를 준다. */
export interface IndexQuoteResponse {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
}

/**
 * 지수·환율 갱신 주기(초).
 *
 * 이 값은 app/page.tsx 의 `export const revalidate` 와 맞춰야 한다.
 * 거기서 import 해 가지 못하는 이유는 Next 가 세그먼트 설정을 정적으로 읽어야 해서
 * 리터럴만 받기 때문이다("Invalid segment configuration export").
 */
export const MARKET_REVALIDATE_SECONDS = 60;

/** 뉴스 시장 구분. 백엔드 쿼리 값 그대로다. */
export type NewsMarket = 'KR' | 'US';

/**
 * `/news` 한 건. publisher·summary 는 기사에 따라 빈다.
 *
 * 백엔드는 image 도 주지만 화면에서 쓰지 않는다 — 제3자 도메인이라 next/image 로
 * 최적화할 수 없고, 핫링크를 막는 언론사가 섞여 있어 목록에 깨진 칸이 생긴다.
 */
export interface NewsArticleResponse {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  publisher?: string;
  summary?: string;
}

/**
 * `/news/digest` 한 건 — 하루치 요약이 아니라 **매시 회차**다.
 *
 * 크론이 한 시간마다 아직 요약에 안 쓰인 기사만 모아 생성하고, 프롬프트가
 * 같은 날 앞 회차와 겹치는 사건을 빼도록 지시한다. 그래서 회차끼리 내용이
 * 이어지지 않고, 뒤로 갈수록 가벼워진다 — 최신 한 건만 보여주면 안 되는 이유다.
 */
export interface NewsDigestResponse {
  digestDate: string;
  summary: string;
  articleCount: number;
  generatedAt: string;
}

/**
 * 뉴스 갱신 주기(초). 기사 수집 크론이 5분 간격이라 그보다 자주 받아올 이유가 없다.
 * app/news/page.tsx 의 `export const revalidate` 와 같은 값을 유지할 것.
 */
export const NEWS_REVALIDATE_SECONDS = 300;

export const BACKEND_ROUTES = {
  marketFx: defineEndpoint<FxResponse>({
    path: '/market/fx',
    revalidate: MARKET_REVALIDATE_SECONDS,
  }),

  marketIndices: defineEndpoint<IndexQuoteResponse[]>({
    path: '/market/indices',
    revalidate: MARKET_REVALIDATE_SECONDS,
  }),

  newsArticles: defineEndpoint<NewsArticleResponse[], { market: NewsMarket; limit: number }>({
    path: '/news',
    revalidate: NEWS_REVALIDATE_SECONDS,
    query: ({ market, limit }) => ({ market, limit: String(limit) }),
  }),

  newsDigests: defineEndpoint<NewsDigestResponse[], { market: NewsMarket; limit: number }>({
    path: '/news/digest',
    revalidate: NEWS_REVALIDATE_SECONDS,
    query: ({ market, limit }) => ({ market, limit: String(limit) }),
  }),
} as const;
