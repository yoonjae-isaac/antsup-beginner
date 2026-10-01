'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import MacroCard from '@/components/home/MacroCard';
import MarketCard from '@/components/home/MarketCard';
import QuoteCard from '@/components/home/QuoteCard';
import ScheduleCard from '@/components/home/ScheduleCard';
import {
  PREVIEW_AUTO_HINT,
  PREVIEW_MACRO_TITLE,
  PREVIEW_MANUAL_HINT,
  PREVIEW_MARKET_TITLE,
  PREVIEW_NAV_LABEL,
  PREVIEW_NEXT_LABEL,
  PREVIEW_PREV_LABEL,
  PREVIEW_QUOTE_TITLE,
  PREVIEW_SCHEDULE_TITLE,
} from '@/domain/jumi/landingCopy';
import type { MacroIndicator } from '@/domain/macro/macro';
import type { MarketSnapshot } from '@/domain/preview/market';
import type { TodaySchedule } from '@/domain/preview/schedule';
import type { InvestorQuote } from '@/domain/preview/quotes';

interface ContentPreviewProps {
  /** 백엔드가 닿지 않으면 null — 그 카드만 빠지고 나머지는 그대로 돈다. */
  market: MarketSnapshot | null;
  schedule: TodaySchedule | null;
  macro: readonly MacroIndicator[];
  quote: InvestorQuote;
  quoteIndex: number;
  quoteTotal: number;
}

/**
 * 자동 전환 간격.
 *
 * 카드가 둘일 때는 3초였다. 지금은 일정·지표처럼 읽을 게 든 카드가 섞여서,
 * 3초면 제목만 보고 넘어간다.
 */
const ROTATE_MS = 5000;

/**
 * 덱에서 실제로 보이는 깊이. 0=앞장, 1=바로 뒷장, 2=그보다 뒤(감춘다).
 * 넉 장이 전부 포개지면 뒤쪽이 비죽비죽 삐져나와 덱이 지저분해진다.
 */
const MAX_DEPTH = 2;

/**
 * 홈 좌측의 컨텐츠 프리뷰.
 *
 * 카드가 몇 장인지는 백엔드에서 뭘 받아왔는지에 달렸다. 한 장뿐이면 돌릴 것도,
 * 고를 것도 없으므로 타이머와 조작부가 통째로 사라진다.
 * 움직임 자체(가로 슬라이드 / 덱)는 globals.css 의 .preview-* 가 맡고,
 * 여기서는 지금 몇 번째 카드가 앞인지만 정한다.
 */
