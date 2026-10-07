/**
 * 사이트 식별 정보 · SEO 문구의 단일 소스.
 * layout(metadata) · robots · sitemap · opengraph-image 가 전부 여기를 참조한다.
 */

/**
 * 서비스 명칭. 프로젝트(레포) 이름인 antsup-beginner 와 구분한다.
 * 도메인은 ants-up.com 이고 이름은 step-ants 로 통일했다 — og:site_name 에 그대로 나간다.
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
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://ants-up.com';

import type { Metadata } from 'next';
import { lessonPath, type Lesson } from '@/domain/jumi/lessons';
import { BRIEFING_ARCHIVE_PATH, BRIEFING_PATH } from '@/domain/briefing/route';
import { CALENDAR_PATH } from '@/domain/calendar/route';
import { INVESTORS_PATH } from '@/domain/investors/route';
import { PRIVACY_PATH, TERMS_PATH } from '@/domain/legal/route';
import { MACRO_PATH } from '@/domain/macro/route';
import { NEWS_PATH } from '@/domain/news/route';
import { MY_STOCKS_PATH } from '@/domain/stocks/route';
import { TOOLS_PATH } from '@/domain/tools/route';

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

/**
 * og:image — `app/opengraph-image.tsx` 가 만드는 그 이미지.
 *
 * 파일 컨벤션만 두면 **루트 세그먼트(홈)에만** 붙는다. 하위 route 가 `openGraph` 를
 * 통째로 지정하는 순간 부모의 og 블록이 이미지째 대체되기 때문이다.
 * 그래서 홈 말고 모든 페이지가 직접 이 값을 끼워 넣어야 한다 —
 * 실제로 2026-10-02 이전까지 홈을 제외한 전 페이지에 og:image 가 없었다.
 *
 * 경로에 해시 쿼리를 붙이지 않는다. 손으로 적은 해시는 이미지를 고쳐도 같이 바뀌지 않아
 * 오히려 낡은 캐시를 가리킨다. 크기·alt 를 함께 적는 이유는 카카오·슬랙 같은 스크래퍼가
 * 이미지를 내려받기 전에 레이아웃을 잡기 때문이다.
 */
const OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: SEO.title,
} as const;

/** 허브에서 갈라져 나온 화면들의 메타데이터. 형태가 같아 한 곳에서 찍어 낸다. */
function hubPageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      url: path,
      siteName: SERVICE_NAME,
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

export function newsMetadata(): Metadata {
  return hubPageMetadata(
    NEWS_PATH,
    '시장 뉴스 · step-ants',
    '오늘 시장에 무슨 일이 있었는지 한 시간마다 정리해 드려요. 국내·미국 뉴스와 요약을 주식이 처음인 사람도 읽을 수 있게 담았습니다.',
  );
}

export function macroMetadata(): Metadata {
  return hubPageMetadata(
    MACRO_PATH,
    '거시 지표 · step-ants',
    '물가, 고용, 금리. 개별 종목보다 먼저 시장 전체를 움직이는 숫자들을 주식이 처음인 사람도 읽을 수 있게 정리했어요.',
  );
}

export function calendarMetadata(): Metadata {
  return hubPageMetadata(
    CALENDAR_PATH,
    '증시 일정 · step-ants',
    '이번 주 실적 발표와 경제 지표, 신규 상장 일정을 한눈에. 무슨 날인지까지 풀어서 알려드려요.',
  );
}

export function investorsMetadata(): Metadata {
  return hubPageMetadata(
    INVESTORS_PATH,
    '투자자들 현황 · step-ants',
    '버핏을 비롯한 거장들이 분기마다 공개하는 보유 종목(13F)을 정리했어요. 지금 들고 있다는 뜻은 아니라는 점까지 같이 알려드립니다.',
  );
}

export function briefingMetadata(): Metadata {
  return hubPageMetadata(
    BRIEFING_PATH,
    '장전 브리핑 · step-ants',
    '장이 열리기 전에 오늘 무슨 일이 예정돼 있는지 미리 훑어보세요. 오늘의 이슈와 움직일 테마, 지켜볼 위험까지 한 문단 요약과 함께 정리했어요.',
  );
}

export function briefingArchiveMetadata(): Metadata {
  return hubPageMetadata(
    BRIEFING_ARCHIVE_PATH,
    '지난 브리핑 · step-ants',
    '날마다 장 시작 전에 올라온 브리핑을 모았어요. 그날 시장에 무슨 이야기가 많았는지 한 줄씩 돌아볼 수 있습니다.',
  );
}

/**
 * 내 주식.
 *
 * 설명에 '담아 둔다'를 쓰고 '보유·포트폴리오'는 쓰지 않는다 — 수량도 평단도 받지 않는
 * 화면이라, 검색 결과에서 그렇게 읽히면 들어와서 찾는 걸 못 찾는다.
 */
export function myStocksMetadata(): Metadata {
  return hubPageMetadata(
    MY_STOCKS_PATH,
    '내 주식 · step-ants',
    '관심 가는 종목을 담아 두고 오늘 가격과 등락률을 한눈에 보세요. 목록은 이 브라우저에만 저장되고 로그인이 필요 없어요.',
  );
}

export function toolsMetadata(): Metadata {
  return hubPageMetadata(
    TOOLS_PATH,
    '투자 도구 · step-ants',
    '평단·손절가·배당·복리까지, 레슨에 나온 계산기를 한자리에 모았어요. 숫자를 직접 넣어 보면 설명이 훨씬 빨리 붙어요.',
  );
}

/**
 * 정책 문서 메타데이터.
 *
 * 검색 유입을 노리는 문서가 아니라 설명을 짧게 둔다. 색인은 막지 않는데,
 * AdSense·GA 심사에서 이 페이지들이 실제로 공개돼 있는지를 본다.
 */
export function privacyMetadata(): Metadata {
  return hubPageMetadata(
    PRIVACY_PATH,
    '개인정보처리방침 · step-ants',
    'AntsUp 이 어떤 정보를 수집하고 어떻게 쓰는지, 쿠키와 광고에 대한 선택권을 어떻게 드리는지 정리했습니다.',
  );
}

export function termsMetadata(): Metadata {
  return hubPageMetadata(
    TERMS_PATH,
    '이용약관 · step-ants',
    'AntsUp 서비스의 성격과 면책, 지식재산권, 금지 행위에 관한 약관입니다.',
  );
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
      images: [OG_IMAGE],
    },
  };
}
