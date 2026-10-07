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

/**
 * 커리큘럼 마지막 레슨의 CTA. 홈 허브로 보낸다.
 * 여기까지 온 사람에게 남은 건 레슨이 아니라 실제 시장 화면(뉴스·지표·일정·투자자)이다.
 */
export const CTA_FINISH_LABEL = '이제 시장 보러 가기';
export const BACK_TO_HOME = '홈으로';

/** 홈 허브 — 주미를 중심에 둔 여덟 방향 입구. */
export const HOME_EYEBROW = 'step-ants';
export const HOME_HEADING = '어디부터 가볼까요?';
export const HOME_LEAD = '주미를 가운데 두고 여덟 방향으로 길을 냈어요. 필요한 곳을 바로 고르면 돼요.';
export const ORBIT_NAV_LABEL = '서비스 바로가기';
export const ORBIT_EMPTY_HINT = '빈 자리 한 곳은 아직 준비 중이에요';

/**
 * 내 주식 — 담아 두고 오늘 가격만 보는 자리.
 *
 * 말투에 조심할 곳이 둘이다. '보유'·'포트폴리오'라고 하면 수량·평단을 받는 화면처럼
 * 읽히는데 우리는 그걸 안 받는다. 그래서 '담아 둔다'로 쓴다. 또 가격을 보여 준다고
 * 사고팔라는 뜻이 되지 않게, 화면 아래 고지를 반드시 같이 둔다.
 */
export const MY_STOCKS_TITLE = '내 주식';
export const MY_STOCKS_LEAD =
  '담아 둔 종목의 오늘 가격이에요. 이 목록은 이 브라우저에만 저장돼요 — 로그인이 없으니 다른 기기에서는 보이지 않고, 저희 서버로도 올라가지 않아요.';
export const MY_STOCKS_ADD_LABEL = '종목 추가';
export const MY_STOCKS_SEARCH_PLACEHOLDER = '종목명이나 코드로 찾아보세요 (예: 삼성전자, 005930, NVDA)';
export const MY_STOCKS_SEARCH_EMPTY = '찾는 종목이 없어요. 코드나 한글 이름으로 쳐 보세요.';
export const MY_STOCKS_ALREADY = '이미 담음';
export const MY_STOCKS_ADD_ONE = '+ 담기';
export const MY_STOCKS_FULL = (max: number) => `최대 ${max}종목까지 담을 수 있어요`;
export const MY_STOCKS_COUNT = (count: number) => `담아 둔 종목 ${count}`;
export const MY_STOCKS_REMOVE = (name: string) => `${name} 빼기`;
export const MY_STOCKS_NO_PRICE = '가격을 못 가져왔어요 · 잠시 뒤 다시 보여드릴게요';
export const MY_STOCKS_LOADING = '가격을 받아오는 중이에요';
export const MY_STOCKS_EMPTY_TITLE = '아직 담아 둔 종목이 없어요';
export const MY_STOCKS_EMPTY_BODY =
  '관심 가는 종목을 넣어 두면 오늘 얼마인지 여기서 바로 보여드릴게요. 사고파는 것과는 상관없어요 — 그냥 눈에 담아 두는 자리예요.';
export const MY_STOCKS_EMPTY_CTA = '종목 담으러 가기';
export const MY_STOCKS_MORE = (total: number) => `${total}종목 전체 보기 →`;
/**
 * 종목을 펼치면 나오는 관련 뉴스.
 *
 * '호재·악재' 같은 말은 쓰지 않는다. 기사를 모아 보여 줄 뿐 그게 오를 신호인지
 * 내릴 신호인지는 우리가 말할 수 있는 것이 아니고, 말하는 순간 투자 조언이 된다.
 */
export const MY_STOCKS_NEWS_TITLE = (name: string) => `${name} 관련 뉴스`;
export const MY_STOCKS_NEWS_LOADING = '기사를 찾아보는 중이에요';
/**
 * '기사가 없다'고 단정하지 않는다. 빈 응답은 정말 기사가 없을 때도 오고 백엔드나
 * 출처가 막혔을 때도 오는데, 화면은 그 둘을 가릴 수 없다. 못 가린 걸 가린 척하지 않는다.
 */
export const MY_STOCKS_NEWS_EMPTY = '지금은 보여드릴 기사가 없어요. 잠시 뒤 다시 열어 보세요.';
export const MY_STOCKS_NEWS_NOTE = '최근 기사 10건이에요. 좋고 나쁨은 가리지 않고 모아 둔 거예요.';
export const MY_STOCKS_NEWS_OPEN = (name: string) => `${name} 관련 뉴스 펼치기`;
export const MY_STOCKS_NEWS_CLOSE = (name: string) => `${name} 관련 뉴스 접기`;

