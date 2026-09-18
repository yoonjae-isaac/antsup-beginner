import type { Metadata } from 'next';
import { lessonMetadata } from '@/config/site';
import { ROOT_LESSON } from '@/domain/jumi/lessons';
import LandingPage from '@/views/LandingPage';

export const metadata: Metadata = lessonMetadata(ROOT_LESSON);

// route 파일은 얇게 — 화면 구성은 src/views 가 갖는다.
export default function Page() {
  return <LandingPage lesson={ROOT_LESSON} />;
}
