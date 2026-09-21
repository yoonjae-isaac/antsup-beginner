'use client';

import { useState } from 'react';
import SegmentedControl from '@/components/common/SegmentedControl';
import TickerLogo from '@/components/common/TickerLogo';
import JumiAvatar from '@/components/jumi/JumiAvatar';
import { JUMI_ART } from '@/domain/jumi/artwork';
import type { GuruInvestor, GuruStock, InvestorsBoard, StockView } from '@/domain/investors/investors';

interface InvestorsBoardViewProps {
  board: InvestorsBoard;
}

const HEADING = '투자자들 현황';
const LEAD =
  '버핏, 아이칸, 애크먼. 미국에서 큰돈을 굴리는 사람들이 분기마다 의무로 공개하는 보유 종목이에요.';
const JUMI_LEAD = '따라 사는 것보다, 이 사람들이 왜 그 회사를 오래 들고 있는지를 보는 게 남아요.';
const EMPTY = '아직 가져온 공시가 없어요. 잠시 뒤에 다시 들러 주세요.';
const NOTE =
  '미국 SEC 에 제출된 13F 공시를 정리한 값이에요. 1억 달러 넘게 굴리는 기관은 분기마다 보유 주식을 신고해야 해요. 공매도·채권·해외 주식은 신고 대상이 아니라서, 여기 보이는 게 그 사람 자산의 전부는 아니에요.';

const VIEWS = [
  { value: 'held' as const, label: '많이 보유' },
  { value: 'bought' as const, label: '이번에 산' },
  { value: 'sold' as const, label: '이번에 판' },
];

const SECTION: Record<StockView, { title: string; note: string }> = {
  held: {
    title: '거장들이 가장 많이 담은 종목',
    note: '추적 중인 거장 가운데 몇 명이 들고 있는지로 줄을 세웠어요.',
  },
  bought: {
    title: '이번 분기에 많이 산 종목',
    note: '직전 분기보다 보유를 늘리거나 새로 담은 사람이 많은 순서예요.',
  },
  sold: {
    title: '이번 분기에 많이 판 종목',
    note: '보유를 줄이거나 전량 매도한 사람이 많은 순서예요.',
  },
};

export default function InvestorsBoardView({ board }: InvestorsBoardViewProps) {
  const [view, setView] = useState<StockView>('held');

  const stocks = board.stocks[view];
  const section = SECTION[view];

  return (
    <>
      <h1 className="text-[1.65rem] leading-snug font-bold tracking-tight lg:text-[2.5rem]">
        {HEADING}
      </h1>
      <p className="mt-2 text-[13.5px] leading-relaxed text-cb-muted lg:text-[15px]">{LEAD}</p>

      {/*
        이 화면에서 제일 중요한 건 순위표가 아니라 이 경고다.
        13F 는 분기가 끝나고 최대 45일 뒤에 나오는 과거 기록인데 초보는 '지금 사고 있는
        종목'으로 읽는다. 그대로 따라 사면 두세 달 지난 가격을 쫓게 된다.
        그래서 목록보다 위에, 접히지 않게 둔다.
      */}
      <div className="mt-5 flex gap-3 rounded-2xl border border-cb-trader/30 bg-cb-trader/7 px-4 py-3.5 lg:mt-6 lg:gap-3.5 lg:px-5 lg:py-[18px]">
        <svg
          aria-hidden="true"
          className="mt-0.5 size-[18px] shrink-0 text-cb-trader lg:size-[22px]"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
          <path d="M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
        </svg>
        <p className="text-[12.5px] leading-[1.65] lg:text-sm lg:leading-[1.7]">
          <b>지금 들고 있다는 뜻이 아니에요.</b> 13F 는 분기가 끝나고 최대 45일 뒤에 내는
          보고서라
          {board.asOfLabel !== null && (
            <>
              , 여기 있는 건 <b className="font-mono">{board.asOfLabel}</b> 기준 과거 기록이에요
            </>
          )}
          . 그 사이에 이미 팔았을 수도 있어요. 따라 사는 용도로 쓰지 마세요.
        </p>
      </div>

      <div className="mt-[18px] flex items-center gap-2.5 lg:mt-6 lg:gap-3">
        <JumiAvatar art={JUMI_ART.greeting} size="sm" />
        <p className="text-[13px] leading-snug text-cb-foreground lg:text-sm">{JUMI_LEAD}</p>
      </div>

      {stocks.length === 0 && board.investors.length === 0 ? (
        <p className="mt-8 text-sm leading-relaxed text-cb-muted">{EMPTY}</p>
      ) : (
        <>
          {stocks.length > 0 && (
            <>
              <div className="mt-7 flex flex-col gap-3.5 lg:mt-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
                <div>
                  <h2 className="text-base font-bold tracking-tight lg:text-xl">{section.title}</h2>
                  <p className="mt-1.5 text-xs leading-normal text-cb-muted lg:text-[13px]">
                    {section.note}
                  </p>
                </div>

                <SegmentedControl
                  fill
                  label="보기 선택"
                  onChange={setView}
                  options={VIEWS}
                  value={view}
                />
              </div>

              <ol className="mt-2.5 lg:mt-4">
                {stocks.map((stock, index) => (
                  <StockRow key={stock.id} rank={index + 1} stock={stock} />
                ))}
              </ol>
            </>
          )}

          {board.investors.length > 0 && (
            <>
              <div className="mt-8 flex items-baseline justify-between lg:mt-12">
                <h2 className="text-base font-bold tracking-tight lg:text-xl">투자자별로 보기</h2>
                {board.filingLabel !== null && (
                  <span className="text-[11px] text-cb-muted lg:text-[13px]">
                    {board.filingLabel}
                  </span>
                )}
              </div>

              <ul className="mt-2.5 grid grid-cols-2 gap-3 lg:mt-4 lg:grid-cols-4 lg:gap-4">
                {board.investors.map((investor) => (
                  <InvestorCard investor={investor} key={investor.id} />
                ))}
              </ul>
            </>
          )}
        </>
      )}

      <p className="mt-6 text-[11.5px] leading-relaxed text-cb-muted lg:mt-7 lg:text-[12.5px]">
        {NOTE}
      </p>
    </>
  );
}

