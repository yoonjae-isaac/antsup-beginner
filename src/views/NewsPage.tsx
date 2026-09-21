import PageShell from '@/components/layout/PageShell';
import NewsBoard from '@/components/news/NewsBoard';
import { FIRST_LESSON, findLesson, lessonPath } from '@/domain/jumi/lessons';
import type { NewsSnapshot } from '@/domain/news/types';

interface NewsPageProps {
  snapshot: NewsSnapshot;
}

/** 시장 뉴스. 껍데기(돌아갈 길·본문 폭·푸터)는 PageShell 이 갖는다. */
export default function NewsPage({ snapshot }: NewsPageProps) {
  // 경로는 여기서 정해 내려보낸다 — 클라이언트 번들에 레슨 목록까지 실을 이유가 없다.
  const terms = findLesson('terms');

  return (
    <PageShell>
      <NewsBoard
        guideHref={lessonPath(FIRST_LESSON.slug)}
        snapshot={snapshot}
        termsHref={terms ? lessonPath(terms.slug) : null}
      />
    </PageShell>
  );
}
