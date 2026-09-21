import HomeLink from '@/components/layout/HomeLink';
import SiteFooter from '@/components/layout/SiteFooter';
import NewsBoard from '@/components/news/NewsBoard';
import { FIRST_LESSON, findLesson, lessonPath } from '@/domain/jumi/lessons';
import type { NewsSnapshot } from '@/domain/news/types';

interface NewsPageProps {
  snapshot: NewsSnapshot;
}

/**
 * 시장 뉴스.
 *
 * 레슨처럼 읽는 화면이지만 대화가 아니라 목록이라, 본문 컬럼(max-w-2xl) 대신
 * 홈과 같은 폭(max-w-6xl)을 쓴다. 푸터도 그래서 hub 폭이다.
 */
export default function NewsPage({ snapshot }: NewsPageProps) {
  // 경로는 여기서 정해 내려보낸다 — 클라이언트 번들에 레슨 목록까지 실을 이유가 없다.
  const terms = findLesson('terms');

  return (
    <>
      <main className="mx-auto w-full max-w-6xl px-6 pt-7 pb-16 lg:px-12 lg:pt-11 lg:pb-24">
        <header className="mb-4 lg:mb-7">
          <HomeLink />
        </header>

        <NewsBoard
          guideHref={lessonPath(FIRST_LESSON.slug)}
          snapshot={snapshot}
          termsHref={terms ? lessonPath(terms.slug) : null}
        />
      </main>

      <SiteFooter width="hub" />
    </>
  );
}
