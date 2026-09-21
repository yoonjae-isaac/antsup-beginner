import type { Metadata } from 'next';
import { newsMetadata } from '@/config/site';
import { loadNewsSnapshot } from '@/domain/news/news';
import NewsPage from '@/views/NewsPage';

export const metadata: Metadata = newsMetadata();

/**
 * 기사 수집 크론이 5분 간격이라 그보다 자주 다시 그릴 이유가 없다.
 *
 * 리터럴이어야 한다 — Next 가 세그먼트 설정을 정적으로 읽는다.
 * config/backendRoutes.ts 의 NEWS_REVALIDATE_SECONDS 와 같은 값을 유지할 것.
 */
export const revalidate = 300;

// route 파일은 얇게 — 화면 구성은 src/views 가 갖는다.
export default async function Page() {
  const snapshot = await loadNewsSnapshot();

  return <NewsPage snapshot={snapshot} />;
}
