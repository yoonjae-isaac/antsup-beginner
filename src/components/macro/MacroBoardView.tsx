'use client';

import { useState } from 'react';
import SegmentedControl from '@/components/common/SegmentedControl';
import JumiAvatar from '@/components/jumi/JumiAvatar';
import { JUMI_ART } from '@/domain/jumi/artwork';
import { MACRO_HEADLINE_IDS, type MacroBoard, type MacroIndicator } from '@/domain/macro/macro';

interface MacroBoardViewProps {
  board: MacroBoard;
}

const ALL = '전체';

const MACRO_HEADING = '거시 지표';
const MACRO_LEAD = '물가, 고용, 금리. 개별 종목보다 먼저 시장 전체를 움직이는 숫자들이에요.';
const MACRO_JUMI_LEAD = '숫자가 어려우면 작년보다 옆의 화살표만 보셔도 돼요. 그게 방향이거든요.';
const MACRO_EMPTY = '아직 가져온 지표가 없어요. 잠시 뒤에 다시 들러 주세요.';
const MACRO_NOTE =
  '미국 FRED 공개 데이터예요. 발표 주기가 지표마다 달라서 기준일도 제각각이에요. 올라간 쪽을 빨강으로 표시했고, 좋고 나쁨을 판정하지는 않아요 — 방향만 보여드려요.';

