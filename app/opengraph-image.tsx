import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { SEO, SERVICE_NAME } from '@/config/site';
import { HERO_HEADING } from '@/domain/jumi/landingCopy';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = SEO.title;

/**
 * next/og 의 기본 폰트는 한글 글리프가 없어 그냥 두면 □□□ 로 나온다.
 * 빌드 시점에 한글 웹폰트를 받아 넣되, CDN 이 죽어도 빌드는 살아야 하므로
 * 실패하면 폰트 없이(=기본 폰트로) 생성한다.
 */
const FONT_URL =
  'https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-kr@latest/korean-700-normal.woff';

async function loadKoreanFont(): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(FONT_URL);
    if (!response.ok) return null;
    return await response.arrayBuffer();
  } catch {
    return null;
  }
}

/**
 * satori 는 외부 URL 을 가져오지 못하므로 전신 일러스트를 data URI 로 심는다.
 * 레포 안의 필수 에셋이라 실패하면 조용히 넘기지 않고 빌드를 세운다.
 */
async function loadJumiFullImage(): Promise<string> {
  const bytes = await readFile(join(process.cwd(), 'public', 'jumi', 'jumi-full-v2.jpg'));
  return `data:image/jpeg;base64,${bytes.toString('base64')}`;
}

/** 카톡·SNS 공유 미리보기 이미지. */
export default async function OpengraphImage() {
  const [fontData, jumiSrc] = await Promise.all([loadKoreanFont(), loadJumiFullImage()]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          // 좌측 정렬로 두면 텍스트가 짧아 우측에 큰 공백이 남는다.
          justifyContent: 'center',
          padding: '0 64px',
          // 본체(cash-bite) 다크 토큰과 같은 값. 여기선 CSS 변수를 못 쓰므로 직접 적는다.
          background: '#101013',
          color: '#ececef',
          fontFamily: fontData ? 'Noto Sans KR' : undefined,
        }}
      >
        {/* 일러스트 배경이 크림색 종이라 카드로 감싸 경계를 의도한 것처럼 보이게 한다. */}
        <img
          src={jumiSrc}
          width={300}
          height={512}
          alt=""
          style={{
            marginRight: 56,
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.13)',
            objectFit: 'cover',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 64, lineHeight: 1.2 }}>{HERO_HEADING}</div>
          <div style={{ fontSize: 34, marginTop: 22, color: '#8e8e98' }}>
            주미와 함께 시작하는 주식 첫걸음
          </div>
          <div style={{ fontSize: 26, marginTop: 34, color: '#5b8def', letterSpacing: 2 }}>
            {SERVICE_NAME}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: 'Noto Sans KR', data: fontData, weight: 700, style: 'normal' }]
        : undefined,
    },
  );
}
