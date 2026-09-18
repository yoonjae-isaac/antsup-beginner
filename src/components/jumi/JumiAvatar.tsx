import Image from 'next/image';
import type { JumiArt } from '@/domain/jumi/types';

type AvatarSize = 'sm' | 'lg';

interface JumiAvatarProps {
  art: JumiArt;
  size: AvatarSize;
}

/**
 * 원형 지름(px) — next/image 의 srcset 기준이므로 **PC 쪽 큰 값**을 넣는다.
 * 모바일 값을 넣으면 PC 에서 2x 이미지가 부족해 흐려진다.
 */
const DIAMETER: Record<AvatarSize, number> = { sm: 40, lg: 160 };

/** 실제 표시 크기는 CSS 가 정한다(md 부터 PC 치수). */
const FRAME: Record<AvatarSize, string> = {
  sm: 'size-9 text-lg md:size-10',
  lg: 'size-32 text-[3.5rem] md:size-40 md:text-[4.25rem]',
};

/**
 * 주미 캐릭터 자리.
 * artwork.ts 의 src 가 null 이면 원형 플레이스홀더를, 채워지면 실제 그림을 그린다.
 * 그림 교체는 artwork.ts 만 수정하면 되고 이 컴포넌트는 손댈 필요가 없다.
 */
export default function JumiAvatar({ art, size }: JumiAvatarProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-cb-tile ring-1 ring-cb-border-strong ${FRAME[size]}`}
    >
      {art.src ? (
        <Image
          src={art.src}
          alt={art.alt}
          width={DIAMETER[size]}
          height={DIAMETER[size]}
          className="size-full object-cover"
          priority={size === 'lg'}
        />
      ) : (
        <span role="img" aria-label={art.alt}>
          {art.placeholderEmoji}
        </span>
      )}
    </span>
  );
}
