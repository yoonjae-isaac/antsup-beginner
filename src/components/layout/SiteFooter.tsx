import Link from 'next/link';
import {
  FOOTER_ABOUT,
  FOOTER_ABOUT_HEADING,
  FOOTER_DISCLAIMER,
  FOOTER_NOTE,
  FOOTER_SOURCE,
  FOOTER_SOURCE_HEADING,
} from '@/domain/jumi/landingCopy';
import { PRIVACY_PATH, TERMS_PATH } from '@/domain/legal/route';

interface SiteFooterProps {
  /**
   * 본문 폭에 맞춘다. 허브(넓은 2단)와 레슨(좁은 읽기 컬럼)이 다른데,
   * 하나로 고정하면 한쪽에서 푸터만 혼자 왼쪽으로 튀어나온다.
   */
  width: 'hub' | 'reading';
}

/** 레슨 쪽 값은 카드의 mx-4 / md:mx-8 과 같아야 글머리가 카드 왼쪽 선에 맞는다. */
const CONTAINER: Record<SiteFooterProps['width'], string> = {
  hub: 'max-w-6xl px-6 lg:px-12',
  reading: 'max-w-md px-4 md:max-w-2xl md:px-8',
};

/**
 * 사이트 푸터 — 소개·출처·면책.
 *
 * 구분선도 배경도 두지 않는다. 위쪽 여백만으로 본문과 떨어뜨리는데,
 * 가로선이나 색 블록을 깔면 오비트 홈의 조용한 화면이 거기서 끊기기 때문이다.
 * 대신 글자 크기와 색을 낮춰 읽을 사람만 읽고 지나가게 한다.
 */
export default function SiteFooter({ width }: SiteFooterProps) {
  return (
    <footer className={`mx-auto w-full pt-20 pb-16 text-cb-muted ${CONTAINER[width]}`}>
      <div className="flex flex-col gap-7 md:flex-row md:gap-14">
        <section className="flex flex-col gap-2 md:max-w-xs">
          <h2 className="text-[13px] font-semibold text-cb-foreground">{FOOTER_ABOUT_HEADING}</h2>
          <p className="text-xs leading-relaxed">{FOOTER_ABOUT}</p>
        </section>

        <section className="flex flex-col gap-2 md:max-w-sm">
          <h2 className="text-[13px] font-semibold text-cb-foreground">{FOOTER_SOURCE_HEADING}</h2>
          <p className="text-xs leading-relaxed">{FOOTER_SOURCE}</p>
        </section>
      </div>

      <p className="mt-8 max-w-2xl text-[11px] leading-relaxed">{FOOTER_DISCLAIMER}</p>

      {/*
        정책 문서 링크. 눈에 띄게 둘 필요는 없지만 모든 페이지에서 닿아야 한다 —
        AdSense·GA 정책이 요구하고, 동의 배너의 '개인정보처리방침' 링크도 같은 곳을 가리킨다.
      */}
      <nav className="mt-6 flex items-center gap-3 text-[11px]">
        <Link href={PRIVACY_PATH} className="transition-colors hover:text-cb-foreground">
          개인정보처리방침
        </Link>
        <span aria-hidden="true">·</span>
        <Link href={TERMS_PATH} className="transition-colors hover:text-cb-foreground">
          이용약관
        </Link>
      </nav>

      {/* 연도는 일부러 뺐다 — 정적 생성이라 빌드 시점 연도가 그대로 굳어 해가 바뀌면 틀린 말이 된다. */}
      <p className="mt-3 text-[11px]">© {FOOTER_NOTE}</p>
    </footer>
  );
}
