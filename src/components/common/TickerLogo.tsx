'use client';

interface TickerLogoProps {
  /**
   * 타일에 남길 글자의 출처. 티커든 종목명이든 '사람이 보는 이름'을 넘긴다.
   *
   * 심볼을 그대로 넘기면 안 된다 — '005380.KS' 에서는 거래소 코드인 'KS' 가 뽑힌다.
   */
  label: string;
  /** GET /stocks/logos 가 준 URL. 없는 종목은 null. */
  src: string | null;
  size?: 'sm' | 'md';
}

const FRAME = {
  sm: 'size-6 rounded-lg text-[9.5px]',
  md: 'size-[30px] rounded-[9px] text-[10.5px] lg:size-9 lg:rounded-xl lg:text-xs',
} as const;

/**
 * 타일에 남길 글자.
 *
 * 숫자·기호를 걷어내고 글자만 남긴다. 한글은 한 자만 쓴다 — 30px 타일에 두 자를
 * 넣으면 넘친다. 남는 글자가 없으면(숫자만 있는 종목 코드 등) 빈 타일로 둔다.
 */
function monoOf(label: string): string {
  const letters = label.replace(/[^\p{L}]/gu, '');
  if (letters === '') return '';

  const isAscii = /^[A-Za-z]/.test(letters);
  return letters.slice(0, isAscii ? 2 : 1).toUpperCase();
}

/**
 * 종목 로고. 없으면 티커 약자가 그 자리에 남는다.
 *
 * 로고와 대체 상태의 크기가 같아야 한다 — 로고 출처가 Finnhub 프로필이라 국내
 * 종목은 대부분 없고, 있다가 없다가 하면 목록 줄이 들썩인다.
 *
 * next/image 를 쓰지 않는다. 제3자 CDN 이라 remotePatterns 를 넓게 열어야 하는데,
 * 그러면 우리 배포가 아무 이미지나 변환해 주는 공개 프록시가 된다.
 * 30px 짜리 아이콘이라 최적화로 얻을 것도 없다.
 */
export default function TickerLogo({ label, src, size = 'md' }: TickerLogoProps) {
  const mono = monoOf(label);

  return (
    <span
      aria-hidden="true"
      className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-[#23232a] font-mono font-bold text-[#b6b6c0] ${FRAME[size]}`}
    >
      {/* 약자를 항상 아래에 깔아 둔다. 로고가 깨지면 이게 그대로 드러난다. */}
      {mono}

      {src !== null && (
        <img
          alt=""
          /* 배경색을 줘야 투명한 로고 뒤로 약자가 비치지 않는다. */
          className="absolute inset-0 size-full bg-[#23232a] object-contain"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
          referrerPolicy="no-referrer"
          src={src}
        />
      )}
    </span>
  );
}
