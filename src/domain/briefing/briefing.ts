import { backendGet } from '@/config/backend';
import { BACKEND_ROUTES, type BriefingResponse } from '@/config/backendRoutes';
import type {
  Briefing,
  BriefingIssue,
  BriefingListItem,
  BriefingNewTheme,
  BriefingRisk,
  BriefingSchedule,
  BriefingScan,
  BriefingStock,
  BriefingTheme,
  IssueTone,
  RiskLevel,
} from './types';

/**
 * 받아 온 브리핑을 화면이 쓸 모양으로 고른다.
 *
 * 출처(개미승리)가 준 섹션은 백엔드가 손대지 않고 그대로 보관한다. 그 데이터가
 * 날마다 모양이 흔들려서(실제로 이틀 사이에 analyst_comment 구조가 바뀌었다),
 * 고르고 다듬는 일을 전부 여기 모았다. 모르는 모양이 오면 그 섹션만 비우고
 * 나머지는 그린다 — 한 칸이 바뀌었다고 페이지가 통째로 죽으면 안 된다.
 */

const KST = 'Asia/Seoul';

/**
 * 국기·심각도 이모지. 출처 글에 섞여 들어온다('🇺🇸 미국', '…협상 중 🔴高').
 *
 * 문자 클래스 하나로 묶지 않고 갈라 쓴 이유는, 이어 붙는 문자(VS16·ZWJ)와 범위를
 * 한 클래스에 넣으면 의도와 다른 짝이 잡히기 때문이다(no-misleading-character-class).
 * 국기는 Extended_Pictographic 에 안 잡혀서 지역 표시자 범위를 따로 둔다.
 */
const EMOJI = /\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]|\u{FE0F}|\u{200D}/gu;

/**
 * 출처 글을 최소한만 다듬는다.
 *
 * 맨 앞의 ': ' 는 거의 모든 summary·upcoming 에 붙어 온다(원본의 라벨 자국).
 * 조사 앞 공백('상승 전망 에')은 건드리지 않는다 — 어느 토막이 조사인지 기계가
 * 가릴 수 없어서, 규칙으로 밀면 멀쩡한 낱말을 붙여 남의 문장을 틀리게 만든다.
 */
