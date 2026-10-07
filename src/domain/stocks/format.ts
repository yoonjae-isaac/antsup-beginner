import type { MarketState, StockQuote } from './types';

const KRW = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 0 });
const DECIMAL = new Intl.NumberFormat('ko-KR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * 가격 표기. 원화는 소수점이 없고(71,900원), 그 외는 두 자리다($184.22).
 *
 * 통화 기호를 Intl 의 currency 포맷에 맡기지 않는 이유는 'US$' 처럼 ko-KR 로케일이
 * 붙이는 접두사가 섞여 나오기 때문이다. 쓰는 통화가 둘뿐이라 직접 적는 게 짧다.
 */
export function formatPrice(price: number, currency: string): string {
  if (currency === 'KRW') return `${KRW.format(price)}원`;
  if (currency === 'USD') return `$${DECIMAL.format(price)}`;
  return `${DECIMAL.format(price)} ${currency}`.trim();
}

/** 전일 대비 금액. 부호를 직접 붙인다 — 빼기 기호(−)는 하이픈보다 숫자와 높이가 맞는다. */
export function formatChange(change: number, currency: string): string {
  const sign = change > 0 ? '+' : change < 0 ? '−' : '';
  return `${sign}${formatPrice(Math.abs(change), currency)}`;
}

/** 등락률. 화살표는 숫자 앞에 붙고, 보합(0%)은 화살표 없이 둔다. */
export function formatChangePercent(changePercent: number): string {
  if (changePercent === 0) return '0.00%';
  const arrow = changePercent > 0 ? '▲' : '▼';
  return `${arrow} ${Math.abs(changePercent).toFixed(2)}%`;
}

/**
 * 상승은 빨강(cb-up), 하락은 파랑(cb-down). 국내 관행이고 홈 카드도 같은 색을 쓴다.
 * 보합은 색을 주지 않는다 — 0% 에 빨강이나 파랑이 붙으면 움직인 것처럼 읽힌다.
 */
export function changeColorClass(changePercent: number): string {
  if (changePercent > 0) return 'text-cb-up';
  if (changePercent < 0) return 'text-cb-down';
  return 'text-cb-muted';
}

/**
 * 기준 시각 문구.
 *
 * 장이 열려 있을 때와 닫혀 있을 때 같은 숫자가 다른 뜻이다. 장중 71,900원은 지금 값이고
 * 장 마감 뒤 71,900원은 오늘 끝난 값이다. 둘을 같은 말로 적으면 주말에 들어온 사람이
 * 이 가격이 지금 움직이는 줄 안다.
 */
export function freshnessLabel(quotes: readonly StockQuote[]): string {
  const state: MarketState | undefined = quotes[0]?.marketState;

  if (state === 'REGULAR') return '지금 장중 가격이에요';
  if (state === 'PRE' || state === 'PREPRE') return '장 열리기 전, 어제 종가예요';
  if (state === 'POST' || state === 'POSTPOST') return '장 마감 뒤 시간외 가격이에요';
  return '오늘 장 마감 가격이에요';
}
