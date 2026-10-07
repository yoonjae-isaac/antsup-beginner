'use client';

import { useEffect, useMemo, useState } from 'react';
import { MY_STOCKS_QUOTES_API } from './route';
import type { StockQuote } from './types';

/**
 * 브라우저에 시세를 들고 있는 시간.
 *
 * 백엔드 Redis 와 같은 1분이다. 두 층을 같은 길이로 맞춰 두면 "브라우저는 방금 받았는데
 * 서버는 이미 버렸다" 같은 어긋남이 생기지 않는다. 화면을 오가며 같은 종목을 다시 그릴 때
 * 그때마다 바깥으로 나가지 않게 하려고 둔다 — 홈과 /my-stocks 가 같은 목록을 본다.
 */
export const QUOTE_TTL_MS = 60_000;

const CACHE_KEY = 'antsup-my-stocks-quotes-v1';

interface CachedQuotes {
  /** 받아온 시각(ms). */
  at: number;
  /** 그때 **물어본** 종목들. 값이 없어 빠진 종목을 매번 다시 묻지 않으려고 같이 적는다. */
  codes: string[];
  quotes: StockQuote[];
}

export interface QuoteState {
  /** 코드 → 시세. 못 받은 종목은 아예 없다 — 화면이 그 줄만 따로 그린다. */
  quotes: ReadonlyMap<string, StockQuote>;
  /** 이 값을 받아온 시각(ms). 한 번도 못 받았으면 null. */
  fetchedAt: number | null;
  loading: boolean;
}

const EMPTY: QuoteState = { quotes: new Map(), fetchedAt: null, loading: false };
const LOADING: QuoteState = { quotes: new Map(), fetchedAt: null, loading: true };

function readCache(codes: readonly string[]): CachedQuotes | null {
  if (codes.length === 0) return null;

  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const cached = JSON.parse(raw) as CachedQuotes;
    if (!Array.isArray(cached.quotes) || !Array.isArray(cached.codes)) return null;
    if (Date.now() - cached.at >= QUOTE_TTL_MS) return null;

    // 그때 물어본 목록이 지금 필요한 걸 다 덮어야 쓸 수 있다. 종목을 하나 더 담았으면 다시 묻는다.
    const asked = new Set(cached.codes);
    return codes.every((code) => asked.has(code)) ? cached : null;
  } catch {
    return null;
  }
}

function writeCache(codes: readonly string[], quotes: StockQuote[]): void {
  try {
    const payload: CachedQuotes = { at: Date.now(), codes: [...codes], quotes };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // 저장이 막혀도 이번 화면은 그대로 그린다.
  }
}

function toState(at: number, quotes: StockQuote[]): QuoteState {
  return {
    quotes: new Map(quotes.map((quote) => [quote.symbol, quote])),
    fetchedAt: at,
    loading: false,
  };
}

/**
 * 담아 둔 종목의 오늘 시세.
 *
 * 브라우저 캐시가 1분 안쪽이고 필요한 종목을 다 덮으면 그걸 쓰고 끝낸다. 아니면
 * 라우트 핸들러에 한 번 묻는다 — 주기적으로 다시 받지는 않는다. 담아 둔 목록을 보는
 * 화면이라 초 단위로 움직일 이유가 없고, 새로 받고 싶으면 새로고침이 가장 분명하다.
 *
 * 실패해도 던지지 않는다. 가격이 없는 목록은 이름만 남은 목록이지 빈 화면이 아니다.
 */
export function useStockQuotes(codes: readonly string[]): QuoteState {
  // 배열이 매 렌더 새로 만들어져도 내용이 같으면 effect 가 다시 돌지 않게 한다.
  const key = codes.join(',');
  const wanted = useMemo(() => (key === '' ? [] : key.split(',')), [key]);

  /*
    캐시는 effect 가 아니라 렌더 중에 읽는다.
    effect 안에서 setState 로 반영하면 마운트 직후 한 번 더 그리게 되고,
    lint(react-hooks/set-state-in-effect)가 바로 그 연쇄 렌더를 막는다.
    localStorage 를 읽을 뿐이라 렌더가 바깥을 건드리지는 않는다.
  */
  const cached = useMemo(() => {
    const hit = readCache(wanted);
    return hit === null ? null : toState(hit.at, hit.quotes);
  }, [wanted]);

  // 어떤 목록에 대한 답인지 같이 들고 있는다 — 종목을 담자마자 옛 답을 새 목록의
  // 답인 척 보여 주면, 방금 담은 종목만 영영 빈칸으로 남는다.
  const [fetched, setFetched] = useState<{ key: string; state: QuoteState } | null>(null);

  useEffect(() => {
    if (wanted.length === 0 || cached !== null) return;

    let cancelled = false;
    const url = `${MY_STOCKS_QUOTES_API}?symbols=${encodeURIComponent(wanted.join(','))}`;

    fetch(url, { headers: { Accept: 'application/json' } })
      .then((response) => (response.ok ? (response.json() as Promise<StockQuote[]>) : []))
      .catch(() => [] as StockQuote[])
      .then((quotes) => {
        if (cancelled) return;
        // 빈 응답은 캐시하지 않는다 — 한 번 실패한 걸 1분 동안 붙잡아 둘 이유가 없다.
        if (quotes.length > 0) writeCache(wanted, quotes);
        setFetched({ key: wanted.join(','), state: toState(Date.now(), quotes) });
      });

    return () => {
      cancelled = true;
    };
  }, [wanted, cached]);

  if (wanted.length === 0) return EMPTY;
  if (cached !== null) return cached;
  return fetched?.key === key ? fetched.state : LOADING;
}