function clean(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(EMOJI, '')
    .replace(/\s+/g, ' ')
    .replace(/^[:\-–—]\s*/, '')
    // 마크다운 구분선('---')이 문장 끝에 딸려 온다. 두 개 이상 이어진 것만 떼어
    // 낸다 — 한 개짜리는 '10/2 — 추석 연휴' 처럼 진짜 글일 수 있다.
    .replace(/\s*[-–—]{2,}\s*$/, '')
    .replace(/\s+([,.!?%])/g, '$1')
    .trim();
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function field(row: unknown, key: string): unknown {
  return row !== null && typeof row === 'object' ? (row as Record<string, unknown>)[key] : undefined;
}

function num(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

/** '2026-10-02' → '10월 2일 (금)'. */
function dateLabel(date: string): string {
  const [, month, day] = date.split('-');
  const weekday = new Intl.DateTimeFormat('ko-KR', { timeZone: KST, weekday: 'short' }).format(
    new Date(`${date}T12:00:00+09:00`),
  );
  return `${Number(month)}월 ${Number(day)}일 (${weekday})`;
}

function kstToday(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: KST,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function toStocks(value: unknown): BriefingStock[] {
  return asArray(value).flatMap((row) => {
    const name = clean(field(row, 'name'));
    if (name === '') return [];
    const code = clean(field(row, 'code'));
    const reason = clean(field(row, 'reason'));
    return [{ name, code: code === '' ? null : code, reason: reason === '' ? null : reason }];
  });
}

/** impact 는 positive·negative·neutral 로 온다. 모르는 값은 그냥 소식으로 둔다. */
function toTone(value: unknown): IssueTone {
  const text = typeof value === 'string' ? value.toLowerCase() : '';
  if (text.includes('positive')) return 'positive';
  if (text.includes('negative')) return 'negative';
  return 'neutral';
}

function toIssues(value: unknown): BriefingIssue[] {
  return asArray(value).flatMap((row, index) => {
    const title = clean(field(row, 'title'));
    if (title === '') return [];
    const upcoming = clean(field(row, 'upcoming'));
    return [
      {
        rank: num(field(row, 'rank'), index + 1),
        title,
        tone: toTone(field(row, 'impact')),
        summary: clean(field(row, 'summary')),
        stocks: toStocks(field(row, 'related_stocks')),
        upcoming: upcoming === '' ? null : upcoming,
      },
    ];
  });
}

/**
 * 주도주 문자열 → 이름 배열.
 *
 * 표기가 날마다 다르다 — '005930, 000660' 로 코드만 오는 날이 있고
 * '삼성전자(005930), SK하이닉스(000660)' 로 오는 날이 있다. 이름이 붙어 있으면
 * 이름만 남기고, 코드뿐이면 코드를 그대로 보여준다(없는 이름을 지어내지 않는다).
 */
function toLeaders(value: unknown): string[] {
  return clean(value)
    .split(',')
    .map((part) => part.replace(/\(.*?\)/g, '').trim())
    .filter((part) => part !== '');
}

function toThemes(value: unknown): BriefingTheme[] {
  return asArray(value).flatMap((row, index) => {
    const theme = clean(field(row, 'theme'));
    if (theme === '') return [];
    // 고정 테마는 catalyst 에, 유동 테마는 status 에 이유가 들어온다.
    const reason = clean(field(row, 'catalyst')) || clean(field(row, 'status'));
    return [{ rank: num(field(row, 'rank'), index + 1), theme, reason, leaders: toLeaders(field(row, 'leaders')) }];
  });
}

/**
 * 신규 테마의 trigger_event 한 칸을 쪼갠다.
 *
 * 출처가 마크다운을 통째로 밀어 넣는다:
 *   ': 계기 - **파급력**: 중기 - **수혜 종목**: 셀트리온(068270), … - **리스크**: …'
 * related_stocks 는 비어 있거나 같은 내용을 중복한다. 라벨을 끊어 나눠 쓴다.
 */
function splitTriggerEvent(raw: string): {
  trigger: string;
  horizon: string | null;
  stocks: BriefingStock[];
  risk: string | null;
} {
  const parts = raw.split(/\s*-\s*\*\*(.+?)\*\*\s*:?\s*/);
  const trigger = clean(parts[0]);

  let horizon: string | null = null;
  let risk: string | null = null;
  let stocks: BriefingStock[] = [];

  // split 결과는 [앞글, 라벨, 값, 라벨, 값, …] 로 번갈아 온다.
  for (let i = 1; i < parts.length - 1; i += 2) {
    const label = clean(parts[i]);
    const value = clean(parts[i + 1]);
    if (label.includes('파급력')) horizon = value;
    else if (label.includes('리스크') || label.includes('걸림돌')) risk = value;
    else if (label.includes('종목')) stocks = parseStockText(value);
  }

  return { trigger, horizon, stocks, risk };
}

/** '셀트리온(068270), 삼성바이오로직스(207940)' → 종목 목록. 마크다운 링크는 버린다. */
function parseStockText(text: string): BriefingStock[] {
  return text
    .replace(/\[.*$/, '')
    .split(',')
    .flatMap((part) => {
      const match = /^\s*(.+?)\s*\((\d{6})\)\s*$/.exec(part);
      if (!match) return [];
      return [{ name: match[1], code: match[2], reason: null }];
    });
}

function toNewThemes(value: unknown): BriefingNewTheme[] {
  return asArray(value).flatMap((row) => {
    const name = clean(field(row, 'theme_name'));
    if (name === '') return [];

    const parsed = splitTriggerEvent(
      typeof field(row, 'trigger_event') === 'string' ? (field(row, 'trigger_event') as string) : '',
    );
    // related_stocks 가 따로 채워져 있으면 그쪽을 믿는다.
    const own = toStocks(field(row, 'related_stocks'));

    return [
      {
        name,
        horizon: parsed.horizon,
        trigger: parsed.trigger,
        stocks: own.length > 0 ? own : parsed.stocks,
        risk: parsed.risk,
      },
    ];
  });
}

/** level 끝에 붙는 심각도 표시(🔴高·🟡中·🟢低)를 등급으로. */
function toRiskLevel(raw: string): RiskLevel {
  if (raw.includes('高')) return 'high';
  if (raw.includes('低')) return 'low';
  return 'mid';
}

function toRisks(value: unknown): BriefingRisk[] {
  return asArray(value).flatMap((row) => {
    const name = clean(field(row, 'name'));
    if (name === '') return [];

    const rawLevel = typeof field(row, 'level') === 'string' ? (field(row, 'level') as string) : '';
    // trigger 는 '조건 — 대응' 이다. 대응은 매매 지시라 싣지 않는다.
    const condition = clean(field(row, 'trigger')).split('—')[0];

    return [
      {
        name,
        level: toRiskLevel(rawLevel),
        status: clean(rawLevel.replace(/[高中低]/g, '')),
        condition: condition.trim(),
      },
    ];
  });
}

function toSchedules(value: unknown): BriefingSchedule[] {
  return asArray(value).flatMap((row) => {
    const event = clean(field(row, 'event'));
    if (event === '') return [];
    return [{ date: clean(field(row, 'date')), event, market: clean(field(row, 'related_theme')) }];
  });
}

/**
 * 영역 스캔 → '오늘 시장 한눈에'.
 *
 * checked 와 category 는 버린다. 그쪽 내부 점검표라 체크 상태가 내용과 맞지 않고
 * ('환율' 에 데이터가 있는데 checked:false), 아예 '수치 미확인' 같은 자기 기록이
 * 들어온 날도 있다. 그런 줄은 읽는 사람에게 쓸모가 없어 빼고, detail 만 쓴다.
 */
function toScans(value: unknown): BriefingScan[] {
  return asArray(value).flatMap((row) => {
    const label = clean(field(row, 'item'));
    const detail = clean(field(row, 'detail'));
    if (label === '' || detail === '' || detail.includes('미확인') || detail.includes('부재')) {
      return [];
    }
    return [{ label, detail }];
  });
}

function toBriefing(row: BriefingResponse): Briefing {
  const date = row.briefingDate;
  const sections = row.sections ?? {};

  return {
    date,
    dateLabel: dateLabel(date),
    isToday: date === kstToday(),
    summaryLine: clean(row.summaryLine),
    issues: toIssues(sections.topIssues),
    themes: toThemes(sections.themeRadar),
    newThemes: toNewThemes(sections.newThemes),
    risks: toRisks(sections.riskMonitoring),
    schedules: toSchedules(sections.weeklySchedules),
    scans: toScans(sections.scanChecklist),
    // sections.analystComment 는 쓰지 않는다. 문장 안에 '분할 매수·손절 라인 필수'
    // 같은 매매 지시가 섞여 있어서, 출처를 밝혀도 우리 화면에 실을 글이 아니다.
    // 백엔드에는 그대로 남아 있으니 마음이 바뀌면 여기만 되살리면 된다.
  };
}

/**
 * 보여줄 브리핑 한 건.
 *
 * 날짜를 주지 않으면 **가장 최근 글**이 온다 — 휴장일에 들어와도 빈 화면 대신
 * 직전 거래일 브리핑이 뜨게 하려는 것이다. 그 경우 `isToday` 가 false 라,
 * 화면이 '오늘 것이 아니라 언제 것인지'를 밝힐 수 있다.
 */
export async function loadBriefing(date?: string): Promise<Briefing | null> {
  const row = await backendGet(BACKEND_ROUTES.briefingDaily, { date: date ?? '' });
  if (!row || typeof row.briefingDate !== 'string' || typeof row.summaryLine !== 'string') {
    return null;
  }
  return toBriefing(row);
}

/** 아카이브 목록. */
export async function loadBriefingList(limit: number): Promise<BriefingListItem[]> {
  const rows = await backendGet(BACKEND_ROUTES.briefingList, { limit });
  if (!Array.isArray(rows)) return [];

  return rows.flatMap((row) => {
    if (typeof row.briefingDate !== 'string') return [];
    return [
      {
        date: row.briefingDate,
        dateLabel: dateLabel(row.briefingDate),
        summaryLine: clean(row.summaryLine),
      },
    ];
  });
}
