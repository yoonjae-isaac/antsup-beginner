'use client';

import { useState } from 'react';
import SegmentedControl from '@/components/common/SegmentedControl';
import TickerLogo from '@/components/common/TickerLogo';
import JumiAvatar from '@/components/jumi/JumiAvatar';
import type { NewsMarket } from '@/config/backendRoutes';
import type { CalendarBoard, CalendarItem, CalendarKind } from '@/domain/calendar/calendar';
import { JUMI_ART } from '@/domain/jumi/artwork';

interface CalendarBoardViewProps {
  board: CalendarBoard;
}

const HEADING = '증시 일정';
const LEAD = '이번 주에 뭐가 예정돼 있는지만 알아도, 갑자기 놀랄 일이 줄어요.';
const JUMI_LEAD = '날짜를 눌러 보세요. 그 날 뭐가 있는지 한 번에 보여드릴게요.';
const EMPTY_WEEK = '이번 주 일정을 아직 가져오지 못했어요. 잠시 뒤에 다시 들러 주세요.';

const MARKETS = [
  { value: 'KR' as const, label: '국내' },
  { value: 'US' as const, label: '미국' },
];

const TAG: Record<CalendarKind, { text: string; className: string; legend: string }> = {
  earning: {
    text: '실적',
    className: 'bg-cb-point/15 text-cb-point',
    legend: '회사가 지난 분기 성적표를 내는 날',
  },
  economic: {
    text: '지표',
    className: 'bg-cb-trader/16 text-cb-trader',
    legend: '나라 전체 숫자가 나오는 날',
  },
  ipo: {
    text: '공모',
    className: 'bg-white/8 text-[#b6b6c0]',
    legend: '새 종목이 시장에 처음 올라오는 날',
  },
};

