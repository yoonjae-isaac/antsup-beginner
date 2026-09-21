import type { Metadata } from 'next';
import InvestorsBoardView from '@/components/investors/InvestorsBoardView';
import PageShell from '@/components/layout/PageShell';
import { investorsMetadata } from '@/config/site';
import { loadInvestorsBoard } from '@/domain/investors/investors';

export const metadata: Metadata = investorsMetadata();

/**
 * 13F 는 분기에 한 번 바뀐다.
 * 리터럴이어야 한다 — config/backendRoutes.ts 의 GURU_REVALIDATE_SECONDS 와 같은 값.
 */
export const revalidate = 21600;

export default async function Page() {
  const board = await loadInvestorsBoard();

  return (
    <PageShell>
      <InvestorsBoardView board={board} />
    </PageShell>
  );
}
