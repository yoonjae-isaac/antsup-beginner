import PreviewIcon from '@/components/home/PreviewIcon';
import {
  PREVIEW_INDEX_HEADING,
  PREVIEW_MARKET_FRESHNESS,
  PREVIEW_MARKET_TITLE,
  PREVIEW_UPDOWN_NOTE,
  PREVIEW_USD_KRW_LABEL,
} from '@/domain/jumi/landingCopy';
import type { MarketSnapshot } from '@/domain/preview/market';

interface MarketCardProps {
  market: MarketSnapshot;
}

const decimal = new Intl.NumberFormat('ko-KR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * 환율 · 시장 카드.
 *
 * 한 벌의 마크업이 두 화면을 본다 — 모바일은 가로로 넓은 카드라 환율과 지수를
 * 좌우로 놓고, lg 부터는 세로로 쌓는다. 레이아웃마다 컴포넌트를 나누면
 * 같은 숫자가 HTML 에 두 번 실린다.
 */
export default function MarketCard({ market }: MarketCardProps) {
  return (
    <article className="flex size-full flex-col overflow-hidden rounded-[22px] border border-cb-border bg-cb-surface p-5 lg:rounded-3xl lg:p-7">
      <header className="flex items-center gap-2.5">
        <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[10px] bg-cb-tile text-cb-point lg:size-9 lg:rounded-xl">
          <PreviewIcon name="market" />
        </span>
        <h2 className="text-[12.5px] font-bold text-cb-foreground lg:text-[13px]">
          {PREVIEW_MARKET_TITLE}
        </h2>
        <span className="ml-auto text-[11px] text-cb-muted lg:text-xs">
          {PREVIEW_MARKET_FRESHNESS}
        </span>
      </header>

      <div className="mt-[18px] flex items-start gap-4 lg:mt-6 lg:flex-col lg:gap-0">
        <div className="grow lg:grow-0">
          <p className="text-[11.5px] text-cb-muted lg:text-[13px]">{PREVIEW_USD_KRW_LABEL}</p>
          <p className="mt-1 flex items-baseline gap-1 lg:mt-1.5 lg:gap-1.5">
            <span className="font-mono text-[27px] leading-none font-bold tabular-nums lg:text-[40px]">
              {decimal.format(market.usdKrw)}
            </span>
            <span className="text-[13px] font-medium text-cb-muted lg:text-[17px]">원</span>
          </p>
        </div>

        {/* 가로 카드에서는 환율 옆에 붙고, 세로 카드에서는 구분선 아래로 내려간다. */}
        <div className="w-[132px] shrink-0 lg:mt-[22px] lg:w-full lg:border-t lg:border-cb-border lg:pt-[18px]">
          <h3 className="hidden text-xs font-bold tracking-[0.14em] text-cb-muted uppercase lg:mb-3.5 lg:block">
            {PREVIEW_INDEX_HEADING}
          </h3>

          <ul className="flex flex-col gap-[7px] lg:gap-[13px]">
            {market.indices.map((index) => {
              const up = index.changePercent >= 0;

              return (
                <li className="flex items-center gap-2 lg:gap-3" key={index.label}>
                  <span className="grow text-xs font-bold lg:w-[54px] lg:grow-0 lg:text-sm">
                    {index.label}
                  </span>
                  <span className="hidden font-mono text-sm font-medium tabular-nums lg:inline lg:grow lg:text-right">
                    {decimal.format(index.price)}
                  </span>
                  <span
                    className={`font-mono text-xs font-bold tabular-nums lg:w-[76px] lg:text-right lg:text-[13px] ${
                      up ? 'text-cb-up' : 'text-cb-down'
                    }`}
                  >
                    {up ? '▲' : '▼'} {Math.abs(index.changePercent).toFixed(2)}%
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p className="mt-auto hidden text-xs text-cb-muted lg:block">{PREVIEW_UPDOWN_NOTE}</p>
    </article>
  );
}
