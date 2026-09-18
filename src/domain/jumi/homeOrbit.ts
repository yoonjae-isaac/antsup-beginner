/**
 * 홈 오비트 — 주미를 중심에 두고 8방향으로 떠 있는 서비스 입구.
 *
 * 8칸 링을 먼저 정의하고 그중 다섯 칸만 채운다. 남는 세 칸은 점선으로 비워
 * 두는데, 이건 미완성이 아니라 '여기에 더 붙는다'는 표시다. 서비스가 늘면
 * ORBIT_ENTRIES 에 추가하고 ORBIT_EMPTY_DIRECTIONS 에서 그 방향만 빼면 된다.
 *
 * 방향 벡터를 여기 한 곳에 두는 이유는, 버튼 위치와 중심에서 뻗는 연결선이
 * 같은 값을 봐야 하기 때문이다. 둘이 어긋나면 선이 버튼을 안 가리킨다.
 */

export type OrbitDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

export type OrbitIconKey = 'sprout' | 'calendar' | 'news' | 'people' | 'globe';

export interface OrbitEntry {
  id: string;
  direction: OrbitDirection;
  label: string;
  icon: OrbitIconKey;
  /** 링에서 시선이 가장 먼저 닿는 자리(N)에 두는 1순위 입구. 하나만 둔다. */
  primary?: true;
}

/** 단위원 위의 방향. y 는 화면 좌표라 위쪽이 음수다. */
const DIAGONAL = 0.7071;

export const DIRECTION_VECTOR: Record<OrbitDirection, { x: number; y: number }> = {
  n: { x: 0, y: -1 },
  ne: { x: DIAGONAL, y: -DIAGONAL },
  e: { x: 1, y: 0 },
  se: { x: DIAGONAL, y: DIAGONAL },
  s: { x: 0, y: 1 },
  sw: { x: -DIAGONAL, y: DIAGONAL },
  w: { x: -1, y: 0 },
  nw: { x: -DIAGONAL, y: -DIAGONAL },
};

/**
 * 채워진 다섯 칸. 대각선 네 칸에 걸어 좌우 대칭을 만들고,
 * 비는 세 칸(동·남·서)이 고르게 퍼지게 했다.
 */
export const ORBIT_ENTRIES: readonly OrbitEntry[] = [
  { id: 'beginner', direction: 'n', label: '주린이는 여기', icon: 'sprout', primary: true },
  { id: 'calendar', direction: 'ne', label: '증시 일정', icon: 'calendar' },
  { id: 'news', direction: 'se', label: '시장 뉴스', icon: 'news' },
  { id: 'investors', direction: 'sw', label: '투자자들 현황', icon: 'people' },
  { id: 'macro', direction: 'nw', label: '거시 지표', icon: 'globe' },
];

export const ORBIT_EMPTY_DIRECTIONS: readonly OrbitDirection[] = ['e', 's', 'w'];
