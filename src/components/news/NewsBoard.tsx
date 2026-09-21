'use client';

import Link from 'next/link';
import { useState } from 'react';
import JumiAvatar from '@/components/jumi/JumiAvatar';
import ArticleList from '@/components/news/ArticleList';
import DigestTimeline from '@/components/news/DigestTimeline';
import { JUMI_ART } from '@/domain/jumi/artwork';
import {
  ARTICLES_FRESHNESS,
  ARTICLES_HEADING,
  DIGEST_HEADING,
  DIGEST_JUMI_LEAD,
  DIGEST_NOTE,
  GUIDE_CARD_BODY,
  GUIDE_CARD_CTA,
  GUIDE_CARD_HEADING,
  MARKET_GROUP_LABEL,
  MARKET_NAME,
  NEWS_HEADING,
  NEWS_LEAD,
  TERMS_CARD_BODY,
  TERMS_CARD_CTA,
  TERMS_CARD_HEADING,
  updateCountLabel,
} from '@/domain/news/copy';
import type { NewsMarket, NewsSnapshot } from '@/domain/news/types';

interface NewsBoardProps {
  snapshot: NewsSnapshot;
  /** 용어 정리 레슨 경로. 레슨이 없으면 null 이라 카드가 빠진다. */
  termsHref: string | null;
  guideHref: string;
}

const MARKETS: readonly NewsMarket[] = ['KR', 'US'];

/**
 * 시장 뉴스 본문.
 *
 * 두 시장을 서버에서 미리 받아 두고 전환만 여기서 한다 — 쿼리스트링으로 받으면
 * searchParams 때문에 페이지가 매 요청 렌더로 바뀌어 ISR 이 깨진다.
 */
export default function NewsBoard({ snapshot, termsHref, guideHref }: NewsBoardProps) {
  const [market, setMarket] = useState<NewsMarket>('KR');
  // 시장을 바꾸면 펼친 회차도 최신으로 되돌린다. 두 시장의 회차 수가 다르다.
  const [openIndex, setOpenIndex] = useState(0);

  const current = snapshot[market];

  function pickMarket(next: NewsMarket) {
    setMarket(next);
    setOpenIndex(0);
  }

  return (
    <>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
        <div>
          <h1 className="text-[1.65rem] leading-snug font-bold tracking-tight lg:text-[2.5rem]">
            {NEWS_HEADING}
          </h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-cb-muted lg:text-[15px]">
            {NEWS_LEAD}
          </p>
        </div>

        <div
          aria-label={MARKET_GROUP_LABEL}
          className="flex shrink-0 rounded-full border border-cb-border bg-[#16161a] p-1"
          role="group"
        >
          {MARKETS.map((item) => (
            <button
              aria-pressed={item === market}
              className={`grow cursor-pointer rounded-full py-2 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cb-point lg:grow-0 lg:px-[22px] ${
                item === market
                  ? 'bg-cb-foreground text-[#16161a]'
                  : 'text-cb-muted hover:text-cb-foreground'
              }`}
              key={item}
              onClick={() => pickMarket(item)}
              type="button"
            >
              {MARKET_NAME[item]}
            </button>
          ))}
        </div>
      </div>

      <section className="mt-6 lg:mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="text-base font-bold tracking-tight lg:text-xl">{DIGEST_HEADING}</h2>
          <span className="text-[11.5px] text-cb-muted lg:text-[13px]">
            {updateCountLabel(market, current.digests.length, current.staleDateLabel)}
          </span>
        </div>

        {/*
          주미가 요약을 건네는 자리. 말풍선을 쓰지 않는 게 의도다 —
          아래 요약 본문은 백엔드가 만든 기사체라, 주미가 직접 말한 것처럼 감싸면
          바로 다음 문장에서 말투가 어긋난다. 주미는 건네주는 역할까지만 한다.
        */}
        <div className="mt-3 flex items-center gap-2.5 lg:mt-4 lg:gap-3">
          <JumiAvatar art={JUMI_ART.greeting} size="sm" />
          <p className="text-[13px] leading-snug text-cb-foreground lg:text-sm">
            {DIGEST_JUMI_LEAD}
          </p>
        </div>

        <div className="mt-2.5 lg:mt-3.5">
          <DigestTimeline
            entries={current.digests}
            onOpen={setOpenIndex}
            openIndex={Math.min(openIndex, Math.max(current.digests.length - 1, 0))}
          />
        </div>

        <p className="mt-3 text-[11.5px] leading-relaxed text-cb-muted lg:mt-3.5 lg:text-[12.5px]">
          {DIGEST_NOTE}
        </p>
      </section>

      <div className="mt-6 flex flex-col gap-10 lg:mt-12 lg:flex-row lg:gap-16">
        <section className="lg:w-[752px] lg:shrink-0">
          <div className="flex items-baseline justify-between">
            <h2 className="text-base font-bold tracking-tight lg:text-xl">{ARTICLES_HEADING}</h2>
            <span className="text-xs text-cb-muted lg:text-[13px]">{ARTICLES_FRESHNESS}</span>
          </div>

          <div className="mt-2 lg:mt-4">
            <ArticleList articles={current.articles} />
          </div>
        </section>

        <aside className="flex flex-col gap-4 lg:w-[336px] lg:shrink-0">
          {/*
            뉴스가 어려운 건 사건이 아니라 단어다. 이미 만들어 둔 용어 정리로 보내는 게
            이 화면이 초보에게 해줄 수 있는 가장 현실적인 도움이다.
          */}
          {termsHref !== null && (
            <SideCard
              body={TERMS_CARD_BODY}
              cta={TERMS_CARD_CTA}
              heading={TERMS_CARD_HEADING}
              href={termsHref}
            />
          )}

          <SideCard
            accent
            body={GUIDE_CARD_BODY}
            cta={GUIDE_CARD_CTA}
            heading={GUIDE_CARD_HEADING}
            href={guideHref}
          />
        </aside>
      </div>
    </>
  );
}

interface SideCardProps {
  heading: string;
  body: string;
  cta: string;
  href: string;
  accent?: true;
}

function SideCard({ heading, body, cta, href, accent }: SideCardProps) {
  return (
    <div
      className={`rounded-[20px] border bg-cb-surface p-5 lg:p-6 ${
        accent ? 'border-cb-trader/30' : 'border-cb-border'
      }`}
    >
      <h2 className="text-[15px] font-bold lg:text-base">{heading}</h2>
      <p className="mt-2.5 text-[13.5px] leading-[1.7] text-cb-muted">{body}</p>
      <Link
        className={`mt-4 inline-flex items-center gap-1.5 rounded-lg text-[13.5px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cb-point ${
          accent ? 'text-cb-trader hover:text-cb-trader/80' : 'text-cb-point hover:text-cb-point-hover'
        }`}
        href={href}
      >
        {cta}
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
