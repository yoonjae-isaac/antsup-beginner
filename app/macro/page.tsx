import type { Metadata } from 'next';
import PageShell from '@/components/layout/PageShell';
import MacroBoardView from '@/components/macro/MacroBoardView';
import { macroMetadata } from '@/config/site';
import { loadMacroBoard } from '@/domain/macro/macro';

export const metadata: Metadata = macroMetadata();

/**
 * FRED 는 하루 한 번꼴로 갱신된다.
 * 리터럴이어야 한다 — config/backendRoutes.ts 의 MACRO_REVALIDATE_SECONDS 와 같은 값.
 */
export const revalidate = 3600;

export default async function Page() {
  const board = await loadMacroBoard();

  return (
    <PageShell>
      <MacroBoardView board={board} />
    </PageShell>
  );
}
