import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { lessonMetadata } from '@/config/site';
import { findLesson, FIRST_LESSON, LESSONS } from '@/domain/jumi/lessons';
import LandingPage from '@/views/LandingPage';
import LessonPage from '@/views/LessonPage';

interface RouteProps {
  params: Promise<{ slug: string }>;
}

// 등록된 레슨 외의 경로는 빌드 시점에 404 로 확정한다(색인될 빈 페이지를 만들지 않는다).
export const dynamicParams = false;

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = findLesson(slug);

  return lesson ? lessonMetadata(lesson) : {};
}

export default async function Page({ params }: RouteProps) {
  const { slug } = await params;
  const lesson = findLesson(slug);
  if (!lesson) notFound();

  // 첫 레슨에서만 주미가 인사를 건넨다 — 처음 만나는 자리이기 때문이다.
  return lesson.slug === FIRST_LESSON.slug ? (
    <LandingPage lesson={lesson} />
  ) : (
    <LessonPage lesson={lesson} />
  );
}
