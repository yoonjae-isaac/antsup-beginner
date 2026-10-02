import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';

// /robots.txt — 지금은 전체 공개. 미노출 route 가 생기면 여기에 disallow 를 추가한다.
// host 를 명시하는 이유: 배포 도메인이 ants-up.com 으로 옮겨 오는 동안 vercel.app
// 주소도 200 으로 살아 있어, 어느 쪽이 정본인지 크롤러에게 한 번 더 말해 둔다.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
