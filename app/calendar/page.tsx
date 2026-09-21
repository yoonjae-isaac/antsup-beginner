import type { Metadata } from 'next';
import CalendarBoardView from '@/components/calendar/CalendarBoardView';
import PageShell from '@/components/layout/PageShell';
import { calendarMetadata } from '@/config/site';
import { loadCalendarBoard } from '@/domain/calendar/calendar';

export const metadata: Metadata = calendarMetadata();

/**
 * 백엔드가 하루 한 번 주간 일정을 미리 데워 둔다.
 * 리터럴이어야 한다 — config/backendRoutes.ts 의 CALENDAR_REVALIDATE_SECONDS 와 같은 값.
 */
export const revalidate = 3600;

export default async function Page() {
  const board = await loadCalendarBoard();

  return (
    <PageShell>
      <CalendarBoardView board={board} />
    </PageShell>
  );
}