export default function ContentPreview({
  market,
  schedule,
  macro,
  quote,
  quoteIndex,
  quoteTotal,
}: ContentPreviewProps) {
  const cards: { id: string; label: string; body: ReactNode }[] = [
    ...(market
      ? [{ id: 'market', label: PREVIEW_MARKET_TITLE, body: <MarketCard market={market} /> }]
      : []),
    ...(schedule
      ? [
          {
            id: 'schedule',
            label: PREVIEW_SCHEDULE_TITLE,
            body: <ScheduleCard schedule={schedule} />,
          },
        ]
      : []),
    ...(macro.length > 0
      ? [{ id: 'macro', label: PREVIEW_MACRO_TITLE, body: <MacroCard indicators={macro} /> }]
      : []),
    {
      id: 'quote',
      label: PREVIEW_QUOTE_TITLE,
      body: <QuoteCard quote={quote} index={quoteIndex} total={quoteTotal} />,
    },
  ];

  const [front, setFront] = useState(0);
  // 한 번이라도 직접 넘기면 자동 전환을 멈춘다. 읽는 중에 카드가 바뀌면,
  // 넘긴 사람 입장에서는 눌러 봐야 소용없는 화면이 된다.
  const [manual, setManual] = useState(false);

  // front 를 의존성에 둔 게 의도다 — 직접 고른 순간에도 타이머가 처음부터 다시 돈다.
  useEffect(() => {
    if (manual || cards.length < 2) return;

    const timer = setTimeout(() => {
      setFront((current) => (current + 1) % cards.length);
    }, ROTATE_MS);

    return () => clearTimeout(timer);
  }, [cards.length, front, manual]);

  function pick(index: number) {
    setManual(true);
    // 음수도 받는다 — '이전'이 첫 장에서 마지막 장으로 돌아가야 한다.
    setFront(((index % cards.length) + cards.length) % cards.length);
  }

  return (
    <section aria-label={PREVIEW_NAV_LABEL}>
      {/*
        lg 에서 overflow 를 풀어야 한다. 뒤로 물러난 카드가 위로 올라가는데
        여기서 자르면 그만큼 잘려 나간다. 유틸리티로 적어야 하는 이유는
        globals.css 의 미디어쿼리보다 Tailwind 유틸리티가 나중에 적용되기 때문이다.
      */}
      <div className="preview-viewport h-48 overflow-hidden lg:h-[470px] lg:overflow-visible">
        <div className="preview-track h-full" style={{ '--front': front } as CSSProperties}>
          {cards.map((card, index) => {
            const behind = (index - front + cards.length) % cards.length;

            return (
              /*
                앞장이 아닌 카드는 inert. 카드 자체가 링크라서, 이게 없으면 화면에
                안 보이는(또는 반쯤 비친) 카드로 탭 포커스가 들어가고 눌리기까지 한다.
              */
              <div
                className="preview-card"
                data-depth={Math.min(behind, MAX_DEPTH)}
                inert={index !== front}
                key={card.id}
              >
                {card.body}
              </div>
            );
          })}
        </div>
      </div>

      {cards.length > 1 && (
        <div className="flex items-center justify-center lg:mt-3 lg:justify-start">
          <NavButton label={PREVIEW_PREV_LABEL} onClick={() => pick(front - 1)} step={-1} />

          {cards.map((card, index) => (
            <button
              aria-current={index === front}
              aria-label={`${card.label} 카드 보기`}
              className="flex size-11 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cb-point"
              key={card.id}
              onClick={() => pick(index)}
              type="button"
            >
              <span
                className={`block h-[3px] rounded-full transition-all duration-300 ${
                  index === front ? 'w-[26px] bg-cb-point' : 'w-3.5 bg-cb-border-strong'
                }`}
              />
            </button>
          ))}

          <NavButton label={PREVIEW_NEXT_LABEL} onClick={() => pick(front + 1)} step={1} />

          <span className="ml-2.5 hidden text-xs text-cb-muted lg:inline">
            {manual ? PREVIEW_MANUAL_HINT : PREVIEW_AUTO_HINT}
          </span>
        </div>
      )}
    </section>
  );
}

interface NavButtonProps {
  label: string;
  onClick: () => void;
  /** -1 이면 왼쪽, 1 이면 오른쪽을 가리킨다. */
  step: -1 | 1;
}

/**
 * 수동 넘기기 버튼.
 *
 * 점 인디케이터만 있을 때도 고를 수는 있었지만, 점은 '지금 몇 번째'를 알리는
 * 표시로 읽히지 누르는 것으로는 안 읽힌다. 화살표가 그 역할을 맡는다.
 * 44px 터치 영역은 유지하고 눈에 보이는 원만 작게 둔다.
 */
function NavButton({ label, onClick, step }: NavButtonProps) {
  return (
    <button
      aria-label={label}
      className="group flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cb-point"
      onClick={onClick}
      type="button"
    >
      <span className="flex size-7 items-center justify-center rounded-full border border-cb-border bg-cb-surface text-cb-muted transition-colors group-hover:border-cb-border-strong group-hover:text-cb-foreground">
        <svg
          aria-hidden="true"
          className="size-3.5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d={step === -1 ? 'M14.5 5.5 8 12l6.5 6.5' : 'M9.5 5.5 16 12l-6.5 6.5'} />
        </svg>
      </span>
    </button>
  );
}
