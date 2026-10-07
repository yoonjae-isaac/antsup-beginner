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

/**
 * `/market/quotes` 한 건 — 지수와 같은 모양에 장 상태만 더했다.
 * 도메인 쪽 StockQuote 와 같은 필드를 쓴다. 여기 둔 건 '백엔드가 주는 모양' 이라는 뜻이고,
 * 화면이 쓰는 타입은 domain/stocks/types.ts 가 갖는다.
 */
export interface StockQuoteResponse {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  marketState: 'REGULAR' | 'CLOSED' | 'PRE' | 'PREPRE' | 'POST' | 'POSTPOST';
}

/**
 * 종목 시세 갱신 주기(초).
 *
 * 브라우저 캐시(QUOTE_TTL_MS)·백엔드 Redis TTL 과 같은 1분이다. Next 의 Data Cache 는
 * 이 엔드포인트만 꺼 두므로(noStore) 실제로 값을 들고 있는 층은 그 둘뿐이고,
 * 이 값은 프록시 응답의 Cache-Control 을 정하는 데 쓴다.
 */
export const QUOTE_REVALIDATE_SECONDS = 60;

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

/**
 * 종목 관련 뉴스 갱신 주기(초).
 *
 * 피드(5분)보다 짧은 1분이다. 백엔드가 이걸 DB 에 쌓지 않고 부를 때마다 외부 API 로
 * 나가면서 Redis 에 1분만 들고 있어서, 그 위에 더 긴 창을 씌우면 백엔드가 이미 새로
 * 받아 온 기사를 Next 가 가리게 된다.
 */
export const TICKER_NEWS_REVALIDATE_SECONDS = 60;

/** `/macro/overview` 한 건. entry 는 카탈로그 정의, latest 는 최신 관측이다. */
export interface MacroOverviewResponse {
  entry: {
    id: string;
    label: string;
    unit: string;
    category: string;
    importance: string;
    /** daily | weekly | monthly | quarterly | annual. 기준일을 어디까지 쓸지 정한다. */
    frequency: string;
    description?: string;
  };
  latest: {
    date: string | null;
    value: number | null;
    /** 전년 동기 대비 %. 지수형 지표는 이 값이 본체다. */
    yoyChange: number | null;
    momChange: number | null;
  };
}

/** FRED 는 하루에 한 번꼴로 갱신된다. 그보다 자주 받아올 이유가 없다. */
export const MACRO_REVALIDATE_SECONDS = 3600;

/** `/calendar` — 실적·IPO·경제지표가 한 응답에 같이 온다. */
export interface CalendarWeekResponse {
  from: string;
  to: string;
  earnings: {
    date: string;
    symbol: string;
    /** bmo(장전) | amc(장후) | dmh(장중) | '' */
    hour: string;
    epsEstimate: number | null;
    /** KR 은 기업명, US 는 비어 있어 심볼로 읽는다. */
    name?: string;
  }[];
  ipos: { date: string; symbol: string; name: string; price: string | null }[];
  economic: { date: string; key: string; event: string; impact: string }[];
}

/** 백엔드가 하루 한 번 주간 일정을 미리 데워 둔다. */
export const CALENDAR_REVALIDATE_SECONDS = 3600;

/** `/disclosure/13f/overview` — 투자자 카드용. */
export interface GuruOverviewResponse {
  asOf: string;
  investors: {
    name: string;
    cik: string;
    /** 이 투자자가 신고한 분기 기준일. 사람마다 다르다 — 늦게 내는 곳이 있다. */
    reportDate: string;
    /** 대표 분기 기준 몇 분기 뒤처졌는지. 0 이면 최신. */
    quartersBehind: number;
    totalValue: number;
    positionCount: number;
    topHolding?: { nameOfIssuer: string; ticker?: string; weight: number };
    newCount: number;
    exitCount: number;
    isStale?: boolean;
  }[];
  filing: { asOfCount: number; totalInvestors: number };
}

/** 한 종목을 들고 있는 거장 한 명. `/13f/stats` 의 holders 항목. */
export interface GuruStatHolderResponse {
  /** 인물명만 온다('Warren Buffett'). CIK 는 없다. */
  name: string;
  value: number;
  change: 'new' | 'increased' | 'decreased' | 'unchanged' | 'exit';
}

/** `/disclosure/13f/stats` 의 종목 한 건. */
export interface GuruStatStockResponse {
  cusip: string;
  ticker?: string;
  nameOfIssuer: string;
  holderCount: number;
  totalValue: number;
  buyerCount: number;
  sellerCount: number;
  holderDelta?: number;
  /** 누가 들고 있는지. 오래된 스냅샷에는 없을 수 있다. */
  holders?: GuruStatHolderResponse[];
}

export interface GuruStatsResponse {
  asOf: string;
  mostHeld: GuruStatStockResponse[];
  mostBought: GuruStatStockResponse[];
  mostSold: GuruStatStockResponse[];
}

/** 13F 는 분기에 한 번 바뀐다. 여섯 시간도 과하게 촘촘한 편이다. */
export const GURU_REVALIDATE_SECONDS = 21600;

/** 로고는 거의 안 바뀐다. 백엔드도 Redis 에 30일 들고 있다. */
export const LOGO_REVALIDATE_SECONDS = 86400;

