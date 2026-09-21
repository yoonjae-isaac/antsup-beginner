import { backendGet } from '@/config/backend';

/**
 * 홈 프리뷰가 쓰는 시장 한 장면.
 * cash-bite-backend 의 `/market/fx` + `/market/indices` 두 호출을 합친 결과다.
 */
export interface MarketIndex {
  /** 주린이가 아는 이름. 백엔드가 주는 name 은 영문이라 여기서 갈아 끼운다. */
  label: string;
  price: number;
  changePercent: number;
}

export interface MarketSnapshot {
  usdKrw: number;
  indices: readonly MarketIndex[];
}

/** 백엔드 `/market/indices` 응답 한 건. */
interface IndexQuote {
  symbol: string;
  price: number;
  changePercent: number;
}

/**
 * 카드에 올릴 지수와 그 순서.
 *
 * 백엔드는 니케이까지 다섯 개를 주지만 여기선 넷만 쓴다 — 주린이 화면에
 * 니케이가 왜 있는지 설명할 자리가 없다. 국내 둘을 먼저 두는 것도 같은 이유다.
 */
const INDEX_LABELS: readonly { symbol: string; label: string }[] = [
  { symbol: '^KS11', label: '코스피' },
  { symbol: '^KQ11', label: '코스닥' },
  { symbol: '^IXIC', label: '나스닥' },
  { symbol: '^DJI', label: '다우' },
];

/**
 * 시세 갱신 주기(초). 지수는 백엔드가 이미 30초 캐시를 두고 있다.
 * app/page.tsx 의 `export const revalidate` 와 같은 값이어야 한다 — 그쪽은
 * Next 제약으로 리터럴만 쓸 수 있어 여기서 import 해 가지 못한다.
 */
export const MARKET_REVALIDATE_SECONDS = 60;

/**
 * 시장 한 장면을 받아온다. 하나라도 비면 통째로 null 이다.
 *
 * 반쪽짜리를 그리지 않는 이유: 환율만 있고 지수가 없거나 그 반대면 카드가
 * 텅 빈 채로 남는데, 초보 눈에는 그게 '고장난 화면'으로 읽힌다.
 * 아예 없으면 명언 카드만 조용히 보여주면 된다.
 */
export async function loadMarketSnapshot(): Promise<MarketSnapshot | null> {
  const [fx, quotes] = await Promise.all([
    backendGet<{ usdKrw: number | null }>('/market/fx', MARKET_REVALIDATE_SECONDS),
    backendGet<IndexQuote[]>('/market/indices', MARKET_REVALIDATE_SECONDS),
  ]);

  const usdKrw = fx?.usdKrw;
  if (usdKrw == null || !Number.isFinite(usdKrw) || !Array.isArray(quotes)) return null;

  const bySymbol = new Map(quotes.map((quote) => [quote.symbol, quote]));
  const indices = INDEX_LABELS.flatMap(({ symbol, label }) => {
    const quote = bySymbol.get(symbol);
    if (!quote || !Number.isFinite(quote.price) || !Number.isFinite(quote.changePercent)) {
      return [];
    }
    return [{ label, price: quote.price, changePercent: quote.changePercent }];
  });

  if (indices.length === 0) return null;

  return { usdKrw, indices };
}
