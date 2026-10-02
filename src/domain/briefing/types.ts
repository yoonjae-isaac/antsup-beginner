/**
 * 화면이 쓰는 장전 브리핑 모양.
 *
 * 백엔드는 출처가 준 섹션을 손대지 않고 그대로 보관한다. 모양이 날마다 흔들리는
 * 데이터라(실제로 이틀 사이에 analyst_comment 구조가 바뀌었다) 고르고 다듬는 일은
 * 전부 여기(briefing.ts)에서 하고, 화면 컴포넌트는 다듬어진 것만 받는다.
 */

export interface BriefingStock {
  name: string;
  /** 종목 코드. 없을 수도 있다. */
  code: string | null;
  /** 왜 묶였는지 한 줄. 없을 수도 있다. */
  reason: string | null;
}

/** 좋은 소식 / 조심할 것 / 그냥 소식. */
export type IssueTone = 'positive' | 'negative' | 'neutral';

export interface BriefingIssue {
  rank: number;
  title: string;
  tone: IssueTone;
  summary: string;
  stocks: readonly BriefingStock[];
  /** '9/30 마이크론 2Q 실적 발표' 같은 예정. 없으면 null. */
  upcoming: string | null;
}

export interface BriefingTheme {
  rank: number;
  theme: string;
  /** 왜 움직이나. catalyst 와 status 중 채워진 쪽. */
  reason: string;
  /** 주도주 이름들. 코드만 온 날에는 코드가 들어간다. */
  leaders: readonly string[];
}

export interface BriefingNewTheme {
  name: string;
  /** '중기 (6개월~1년)' 같은 말. 없으면 null. */
  horizon: string | null;
  /** 왜 떴나. */
  trigger: string;
  stocks: readonly BriefingStock[];
  /** 걸림돌. 없으면 null. */
  risk: string | null;
}

export type RiskLevel = 'high' | 'mid' | 'low';

export interface BriefingRisk {
  name: string;
  level: RiskLevel;
  /** 지금 상태. 심각도 표시는 떼어 낸 뒤의 글이다. */
  status: string;
  /**
   * 무슨 일이 생기면 문제가 되는지.
   * 출처는 여기에 '— 대응' 을 붙여 매매 지시까지 적지만, 그 뒤는 싣지 않는다.
   */
  condition: string;
}

export interface BriefingSchedule {
  date: string;
  event: string;
  /** '국내' | '미국' 등. 이모지는 떼어 낸다. */
  market: string;
}

export interface BriefingScan {
  label: string;
  detail: string;
}

export interface Briefing {
  /** '2026-10-02'. */
  date: string;
  /** '10월 2일 (금)'. */
  dateLabel: string;
  /** 오늘 날짜가 아니면(휴장일 등) 직전 거래일 글이라는 뜻이다. */
  isToday: boolean;
  summaryLine: string;
  issues: readonly BriefingIssue[];
  themes: readonly BriefingTheme[];
  newThemes: readonly BriefingNewTheme[];
  risks: readonly BriefingRisk[];
  schedules: readonly BriefingSchedule[];
  scans: readonly BriefingScan[];
}

/** 아카이브 목록 한 줄. */
export interface BriefingListItem {
  date: string;
  dateLabel: string;
  summaryLine: string;
}
