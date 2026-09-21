import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';
import { LESSONS, lessonPath } from '@/domain/jumi/lessons';
import { CALENDAR_PATH } from '@/domain/calendar/route';
import { INVESTORS_PATH } from '@/domain/investors/route';
import { MACRO_PATH } from '@/domain/macro/route';
import { NEWS_PATH } from '@/domain/news/route';

// /sitemap.xml — 국내 전용 단일 로케일이라 hreflang alternates 없이 ko 단일 URL 이다.
// 대사가 있는 레슨만 LESSONS 에 등록되므로, 빈 페이지가 여기 실릴 일은 없다.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: new URL('/', SITE_URL).toString(),
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    // 허브에서 갈라진 데이터 화면들. 레슨과 달리 내용이 계속 바뀌어 주기가 짧다.
    {
      url: new URL(NEWS_PATH, SITE_URL).toString(),
      lastModified,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: new URL(CALENDAR_PATH, SITE_URL).toString(),
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: new URL(MACRO_PATH, SITE_URL).toString(),
      lastModified,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    // 13F 는 분기에 한 번만 바뀐다.
    {
      url: new URL(INVESTORS_PATH, SITE_URL).toString(),
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    ...LESSONS.map((lesson) => ({
      url: new URL(lessonPath(lesson.slug), SITE_URL).toString(),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
