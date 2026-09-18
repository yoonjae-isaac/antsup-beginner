import type { Metadata } from 'next';
import type { ReactNode } from 'react';
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
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
