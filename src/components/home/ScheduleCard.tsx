import Link from 'next/link';
import PreviewIcon from '@/components/home/PreviewIcon';
import { CALENDAR_PATH } from '@/domain/calendar/route';
import { PREVIEW_SCHEDULE_MORE, PREVIEW_SCHEDULE_TITLE } from '@/domain/jumi/landingCopy';
import type { ScheduleItem, TodaySchedule } from '@/domain/preview/schedule';

interface ScheduleCardProps {
  schedule: TodaySchedule;
}

/**
 * 좁은 카드에서 보여줄 줄 수.
 *
 * 카드 높이가 고정이라 이 이상은 아래가 잘린다. 나머지는 밑줄의 '전체 N건'이 받는다.
 * 넓은 카드는 CARD_LIMIT(도메인) 까지 전부 세운다.
 */
const NARROW_ROWS = 3;

const KIND_TAG: Record<ScheduleItem['kind'], { text: string; className: string }> = {
  economic: { text: '지표', className: 'bg-cb-trader/16 text-cb-trader' },
  earning: { text: '실적', className: 'bg-cb-point/15 text-cb-point' },
};

/**
 * 오늘 증시 일정 카드.
 *
 * 카드 전체가 링크다 — 여기 담긴 건 오늘 일정의 일부라서, 더 보려면 갈 곳이
 * 있어야 한다. 안에 또 링크를 두지 않는 이유도 같다(링크 안의 링크는 못 만든다).
 */
export default function ScheduleCard({ schedule }: ScheduleCardProps) {
  return (
    <Link
      className="flex size-full flex-col overflow-hidden rounded-[22px] border border-cb-border bg-cb-surface p-5 transition-colors hover:border-cb-border-strong hover:bg-cb-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cb-point lg:rounded-3xl lg:p-7"
      href={CALENDAR_PATH}
    >
      <header className="flex items-center gap-2.5">
        <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[10px] bg-cb-tile text-cb-trader lg:size-9 lg:rounded-xl">
          <PreviewIcon name="schedule" />
        </span>
        <h2 className="text-[12.5px] font-bold text-cb-foreground lg:text-[13px]">
          {PREVIEW_SCHEDULE_TITLE}
        </h2>
        <span className="ml-auto text-[11px] text-cb-muted lg:text-xs">{schedule.dateLabel}</span>
      </header>

      <ul className="mt-3 flex flex-col gap-1.5 lg:mt-6 lg:gap-[13px]">
        {schedule.items.map((item, index) => {
          const tag = KIND_TAG[item.kind];

          return (
            <li
              className={`items-center gap-2 lg:gap-3 ${
                index < NARROW_ROWS ? 'flex' : 'hidden lg:flex'
              }`}
              key={item.id}
            >
              <span
                className={`shrink-0 rounded-md px-1.5 py-[2px] text-[10px] font-bold lg:px-2 lg:py-[3px] lg:text-[11.5px] ${tag.className}`}
              >
                {tag.text}
              </span>
              {/*
                min-w-0 이 없으면 truncate 가 듣지 않는다 — flex 아이템의 기본 min-width
                는 auto 라, 긴 종목명이 칸을 밀어내고 오른쪽 꼬리를 카드 밖으로 보낸다.
              */}
              <span className="min-w-0 grow truncate text-[11.5px] font-bold lg:text-sm">
                {item.title}
              </span>
              <span className="shrink-0 text-[10.5px] text-cb-muted lg:text-xs">
                {item.marketLabel}
              </span>
              <span
                className={`hidden shrink-0 text-xs lg:inline lg:w-[62px] lg:text-right ${
                  item.important ? 'font-bold text-cb-negative' : 'text-cb-muted'
                }`}
              >
                {item.meta}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-auto pt-2.5 text-[11px] text-cb-muted lg:pt-4 lg:text-xs">
        {PREVIEW_SCHEDULE_MORE(schedule.total)}
      </p>
    </Link>
  );
}
