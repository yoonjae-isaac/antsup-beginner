/** 카탈로그가 다루는 다섯 시장. 지수(k-index·n-index)는 종목이 아니라 들어 있지 않다. */
export type StockMarket = 'KOSPI' | 'KOSDAQ' | 'NASDAQ' | 'NYSE' | 'AMEX';

/** 화면에 붙이는 시장 이름. 영문 코드를 그대로 보여 주면 주린이에게는 읽히지 않는다. */
export const MARKET_LABEL: Record<StockMarket, string> = {
  KOSPI: '코스피',
  KOSDAQ: '코스닥',
  NASDAQ: '나스닥',
  NYSE: '뉴욕',
  AMEX: '아멕스',
};

/** 검색 결과 한 건. 담을 때 이 모양 그대로 브라우저에 들어간다. */
export interface SymbolHit {
  code: string;
  name: string;
  market: StockMarket;
}

/**
 * 담아 둔 종목 한 건.
 *
 * 이름·시장까지 같이 저장하는 이유는, 시세를 못 받아 온 날에도 목록이 '005930' 이 아니라
 * '삼성전자'로 보여야 하기 때문이다. 카탈로그는 서버에만 있어 브라우저가 되찾을 수 없다.
 *
 * 수량·평단은 일부러 받지 않는다. 그걸 받는 순간 수익률이 나오고, 수익률이 나오면
 * '그래서 팔까요'가 따라붙는다 — 푸터의 '매수·매도를 권유하지 않아요'와 정면으로 부딪힌다.
 */
export type MyStock = SymbolHit;

/**
 * 담을 수 있는 최대 종목 수.
 *
 * 백엔드 MAX_QUOTE_SYMBOLS 와 같은 값이어야 한다 — 여기가 더 크면 담았는데 가격이
 * 안 나오는 종목이 생긴다. 'use client' 가 붙지 않은 이 파일에 두는 건 브라우저 저장소
 * 쪽과 라우트 핸들러가 같이 봐야 하기 때문이다.
 */
export const MAX_MY_STOCKS = 20;

/** 국내 두 시장. 관련 뉴스 검색어가 시장마다 달라 가를 일이 생긴다. */
const KR_MARKETS: readonly StockMarket[] = ['KOSPI', 'KOSDAQ'];

/**
 * 관련 뉴스를 물을 때 쓸 (market, query).
 *
 * 백엔드 `/news/ticker` 는 KR 이면 네이버 검색이라 **회사명**을, US 면 Finnhub
 * company-news 라 **티커**를 받는다. KR 에 코드를 넣으면 '005930' 이 그대로 검색어가 되어
 * 기사가 거의 안 잡히고, US 에 한글명을 넣으면 아무것도 안 나온다.
 */
export function tickerNewsQuery(stock: SymbolHit): { market: 'KR' | 'US'; query: string } {
  return KR_MARKETS.includes(stock.market)
    ? { market: 'KR', query: stock.name }
    : { market: 'US', query: stock.code };
}

/** Yahoo 가 말하는 장 상태. 기준 시각 문구를 '방금'과 '종가' 중에 고르는 데 쓴다. */
export type MarketState = 'REGULAR' | 'CLOSED' | 'PRE' | 'PREPRE' | 'POST' | 'POSTPOST';

/** 백엔드 `/market/quotes` 한 건. */
export interface StockQuote {
  /** 우리가 보낸 심볼 그대로. Yahoo 가 붙인 .KS/.KQ 는 백엔드가 떼고 준다. */
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  marketState: MarketState;
}