/** 가격을 보여 주는 화면마다 같이 둔다. 푸터의 면책과 같은 말을 이 자리에서 한 번 더 한다. */
export const MY_STOCKS_DISCLAIMER =
  '가격은 참고용이에요. 실제 체결가와 다를 수 있고, 저희는 매수·매도를 권유하지 않아요.';

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
// 색 규칙은 globals.css 한 곳에서 정한다(오른 쪽이 빨강). 이 문구가 그걸 따라가야 한다.
export const PREVIEW_UPDOWN_NOTE = '상승 빨강 · 하락 파랑으로 보고 있어요';
/** 오늘 증시 일정 카드 — 공모는 담지 않는다(홈에서 할 수 있는 일이 없다). */
export const PREVIEW_SCHEDULE_TITLE = '오늘 증시 일정';
export const PREVIEW_SCHEDULE_MORE = (total: number) => `오늘 ${total}건 · 전체 일정 보기 →`;

/** 거시 지표 카드 — 지표 페이지 상단과 같은 넷. */
export const PREVIEW_MACRO_TITLE = '거시 지표';
export const PREVIEW_MACRO_FRESHNESS = '하루 한 번 갱신';
export const PREVIEW_MACRO_MORE = '대표 네 가지 · 전체 지표 보기 →';

/**
 * 장전 브리핑 — 글을 쓴 곳이 우리가 아니다.
 * 출처 표기는 선택이 아니라 이 화면이 성립하는 조건이라, 문구를 한곳에 모아 둔다.
 */
export const BRIEFING_HEADING = '장 시작 전에 보는 오늘';
export const BRIEFING_LEAD =
  '9시에 장이 열리기 전, 오늘 무슨 일이 예정돼 있는지 미리 훑어보는 자리예요.';
export const BRIEFING_JUMI_LEAD = '어려운 말이 많아요. 맨 위 한 문단만 읽어도 오늘 분위기는 알 수 있어요.';
export const BRIEFING_SOURCE_NAME = '개미승리';
export const BRIEFING_SOURCE_URL = 'https://antwinner.com';
/** 리드 문장 뒤에 이어 붙는다 — 출처를 별도 칸이 아니라 설명 문장 안에서 밝힌다. */
export const BRIEFING_SOURCE_NOTE = '가 쓴 브리핑을 받아서 전해드려요.';
export const BRIEFING_STOCK_NOTE = '관련 종목은 브리핑이 짚은 것일 뿐, 사라는 뜻이 아니에요.';
export const BRIEFING_CLOSING_NOTE =
  '이 페이지의 글은 개미승리가 작성한 것으로, 투자 권유가 아니에요. 원문에 들어 있던 매매 판단(비중·손절 등)은 싣지 않았습니다. 투자 판단과 그 결과는 투자자 본인에게 있습니다.';

/** 홈 카드 — 장전 브리핑 한 문단만 싣는다. */
export const PREVIEW_BRIEFING_TITLE = '장 시작 전';
export const PREVIEW_BRIEFING_MORE = '브리핑 전체 보기 →';

export const PREVIEW_QUOTE_TITLE = '오늘의 명언';
export const PREVIEW_AUTO_HINT = '5초마다 다음 카드로';
/** 직접 넘긴 뒤에는 자동 전환을 멈춘다 — 읽는 중에 카드가 넘어가면 안 된다. */
export const PREVIEW_MANUAL_HINT = '버튼으로 넘겨 보세요';
export const PREVIEW_PREV_LABEL = '이전 카드';
export const PREVIEW_NEXT_LABEL = '다음 카드';

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
 * 계산기가 붙는 레슨의 하단 고지.
 *
 * FIGURES_NOTICE 를 그대로 쓰면 안 된다 — 그 문구는 '숫자를 일부러 안 적었다'고
 * 말하는데 계산기는 숫자를 보여 준다. 화면이 자기 말을 뒤집는 셈이다.
 * 여기서는 '보이는 숫자는 가정이고 바꿀 수 있다'를 대신 말한다.
 */
export const CALC_NOTICE =
  '계산기에 미리 채워둔 값은 계산을 시작하려고 넣어둔 가정이에요. 약속된 숫자가 아니니 직접 바꿔 넣어 보세요. 특히 세율은 바뀌므로 실제로 하실 땐 증권사 안내나 국세청에서 최신 기준을 확인해 주세요. 결과는 참고용이라 실제 금액은 증권사·상품·상황에 따라 달라요.';

/**
 * 스크린리더·검색봇에게 화자를 알려주는 라벨.
 * 화면에서는 색과 정렬로만 구분되므로, 그 정보를 텍스트로도 남긴다.
 */
export const SPEAKER_LABEL: Record<Speaker, string> = {
  jumi: MASCOT_NAME,
  user: '나',
};
