/**
 * 사이트 식별 정보 · SEO 문구의 단일 소스.
 * layout(metadata) · robots · sitemap · opengraph-image 가 전부 여기를 참조한다.
 */

/**
 * 서비스 명칭. 프로젝트(레포) 이름인 antsup-beginner 와 구분한다.
 * 도메인(step.ants-up.com)과 어긋나지 않게 step-ants 로 통일했다 — og:site_name 에 그대로 나간다.
 */
export const SERVICE_NAME = 'step-ants';

/**
 * 배포 도메인. 환경변수로 덮어쓸 수 있게 둔 이유는 Vercel 프리뷰 배포 때문이다.
 * 프리뷰에서 canonical·og:url 이 프로덕션을 가리키면 색인이 꼬인다.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://step.ants-up.com';

import type { Metadata } from 'next';
import { lessonPath, ROOT_LESSON, type Lesson } from '@/domain/jumi/lessons';

/** 사이트 기본 SEO 문구. 레슨별 문구는 lessons.ts 가 소유한다. */
export const SEO = {
  title: ROOT_LESSON.seoTitle,
  description: ROOT_LESSON.seoDescription,
} as const;

/**
 * 레슨 한 건의 페이지 메타데이터.
 *
 * openGraph 는 레이아웃과 병합되지 않고 통째로 덮어써지므로,
 * type·locale·siteName 까지 여기서 다 채워야 한다.
 */
export function lessonMetadata(lesson: Lesson): Metadata {
  const path = lessonPath(lesson.slug);

  return {
    title: lesson.seoTitle,
    description: lesson.seoDescription,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      url: path,
      siteName: SERVICE_NAME,
      title: lesson.seoTitle,
      description: lesson.seoDescription,
    },
  };
}
