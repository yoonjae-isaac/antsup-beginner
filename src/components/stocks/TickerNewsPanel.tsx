'use client';

import {
  MY_STOCKS_NEWS_EMPTY,
  MY_STOCKS_NEWS_LOADING,
  MY_STOCKS_NEWS_NOTE,
  MY_STOCKS_NEWS_TITLE,
} from '@/domain/jumi/landingCopy';
import { useTickerNews } from '@/domain/stocks/tickerNews';
import type { MyStock } from '@/domain/stocks/types';

interface TickerNewsPanelProps {
  stock: MyStock;
  id: string;
}

/**
 * 종목을 펼치면 나오는 관련 뉴스.
 *
 * 기사 본문은 남의 글이라 제목과 출처만 두고 원문으로 보낸다. 요약을 우리가 다시 쓰면
 * 그 순간 우리 말이 되고, 종목 화면에서 우리가 할 말이 아니다.
 */
export default function TickerNewsPanel({ stock, id }: TickerNewsPanelProps) {
  const { articles, loading } = useTickerNews(stock.code);

  return (
    <div className="border-t border-cb-border px-4 py-4 sm:px-[22px]" id={id}>
      <h3 className="text-[12.5px] font-bold tracking-[0.1em] text-cb-muted uppercase">
        {MY_STOCKS_NEWS_TITLE(stock.name)}
      </h3>

      {loading ? (
        <p className="mt-3 text-[13px] text-cb-muted">{MY_STOCKS_NEWS_LOADING}</p>
      ) : articles.length === 0 ? (
        <p className="mt-3 text-[13px] text-cb-muted">{MY_STOCKS_NEWS_EMPTY}</p>
      ) : (
        <>
          <ul className="mt-3 flex flex-col gap-0.5">
            {articles.map((article) => (
              <li key={article.id}>
                <a
                  className="-mx-2 flex flex-col gap-1 rounded-lg px-2 py-2 hover:bg-cb-hover"
                  href={article.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="text-[13.5px] leading-snug font-medium text-cb-foreground">
                    {article.title}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11.5px] text-cb-muted">
                    {article.publisher !== '' && (
                      <>
                        <span>{article.publisher}</span>
                        <span aria-hidden="true">·</span>
                      </>
                    )}
                    <span>{article.ago}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11.5px] text-cb-muted">{MY_STOCKS_NEWS_NOTE}</p>
        </>
      )}
    </div>
  );
}
