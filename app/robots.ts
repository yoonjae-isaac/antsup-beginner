import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';

// /robots.txt — 지금은 전체 공개. 미노출 route 가 생기면 여기에 disallow 를 추가한다.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
