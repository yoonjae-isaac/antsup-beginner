'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import BriefingCard from '@/components/home/BriefingCard';
import MacroCard from '@/components/home/MacroCard';
import MarketCard from '@/components/home/MarketCard';
import QuoteCard from '@/components/home/QuoteCard';
import ScheduleCard from '@/components/home/ScheduleCard';
import type { Briefing } from '@/domain/briefing/types';
import {
  PREVIEW_AUTO_HINT,
  PREVIEW_BRIEFING_TITLE,
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
  briefing: Briefing | null;
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
 * 스와이프로 인정하는 최소 이동(px). 그보다 짧으면 제자리로 돌아간다.
 * 카드가 통째로 링크라서, 누르려다 손가락이 조금 흐른 것을 넘기기로 읽으면 안 된다.
 */
const SWIPE_PX = 40;

/** 가로인지 세로인지 정하는 데 필요한 최소 이동(px). 그 전까지는 아무것도 안 한다. */
const AXIS_LOCK_PX = 8;

/**
 * 끝 카드에서 더 밀 때 손가락을 따라오는 비율.
 *
 * 버튼은 끝에서 반대편으로 돌지만 스와이프는 돌지 않는다. 손가락은 오른쪽으로
 * 밀었는데 트랙이 왼쪽으로 넉 장을 달려가면 어디로 갔는지 놓친다. 대신 조금만
 * 따라와서 '여기가 끝'이라고 알린다.
 */
const EDGE_RESISTANCE = 0.35;

interface Gesture {
  pointerId: number;
  startX: number;
  startY: number;
  /** null 이면 아직 방향이 안 정해진 것. 'y' 면 페이지 스크롤이라 손을 뗀다. */
  axis: 'x' | 'y' | null;
}

/**
 * 홈 좌측의 컨텐츠 프리뷰.
 *
 * 카드가 몇 장인지는 백엔드에서 뭘 받아왔는지에 달렸다. 한 장뿐이면 돌릴 것도,
 * 고를 것도 없으므로 타이머와 조작부가 통째로 사라진다.
 * 움직임 자체(가로 슬라이드 / 덱)는 globals.css 의 .preview-* 가 맡고,
 * 여기서는 지금 몇 번째 카드가 앞인지(--front)와, 모바일에서 손가락을 따라
 * 끌려온 거리(--drag)만 정한다.
 */
export default function ContentPreview({
  market,
  briefing,
  schedule,
  macro,
  quote,
  quoteIndex,
  quoteTotal,
}: ContentPreviewProps) {
  const cards: { id: string; label: string; body: ReactNode }[] = [
    // 장전 브리핑이 맨 앞이다 — 아침에 들어온 사람에게 오늘을 가장 먼저 말해 준다.
    ...(briefing
      ? [
          {
            id: 'briefing',
            label: PREVIEW_BRIEFING_TITLE,
            body: <BriefingCard briefing={briefing} />,
          },
        ]
      : []),
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

  const trackRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<Gesture | null>(null);
  // 방금 스와이프한 손가락이 떨어질 때 따라오는 click 을 한 번 삼킨다.
  // 카드가 링크라서, 안 삼키면 넘기려던 손길이 페이지 이동이 된다.
  const swipedRef = useRef(false);

  /**
   * 끄는 동안의 오프셋은 React 상태로 두지 않는다. 손가락이 움직일 때마다 덱 전체를
   * 다시 그릴 이유가 없어서 트랙의 --drag 만 직접 바꾼다. --front 는 React 가 갖고
   * 있고 둘은 다른 속성이라 서로 덮지 않는다. data-dragging 은 CSS 가 전환을 끄는
   * 신호다 — 500ms 전환이 켜진 채로는 트랙이 손가락보다 늦게 따라온다.
   */
  function setDrag(px: number, dragging: boolean) {
    const track = trackRef.current;
    if (!track) return;
    track.style.setProperty('--drag', `${px}px`);
    track.toggleAttribute('data-dragging', dragging);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    // 마우스는 받지 않는다. lg 의 덱은 옆으로 미는 구조가 아니고, 링크 위에서
    // 마우스를 끌면 텍스트 선택과 겹친다. 터치와 펜만이다.
    if (event.pointerType === 'mouse' || cards.length < 2) return;
    swipedRef.current = false;
    gestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      axis: null,
    };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;

    if (gesture.axis === null) {
      if (Math.abs(dx) < AXIS_LOCK_PX && Math.abs(dy) < AXIS_LOCK_PX) return;
      gesture.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      // 손가락으로 넘기기 시작한 순간 자동 전환을 멈춘다 — 버튼과 같은 이유다.
      if (gesture.axis === 'x') setManual(true);
    }
    if (gesture.axis !== 'x') return;

    const atEdge = (dx > 0 && front === 0) || (dx < 0 && front === cards.length - 1);
    setDrag(atEdge ? dx * EDGE_RESISTANCE : dx, true);
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    gestureRef.current = null;
    if (gesture.axis !== 'x') return;

    swipedRef.current = true;
    // --drag 를 0 으로 되돌리는 것과 --front 가 바뀌는 것이 같은 프레임에 들어간다
    // (React 는 포인터 이벤트 안의 상태 변경을 핸들러가 끝날 때 바로 커밋한다).
    // 그래서 끌려온 자리에서 새 카드까지 한 번의 전환으로 이어진다.
    setDrag(0, false);
    const dx = event.clientX - gesture.startX;
    if (dx <= -SWIPE_PX && front < cards.length - 1) pick(front + 1);
    else if (dx >= SWIPE_PX && front > 0) pick(front - 1);
  }

  function onPointerCancel(event: PointerEvent<HTMLDivElement>) {
    // 브라우저가 세로 스크롤로 가져간 경우. 끌던 만큼 제자리로.
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    gestureRef.current = null;
    setDrag(0, false);
  }

  function onClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (!swipedRef.current) return;
    swipedRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <section aria-label={PREVIEW_NAV_LABEL}>
      {/*
        lg 에서 overflow 를 풀어야 한다. 뒤로 물러난 카드가 위로 올라가는데
        여기서 자르면 그만큼 잘려 나간다. 유틸리티로 적어야 하는 이유는
        globals.css 의 미디어쿼리보다 Tailwind 유틸리티가 나중에 적용되기 때문이다.
      */}
      {/*
        좁은 화면 높이는 가장 빡빡한 카드(장전 브리핑)가 정한다 — 머리줄 + 요약 네 줄 +
        밑줄이 들어가야 해서 192px 로는 마지막 줄이 밑줄에 가려졌다.
      */}
      {/*
        touch-pan-y: 세로는 브라우저가 페이지를 스크롤하고, 가로만 여기로 온다.
        이게 없으면 브라우저가 가로 움직임도 가져가서 pointermove 가 끊긴다.
      */}
      <div
        className="preview-viewport h-[204px] touch-pan-y overflow-hidden max-lg:select-none lg:h-[470px] lg:overflow-visible"
        onClickCapture={onClickCapture}
        onPointerCancel={onPointerCancel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div
          className="preview-track h-full"
          ref={trackRef}
          style={{ '--front': front } as CSSProperties}
        >
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
