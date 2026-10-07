import type { Metadata } from 'next';
import PageShell from '@/components/layout/PageShell';
import MyStocksBoardView from '@/components/stocks/MyStocksBoardView';
import { myStocksMetadata } from '@/config/site';

export const metadata: Metadata = myStocksMetadata();

// 바깥에서 받아 오는 값이 없다 — 목록은 브라우저에, 가격은 브라우저가 라우트 핸들러에
// 물어 받는다. 그래서 이 페이지는 레슨처럼 완전 정적이고 ISR 창도 없다.

export default function Page() {
  return (
    <PageShell>
      <MyStocksBoardView />
    </PageShell>
  );
}
