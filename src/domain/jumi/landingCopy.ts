import type { Speaker } from './types';

/**
 * 대사가 아닌 화면 문구 — 제목·라벨 등.
 * 주미가 '말하는' 것은 jumiScript.ts / choiceScript.ts 가 소유하고,
 * 레슨별 제목은 lessons.ts 가 소유한다.
 */

export const MASCOT_NAME = '주미';
export const MASCOT_ROLE = '주식개미';

export const HERO_HEADING = '주식, 처음이세요?';
export const CTA_LABEL = '다음 이야기 들으러 가기';
export const BACK_TO_HOME = '홈으로';

/** 홈 허브 — 주미를 중심에 둔 여덟 방향 입구. */
export const HOME_EYEBROW = 'step-ants';
export const HOME_HEADING = '어디부터 가볼까요?';
export const HOME_LEAD = '주미를 가운데 두고 여덟 방향으로 길을 냈어요. 필요한 곳을 바로 고르면 돼요.';
export const ORBIT_NAV_LABEL = '서비스 바로가기';
export const ORBIT_EMPTY_HINT = '빈 자리 세 곳은 아직 준비 중이에요';

/**
 * 홈 좌측 컨텐츠 프리뷰 — 환율·시장 카드와 오늘의 명언 카드.
 * 숫자는 cash-bite-backend 에서 오고, 여기 있는 건 라벨뿐이다.
 */
export const PREVIEW_NAV_LABEL = '컨텐츠 미리보기';
export const PREVIEW_MARKET_TITLE = '환율 · 시장';
export const PREVIEW_MARKET_FRESHNESS = '1분마다 새로 받아요';
export const PREVIEW_USD_KRW_LABEL = '원 / 달러';
export const PREVIEW_INDEX_HEADING = '오늘 지수';
/** 상승·하락 색이 나라마다 반대라, 이 화면이 어느 쪽인지는 글로도 남긴다. */
export const PREVIEW_UPDOWN_NOTE = '상승 파랑 · 하락 빨강으로 보고 있어요';
export const PREVIEW_QUOTE_TITLE = '오늘의 명언';
export const PREVIEW_AUTO_HINT = '3초마다 다음 카드로';

/** 눌러야 대화가 이어진다는 걸 알려주는 안내. 없으면 멈춘 화면으로 오해한다. */
export const CHOICE_HINT = '답장을 골라 대화를 이어가세요';
export const CHOICE_GROUP_LABEL = '주미에게 할 답장 선택';

export const STEP_RAIL_LABEL = '가이드 단계';

/**
 * 푸터 — 소개·출처·면책을 담는 자리.
 * 구분선이나 배경 없이 본문 아래에 조용히 깔린다(디자인을 끊지 않기 위해).
 */
export const FOOTER_ABOUT_HEADING = 'step-ants';
export const FOOTER_ABOUT =
  '주식이 처음인 사람을 위한 가이드예요. 주식개미 주미가 어려운 말 대신 일상의 비유로 하나씩 풀어드립니다.';
export const FOOTER_SOURCE_HEADING = '내용 출처';
export const FOOTER_SOURCE =
  '투자 관련 설명은 국세청·금융투자협회·각 증권사 공개 자료를 바탕으로 정리했어요. 세율·한도처럼 자주 바뀌는 숫자는 단정하지 않았습니다.';
export const FOOTER_DISCLAIMER =
  '이 사이트의 내용은 투자 정보 제공이 목적이며 특정 종목의 매수·매도를 권유하지 않아요. 투자 판단과 그 결과는 투자자 본인에게 있습니다.';
export const FOOTER_NOTE = 'AntsUp';

/**
 * 세금·한도·증권사 정보를 다루는 레슨 하단 고지.
 * 대사에서 숫자를 뺐다는 사실만으로는 부족하고, 언제 기준인지가 화면에 남아야 한다.
 */
export const FIGURES_NOTICE =
  '세율·한도·증권사 서비스는 자주 바뀌어서, 여기서는 구조만 설명하고 정확한 숫자는 일부러 적지 않았어요. 실제로 하실 땐 증권사 안내나 국세청에서 최신 기준을 확인해 주세요.';

/**
 * 스크린리더·검색봇에게 화자를 알려주는 라벨.
 * 화면에서는 색과 정렬로만 구분되므로, 그 정보를 텍스트로도 남긴다.
 */
export const SPEAKER_LABEL: Record<Speaker, string> = {
  jumi: MASCOT_NAME,
  user: '나',
};
