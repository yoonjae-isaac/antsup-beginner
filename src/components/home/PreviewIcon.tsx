type PreviewIconKey = 'market' | 'schedule' | 'macro' | 'quote';

interface PreviewIconProps {
  name: PreviewIconKey;
}

/**
 * 프리뷰 카드 머리 아이콘.
 * OrbitIcon 과 같은 이유로 인라인 스트로크 SVG 다 — 이모지는 플랫폼마다 그림이
 * 달라지고 주미 그림과 화풍이 부딪힌다. 색은 currentColor 로 카드가 정한다.
 */
export default function PreviewIcon({ name }: PreviewIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4 lg:size-[19px]"
    >
      {name === 'market' && (
        <>
          <path d="M3.5 16.5 9 11l3.5 3.5L20.5 6.5" />
          <path d="M15.5 6.5h5v5" />
        </>
      )}

      {/* 오비트의 같은 입구와 같은 그림이어야 한다 — 카드와 버튼이 같은 곳을 가리킨다. */}
      {name === 'schedule' && (
        <>
          <rect x="3" y="5" width="18" height="16" rx="2.5" />
          <path d="M8 3v4" />
          <path d="M16 3v4" />
          <path d="M3 10h18" />
        </>
      )}

      {name === 'macro' && (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.5 12h17" />
          <ellipse cx="12" cy="12" rx="4" ry="8.5" />
        </>
      )}

      {name === 'quote' && (
        <>
          <path d="M9.5 6.5C6.6 7.6 4.8 10.2 4.8 13.4c0 2.3 1.4 3.9 3.4 3.9 1.8 0 3.1-1.3 3.1-3 0-1.7-1.2-2.9-2.8-2.9-.3 0-.6 0-.8.1.3-1.3 1.3-2.4 2.6-3z" />
          <path d="M19.2 6.5c-2.9 1.1-4.7 3.7-4.7 6.9 0 2.3 1.4 3.9 3.4 3.9 1.8 0 3.1-1.3 3.1-3 0-1.7-1.2-2.9-2.8-2.9-.3 0-.6 0-.8.1.3-1.3 1.3-2.4 2.6-3z" />
        </>
      )}
    </svg>
  );
}
