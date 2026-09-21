import type { NewsMarket } from '@/config/backendRoutes';

export type { NewsMarket };

/**
 * 다이제스트 한 회차. 백엔드는 한 시간마다 한 건씩 쌓고, 회차끼리 내용이 겹치지 않는다.
 * 화면은 이걸 시간축에 세우므로 생성 시각(KST)이 곧 라벨이다.
 */
export interface DigestEntry {
  /** KST HH:mm. 서버에서 만들어 둔다 — 클라이언트에서 만들면 하이드레이션이 어긋난다. */
  time: string;
  text: string;
  /** 접힌 줄에 보여줄 첫 문장. 시간만 있으면 뭘 펼칠지 고를 수 없다. */
  preview: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  summary: string;
  publisher: string;
  /** '23분 전' 같은 상대 시각. */
  ago: string;
}

export interface MarketNews {
  digests: readonly DigestEntry[];
  /**
   * 다이제스트가 오늘 것이 아닐 때만 붙는 날짜(예: '9월 20일').
   * 새벽처럼 오늘 회차가 아직 없을 때 어제 요약을 오늘 것처럼 보여주면 안 된다.
   */
  staleDateLabel: string | null;
  articles: readonly NewsArticle[];
}

/** 두 시장을 서버에서 한 번에 받아 둔다. 토글은 클라이언트에서 즉시 바뀐다. */
export type NewsSnapshot = Record<NewsMarket, MarketNews>;
