import type { Metadata } from 'next';
import { homeMetadata } from '@/config/site';
import { loadMarketSnapshot } from '@/domain/preview/market';
import HomePage from '@/views/HomePage';

export const metadata: Metadata = homeMetadata();

/**
 * 시세가 붙으면서 이 페이지만 완전 정적에서 ISR 로 바뀐다.
 * 레슨 페이지들은 그대로 정적이다 — 바깥에서 오는 값이 없다.
 *
 * 숫자를 상수로 빼서 import 하면 빌드가 죽는다. Next 는 세그먼트 설정을
 * 정적으로 읽어야 해서 리터럴만 받는다("Invalid segment configuration export").
 * config/backendRoutes.ts 의 MARKET_REVALIDATE_SECONDS 와 같은 값을 유지할 것.
 */
export const revalidate = 60;

// route 파일은 얇게 — 화면 구성은 src/views 가 갖는다.
export default async function Page() {
  const market = await loadMarketSnapshot();

  return <HomePage market={market} />;
}
