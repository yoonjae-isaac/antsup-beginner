'use client';

import { useEffect, useState, type ReactNode } from 'react';
import MarketCard from '@/components/home/MarketCard';
import QuoteCard from '@/components/home/QuoteCard';
import {
  PREVIEW_AUTO_HINT,
  PREVIEW_MARKET_TITLE,
  PREVIEW_NAV_LABEL,
  PREVIEW_QUOTE_TITLE,
} from '@/domain/jumi/landingCopy';
import type { MarketSnapshot } from '@/domain/preview/market';
import type { InvestorQuote } from '@/domain/preview/quotes';

interface ContentPreviewProps {
  /** 백엔드가 닿지 않으면 null — 그때는 명언 카드만 남는다. */
  market: MarketSnapshot | null;
  quote: InvestorQuote;
  quoteIndex: number;
  quoteTotal: number;
}

const ROTATE_MS = 3000;

/**
 * 홈 좌측의 컨텐츠 프리뷰.
 *
 * 카드가 몇 장인지는 시세를 받아왔는지에 달렸다. 한 장뿐이면 돌릴 것도,
 * 고를 것도 없으므로 타이머와 인디케이터가 통째로 사라진다.
 * 움직임 자체(가로 슬라이드 / 덱)는 globals.css 의 .preview-* 가 맡고,
 * 여기서는 지금 몇 번째 카드가 앞인지만 정한다.
 */
export default function ContentPreview({
  market,
  quote,
  quoteIndex,
  quoteTotal,
}: ContentPreviewProps) {
  const cards: { id: string; label: string; body: ReactNode }[] = [
    ...(market
      ? [{ id: 'market', label: PREVIEW_MARKET_TITLE, body: <MarketCard market={market} /> }]
      : []),
    {
      id: 'quote',
      label: PREVIEW_QUOTE_TITLE,
      body: <QuoteCard quote={quote} index={quoteIndex} total={quoteTotal} />,
    },
  ];

  const [front, setFront] = useState(0);

  // front 를 의존성에 둔 게 의도다 — 직접 고른 순간에도 타이머가 처음부터 다시 돈다.
  // 고르자마자 넘어가면 누른 의미가 없다.
  useEffect(() => {
    if (cards.length < 2) return;

    const timer = setTimeout(() => {
      setFront((current) => (current + 1) % cards.length);
    }, ROTATE_MS);

    return () => clearTimeout(timer);
  }, [cards.length, front]);

  return (
    <section aria-label={PREVIEW_NAV_LABEL}>
      {/*
        lg 에서 overflow 를 풀어야 한다. 뒤로 물러난 카드가 위로 올라가는데
        여기서 자르면 그만큼 잘려 나간다. 유틸리티로 적어야 하는 이유는
        globals.css 의 미디어쿼리보다 Tailwind 유틸리티가 나중에 적용되기 때문이다.
      */}
      <div className="preview-viewport h-44 overflow-hidden lg:h-[470px] lg:overflow-visible">
        <div className="preview-track h-full" data-front={front}>
          {cards.map((card) => (
            <div className="preview-card" key={card.id}>
              {card.body}
            </div>
          ))}
        </div>
      </div>

      {cards.length > 1 && (
        <div className="flex items-center justify-center lg:mt-3.5 lg:justify-start">
          {cards.map((card, index) => (
            <button
              aria-current={index === front}
              aria-label={`${card.label} 카드 보기`}
              className="flex size-11 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cb-point"
              key={card.id}
              onClick={() => setFront(index)}
              type="button"
            >
              <span
                className={`block h-[3px] rounded-full transition-all duration-300 ${
                  index === front ? 'w-[26px] bg-cb-point' : 'w-3.5 bg-cb-border-strong'
                }`}
              />
            </button>
          ))}
          <span className="ml-2.5 hidden text-xs text-cb-muted lg:inline">
            {PREVIEW_AUTO_HINT}
          </span>
        </div>
      )}
    </section>
  );
}
