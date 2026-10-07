'use client';

import Link from 'next/link';
import PreviewIcon from '@/components/home/PreviewIcon';
import {
  MY_STOCKS_EMPTY_BODY,
  MY_STOCKS_EMPTY_CTA,
  MY_STOCKS_EMPTY_TITLE,
  MY_STOCKS_LOADING,
  MY_STOCKS_MORE,
  MY_STOCKS_NO_PRICE,
  MY_STOCKS_TITLE,
  PREVIEW_UPDOWN_NOTE,
} from '@/domain/jumi/landingCopy';
import {
  changeColorClass,
  formatChangePercent,
  formatPrice,
  freshnessLabel,
} from '@/domain/stocks/format';
import { useMyStocks } from '@/domain/stocks/myStocks';
import { useStockQuotes } from '@/domain/stocks/quotes';
import { MY_STOCKS_PATH } from '@/domain/stocks/route';
import { MARKET_LABEL } from '@/domain/stocks/types';

/**
 * 카드에 보여 줄 최대 줄 수.
 *
 * 스무 개를 담을 수 있지만 카드 높이는 470px 로 고정이다. 넉 줄이 들어가고, 나머지는
 * 아래 '전체 보기'가 받는다. 줄을 더 넣으려고 글자를 줄이면 숫자가 안 읽힌다.
 */
const CARD_ROWS = 4;

/**
 * 홈 컨텐츠 프리뷰의 '내 주식' 카드.
 *
 * 다른 카드들과 달리 서버에서 받아 온 값이 없다 — 목록이 브라우저에만 있어서다.
 * 그래서 서버 렌더와 첫 페인트에서는 빈 상태로 그려지고, 마운트 직후 실제 목록으로 바뀐다.
 * 담은 게 없으면 ContentPreview 가 이 카드를 아예 덱에서 뺀다.
 */
export default function MyStocksCard() {
  const mine = useMyStocks();
  const { quotes, loading } = useStockQuotes(mine.map((stock) => stock.code));

  const shown = mine.slice(0, CARD_ROWS);
  const priced = [...quotes.values()];

  return (
    <article className="flex size-full flex-col overflow-hidden rounded-[22px] border border-cb-border bg-cb-surface p-5 lg:rounded-3xl lg:p-7">
      <header className="flex items-center gap-2.5">
        <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[10px] bg-cb-tile text-cb-point lg:size-9 lg:rounded-xl">
          <PreviewIcon name="bookmark" />
        </span>
        <h2 className="text-[12.5px] font-bold lg:text-[13px]">{MY_STOCKS_TITLE}</h2>
        {mine.length > 0 && (
          <span className="ml-auto text-[11px] text-cb-muted lg:text-xs">
            {loading ? MY_STOCKS_LOADING : freshnessLabel(priced)}
          </span>
        )}
      </header>

      {mine.length === 0 ? (
        <div className="flex grow flex-col justify-center">
          <p className="text-sm font-bold lg:text-[19px]">{MY_STOCKS_EMPTY_TITLE}</p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-cb-muted lg:mt-3 lg:text-sm">
            {MY_STOCKS_EMPTY_BODY}
          </p>
          <Link
            className="mt-4 flex h-11 items-center justify-center rounded-xl bg-cb-point text-[13.5px] font-bold text-cb-on-point hover:bg-cb-point-hover lg:mt-6 lg:h-12 lg:text-[14.5px]"
            href={MY_STOCKS_PATH}
          >
            {MY_STOCKS_EMPTY_CTA}
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-3 lg:mt-6">
            {shown.map((stock) => {
              const quote = quotes.get(stock.code);

              return (
                <li
                  className="flex items-center gap-3 border-b border-cb-border py-2 last:border-b-0 lg:py-[13px]"
                  key={stock.code}
                >
                  <span className="flex min-w-0 grow flex-col gap-0.5 lg:gap-[3px]">
                    <span className="truncate text-[13px] font-bold lg:text-[15px]">
                      {stock.name}
                    </span>
                    <span className="hidden font-mono text-[11.5px] text-cb-muted lg:inline">
                      {stock.code} · {MARKET_LABEL[stock.market]}
                    </span>
                  </span>

                  {quote ? (
                    <span className="flex shrink-0 items-center gap-3 lg:flex-col lg:items-end lg:gap-[3px]">
                      <span className="font-mono text-[13px] font-medium tabular-nums lg:text-base lg:font-bold">
                        {formatPrice(quote.price, quote.currency)}
                      </span>
                      <span
                        className={`w-[68px] text-right font-mono text-xs font-bold tabular-nums lg:w-auto lg:text-[12.5px] ${changeColorClass(
                          quote.changePercent,
                        )}`}
                      >
                        {formatChangePercent(quote.changePercent)}
                      </span>
                    </span>
                  ) : (
                    <span className="shrink-0 text-[11.5px] text-cb-muted">
                      {loading ? '…' : MY_STOCKS_NO_PRICE}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-auto pt-3">
            <Link className="text-[12px] font-bold text-cb-point lg:text-[13px]" href={MY_STOCKS_PATH}>
              {MY_STOCKS_MORE(mine.length)}
            </Link>
            <p className="mt-2.5 hidden text-xs text-cb-muted lg:block">{PREVIEW_UPDOWN_NOTE}</p>
          </div>
        </>
      )}
    </article>
  );
}
