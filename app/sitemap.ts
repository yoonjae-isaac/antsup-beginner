import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';
import { LESSONS, lessonPath } from '@/domain/jumi/lessons';
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
    // 내용이 하루에도 여러 번 바뀌는 유일한 페이지라 changeFrequency 가 다르다.
    {
      url: new URL(NEWS_PATH, SITE_URL).toString(),
      lastModified,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    ...LESSONS.map((lesson) => ({
      url: new URL(lessonPath(lesson.slug), SITE_URL).toString(),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
