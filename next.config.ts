import type { NextConfig } from 'next';

/**
 * 본체(cash-bite)가 ants-up.com 에서 색인시킨 경로 중, 이 앱에 **같은 주소가 없는** 것들.
 *
 * 도메인이 넘어오는 순간 이 주소들은 전부 404 가 된다. 색인·외부 링크·북마크가
 * 거기 걸려 있으므로 가장 가까운 화면으로 보낸다. 대응이 애매하면 홈으로 보내
 * 허브에서 고르게 한다 — 엉뚱한 화면에 떨구는 것보다 낫다.
 *
 * 여기 **없는** 것들:
 * - `/news` `/calendar` `/macro` `/tools` `/privacy` — 양쪽에 같은 주소가 있다.
 * - `/terms` — 본체에선 이용약관이지만 이 앱에선 '주식 용어 10개' 레슨이다.
 *   레슨 쪽이 읽을 거리로 더 가치 있어 그대로 둔다(이용약관은 /terms-of-service).
 * - `/persona` — 본체에서도 robots 로 막고 404 를 내던 미노출 route 다.
 */
const LEGACY_PATHS: Record<string, string> = {
  '/onboarding': '/stock-basics',
  '/gurus': '/investors',
  '/learn': '/',
  '/consensus': '/',
  '/stock': '/',
  '/about': '/',
};

/** 하위 경로까지 쓸어 담아야 하는 것들. 개별 글·종목·계산기는 1:1 대응이 없다. */
const LEGACY_PATTERNS: Record<string, string> = {
  '/gurus/:investor': '/investors',
  '/tools/:slug': '/tools',
  '/learn/:slug': '/',
};

/**
 * 본체는 ko 를 루트에 두고 en·ja 만 접두어를 붙였다(`localePrefix: 'as-needed'`).
 * 이 앱은 한국어 전용이라 접두어를 받을 곳이 없다.
 */
const LEGACY_LOCALES = ['en', 'ja'] as const;

const nextConfig: NextConfig = {
  /**
   * 전부 308(permanent). 구글은 308 을 301 과 같게 보고 색인을 목적지로 옮긴다.
   *
   * 순서가 곧 우선순위다 — 구체적인 규칙이 먼저 와야 `/en/gurus` 가
   * 맨 끝의 접두어 제거 규칙에 먼저 걸려 `/gurus`(404)로 빠지지 않는다.
   */
  async redirects() {
    const base = [
      ...Object.entries(LEGACY_PATHS),
      ...Object.entries(LEGACY_PATTERNS),
    ].map(([source, destination]) => ({ source, destination, permanent: true }));

    // 같은 규칙의 /en · /ja 변형.
    const localized = base.flatMap((rule) =>
      LEGACY_LOCALES.map((locale) => ({ ...rule, source: `/${locale}${rule.source}` })),
    );

    // 위에서 안 걸린 나머지 로케일 경로는 접두어만 떼어 같은 자리로 보낸다
    // (`/en/news` → `/news`). 콘텐츠는 한국어뿐이지만 주제는 같다.
    const localeStrip = LEGACY_LOCALES.map((locale) => ({
      source: `/${locale}/:path*`,
      destination: '/:path*',
      permanent: true,
    }));

    return [...base, ...localized, ...localeStrip];
  },
};

export default nextConfig;
