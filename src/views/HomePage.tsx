import ContentPreview from '@/components/home/ContentPreview';
import OrbitHub from '@/components/home/OrbitHub';
import SiteFooter from '@/components/layout/SiteFooter';
import { HOME_EYEBROW, HOME_HEADING, ORBIT_EMPTY_HINT } from '@/domain/jumi/landingCopy';
import type { MarketSnapshot } from '@/domain/preview/market';
import { INVESTOR_QUOTES, pickDailyQuote } from '@/domain/preview/quotes';

interface HomePageProps {
  market: MarketSnapshot | null;
}

/**
 * 홈 — 서비스 허브.
 *
 * 레슨 페이지들과 달리 읽는 화면이 아니라 고르는 화면이라, 본문 컬럼(max-w-2xl)을
 * 쓰지 않고 오비트가 화면을 쓰게 둔다.
 * lg 부터는 좌측을 컨텐츠 프리뷰로 세워 2단이 된다 — 좁은 화면에서 그대로 키우기만
 * 하면 링이 화면을 다 먹고 나머지가 밀려난다.
 */
export default function HomePage({ market }: HomePageProps) {
  const { quote, index } = pickDailyQuote();

  return (
    <>
      <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center gap-8 px-6 py-12 lg:flex-row lg:items-center lg:justify-center lg:gap-20 lg:px-12">
        <section className="flex flex-col gap-5 lg:w-[424px] lg:shrink-0">
          {/*
            order 로 위아래를 바꾼다. 모바일에서는 카드가 주미 바로 위에 와야 하고,
            PC 에서는 제목이 카드 위에 와야 한다. DOM 순서는 제목이 먼저인 채로 두어
            h1 이 문서 앞쪽에 남는다.
          */}
          <div className="order-2 flex flex-col gap-2.5 lg:order-1">
            <span className="text-xs font-bold tracking-[0.2em] text-cb-point uppercase lg:text-[13px] lg:tracking-[0.22em]">
              {HOME_EYEBROW}
            </span>
            <h1 className="text-[1.6rem] leading-snug font-bold tracking-tight text-balance lg:text-[2rem]">
              {HOME_HEADING}
            </h1>
          </div>

          <div className="order-1 lg:order-2">
            <ContentPreview
              market={market}
              quote={quote}
              quoteIndex={index}
              quoteTotal={INVESTOR_QUOTES.length}
            />
          </div>
        </section>

        {/*
          lg 에서 grow + basis-0 이 꼭 있어야 한다. 이게 없으면 이 flex 아이템이 내용
          기준으로 크기를 잡는데, 안의 무대는 w-full(부모의 100%)이라 서로를 참조하게 된다.
          무대 내용물이 전부 absolute 라 내용 폭이 0 → 무대도 0 → 노드가 전부 한 점에 겹친다.
          세로로 쌓이는 모바일에서는 아이템이 폭 전체로 늘어나 우연히 멀쩡했다.
        */}
        <div className="flex justify-center lg:grow lg:basis-0">
          <OrbitHub />
        </div>

        <div className="flex items-center gap-2.5 lg:hidden">
          <span className="size-[11px] shrink-0 rounded-full border border-dashed border-cb-border-strong" />
          <span className="text-xs leading-relaxed text-cb-muted">{ORBIT_EMPTY_HINT}</span>
        </div>
      </main>

      <SiteFooter width="hub" />
    </>
  );
}
