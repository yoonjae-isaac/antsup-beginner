import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { lessonMetadata } from '@/config/site';
import { findLesson, LESSONS } from '@/domain/jumi/lessons';
import LessonPage from '@/views/LessonPage';

interface RouteProps {
  params: Promise<{ slug: string }>;
}

// 등록된 레슨 외의 경로는 빌드 시점에 404 로 확정한다(색인될 빈 페이지를 만들지 않는다).
export const dynamicParams = false;

export function generateStaticParams() {
  return LESSONS.filter((lesson) => lesson.slug !== '').map((lesson) => ({ slug: lesson.slug }));
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

  return <LessonPage lesson={lesson} />;
}
