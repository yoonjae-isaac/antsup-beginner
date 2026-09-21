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
 *
 * `??` 가 아니라 `||` 인 이유: Vercel 대시보드에서 키만 만들고 값을 비워두면
 * 빈 문자열이 들어온다. `??` 는 빈 문자열을 통과시켜 metadataBase 의
 * `new URL('')` 에서 빌드가 터진다. 값이 비면 기본값으로 떨어지게 둔다.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://step.ants-up.com';

import type { Metadata } from 'next';
import { lessonPath, type Lesson } from '@/domain/jumi/lessons';
import { NEWS_PATH } from '@/domain/news/route';

/** 홈(서비스 허브)의 SEO 문구. 레슨별 문구는 lessons.ts 가 소유한다. */
export const SEO = {
  title: 'step-ants · 주미와 함께하는 주식 첫걸음',
  description:
    '주식 기초부터 증시 일정, 시장 뉴스, 투자자들 현황, 거시 지표까지. 주식개미 주미가 필요한 곳으로 안내해요.',
} as const;

/** 홈 페이지 메타데이터. */
export function homeMetadata(): Metadata {
  return {
    title: SEO.title,
    description: SEO.description,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      url: '/',
      siteName: SERVICE_NAME,
      title: SEO.title,
      description: SEO.description,
    },
  };
}

/** 시장 뉴스 페이지 메타데이터. */
export function newsMetadata(): Metadata {
  const title = '시장 뉴스 · step-ants';
  const description =
    '오늘 시장에 무슨 일이 있었는지 한 시간마다 정리해 드려요. 국내·미국 뉴스와 요약을 주식이 처음인 사람도 읽을 수 있게 담았습니다.';

  return {
    title,
    description,
    alternates: { canonical: NEWS_PATH },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      url: NEWS_PATH,
      siteName: SERVICE_NAME,
      title,
      description,
    },
  };
}

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