export default function CalendarBoardView({ board }: CalendarBoardViewProps) {
  // 기본은 미국. 실적·IPO·지표가 국내보다 훨씬 촘촘해서 처음 열었을 때 볼 게 있다.
  const [market, setMarket] = useState<NewsMarket>('US');
  const [dayIndex, setDayIndex] = useState<number | null>(null);

  const week = board[market];

  // 처음 열면 오늘이 잡혀 있어야 한다. 오늘이 이번 주에 없으면 첫날로 떨어진다.
  const todayIndex = week.days.findIndex((day) => day.isToday);
  const fallbackIndex = todayIndex === -1 ? 0 : todayIndex;
  const picked = Math.min(dayIndex ?? fallbackIndex, Math.max(week.days.length - 1, 0));
  const day = week.days[picked];

  function pickMarket(next: NewsMarket) {
    setMarket(next);
    // 시장마다 날짜 칸 수가 달라 인덱스를 들고 가면 엉뚱한 날이 잡힌다.
    setDayIndex(null);
  }

  return (
    <>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
        <div>
          <h1 className="text-[1.65rem] leading-snug font-bold tracking-tight lg:text-[2.5rem]">
            {HEADING}
          </h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-cb-muted lg:text-[15px]">{LEAD}</p>
        </div>

        <SegmentedControl
          fill
          label="시장 선택"
          onChange={pickMarket}
          options={MARKETS}
          value={market}
        />
      </div>

      <div className="mt-[18px] flex items-center gap-2.5 lg:mt-6 lg:gap-3">
        <JumiAvatar art={JUMI_ART.greeting} size="sm" />
        <p className="text-[13px] leading-snug text-cb-foreground lg:text-sm">{JUMI_LEAD}</p>
      </div>

      {week.days.length === 0 ? (
        <p className="mt-8 text-sm leading-relaxed text-cb-muted">{EMPTY_WEEK}</p>
      ) : (
        <>
          <div className="mt-6 flex items-baseline justify-between lg:mt-8">
            <h2 className="text-base font-bold tracking-tight lg:text-xl">{week.rangeLabel}</h2>
            <span className="text-[11.5px] text-cb-muted lg:text-[13px]">
              이번 주 {week.total}건
            </span>
          </div>

          <div className="mt-2.5 flex gap-1.5 lg:mt-4 lg:gap-2.5">
            {week.days.map((item, index) => {
              const on = index === picked;

              return (
                <button
                  aria-pressed={on}
                  className={`grow cursor-pointer rounded-xl border py-2.5 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cb-point lg:rounded-2xl lg:py-3.5 ${
                    on
                      ? 'border-transparent bg-cb-foreground'
                      : item.isToday
                        ? 'border-cb-point bg-cb-point/10'
                        : 'border-transparent bg-[#16161a] hover:bg-[#1f1f25]'
                  }`}
                  key={item.date}
                  onClick={() => setDayIndex(index)}
                  type="button"
                >
                  <span
                    className={`block text-[10.5px] font-bold lg:text-[11.5px] ${on ? 'text-[#16161a]' : 'text-cb-muted'}`}
                  >
                    {item.weekday}
                  </span>
                  <span
                    className={`mt-0.5 block font-mono text-base font-bold tabular-nums lg:mt-1 lg:text-[19px] ${on ? 'text-[#16161a]' : 'text-cb-foreground'}`}
                  >
                    {item.dayOfMonth}
                  </span>
                  <span
                    className={`mt-0.5 block text-[10px] lg:mt-[5px] lg:text-[11.5px] ${on ? 'text-[#16161a]' : 'text-cb-muted'}`}
                  >
                    {item.items.length === 0 ? '—' : `${item.items.length}건`}
                  </span>
                </button>
              );
            })}
          </div>

          <h3 className="mt-7 text-sm font-bold lg:mt-9 lg:text-base">
            {day.items.length === 0
              ? `${day.dayOfMonth}일 (${day.weekday}) · 예정된 일정이 없어요`
              : `${day.dayOfMonth}일 (${day.weekday})`}
          </h3>

          <ul className="mt-1.5 lg:mt-2.5">
            {day.items.map((item) => (
              <ItemRow item={item} key={item.id} />
            ))}
          </ul>
        </>
      )}

      {/* 태그 뜻풀이. 실적·지표·공모가 뭔지 모르면 목록이 그냥 글자 더미다. */}
      <dl className="mt-7 flex flex-col gap-2.5 border-t border-cb-border pt-5 lg:mt-9 lg:flex-row lg:gap-7">
        {(Object.keys(TAG) as CalendarKind[]).map((kind) => (
          <div className="flex items-center gap-2" key={kind}>
            <dt
              className={`shrink-0 rounded-md px-2 py-[3px] text-[10.5px] font-bold lg:text-[11.5px] ${TAG[kind].className}`}
            >
              {TAG[kind].text}
            </dt>
            <dd className="m-0 text-[11.5px] text-cb-muted lg:text-[12.5px]">{TAG[kind].legend}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

function ItemRow({ item }: { item: CalendarItem }) {
  const tag = TAG[item.kind];

  return (
    <li className="border-t border-cb-border py-3.5 lg:flex lg:items-center lg:gap-4 lg:py-4">
      <div className="flex items-center gap-2 lg:contents">
        <span
          className={`shrink-0 rounded-md px-2 py-[3px] text-center text-[10.5px] font-bold lg:w-[62px] lg:rounded-lg lg:px-0 lg:py-1 lg:text-[11.5px] ${tag.className}`}
        >
          {tag.text}
        </span>

        {/*
          로고는 실적에만. 지표·공모에는 종목이 없다.
          대체 글자는 심볼이 아니라 제목에서 뽑는다 — '005380.KS' 에서는 거래소
          코드인 'KS' 가 나오고, 제목에서는 '현' 이 나온다.
        */}
        {item.ticker !== null && <TickerLogo label={item.title} src={item.logo} />}

        {item.when !== null && (
          <span className="shrink-0 rounded-full bg-white/6 px-2 py-0.5 text-[10.5px] text-[#b6b6c0] lg:hidden">
            {item.when}
          </span>
        )}

        <span
          className={`ml-auto shrink-0 font-mono text-[11.5px] tabular-nums lg:hidden ${item.important ? 'font-bold text-cb-negative' : 'text-cb-muted'}`}
        >
          {item.meta}
        </span>
      </div>

      <div className="mt-2 min-w-0 grow lg:mt-0">
        <p className="text-[15px] font-bold tracking-tight lg:text-base">{item.title}</p>
        <p className="mt-1 text-xs leading-normal text-cb-muted lg:mt-[5px] lg:text-[12.5px]">
          {item.note}
        </p>
      </div>

      {item.when !== null && (
        <span className="hidden shrink-0 rounded-full bg-white/6 px-2.5 py-[3px] text-[11.5px] text-[#b6b6c0] lg:inline">
          {item.when}
        </span>
      )}

      <span
        className={`hidden w-[130px] shrink-0 text-right font-mono text-[13px] tabular-nums lg:inline ${item.important ? 'font-bold text-cb-negative' : 'text-cb-muted'}`}
      >
        {item.meta}
      </span>
    </li>
  );
}
