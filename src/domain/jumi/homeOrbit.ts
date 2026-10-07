/**
 * 홈 오비트 — 주미를 중심에 두고 8방향으로 떠 있는 서비스 입구.
 *
 * 8칸 링을 먼저 정의하고 그중 일곱 칸을 채운다. 남는 한 칸은 점선으로 비워
 * 두는데, 이건 미완성이 아니라 '여기에 더 붙는다'는 표시다. 서비스가 늘면
 * ORBIT_ENTRIES 에 추가하고 ORBIT_EMPTY_DIRECTIONS 에서 그 방향만 빼면 된다.
 *
 * 방향 벡터를 여기 한 곳에 두는 이유는, 버튼 위치와 중심에서 뻗는 연결선이
 * 같은 값을 봐야 하기 때문이다. 둘이 어긋나면 선이 버튼을 안 가리킨다.
 */

import { CALENDAR_PATH } from '@/domain/calendar/route';
import { INVESTORS_PATH } from '@/domain/investors/route';
import { BRIEFING_PATH } from '@/domain/briefing/route';
import { MACRO_PATH } from '@/domain/macro/route';
import { NEWS_PATH } from '@/domain/news/route';
import { MY_STOCKS_PATH } from '@/domain/stocks/route';
import { TOOLS_PATH } from '@/domain/tools/route';
import { FIRST_LESSON, lessonPath } from './lessons';

export type OrbitDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

export type OrbitIconKey =
  | 'sprout'
  | 'calendar'
  | 'news'
  | 'people'
  | 'globe'
  | 'calculator'
  | 'sunrise'
  | 'bookmark';

export interface OrbitEntry {
  id: string;
  direction: OrbitDirection;
  label: string;
  icon: OrbitIconKey;
  /** 링에서 시선이 가장 먼저 닿는 자리(N)에 두는 1순위 입구. 하나만 둔다. */
  primary?: true;
  /**
   * 갈 곳. 아직 없는 입구는 비워 두면 눌리지 않는 버튼으로 그려진다 —
   * 눌러도 아무 일이 없는 버튼을 살아 있는 척 두지 않기 위해서다.
   */
  href?: string;
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

/** 링의 높이 단계 — 위에서 아래로. 같은 단계에 있는 노드는 수평이 맞아야 한다. */
const FLOAT_ROWS: readonly number[] = [-1, -DIAGONAL, 0, DIAGONAL, 1];

/** 한 단계 아래로 내려갈 때마다 이만큼 늦게 뜨기 시작한다. */
const FLOAT_ROW_STEP_MS = 700;

/**
 * 노드가 둥둥 뜨기 시작하는 시각(ms).
 *
 * 선언 순서가 아니라 **링에서 몇 번째 높이인가**로 준다. 순서로 주면 같은 높이에
 * 있어야 할 좌우 짝(ne·nw, se·sw)이 서로 다른 위상으로 떠서, 멈춰 세우면 정확히
 * 맞는 자리인데 화면에서는 늘 몇 px 씩 어긋나 보인다 — 링이 미세하게 기운 것처럼
 * 읽힌다. 높이로 묶으면 좌우는 항상 수평을 지키고 시간차는 위아래로만 생긴다.
 */
export function floatDelayMs(direction: OrbitDirection): number {
  const { y } = DIRECTION_VECTOR[direction];
  // 소수 좌표라 값이 정확히 같은지 묻지 않고 오차를 둔다.
  const row = FLOAT_ROWS.findIndex((value) => Math.abs(value - y) < 0.01);
  return (row === -1 ? 0 : row) * FLOAT_ROW_STEP_MS;
}

/**
 * 여덟 칸이 전부 찼다. 대각선 네 칸으로 좌우 대칭을 만들고, 남북을 세로축으로 세웠다.
 * 마지막까지 비어 있던 서쪽은 '내 주식'이 받았다.
 */
export const ORBIT_ENTRIES: readonly OrbitEntry[] = [
  {
    id: 'beginner',
    direction: 'n',
    label: '주린이는 여기',
    icon: 'sprout',
    primary: true,
    // 경로를 적지 않고 레슨 레지스트리에서 끌어온다 — 첫 레슨 슬러그가 바뀌어도 따라온다.
    href: lessonPath(FIRST_LESSON.slug),
  },
  { id: 'calendar', direction: 'ne', label: '증시 일정', icon: 'calendar', href: CALENDAR_PATH },
  { id: 'news', direction: 'se', label: '시장 뉴스', icon: 'news', href: NEWS_PATH },
  { id: 'investors', direction: 'sw', label: '투자자들 현황', icon: 'people', href: INVESTORS_PATH },
  { id: 'macro', direction: 'nw', label: '거시 지표', icon: 'globe', href: MACRO_PATH },
  { id: 'tools', direction: 's', label: '투자 도구', icon: 'calculator', href: TOOLS_PATH },
  { id: 'briefing', direction: 'e', label: '장전 브리핑', icon: 'sunrise', href: BRIEFING_PATH },
  { id: 'mystocks', direction: 'w', label: '내 주식', icon: 'bookmark', href: MY_STOCKS_PATH },
];

export const ORBIT_EMPTY_DIRECTIONS: readonly OrbitDirection[] = [];
