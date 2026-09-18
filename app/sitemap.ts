import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';
import { LESSONS, lessonPath } from '@/domain/jumi/lessons';

// /sitemap.xml — 국내 전용 단일 로케일이라 hreflang alternates 없이 ko 단일 URL 이다.
// 대사가 있는 레슨만 LESSONS 에 등록되므로, 빈 페이지가 여기 실릴 일은 없다.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return LESSONS.map((lesson) => ({
    url: new URL(lessonPath(lesson.slug), SITE_URL).toString(),
    lastModified,
    changeFrequency: 'monthly',
    priority: lesson.slug === '' ? 1 : 0.8,
  }));
}
