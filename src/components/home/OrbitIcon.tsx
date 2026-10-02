import type { OrbitIconKey } from '@/domain/jumi/homeOrbit';

interface OrbitIconProps {
  name: OrbitIconKey;
}

/**
 * 오비트 버튼 아이콘 — 전부 인라인 스트로크 SVG.
 * 이모지를 쓰지 않는 이유는 플랫폼마다 그림이 달라지고, 주미 그림과 화풍이
 * 부딪히기 때문이다. currentColor 를 쓰므로 색은 버튼이 정한다.
 */
export default function OrbitIcon({ name }: OrbitIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-[22px] md:size-6"
    >
      {name === 'sprout' && (
        <>
          <path d="M12 21v-8" />
          <path d="M12 13c0-3.3-2.7-6-6-6 0 3.3 2.7 6 6 6z" />
          <path d="M12 13c0-3.9 3.1-7 7-7 0 3.9-3.1 7-7 7z" />
        </>
      )}

      {name === 'calendar' && (
        <>
          <rect x="3" y="5" width="18" height="16" rx="2.5" />
          <path d="M8 3v4" />
          <path d="M16 3v4" />
          <path d="M3 10h18" />
        </>
      )}

      {name === 'news' && (
        <>
          <path d="M4 5h11a1 1 0 0 1 1 1v13H5a1 1 0 0 1-1-1V5z" />
          <path d="M16 9h3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-3" />
          <path d="M7 9h6" />
          <path d="M7 12.5h6" />
          <path d="M7 16h4" />
        </>
      )}

      {name === 'people' && (
        <>
          <circle cx="9" cy="8" r="3.2" />
          <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
          <path d="M16 5.6a3.2 3.2 0 0 1 0 6.3" />
          <path d="M17.6 14.2A5.5 5.5 0 0 1 20.5 19" />
        </>
      )}

      {name === 'globe' && (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.5 12h17" />
          <ellipse cx="12" cy="12" rx="4" ry="8.5" />
        </>
      )}

      {/* 지평선 위로 해가 올라오는 모양 — 장이 열리기 전을 가리킨다. */}
      {name === 'sunrise' && (
        <>
          <path d="M3.5 19h17" />
          <path d="M6.5 15.5a5.5 5.5 0 0 1 11 0" />
          <path d="M12 3v3" />
          <path d="M5.2 6.2 7 8" />
          <path d="M18.8 6.2 17 8" />
        </>
      )}

      {/*
        자판 여섯 개는 길이 0 인 선이다. strokeLinecap='round' 가 그걸 동그란 점으로
        그려 준다 — <circle> 로 찍으면 fill='none' 때문에 속이 빈 동그라미가 된다.
      */}
      {name === 'calculator' && (
        <>
          <rect x="4.5" y="3" width="15" height="18" rx="2.5" />
          <rect x="8" y="6.4" width="8" height="2.6" rx="0.8" />
          <path d="M9.3 12.6h.01" />
          <path d="M12 12.6h.01" />
          <path d="M14.7 12.6h.01" />
          <path d="M9.3 16.6h.01" />
          <path d="M12 16.6h.01" />
          <path d="M14.7 16.6h.01" />
        </>
      )}
    </svg>
  );
}
