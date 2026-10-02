import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import ConsentBanner from '@/components/app/ConsentBanner';
import {
  ADSENSE_CLIENT,
  CONSENT_INIT_SCRIPT,
  GOOGLE_SITE_VERIFICATION,
  GTM_ID,
  gtmScript,
} from '@/config/analytics';
import { SEO, SERVICE_NAME, SITE_URL } from '@/config/site';
import './globals.css';

/**
 * 사이트 공통 메타데이터 — 레슨마다 달라지는 title·description·canonical 은
 * 각 페이지가 lessonMetadata() 로 덮어쓴다. 여기 값은 그 폴백이다.
 * (og:image 는 app/opengraph-image.tsx, favicon 은 app/icon.png 가 자동으로 붙인다.)
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SEO.title,
  description: SEO.description,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: SERVICE_NAME,
  },
  /*
   * 큰 카드로 미리보기. 지정하지 않으면 Next 가 `summary`(작은 정사각 썸네일)로 채우는데,
   * og 이미지가 1200×630 가로형이라 그 틀에서는 양옆이 잘린다.
   * title·description 은 Next 가 각 페이지의 og 값에서 자동으로 가져간다.
   */
  twitter: { card: 'summary_large_image' },
  // 전 페이지 색인 허용. 숨길 route 가 생기면 그 페이지에서 덮어쓴다.
  robots: { index: true, follow: true },
  // 도메인 속성(DNS TXT)으로 등록된 동안은 비어 있어 아예 태그가 나가지 않는다.
  ...(GOOGLE_SITE_VERIFICATION ? { verification: { google: GOOGLE_SITE_VERIFICATION } } : {}),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/*
          한글 폰트는 본체(cash-bite)와 같은 Pretendard 를 같은 CDN 에서 쓴다.
          dynamic-subset 이라 필요한 글자만 내려받는다. next/font 로 셀프호스팅하지
          않는 이유도 본체와 같다 — Pretendard 는 구글 폰트에 없다.
        */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {/*
          consent 기본값(전부 denied)은 GTM 로더보다 먼저 실행되어야 한다.
          next/script 는 실행 순서를 보장하지 않으므로 여기서 인라인으로 넣는다.
        */}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {GTM_ID && (
          <Script id="gtm-init" strategy="afterInteractive">
            {gtmScript(GTM_ID)}
          </Script>
        )}
        {ADSENSE_CLIENT && (
          <Script
            id="adsbygoogle-init"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}

        <ConsentBanner />

        {children}
      </body>
    </html>
  );
}
