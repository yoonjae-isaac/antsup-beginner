import type { ReactNode } from 'react';
import HomeLink from '@/components/layout/HomeLink';
import SiteFooter from '@/components/layout/SiteFooter';

interface PageShellProps {
  children: ReactNode;
}

/**
 * 허브에서 갈라져 나온 화면들의 공통 껍데기 — 돌아갈 길, 본문 폭, 푸터.
 *
 * 레슨처럼 대화를 읽는 화면이 아니라 목록을 훑는 화면이라 본문 컬럼(max-w-2xl)이
 * 아니라 홈과 같은 폭을 쓴다. 푸터 폭이 hub 인 것도 그래서다.
 */
export default function PageShell({ children }: PageShellProps) {
  return (
    <>
      <main className="mx-auto w-full max-w-6xl px-6 pt-7 pb-16 lg:px-12 lg:pt-11 lg:pb-24">
        <header className="mb-4 lg:mb-7">
          <HomeLink />
        </header>

        {children}
      </main>

      <SiteFooter width="hub" />
    </>
  );
}
