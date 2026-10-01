import Link from 'next/link';
import PreviewIcon from '@/components/home/PreviewIcon';
import {
  PREVIEW_MACRO_FRESHNESS,
  PREVIEW_MACRO_MORE,
  PREVIEW_MACRO_TITLE,
} from '@/domain/jumi/landingCopy';
import { MACRO_HEADLINE_SHORT_LABEL, type MacroIndicator } from '@/domain/macro/macro';
import { MACRO_PATH } from '@/domain/macro/route';

interface MacroCardProps {
  indicators: readonly MacroIndicator[];
}

/** 오른 쪽이 빨강. 거시 지표 페이지의 같은 규칙과 어긋나면 안 된다. */
function changeColor(direction: MacroIndicator['direction']): string {
  if (direction === 'up') return 'text-cb-negative';
  if (direction === 'down') return 'text-cb-positive';
  return 'text-cb-muted';
}

/**
 * 거시 지표 카드 — 대표 네 개.
 *
 * 거시 지표 페이지 상단 카드와 같은 넷, 같은 규칙으로 읽는다. 수준 자체가 뜻을
 * 갖는 지표(실업률·금리)는 값을 크게 쓰고, 지수형(CPI)은 '작년보다'를 크게 쓴다 —
 * '지수 320.52' 는 초보에게 아무 뜻도 아니기 때문이다.
 */
export default function MacroCard({ indicators }: MacroCardProps) {
  return (
    <Link
      className="flex size-full flex-col overflow-hidden rounded-[22px] border border-cb-border bg-cb-surface p-5 transition-colors hover:border-cb-border-strong hover:bg-cb-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cb-point lg:rounded-3xl lg:p-7"
      href={MACRO_PATH}
    >
      <header className="flex items-center gap-2.5">
        <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[10px] bg-cb-tile text-cb-value lg:size-9 lg:rounded-xl">
          <PreviewIcon name="macro" />
        </span>
        <h2 className="text-[12.5px] font-bold text-cb-foreground lg:text-[13px]">
          {PREVIEW_MACRO_TITLE}
        </h2>
        <span className="ml-auto text-[11px] text-cb-muted lg:text-xs">
          {PREVIEW_MACRO_FRESHNESS}
        </span>
      </header>

      {/* 좁은 카드는 2×2, 넓은 카드는 한 줄씩. 같은 마크업이 두 배치를 본다. */}
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 lg:mt-5 lg:grid-cols-1 lg:gap-0">
        {indicators.map((item) => {
          // 수준이 뜻을 갖는 지표는 값을, 지수형은 변동을 크게 쓴다.
          const big = item.levelIsMeaningful ? item.value : (item.yoy ?? item.value);
          const bigColor = item.levelIsMeaningful
            ? 'text-cb-foreground'
            : changeColor(item.direction);
          const caption = item.levelIsMeaningful ? '지금' : '작년보다';

          return (
            <li
              className="min-w-0 lg:mt-[13px] lg:flex lg:items-baseline lg:gap-3 lg:border-t lg:border-cb-border lg:pt-[13px] lg:first:mt-0 lg:first:border-t-0 lg:first:pt-0"
              key={item.id}
            >
              <span className="block truncate text-[10.5px] text-cb-muted lg:grow lg:text-sm lg:font-bold lg:text-cb-foreground">
                {MACRO_HEADLINE_SHORT_LABEL[item.id] ?? item.label}
              </span>

              <span className="mt-0.5 flex items-baseline gap-1.5 lg:mt-0 lg:shrink-0 lg:gap-2.5">
                <span
                  className={`font-mono text-[17px] leading-none font-bold tabular-nums lg:text-[22px] ${bigColor}`}
                >
                  {big}
                </span>
                <span className="text-[9.5px] text-cb-muted lg:text-[11px]">{caption}</span>
              </span>

              {/*
                수준형 지표는 변동(+0.2%p)을, 지수형은 원값('지수 322.48')을 따로 붙인다.
                지수형의 변동은 이미 위에 크게 서 있어서다. 폭을 넉넉히 잡고 nowrap 을
                거는 이유는 '지수 322.48' 이 두 줄로 접히면 그 줄만 키가 커지기 때문이다.
              */}
              <span
                className={`hidden w-[84px] shrink-0 text-right font-mono text-[12.5px] font-bold tabular-nums whitespace-nowrap lg:inline ${
                  // 원값에는 색을 입히지 않는다 — 빨강·파랑은 '올랐다/내렸다'는 뜻이라,
                  // 수준인 '지수 322.48' 에 칠하면 그 숫자가 변동인 것처럼 읽힌다.
                  item.levelIsMeaningful ? changeColor(item.direction) : 'text-cb-muted'
                }`}
              >
                {item.levelIsMeaningful ? (item.yoy ?? '—') : item.value}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-auto pt-2.5 text-[11px] text-cb-muted lg:pt-4 lg:text-xs">
        {PREVIEW_MACRO_MORE}
      </p>
    </Link>
  );
}
