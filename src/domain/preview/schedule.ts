import { backendGet } from '@/config/backend';
import { BACKEND_ROUTES, type CalendarWeekResponse, type NewsMarket } from '@/config/backendRoutes';
import { earningTitle, hourLabel, kstToday } from '@/domain/calendar/calendar';

/**
 * 홈 프리뷰가 쓰는 '오늘' 한 칸.
 *
 * 증시 일정 페이지(domain/calendar/calendar.ts)와 같은 엔드포인트를 보지만 모양이 다르다.
 * 거기는 한 주를 날짜별로 펼치는 화면이고, 여기는 카드 한 장에 오늘만 담는다 —
 * 로고도 받지 않는다(한 줄짜리 목록에 들어갈 자리가 없다).
 */
export interface ScheduleItem {
  id: string;
  kind: 'economic' | 'earning';
  /** '국내' | '미국'. 지표는 제목만 봐서는 어느 나라 숫자인지 모른다. */
  marketLabel: string;
  title: string;
  /** '중요' / '장 열기 전' 같은 꼬리. 좁은 화면에서는 접힌다. */
  meta: string;
  /** 중요도가 높은 지표. 빨강으로 눈에 띄게 둔다. */
  important: boolean;
}

export interface TodaySchedule {
  /** '10월 1일 (목)'. */
  dateLabel: string;
  items: readonly ScheduleItem[];
  /** 오늘 잡혀 있는 전부(공모 제외). 카드가 접은 만큼이 있다는 걸 알려 준다. */
  total: number;
}

const MARKET_LABEL: Record<NewsMarket, string> = { KR: '국내', US: '미국' };

/**
 * 실적은 세 건까지만.
 *
 * 하루에 수십 곳이 실적을 내는 날이 있는데, 그걸 다 세우면 카드가 실적 목록이 된다.
 * 지표는 날마다 몇 건뿐이고 시장 전체를 움직이므로 자르지 않는다.
 */
const EARNING_LIMIT = 3;

/**
 * 카드가 그릴 수 있는 줄 수의 한계.
 *
 * 내용 규칙이 아니라 레이아웃 제약이다 — 카드 높이가 고정이라 이보다 많으면
 * 아래가 잘려 나간다. 잘린 만큼은 `total` 과 '전체 보기'가 받는다.
 */
const CARD_LIMIT = 8;

/** '2026-10-01' → '10월 1일 (목)'. */
function todayLabel(date: string): string {
  const [, month, day] = date.split('-');
  const weekday = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    weekday: 'short',
  }).format(new Date(`${date}T12:00:00+09:00`));

  return `${Number(month)}월 ${Number(day)}일 (${weekday})`;
}

function collect(market: NewsMarket, week: CalendarWeekResponse, today: string) {
  const economic: ScheduleItem[] = [];
  const earnings: ScheduleItem[] = [];

  for (const row of week.economic ?? []) {
    if (row.date !== today) continue;
    const important = row.impact.toLowerCase() === 'high';
    economic.push({
      id: `econ-${market}-${row.key}`,
      kind: 'economic',
      marketLabel: MARKET_LABEL[market],
      title: row.event,
      meta: important ? '중요' : '보통',
      important,
    });
  }

  for (const row of week.earnings ?? []) {
    if (row.date !== today) continue;
    earnings.push({
      id: `earn-${market}-${row.symbol}`,
      kind: 'earning',
      marketLabel: MARKET_LABEL[market],
      title: earningTitle(row.symbol, row.name),
      meta: hourLabel(row.hour) ?? '실적 발표',
      important: false,
    });
  }

  return { economic, earnings };
}

/**
 * 오늘 증시 일정 한 장면. 오늘 아무것도 없으면 null 이다.
 *
 * 공모는 담지 않는다 — 청약은 증권사 계좌와 일정이 따로 걸려 있어서, 알려 줘도
 * 홈에서 할 수 있는 일이 없다. 주말처럼 비는 날에 '없어요' 카드를 돌리느니
 * 카드 자체를 빼는 게 낫다(시세 카드가 null 일 때와 같은 규칙).
 */
export async function loadTodaySchedule(): Promise<TodaySchedule | null> {
  const today = kstToday(new Date());

  const [kr, us] = await Promise.all([
    backendGet(BACKEND_ROUTES.calendarWeek, { market: 'KR' }),
    backendGet(BACKEND_ROUTES.calendarWeek, { market: 'US' }),
  ]);

  // 한쪽만 와도 그릴 수 있다 — 국내만 있는 카드가 아무것도 없는 것보다 낫다.
  const weeks: { market: NewsMarket; week: CalendarWeekResponse }[] = [];
  if (kr) weeks.push({ market: 'KR', week: kr });
  if (us) weeks.push({ market: 'US', week: us });
  if (weeks.length === 0) return null;

  const economic: ScheduleItem[] = [];
  const earnings: ScheduleItem[] = [];
  for (const { market, week } of weeks) {
    const found = collect(market, week, today);
    economic.push(...found.economic);
    earnings.push(...found.earnings);
  }

  /*
   * 종류별로 묶지 않고 중요한 것부터 세운다.
   *
   * 좁은 카드는 위에서 세 줄만 보여주는데, '지표 전부 → 실적' 순으로 묶으면 지표가
   * 많은 날에는 실적이 한 건도 안 보인다. 그날 '삼성전자 실적'이 있다는 건 초보에게
   * 가장 눈에 띄는 정보라, 보통 등급 지표보다 앞에 둔다.
   */
  const items = [
    ...economic.filter((item) => item.important),
    ...earnings.slice(0, EARNING_LIMIT),
    ...economic.filter((item) => !item.important),
  ].slice(0, CARD_LIMIT);
  if (items.length === 0) return null;

  return { dateLabel: todayLabel(today), items, total: economic.length + earnings.length };
}