function moveColor(direction: GuruStock['moveDirection']): string {
  if (direction === 'buy') return 'text-cb-negative';
  if (direction === 'sell') return 'text-cb-positive';
  return 'text-cb-muted';
}

function StockRow({ stock, rank }: { stock: GuruStock; rank: number }) {
  return (
    <li className="flex items-center gap-3 border-t border-cb-border py-3 lg:gap-4 lg:py-4">
      <span className="w-4 shrink-0 font-mono text-[12.5px] font-bold tabular-nums text-[#55555f] lg:w-[22px] lg:text-sm">
        {rank}
      </span>

      <TickerLogo label={stock.monoSource} src={stock.logo} />

      <div className="min-w-0 grow">
        {/* 티커가 없는 종목은 줄을 비운다 — 회사명을 위아래로 두 번 쓰게 된다. */}
        {stock.ticker !== null && (
          <p className="truncate font-mono text-[11px] font-bold tracking-wide text-cb-muted lg:text-[11.5px]">
            {stock.ticker}
          </p>
        )}
        <p className="truncate text-[13px] font-bold lg:text-[15px]">{stock.name}</p>
      </div>

      <span className="hidden w-[150px] shrink-0 text-right text-[13px] text-cb-muted lg:inline">
        {stock.holders}
      </span>

      <div className="shrink-0 text-right lg:contents">
        <p className="font-mono text-[12.5px] font-bold tabular-nums lg:order-last lg:w-[130px] lg:text-[13.5px]">
          {stock.value}
        </p>
        <p
          className={`mt-0.5 font-mono text-[11px] tabular-nums lg:mt-0 lg:w-[110px] lg:text-right lg:text-[13px] ${moveColor(stock.moveDirection)}`}
        >
          {/* 좁은 화면에서는 보유 인원이 변동 자리를 대신한다. 둘 다 넣을 폭이 없다. */}
          <span className="lg:hidden">{stock.holders}</span>
          <span className="hidden lg:inline">{stock.move ?? ''}</span>
        </p>
      </div>
    </li>
  );
}

function InvestorCard({ investor }: { investor: GuruInvestor }) {
  return (
    <li className="flex flex-col rounded-2xl border border-cb-border bg-cb-surface p-4 lg:p-5">
      <p className="text-[13.5px] leading-snug font-bold lg:text-[15px]">{investor.person}</p>
      <p className="mt-1 text-[10.5px] leading-snug text-cb-muted lg:text-[11.5px]">
        {investor.firm}
      </p>

      <p className="mt-3 text-[11px] text-cb-muted lg:mt-4 lg:text-[11.5px]">신고 총액</p>
      <p className="mt-0.5 font-mono text-[19px] leading-none font-bold tabular-nums lg:text-[22px]">
        {investor.total}
      </p>

      {investor.topLabel !== null && investor.topTicker !== null && (
        <>
          <p className="mt-3 text-[11px] text-cb-muted lg:mt-3.5 lg:text-[11.5px]">
            가장 많이 담은 종목
          </p>
          <p className="mt-1.5 flex items-center gap-2">
            <TickerLogo label={investor.topTicker} size="sm" src={investor.topLogo} />
            <span className="truncate text-xs font-bold lg:text-[13px]">{investor.topLabel}</span>
          </p>
        </>
      )}

      <span className="grow" />

      <p className="mt-3.5 flex flex-wrap gap-x-2.5 gap-y-1 font-mono text-[10.5px] tabular-nums lg:mt-4 lg:text-[11.5px]">
        <span className="text-cb-muted">{investor.positions}</span>
        <span className="font-bold text-cb-negative">신규 {investor.newCount}</span>
        <span className="font-bold text-cb-positive">매도 {investor.exitCount}</span>
      </p>
    </li>
  );
}
