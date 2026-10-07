'use client';

import { useEffect, useState } from 'react';
import type { NewsArticle } from '@/domain/news/types';
import { MY_STOCKS_NEWS_API } from './route';

/**
 * 한 번 받아 둔 기사를 이 세션 동안 들고 있는다.
 *
 * localStorage 가 아니라 메모리인 게 의도다. 기사는 접었다 폈다 하는 동안만 필요하고,
 * 새로고침하면 다시 받는 게 맞다 — 시세와 달리 '1분 전 것'이 의미 있는 값이 아니다.
 *
 * **빈 결과는 넣지 않는다.** 빈 응답은 정말 기사가 없을 때도 오고 백엔드나 출처가
 * 막혔을 때도 오는데, 둘을 가릴 수가 없다. 적어 두면 한 번 실패한 종목이 새로고침
 * 전까지 영영 비어 보인다. 다시 묻는 비용은 거의 없다 — 백엔드가 1분을 들고 있고,
 * 사람이 직접 펼쳐야 나간다.
 */
const seen = new Map<string, NewsArticle[]>();

export interface TickerNewsState {
  articles: readonly NewsArticle[];
  loading: boolean;
}

const EMPTY: TickerNewsState = { articles: [], loading: false };
const LOADING: TickerNewsState = { articles: [], loading: true };

/**
 * 종목 하나의 관련 뉴스. code 가 null 이면(접힌 상태) 아무것도 하지 않는다.
 *
 * 코드만 보낸다 — 종목명과 시장은 서버가 카탈로그에서 찾는다.
 */
export function useTickerNews(code: string | null): TickerNewsState {
  /*
    어떤 종목에 대한 답인지 같이 들고 있는다. 위의 Map 에 없는 종목(= 빈 답이었거나
    아직 안 물어본 것)도 이번 펼침 동안은 '물어봤고 비었다'를 기억해야 로딩이 끝난다.
  */
  const [answered, setAnswered] = useState<{ code: string; articles: NewsArticle[] } | null>(null);

  useEffect(() => {
    if (code === null || seen.has(code)) return;

    let cancelled = false;
    fetch(`${MY_STOCKS_NEWS_API}?code=${encodeURIComponent(code)}`, {
      headers: { Accept: 'application/json' },
    })
      .then((response) => (response.ok ? (response.json() as Promise<NewsArticle[]>) : []))
      .catch(() => [] as NewsArticle[])
      .then((articles) => {
        if (cancelled) return;
        if (articles.length > 0) seen.set(code, articles);
        setAnswered({ code, articles });
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  if (code === null) return EMPTY;

  const cached = seen.get(code);
  if (cached !== undefined) return { articles: cached, loading: false };
  if (answered?.code === code) return { articles: answered.articles, loading: false };
  return LOADING;
}
