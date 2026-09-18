import OrbitHub from '@/components/home/OrbitHub';
import SiteFooter from '@/components/layout/SiteFooter';
import {
  HOME_EYEBROW,
  HOME_HEADING,
  HOME_LEAD,
  ORBIT_EMPTY_COUNT_LABEL,
  ORBIT_EMPTY_HINT,
  ORBIT_OPEN_COUNT_LABEL,
} from '@/domain/jumi/landingCopy';

/**
 * 홈 — 서비스 허브.
 *
 * 레슨 페이지들과 달리 읽는 화면이 아니라 고르는 화면이라, 본문 컬럼(max-w-2xl)을
 * 쓰지 않고 오비트가 화면을 쓰게 둔다.
 * lg 부터는 카피를 왼쪽으로 빼 2단으로 세운다 — 좁은 화면에서 그대로 키우기만 하면
 * 링이 화면을 다 먹고 글이 밀려난다.
 */
export default function HomePage() {
  return (
    <>
      <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center gap-8 px-6 py-12 lg:flex-row lg:items-center lg:justify-center lg:gap-20 lg:px-12">
        <section className="flex flex-col gap-3 lg:w-[380px] lg:shrink-0 lg:gap-5">
          <span className="text-xs font-bold tracking-[0.2em] text-cb-point uppercase lg:text-[13px] lg:tracking-[0.22em]">
            {HOME_EYEBROW}
          </span>
          <h1 className="text-[1.7rem] leading-snug font-bold tracking-tight text-balance lg:text-[2.875rem] lg:leading-[1.24]">
            {HOME_HEADING}
          </h1>
          <p className="max-w-[19rem] text-[13px] leading-relaxed text-cb-muted lg:text-[15px]">
            {HOME_LEAD}
          </p>

          {/* 링의 점선 칸이 무슨 뜻인지 알려주는 범례. 넓은 화면에서만 자리가 난다. */}
          <div className="mt-3 hidden flex-col gap-2.5 lg:flex">
            <div className="flex items-center gap-2.5">
              <span className="size-[11px] shrink-0 rounded-full bg-cb-point" />
              <span className="text-[13px] text-[#B6B6C0]">{ORBIT_OPEN_COUNT_LABEL}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="size-[11px] shrink-0 rounded-full border border-dashed border-cb-border-strong" />
              <span className="text-[13px] text-cb-muted">{ORBIT_EMPTY_COUNT_LABEL}</span>
            </div>
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
