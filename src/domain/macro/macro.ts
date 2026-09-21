import { backendGet } from '@/config/backend';
import { BACKEND_ROUTES, type MacroOverviewResponse } from '@/config/backendRoutes';


export interface MacroIndicator {
  id: string;
  category: string;
  label: string;
  description: string;
  /** 사람이 읽을 수 있게 만든 최신값. 단위까지 붙어 있다. */
  value: string;
  /** '+2.9%' / '-1.0%p'. 받아오지 못하면 null. */
  yoy: string | null;
  /** 'up' | 'down' | null. 색과 방향을 정한다. */
  direction: 'up' | 'down' | null;
  asOf: string;
  /**
   * 수준 자체가 뜻을 갖는 지표인지.
   *
   * FRED 지수형 값은 'Index 1982-84=100, 314.686' 이라 초보에게 아무 의미가 없다.
   * 그런 지표는 '작년보다'를 앞세우고 원값을 뒤로 물린다. 실업률·금리처럼 Percent
   * 단위인 것만 값 자체를 크게 쓴다.
   */
  levelIsMeaningful: boolean;
}

export interface MacroBoard {
  indicators: readonly MacroIndicator[];
  categories: readonly string[];
}

/** 카드로 세울 대표 지표. 카탈로그 id 를 그대로 쓴다. */
export const MACRO_HEADLINE_IDS = [
  'us-cpi',
  'us-unemployment',
  'us-fed-rate',
  'us-treasury-10y',
] as const;

/** 목록에서 쓰는 분류 순서. 백엔드 카테고리 문자열과 같아야 한다. */
const CATEGORY_ORDER = ['물가', '고용', '금리', 'GDP', '소비', '주택'];

function isPercentUnit(unit: string): boolean {
  return unit.trim().toLowerCase() === 'percent';
}

/**
 * FRED 단위 → 화면에 붙일 한국어 꼬리.
 *
 * 꼬리를 떼면 숫자가 거짓말을 한다 — 비농업 취업자 수 159,540 은 15만 명이 아니라
 * 1억 5,954만 명이다. 카탈로그에 실제로 쓰이는 13종만 적어 두고, 모르는 단위는
 * 꼬리 없이 숫자만 낸다(틀린 꼬리보다 없는 편이 낫다).
 */
const UNIT_SUFFIX: Record<string, string> = {
  'thousands of persons': '천 명',
  'millions of dollars': '백만 달러',
  'billions of chained 2017 dollars': '십억 달러',
  'dollars per hour': '달러/시간',
  'dollars per barrel': '달러/배럴',
  'dollars per million btu': '달러/MMBtu',
  'dollars per troy ounce': '달러/온스',
};

/** 1,234.56 형태. 소수 자리는 값 크기에 맞춘다 — 금리는 소수가, 취업자 수는 정수가 읽힌다. */
function formatValue(value: number, unit: string): string {
  if (isPercentUnit(unit)) return `${value.toFixed(2)}%`;

  const digits = Math.abs(value) >= 1000 ? 0 : 2;
  const number = value.toLocaleString('ko-KR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

  // 지수는 'Index 1982-84=100' 처럼 기준연도가 붙어 온다. 기준연도는 초보에게 의미가 없다.
  if (unit.trim().toLowerCase().startsWith('index')) return `지수 ${number}`;

  const suffix = UNIT_SUFFIX[unit.trim().toLowerCase()];
  return suffix === undefined ? number : `${number}${suffix}`;
}

/**
 * 변동 표기.
 * Percent 단위 지표의 변동은 %가 아니라 %p 다 — 4.1%에서 4.3%로 간 걸 '+4.9%'로
 * 적으면 완전히 다른 뜻이 된다.
 */
function formatChange(yoy: number, unit: string): string {
  const sign = yoy > 0 ? '+' : '';
  return isPercentUnit(unit) ? `${sign}${yoy.toFixed(1)}%p` : `${sign}${yoy.toFixed(1)}%`;
}

/**
 * '2026-08-01' → '2026년 8월'.
 *
 * 일간 지표만 날짜까지 쓴다. 월간·분기 지표의 관측일은 그 달의 1일로 오기 때문에,
 * '9월 1일'이라고 적으면 9월 1일에 발표된 값처럼 읽힌다.
 */
function formatAsOf(date: string, frequency: string): string {
  const [year, month, day] = date.split('-');
  if (frequency === 'daily' || frequency === 'weekly') {
    return `${Number(month)}월 ${Number(day)}일`;
  }
  return `${year}년 ${Number(month)}월`;
}

function toIndicator(row: MacroOverviewResponse): MacroIndicator | null {
  const { entry, latest } = row;
  if (latest.value == null || latest.date == null) return null;

  const yoy = latest.yoyChange;

  return {
    id: entry.id,
    category: entry.category,
    label: entry.label,
    description: entry.description ?? '',
    value: formatValue(latest.value, entry.unit),
    yoy: yoy == null ? null : formatChange(yoy, entry.unit),
    direction: yoy == null ? null : yoy >= 0 ? 'up' : 'down',
    asOf: formatAsOf(latest.date, entry.frequency),
    levelIsMeaningful: isPercentUnit(entry.unit),
  };
}

/**
 * 거시 지표 한 판.
 *
 * 값이 비어 있는 지표(발표 전이거나 FRED 가 아직 안 준 것)는 목록에서 뺀다 —
 * 이름만 있고 숫자가 없는 줄은 초보에게 '고장'으로 읽힌다.
 */
export async function loadMacroBoard(): Promise<MacroBoard> {
  const rows = await backendGet(BACKEND_ROUTES.macroOverview);
  if (!Array.isArray(rows)) return { indicators: [], categories: [] };

  const indicators = rows.flatMap((row) => {
    const indicator = toIndicator(row);
    return indicator ? [indicator] : [];
  });

  const present = new Set(indicators.map((item) => item.category));
  const categories = CATEGORY_ORDER.filter((name) => present.has(name));

  return { indicators, categories };
}