/**
 * `/briefing/daily` — 장전 브리핑 한 건.
 *
 * sections 안쪽은 출처(개미승리)가 준 모양 그대로라 타입을 박지 않는다.
 * 실제로 날마다 구조가 바뀌는 섹션이 있어서, 고르는 일은 전부
 * domain/briefing/briefing.ts 가 방어적으로 한다.
 */
export interface BriefingResponse {
  briefingDate: string;
  summaryLine: string;
  sections?: {
    topIssues?: unknown;
    themeRadar?: unknown;
    weeklySchedules?: unknown;
    newThemes?: unknown;
    riskMonitoring?: unknown;
    scanChecklist?: unknown;
    analystComment?: unknown;
  };
  fetchedAt: string;
}

/** `/briefing/list` 한 건. */
export interface BriefingListResponse {
  briefingDate: string;
  summaryLine: string;
}

/** 브리핑은 평일 아침에 하루 한 번 올라온다. 한 시간이면 넉넉하다. */
export const BRIEFING_REVALIDATE_SECONDS = 3600;

export const BACKEND_ROUTES = {
  marketFx: defineEndpoint<FxResponse>({
    path: '/market/fx',
    revalidate: MARKET_REVALIDATE_SECONDS,
  }),

  marketIndices: defineEndpoint<IndexQuoteResponse[]>({
    path: '/market/indices',
    revalidate: MARKET_REVALIDATE_SECONDS,
  }),

  /**
   * 담아 둔 종목 묶음 시세 — '내 주식'이 쓴다.
   *
   * 한 번에 최대 20종목(백엔드 MAX_QUOTE_SYMBOLS). 허용 목록 밖이거나 시세를 못 받은
   * 종목은 응답에서 빠지므로, 부르는 쪽이 보낸 심볼과 짝지어 빈자리를 그려야 한다.
   */
  marketQuotes: defineEndpoint<StockQuoteResponse[], { symbols: readonly string[] }>({
    path: '/market/quotes',
    revalidate: QUOTE_REVALIDATE_SECONDS,
    // 가격은 낡으면 거짓말이 된다 — Next 층을 건너뛰고 브라우저(1분)와 백엔드 Redis(1분)만 둔다.
    noStore: true,
    query: ({ symbols }) => ({ symbols: symbols.join(',') }),
  }),

  newsArticles: defineEndpoint<NewsArticleResponse[], { market: NewsMarket; limit: number }>({
    path: '/news',
    revalidate: NEWS_REVALIDATE_SECONDS,
    query: ({ market, limit }) => ({ market, limit: String(limit) }),
  }),

  /**
   * 종목 관련 뉴스 (온디맨드, 최신 10). DB 에 쌓이지 않고 백엔드가 그때 외부 API 를 부른다.
   *
   * query 가 시장마다 다른 값이다 — KR 은 네이버 검색어라 **회사명**, US 는 Finnhub
   * company-news 라 **티커**다. 코드로 KR 을 찾으면 엉뚱한 기사가 섞인다.
   */
  newsTicker: defineEndpoint<NewsArticleResponse[], { market: NewsMarket; query: string }>({
    path: '/news/ticker',
    revalidate: TICKER_NEWS_REVALIDATE_SECONDS,
    query: ({ market, query }) => ({ market, query }),
  }),

  newsDigests: defineEndpoint<NewsDigestResponse[], { market: NewsMarket; limit: number }>({
    path: '/news/digest',
    revalidate: NEWS_REVALIDATE_SECONDS,
    query: ({ market, limit }) => ({ market, limit: String(limit) }),
  }),

  macroOverview: defineEndpoint<MacroOverviewResponse[]>({
    path: '/macro/overview',
    revalidate: MACRO_REVALIDATE_SECONDS,
  }),

  calendarWeek: defineEndpoint<CalendarWeekResponse, { market: NewsMarket }>({
    path: '/calendar',
    revalidate: CALENDAR_REVALIDATE_SECONDS,
    query: ({ market }) => ({ market }),
  }),

  guruOverview: defineEndpoint<GuruOverviewResponse>({
    path: '/disclosure/13f/overview',
    revalidate: GURU_REVALIDATE_SECONDS,
  }),

  guruStats: defineEndpoint<GuruStatsResponse>({
    path: '/disclosure/13f/stats',
    revalidate: GURU_REVALIDATE_SECONDS,
  }),

  /** date 가 빈 문자열이면 백엔드가 최신 글을 준다 — 휴장일 대비. */
  briefingDaily: defineEndpoint<BriefingResponse, { date: string }>({
    path: '/briefing/daily',
    revalidate: BRIEFING_REVALIDATE_SECONDS,
    query: ({ date }): Record<string, string> => (date === '' ? {} : { date }),
  }),

  briefingList: defineEndpoint<BriefingListResponse[], { limit: number }>({
    path: '/briefing/list',
    revalidate: BRIEFING_REVALIDATE_SECONDS,
    query: ({ limit }) => ({ limit: String(limit) }),
  }),

  /**
   * 티커 → 로고 URL. 없는 종목은 키 자체가 없다.
   * 한 번에 40개까지만 받으므로(백엔드 LOGO_BATCH_LIMIT) 호출부가 잘라서 보내야 한다.
   */
  stockLogos: defineEndpoint<Record<string, string>, { symbols: readonly string[] }>({
    path: '/stocks/logos',
    revalidate: LOGO_REVALIDATE_SECONDS,
    query: ({ symbols }) => ({ symbols: symbols.join(',') }),
  }),
} as const;
