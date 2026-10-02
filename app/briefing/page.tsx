import type { Metadata } from 'next';
import BriefingBoardView from '@/components/briefing/BriefingBoardView';
import PageShell from '@/components/layout/PageShell';
import { briefingMetadata } from '@/config/site';
import { loadBriefing } from '@/domain/briefing/briefing';

export const metadata: Metadata = briefingMetadata();

/**
 * 브리핑은 평일 아침 한 번 올라온다.
 * 리터럴이어야 한다 — config/backendRoutes.ts 의 BRIEFING_REVALIDATE_SECONDS 와 같은 값.
 */
export const revalidate = 3600;

const EMPTY = '아직 가져온 브리핑이 없어요. 잠시 뒤에 다시 들러 주세요.';

export default async function Page() {
  // 날짜를 주지 않으면 최신 글이 온다 — 휴장일에도 빈 화면 대신 직전 거래일 글이 뜬다.
  const briefing = await loadBriefing();

  return (
    <PageShell>
      {briefing === null ? (
        <p className="text-sm leading-relaxed text-cb-muted">{EMPTY}</p>
      ) : (
        <BriefingBoardView briefing={briefing} />
      )}
    </PageShell>
  );
}
