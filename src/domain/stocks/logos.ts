import { backendGet } from '@/config/backend';
import { BACKEND_ROUTES } from '@/config/backendRoutes';

/** 백엔드 LOGO_BATCH_LIMIT 과 같은 값. 넘겨 보내면 뒤쪽이 조용히 잘린다. */
const BATCH_LIMIT = 40;

/**
 * 티커 묶음의 로고 URL을 받아온다. 없는 종목은 키가 없다.
 *
 * 출처가 Finnhub 프로필이라 국내 종목은 대부분 안 나온다 — 그래서 실패를 정상으로
 * 취급한다. 호출부는 로고가 없을 때의 모습(TickerLogo 의 약자 타일)을 항상 갖고 있어야 한다.
 */
export async function loadLogos(symbols: readonly string[]): Promise<Record<string, string>> {
  const unique = [...new Set(symbols.map((s) => s.trim().toUpperCase()).filter(Boolean))];
  if (unique.length === 0) return {};

  // 상한을 넘으면 나눠서 부른다. 잘린 뒤쪽이 통째로 로고를 잃는 것보다 낫다.
  const batches: string[][] = [];
  for (let i = 0; i < unique.length; i += BATCH_LIMIT) {
    batches.push(unique.slice(i, i + BATCH_LIMIT));
  }

  const results = await Promise.all(
    batches.map((batch) => backendGet(BACKEND_ROUTES.stockLogos, { symbols: batch })),
  );

  return Object.assign({}, ...results.map((result) => result ?? {})) as Record<string, string>;
}
