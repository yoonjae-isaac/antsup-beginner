'use client';

import { useState } from 'react';
import TickerNewsPanel from '@/components/stocks/TickerNewsPanel';
import {
  MY_STOCKS_COUNT,
  MY_STOCKS_DISCLAIMER,
  MY_STOCKS_EMPTY_BODY,
  MY_STOCKS_EMPTY_TITLE,
  MY_STOCKS_LOADING,
  MY_STOCKS_NEWS_CLOSE,
  MY_STOCKS_NEWS_OPEN,
  MY_STOCKS_NO_PRICE,
  MY_STOCKS_REMOVE,
  PREVIEW_UPDOWN_NOTE,
} from '@/domain/jumi/landingCopy';
import {
  changeColorClass,
  formatChange,
  formatChangePercent,
  formatPrice,
  freshnessLabel,
} from '@/domain/stocks/format';
import { removeMyStock, useMyStocks } from '@/domain/stocks/myStocks';
import { useStockQuotes } from '@/domain/stocks/quotes';
import { MARKET_LABEL } from '@/domain/stocks/types';

/** aria-controls 가 가리킬 패널 id. 종목 코드를 붙여 줄마다 다른 값이 된다. */
const PANEL_ID_PREFIX = 'my-stock-news-';

/**
 * 담아 둔 종목 목록 — /my-stocks 의 본문.
 *
 * 목록은 브라우저에, 가격은 서버에 있다. 둘의 생애가 달라서 '담았는데 가격이 없는' 줄이
 * 정상적으로 생긴다(상장폐지·조회 실패·아직 받는 중). 그런 줄도 지우지 않고 남긴다 —
 * 담은 건 사용자가 한 일이고, 우리가 가격을 못 받았다고 없애면 목록이 제멋대로 줄어든다.
 */
export default function MyStockList() {
  const mine = useMyStocks();
  const { quotes, loading } = useStockQuotes(mine.map((stock) => stock.code));

  /*
    한 번에 한 종목만 펼친다. 여럿을 동시에 열 수 있게 두면 스무 줄짜리 목록이
    기사 이백 건으로 늘어나 원래 보러 온 가격을 찾을 수 없게 된다.
  */
  const [opened, setOpened] = useState<string | null>(null);

  if (mine.length === 0) {
    return (
      <section className="rounded-3xl border border-cb-border bg-cb-surface px-7 py-12 text-center">
        <p className="text-lg font-bold">{MY_STOCKS_EMPTY_TITLE}</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-cb-muted">
          {MY_STOCKS_EMPTY_BODY}
        </p>
      </section>
    );
  }

  const priced = [...quotes.values()];

  return (
    <section>
      <div className="mb-4 flex items-baseline gap-3">
        <h2 className="text-[15px] font-bold">{MY_STOCKS_COUNT(mine.length)}</h2>
        <span className="ml-auto text-[12.5px] text-cb-muted">
          {loading ? MY_STOCKS_LOADING : freshnessLabel(priced)}
        </span>
      </div>

      <ul className="flex flex-col gap-2.5">
        {mine.map((stock) => {
          const quote = quotes.get(stock.code);

          const open = opened === stock.code;
          const panelId = `${PANEL_ID_PREFIX}${stock.code}`;

          return (
            <li
              className={`overflow-hidden rounded-2xl border bg-cb-surface ${
                quote ? 'border-cb-border' : 'border-dashed border-cb-border-strong'
              }`}
              key={stock.code}
            >
              {/*
                펼치기는 줄 전체가 받고, 빼기는 그 옆에 따로 선다. 줄째로 <button> 을 씌우면
                그 안에 빼기 버튼을 넣을 수 없다 — 버튼 안의 버튼은 마크업이 성립하지 않는다.
              */}
              <div className="flex items-center gap-3 px-4 py-4 sm:gap-4 sm:px-[22px] sm:py-[18px]">
                <button
                  aria-controls={open ? panelId : undefined}
                  aria-expanded={open}
                  aria-label={
                    open ? MY_STOCKS_NEWS_CLOSE(stock.name) : MY_STOCKS_NEWS_OPEN(stock.name)
                  }
                  className="flex min-w-0 grow items-center gap-3 text-left sm:gap-4"
                  onClick={() => setOpened(open ? null : stock.code)}
                  type="button"
                >
                  {/*
                    좁은 화면에서는 이름 칸이 남는 만큼만 차지하고 숫자는 오른쪽에 세로로 쌓인다.
                    넓어지면 이름 칸을 고정폭으로 세워 여러 줄의 숫자가 같은 자리에 선다 —
                    폭을 처음부터 고정하면 390px 에서 등락률과 빼기 버튼이 카드 밖으로 밀린다.
                  */}
                  <span className="flex min-w-0 grow flex-col gap-1.5 sm:w-[260px] sm:shrink-0 sm:grow-0">
                    <span className="truncate text-[15px] font-bold sm:text-[17px]">
                      {stock.name}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-[12.5px] text-cb-muted">{stock.code}</span>
                      <span className="rounded-md bg-cb-tile px-2 py-0.5 text-[11px] font-bold text-cb-muted">
                        {MARKET_LABEL[stock.market]}
                      </span>
                    </span>
                  </span>

                  {quote ? (
                    <span className="flex shrink-0 flex-col items-end gap-1 sm:grow sm:flex-row sm:items-center sm:gap-4">
                      <span className="font-mono text-[16px] font-bold tabular-nums sm:grow sm:text-right sm:text-[21px]">
                        {formatPrice(quote.price, quote.currency)}
                      </span>
                      <span
                        className={`hidden font-mono text-sm tabular-nums sm:inline sm:w-[110px] sm:text-right ${changeColorClass(
                          quote.changePercent,
                        )}`}
                      >
                        {formatChange(quote.change, quote.currency)}
                      </span>
                      <span
                        className={`font-mono text-[13px] font-bold tabular-nums sm:w-[100px] sm:text-right sm:text-[17px] ${changeColorClass(
                          quote.changePercent,
                        )}`}
                      >
                        {formatChangePercent(quote.changePercent)}
                      </span>
                    </span>
                  ) : (
                    <span className="min-w-0 shrink text-right text-[12.5px] leading-snug text-cb-muted sm:grow sm:text-sm">
                      {loading ? MY_STOCKS_LOADING : MY_STOCKS_NO_PRICE}
                    </span>
                  )}

                  <svg
                    aria-hidden="true"
                    className={`size-4 shrink-0 text-cb-muted transition-transform duration-200 ${
                      open ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                <button
                  aria-label={MY_STOCKS_REMOVE(stock.name)}
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-cb-border text-cb-muted hover:bg-cb-hover hover:text-cb-foreground"
                  onClick={() => removeMyStock(stock.code)}
                  type="button"
                >
                  <svg
                    aria-hidden="true"
                    className="size-[17px]"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6.5 6.5 17.5 17.5" />
                    <path d="M17.5 6.5 6.5 17.5" />
                  </svg>
                </button>
              </div>

              {open && <TickerNewsPanel id={panelId} stock={stock} />}
            </li>
          );
        })}
      </ul>

      <p className="mt-6 rounded-2xl bg-cb-hover px-[22px] py-[18px] text-[13px] leading-relaxed text-cb-muted">
        {MY_STOCKS_DISCLAIMER} {PREVIEW_UPDOWN_NOTE}
      </p>
    </section>
  );
}
