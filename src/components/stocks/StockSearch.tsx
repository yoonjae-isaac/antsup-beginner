'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import {
  MY_STOCKS_ADD_LABEL,
  MY_STOCKS_ADD_ONE,
  MY_STOCKS_ALREADY,
  MY_STOCKS_FULL,
  MY_STOCKS_SEARCH_EMPTY,
  MY_STOCKS_SEARCH_PLACEHOLDER,
} from '@/domain/jumi/landingCopy';
import { addMyStock, useMyStocks } from '@/domain/stocks/myStocks';
import { MY_STOCKS_SEARCH_API } from '@/domain/stocks/route';
import { MARKET_LABEL, MAX_MY_STOCKS, type SymbolHit } from '@/domain/stocks/types';

/**
 * 입력이 멎고 나서 찾으러 가기까지 기다리는 시간(ms).
 * '삼성전자'를 치면 글자마다 한 번씩, 다섯 번 나간다 — 그걸 한 번으로 줄인다.
 */
const DEBOUNCE_MS = 180;

/**
 * 종목 검색 + 담기.
 *
 * 카탈로그가 서버에만 있어 자동완성도 서버에 묻는다(/api/my-stocks/search).
 * 800KB 를 번들에 싣느니 글자마다 한 번 나가는 쪽을 골랐다 — 응답이 여덟 줄이라 가볍고,
 * 앞글자는 모두가 같은 걸 쳐서 CDN 이 거의 다 받아 준다.
 */
export default function StockSearch() {
  const mine = useMyStocks();
  const [text, setText] = useState('');
  // 어떤 입력에 대한 답인지 같이 들고 있는다. 그래야 '찾는 종목이 없어요'를
  // 아직 묻지도 않은 글자에 대고 띄우지 않는다.
  const [found, setFound] = useState<{ query: string; hits: SymbolHit[] } | null>(null);
  const inputId = useId();

  const query = text.trim();
  const owned = useMemo(() => new Set(mine.map((stock) => stock.code)), [mine]);
  const full = mine.length >= MAX_MY_STOCKS;

  // 답이 올 때까지는 직전 결과를 그대로 둔다 — 글자마다 목록이 비었다 찼다 하면 읽기 힘들다.
  const hits = found?.hits ?? [];
  const settled = found?.query === query;

  useEffect(() => {
    if (query === '') return;

    let cancelled = false;
    const timer = setTimeout(() => {
      fetch(`${MY_STOCKS_SEARCH_API}?q=${encodeURIComponent(query)}`, {
        headers: { Accept: 'application/json' },
      })
        .then((response) => (response.ok ? (response.json() as Promise<SymbolHit[]>) : []))
        .catch(() => [] as SymbolHit[])
        .then((result) => {
          if (!cancelled) setFound({ query, hits: result });
        });
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  function add(hit: SymbolHit) {
    addMyStock(hit);
    // 담고 나면 입력을 비운다 — 같은 글자가 남아 있으면 방금 담은 종목이 계속 1등에 뜬다.
    setText('');
    setFound(null);
  }

  return (
    <section className="relative">
      <label className="mb-2.5 block text-[13px] font-bold" htmlFor={inputId}>
        {MY_STOCKS_ADD_LABEL}
      </label>

      <div className="flex h-14 items-center gap-3 rounded-2xl border border-cb-border bg-cb-surface px-5 focus-within:border-cb-point">
        <svg
          aria-hidden="true"
          className="size-[19px] shrink-0 text-cb-muted"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.9"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="6.5" />
          <path d="M15.8 15.8 20.5 20.5" />
        </svg>
        <input
          autoComplete="off"
          className="h-full grow bg-transparent text-[15px] outline-none placeholder:text-cb-muted"
          id={inputId}
          onChange={(event) => setText(event.target.value)}
          placeholder={MY_STOCKS_SEARCH_PLACEHOLDER}
          type="text"
          value={text}
        />
      </div>

      {full && <p className="mt-2.5 text-xs text-cb-muted">{MY_STOCKS_FULL(MAX_MY_STOCKS)}</p>}

      {query !== '' && (hits.length > 0 || settled) && (
        <ul className="absolute inset-x-0 top-[94px] z-10 overflow-hidden rounded-2xl border border-cb-border-strong bg-cb-surface shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]">
          {hits.length === 0 ? (
            <li className="px-[18px] py-[13px] text-sm text-cb-muted">{MY_STOCKS_SEARCH_EMPTY}</li>
          ) : (
            hits.map((hit) => {
              const already = owned.has(hit.code);

              return (
                <li className="border-t border-cb-border first:border-t-0" key={hit.code}>
                  <button
                    className="flex w-full items-center gap-3 px-[18px] py-[13px] text-left enabled:hover:bg-cb-hover disabled:cursor-default"
                    disabled={already || full}
                    onClick={() => add(hit)}
                    type="button"
                  >
                    <span className="grow truncate text-[15px] font-bold">{hit.name}</span>
                    <span className="font-mono text-[13px] text-cb-muted">{hit.code}</span>
                    <span className="rounded-md bg-cb-tile px-2 py-0.5 text-[11px] font-bold text-cb-muted">
                      {MARKET_LABEL[hit.market]}
                    </span>
                    <span
                      className={`w-[72px] shrink-0 text-right text-xs font-bold ${
                        already ? 'text-cb-muted' : 'text-cb-point'
                      }`}
                    >
                      {already ? MY_STOCKS_ALREADY : MY_STOCKS_ADD_ONE}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </section>
  );
}
