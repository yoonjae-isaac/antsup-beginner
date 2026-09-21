import type { NewsMarket } from '@/domain/news/types';

/** 시장 뉴스 화면 문구. 숫자와 기사는 백엔드에서 오고, 여기 있는 건 라벨뿐이다. */

export const NEWS_HEADING = '시장 뉴스';
export const NEWS_LEAD = '오늘 무슨 일이 있었는지, 읽기 쉬운 것부터 하나씩 짚어드릴게요.';

export const MARKET_GROUP_LABEL = '시장 선택';
export const MARKET_NAME: Record<NewsMarket, string> = { KR: '국내', US: '미국' };

export const DIGEST_HEADING = '오늘의 흐름';

/**
 * 주미가 요약을 건네는 말.
 *
 * '제가 정리했어요'가 아니라 '추려서 전해드릴게요'인 게 중요하다 — 요약 본문은
 * 백엔드가 "과장 없이 사실 위주"로 만든 기사체라 주미 말투가 아니다. 주미가
 * 직접 말한 것처럼 두면 바로 아래 문장에서 말투가 어긋난다.
 */
export const DIGEST_JUMI_LEAD = '오늘 들어온 소식, 제가 추려서 전해드릴게요.';

/**
 * 회차가 왜 서로 이어지지 않는지 알려 준다.
 * 이 설명이 없으면 초보는 요약이 중간에 끊긴 걸로 읽는다.
 * AI가 만든 글이라는 사실도 여기서 밝힌다.
 */
export const DIGEST_NOTE =
  '기사를 모아 정리한 AI 요약이에요. 한 시간마다 새로 들어온 것만 담아서 앞에서 다룬 이야기와는 겹치지 않아요. 투자를 권하는 말은 아니에요.';
export const DIGEST_EMPTY = '아직 정리된 요약이 없어요. 기사가 쌓이면 한 시간 안에 올라와요.';
export const DIGEST_LATEST_BADGE = '방금';

export const ARTICLES_HEADING = '최신 뉴스';
export const ARTICLES_FRESHNESS = '5분마다 새로 받아와요';
export const ARTICLES_EMPTY = '지금은 가져온 기사가 없어요. 잠시 뒤에 다시 들러 주세요.';

export const TERMS_CARD_HEADING = '낯선 말이 나왔나요?';
export const TERMS_CARD_BODY =
  '공매도, 컨센서스, 어닝 서프라이즈. 뉴스가 어려운 건 사건이 아니라 단어예요.';
export const TERMS_CARD_CTA = '용어 정리 보러 가기';

export const GUIDE_CARD_HEADING = '주식이 처음이라면';
export const GUIDE_CARD_BODY = '뉴스를 읽기 전에, 주미가 기초부터 하나씩 짚어드려요.';
export const GUIDE_CARD_CTA = '주린이 가이드 1화';

/** '국내 · 오늘 4번 업데이트' — 시간당 쌓인다는 사실을 설명 없이 전달한다. */
export function updateCountLabel(market: NewsMarket, count: number, dateLabel: string | null) {
  return `${MARKET_NAME[market]} · ${dateLabel ?? '오늘'} ${count}번 업데이트`;
}
