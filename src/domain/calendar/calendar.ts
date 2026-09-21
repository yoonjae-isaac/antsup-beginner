import { backendGet } from '@/config/backend';
import { BACKEND_ROUTES, type CalendarWeekResponse, type NewsMarket } from '@/config/backendRoutes';
import { loadLogos } from '@/domain/stocks/logos';
import { koreanSymbolName } from '@/domain/stocks/symbolNames';


export type CalendarKind = 'earning' | 'economic' | 'ipo';

export interface CalendarItem {
  id: string;
  kind: CalendarKind;
  title: string;
  note: string;
  /** '장 열기 전' 같은 말. 실적에만 있다. */
  when: string | null;
  meta: string;
  /** 중요도가 높은 지표. 빨강으로 눈에 띄게 둔다. */
  important: boolean;
  /** 실적에만. 로고 조회에 쓴 티커다. */
  ticker: string | null;
  logo: string | null;
}

export interface CalendarDay {
  date: string;
  /** '월' ~ '일'. */
  weekday: string;
  /** 22 같은 일자. */
  dayOfMonth: string;
  isToday: boolean;
  items: readonly CalendarItem[];
}

export interface CalendarWeek {
  rangeLabel: string;
  days: readonly CalendarDay[];
  total: number;
}

export type CalendarBoard = Record<NewsMarket, CalendarWeek>;

const KST = 'Asia/Seoul';
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * 백엔드 hour 코드를 사람 말로. 코드를 그대로 두면 초보는 읽을 수 없다.
 * dmh(장중)는 안 쓴다 — 실적을 장중에 내는 일은 드물고, 그때는 시간이 없는 편이 낫다.
 */
const HOUR_LABEL: Record<string, string> = {
  bmo: '장 열기 전',
  amc: '장 마감 후',
};

function kstToday(now: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: KST,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/**
 * '월' ~ '일'.
 *
 * Date#getDay 를 쓰면 안 된다 — 그건 서버의 로컬 시간대 요일이라, UTC 뒤에 있는
 * 지역에서 돌면 하루 밀린다. 시간대를 명시한 Intl 로 뽑는다.
 */
function weekdayOf(date: string): string {
  return new Intl.DateTimeFormat('ko-KR', { timeZone: KST, weekday: 'short' }).format(
    new Date(`${date}T12:00:00+09:00`),
  );
}

function monthDayLabel(date: string): string {
  const [, month, day] = date.split('-');
  return `${Number(month)}월 ${Number(day)}일`;
}

function impactLabel(impact: string): { text: string; important: boolean } {
  return impact.toLowerCase() === 'high'
    ? { text: '중요', important: true }
    : { text: '보통', important: false };
}

/**
 * 실적 항목의 제목.
 *
 * 국내는 DART 가 기업명을 같이 준다. 미국은 심볼만 와서 'MU' 가 제목이 되는데,
 * 초보에게 세 글자 약자는 아무것도 아니라 한글 종목명을 찾아 앞에 세운다.
 */
function earningTitle(symbol: string, name?: string): string {
  if (name && name.trim() !== '') return name;
  return koreanSymbolName(symbol) ?? symbol;
}

function toItems(week: CalendarWeekResponse, date: string, logos: Record<string, string>) {
  const items: CalendarItem[] = [];

  for (const row of week.economic.filter((e) => e.date === date)) {
    const impact = impactLabel(row.impact);
    items.push({
      id: `econ-${row.date}-${row.key}`,
      kind: 'economic',
      title: row.event,
      note: '나라 전체 숫자가 나오는 날이에요.',
      when: null,
      meta: impact.text,
      important: impact.important,
      ticker: null,
      logo: null,
    });
  }

  for (const row of week.earnings.filter((e) => e.date === date)) {
    items.push({
      id: `earn-${row.date}-${row.symbol}`,
      kind: 'earning',
      title: earningTitle(row.symbol, row.name),
      // 제목이 한글 이름으로 바뀌면 심볼이 화면에서 사라진다. 찾아볼 수 있게 남겨 둔다.
      note: `${row.symbol} · 지난 분기 성적표를 내는 날이에요.`,
      when: HOUR_LABEL[row.hour] ?? null,
      meta: row.epsEstimate == null ? '예상치 없음' : `EPS 예상 ${row.epsEstimate.toFixed(2)}`,
      important: false,
      ticker: row.symbol,
      logo: logos[row.symbol.toUpperCase()] ?? null,
    });
  }

  for (const row of week.ipos.filter((e) => e.date === date)) {
    items.push({
      id: `ipo-${row.date}-${row.symbol}`,
      kind: 'ipo',
      title: row.name,
      note: '새 종목이 시장에 처음 올라오는 날이에요.',
      when: null,
      meta: row.price == null ? '공모가 미정' : `공모가 ${row.price}`,
      important: false,
      ticker: null,
      logo: null,
    });
  }

  return items;
}

/** from~to 사이의 날짜를 하루씩 채운다. 일정이 없는 날도 칸은 있어야 한 주가 보인다. */
function datesBetween(from: string, to: string): string[] {
  const dates: string[] = [];
  // 정오에서 출발해 24시간씩 더한다. setDate 는 로컬 시간대를 타서 서버 위치에 휘둘린다.
  let cursor = new Date(`${from}T12:00:00+09:00`).getTime();
  const end = new Date(`${to}T12:00:00+09:00`).getTime();
  const format = new Intl.DateTimeFormat('en-CA', { timeZone: KST });

  if (!Number.isFinite(cursor) || !Number.isFinite(end)) return dates;

  // 한 주를 넘게 받는 일은 없지만, 응답이 이상해도 무한 루프에 빠지지 않게 막아 둔다.
  while (cursor <= end && dates.length < 14) {
    dates.push(format.format(cursor));
    cursor += DAY_MS;
  }

  return dates;
}

const EMPTY_WEEK: CalendarWeek = { rangeLabel: '', days: [], total: 0 };

async function loadMarket(market: NewsMarket, now: Date): Promise<CalendarWeek> {
  const week = await backendGet(BACKEND_ROUTES.calendarWeek, { market });
  if (!week || !Array.isArray(week.earnings)) return EMPTY_WEEK;

  // 로고는 실적 심볼만 필요하다. 한 주 분량이라 배치 상한(40)을 넘길 일이 드물다.
  const logos = await loadLogos(week.earnings.map((row) => row.symbol));

  const today = kstToday(now);
  const days = datesBetween(week.from, week.to)
    .map((date) => ({
      date,
      weekday: weekdayOf(date),
      dayOfMonth: String(Number(date.split('-')[2])),
      isToday: date === today,
      items: toItems(week, date, logos),
    }))
    // 주말은 일정이 없으면 뺀다. 빈 칸 두 개가 한 주를 넓히기만 한다.
    .filter((day) => day.items.length > 0 || (day.weekday !== '토' && day.weekday !== '일'));

  return {
    rangeLabel: `${monthDayLabel(week.from)} ~ ${monthDayLabel(week.to)}`,
    days,
    total: days.reduce((sum, day) => sum + day.items.length, 0),
  };
}

/**
 * 두 시장을 한 번에 받아 둔다 — 뉴스와 같은 이유로, 전환을 쿼리스트링으로 받으면
 * searchParams 때문에 페이지가 매 요청 렌더로 바뀌어 ISR 이 깨진다.
 */
export async function loadCalendarBoard(): Promise<CalendarBoard> {
  const now = new Date();
  const [kr, us] = await Promise.all([loadMarket('KR', now), loadMarket('US', now)]);

  return { KR: kr, US: us };
}