export default function MacroBoardView({ board }: MacroBoardViewProps) {
  const [category, setCategory] = useState(ALL);

  const headlines = MACRO_HEADLINE_IDS.flatMap((id) => {
    const found = board.indicators.find((item) => item.id === id);
    return found ? [found] : [];
  });

  const rows =
    category === ALL
      ? board.indicators
      : board.indicators.filter((item) => item.category === category);

  const options = [
    { value: ALL, label: ALL },
    ...board.categories.map((name) => ({ value: name, label: name })),
  ];

  return (
    <>
      <h1 className="text-[1.65rem] leading-snug font-bold tracking-tight lg:text-[2.5rem]">
        {MACRO_HEADING}
      </h1>
      <p className="mt-2 text-[13.5px] leading-relaxed text-cb-muted lg:text-[15px]">{MACRO_LEAD}</p>

      <div className="mt-[18px] flex items-center gap-2.5 lg:mt-6 lg:gap-3">
        <JumiAvatar art={JUMI_ART.greeting} size="sm" />
        <p className="text-[13px] leading-snug text-cb-foreground lg:text-sm">{MACRO_JUMI_LEAD}</p>
      </div>

      {board.indicators.length === 0 ? (
        <p className="mt-8 text-sm leading-relaxed text-cb-muted">{MACRO_EMPTY}</p>
      ) : (
        <>
          {headlines.length > 0 && (
            <div className="mt-[18px] grid grid-cols-2 gap-3 lg:mt-6 lg:grid-cols-4 lg:gap-5">
              {headlines.map((item) => (
                <HeadlineCard indicator={item} key={item.id} />
              ))}
            </div>
          )}

          {/* 칩이 넘치면 가로로 민다. 줄바꿈하면 목록이 아래로 밀려 내려간다. */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto lg:mt-11">
            <SegmentedControl
              label="지표 분류"
              onChange={setCategory}
              options={options}
              value={category}
            />
            <span className="ml-auto hidden shrink-0 text-[13px] text-cb-muted lg:inline">
              {rows.length}개 지표
            </span>
          </div>

          <ul className="mt-2 lg:mt-3">
            {rows.map((item) => (
              <IndicatorRow indicator={item} key={item.id} />
            ))}
          </ul>
        </>
      )}

      <p className="mt-5 text-[11.5px] leading-relaxed text-cb-muted lg:mt-6 lg:text-[12.5px]">
        {MACRO_NOTE}
      </p>
    </>
  );
}

/** 오른 쪽이 빨강. 주미가 위에서 안내한 규칙과 같아야 한다. */
function changeColor(direction: MacroIndicator['direction']): string {
  if (direction === 'up') return 'text-cb-negative';
  if (direction === 'down') return 'text-cb-positive';
  return 'text-cb-muted';
}

function HeadlineCard({ indicator }: { indicator: MacroIndicator }) {
  // 수준이 뜻을 갖는 지표는 값을, 지수형은 변동을 크게 쓴다.
  const big = indicator.levelIsMeaningful ? indicator.value : (indicator.yoy ?? indicator.value);
  const bigColor = indicator.levelIsMeaningful
    ? 'text-cb-foreground'
    : changeColor(indicator.direction);
  const caption = indicator.levelIsMeaningful ? '지금' : '작년보다';

  return (
    <li className="flex list-none flex-col rounded-2xl border border-cb-border bg-cb-surface p-4 lg:p-6">
      <span className="text-xs font-bold text-cb-foreground lg:text-[13px]">{indicator.label}</span>

      {indicator.description !== '' && (
        <span className="mt-1.5 hidden text-[12.5px] leading-relaxed text-cb-muted lg:block">
          {indicator.description}
        </span>
      )}

      <span className="grow" />

      <span className="mt-3 text-[11.5px] text-cb-muted lg:mt-[18px] lg:text-xs">{caption}</span>
      <span
        className={`mt-0.5 font-mono text-[26px] leading-none font-bold tabular-nums lg:text-[34px] ${bigColor}`}
      >
        {big}
      </span>

      <span className="mt-1.5 font-mono text-[11px] tabular-nums text-cb-muted lg:mt-2 lg:text-xs">
        {indicator.levelIsMeaningful ? (
          <>
            {indicator.yoy !== null && (
              <span className={changeColor(indicator.direction)}>{indicator.yoy}</span>
            )}{' '}
            {indicator.asOf} 기준
          </>
        ) : (
          <>
            {indicator.value} · {indicator.asOf} 기준
          </>
        )}
      </span>
    </li>
  );
}

function IndicatorRow({ indicator }: { indicator: MacroIndicator }) {
  return (
    <li className="border-t border-cb-border py-[15px] lg:flex lg:items-center lg:gap-5 lg:py-[18px]">
      <span className="hidden w-16 shrink-0 text-[11.5px] font-bold tracking-wider text-cb-muted lg:block">
        {indicator.category}
      </span>

      <div className="lg:w-[300px] lg:shrink-0">
        <div className="flex items-baseline gap-2.5">
          <span className="grow text-sm font-bold lg:text-[15px]">{indicator.label}</span>
          {/* 좁은 화면에서는 변동을 이름 옆에 붙인다 — 오른쪽 열을 따로 둘 폭이 없다. */}
          <span
            className={`shrink-0 font-mono text-[13.5px] font-bold tabular-nums lg:hidden ${changeColor(indicator.direction)}`}
          >
            {indicator.yoy ?? '—'}
          </span>
        </div>

        {indicator.description !== '' && (
          <p className="mt-1.5 hidden text-[12.5px] leading-normal text-cb-muted lg:block">
            {indicator.description}
          </p>
        )}
      </div>

      <div className="mt-1.5 flex items-baseline gap-2 lg:mt-0 lg:grow lg:gap-5">
        <span className="grow font-mono text-[12.5px] tabular-nums text-[#b6b6c0] lg:text-right lg:text-[17px] lg:font-bold lg:text-cb-foreground">
          {indicator.value}
        </span>
        <span
          className={`hidden w-24 shrink-0 text-right font-mono text-sm font-bold tabular-nums lg:inline ${changeColor(indicator.direction)}`}
        >
          {indicator.yoy ?? '—'}
        </span>
        <span className="shrink-0 font-mono text-[11.5px] tabular-nums text-cb-muted lg:w-[92px] lg:text-right lg:text-[12.5px]">
          {indicator.asOf}
        </span>
      </div>
    </li>
  );
}
