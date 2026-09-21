import { backendGet } from '@/config/backend';
import {
  BACKEND_ROUTES,
  type GuruStatHolderResponse,
  type GuruStatStockResponse,
} from '@/config/backendRoutes';
import { investorNameByCik, investorNameByPerson } from '@/domain/investors/names';
import { loadLogos } from '@/domain/stocks/logos';
import { koreanSymbolName } from '@/domain/stocks/symbolNames';


export type StockView = 'held' | 'bought' | 'sold';

/** 한 종목을 들고 있는 거장 한 명 — 보유 수 옆 팝업에 뜬다. */
export interface GuruHolder {
  name: string;
  value: string;
  /** '신규' · '확대' · '축소' · '유지' · '전량매도'. */
  changeLabel: string;
  direction: 'buy' | 'sell' | null;
}

export interface GuruStock {
  id: string;
  /** 티커를 못 붙인 종목이 있다(OpenFIGI 매핑이 best-effort). 그때는 null 이다. */
  ticker: string | null;
  /** 로고가 없을 때 타일에 남길 글자의 출처. 티커가 없으면 회사명을 쓴다. */
  monoSource: string;
  name: string;
  /** '거장 9명 보유' 처럼 이미 문장이 된 값. */
  holdersLabel: string;
  /** '+1명' / '신규 2명'. 없으면 null. */
  move: string | null;
  moveDirection: 'buy' | 'sell' | null;
  value: string;
  logo: string | null;
  /** 이 종목을 들고 있는 거장들. 붙어 있는 숫자와 같은 기준으로 걸러 둔다. */
  holders: readonly GuruHolder[];
}

export interface GuruInvestor {
  id: string;
  /** 'Berkshire Hathaway (Warren Buffett)' 에서 갈라낸 사람 이름. */
  person: string;
  firm: string;
  /**
   * 이 사람이 신고한 분기('2026년 2분기'). 사람마다 다르다.
   * 화면 맨 위 기준 분기만 믿으면, 아직 안 낸 사람의 옛 숫자를 이번 분기로 오해한다.
   */
  quarter: string;
  /** 대표 분기보다 뒤처졌을 때만 붙는 꼬리표('한 분기 전'). 최신이면 null. */
  lagLabel: string | null;
  total: string;
  topLabel: string | null;
  topTicker: string | null;
  topLogo: string | null;
  positions: string;
  newLabel: string;
  exitLabel: string;
}

export interface InvestorsBoard {
  /** '2026년 2분기'. 비어 있으면 화면이 기준 분기를 못 밝힌다. */
  asOfLabel: string | null;
  filingLabel: string | null;
  stocks: Record<StockView, readonly GuruStock[]>;
  investors: readonly GuruInvestor[];
}

/** 순위표에 올릴 종목 수. 더 길어지면 초보가 훑을 분량을 넘는다. */
const STOCK_LIMIT = 6;

/** 카드로 세울 투자자 수. */
const INVESTOR_LIMIT = 8;

/**
 * 백엔드가 전량 매도 종목을 돌려주는 상한(`EXITS_LIMIT`). `exitCount` 가 이 값이면
 * 딱 15건이 아니라 **15건 이상**이라는 뜻이다. 그대로 '매도 15' 라고 쓰면 거짓이 된다.
 * 실제로 버핏·사이먼스·달리오가 전부 15로 잘려서 나온다.
 */
const EXITS_LIMIT = 15;

/** 상한에 걸린 수는 '15+' 로 쓴다. */
function countLabel(count: number, limit: number): string {
  const text = count.toLocaleString('ko-KR');
  return count >= limit ? `${text}+` : text;
}

/** '2026-06-30' → '2026년 2분기'. 13F 는 분기 기준일로 온다. */
function quarterLabel(reportDate: string): string {
  const [year, month] = reportDate.split('-');
  const quarter = Math.floor((Number(month) - 1) / 3) + 1;
  return `${year}년 ${quarter}분기`;
}

/**
 * 대표 분기보다 뒤처진 정도.
 *
 * 13F 는 사람마다 내는 시점이 달라, 한 화면에 여러 분기가 섞인다. 뒤처진 카드에
 * 표시를 안 하면 초보는 전부 같은 분기로 읽는다.
 */
function lagLabelOf(quartersBehind: number, isStale?: boolean): string | null {
  if (isStale === true) return '한동안 공시 없음';
  if (!Number.isFinite(quartersBehind) || quartersBehind <= 0) return null;
  return `${quartersBehind}분기 전`;
}

/** USD → '$812억'. 13F 값은 2023년 규칙 개정 이후 달러 단위다(천 단위 아님). */
function usdLabel(value: number): string {
  const billion = value / 100_000_000;
  if (billion >= 1) {
    return `$${billion.toLocaleString('ko-KR', { maximumFractionDigits: billion >= 100 ? 0 : 1 })}억`;
  }
  return `$${(value / 10_000).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}만`;
}

/** 'Berkshire Hathaway (Warren Buffett)' → { firm, person }. 괄호가 없으면 전부 회사명이다. */
function splitInvestorName(name: string): { firm: string; person: string } {
  const match = name.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (!match) return { firm: name, person: name };
  return { firm: match[1].trim(), person: match[2].trim() };
}

const CHANGE_LABEL: Record<GuruStatHolderResponse['change'], string> = {
  new: '신규',
  increased: '확대',
  decreased: '축소',
  unchanged: '유지',
  exit: '전량매도',
};

/**
 * 종목별 보유 거장 목록.
 *
 * 붙어 있는 숫자와 같은 기준으로 거른다 — '2명이 늘림' 옆 팝업에 판 사람이 섞이면
 * 숫자와 목록이 안 맞는다. 정렬(보유액 내림차순)은 백엔드가 보장한다.
 */
function toHolders(
  rows: readonly GuruStatHolderResponse[] | undefined,
  view: StockView,
): GuruHolder[] {
  // Array.isArray 를 쓰면 안 된다 — readonly 배열을 any[] 로 넓혀서 change 가 any 가 된다.
  if (rows === undefined) return [];

  const keep = (change: GuruStatHolderResponse['change']) => {
    if (view === 'bought') return change === 'new' || change === 'increased';
    if (view === 'sold') return change === 'decreased' || change === 'exit';
    // 보유 목록에서는 이미 판 사람을 뺀다.
    return change !== 'exit';
  };

  return rows.filter((row) => keep(row.change)).map((row) => ({
    name: investorNameByPerson(row.name) ?? row.name,
    value: usdLabel(row.value),
    changeLabel: CHANGE_LABEL[row.change],
    direction:
      row.change === 'new' || row.change === 'increased'
        ? ('buy' as const)
        : row.change === 'decreased' || row.change === 'exit'
          ? ('sell' as const)
          : null,
  }));
}

function toStock(row: GuruStatStockResponse, view: StockView, logos: Record<string, string>): GuruStock {
  const ticker = row.ticker ?? '';

  const holdersLabel =
    view === 'held'
      ? `거장 ${row.holderCount}명 보유`
      : view === 'bought'
        ? `${row.buyerCount}명이 늘림`
        : `${row.sellerCount}명이 줄임`;

  const move =
    view === 'held'
      ? row.holderDelta == null || row.holderDelta === 0
        ? '변화 없음'
        : `${row.holderDelta > 0 ? '+' : ''}${row.holderDelta}명`
      : null;

  // 공시에 적힌 이름은 'Apple Inc.' 다. 한글 이름이 있으면 그걸 앞에 세운다.
  const korean = ticker === '' ? null : koreanSymbolName(ticker);
  const name = korean ?? row.nameOfIssuer;

  return {
    id: row.cusip,
    ticker: ticker === '' ? null : ticker,
    monoSource: name,
    name,
    holdersLabel,
    holders: toHolders(row.holders, view),
    move,
    moveDirection:
      view === 'bought' ? 'buy' : view === 'sold' ? 'sell' : row.holderDelta == null || row.holderDelta === 0 ? null : row.holderDelta > 0 ? 'buy' : 'sell',
    value: usdLabel(row.totalValue),
    logo: ticker === '' ? null : (logos[ticker.toUpperCase()] ?? null),
  };
}

const EMPTY: InvestorsBoard = {
  asOfLabel: null,
  filingLabel: null,
  stocks: { held: [], bought: [], sold: [] },
  investors: [],
};

/**
 * 거장 13F 한 판.
 *
 * 두 엔드포인트를 합친다 — stats 는 종목 쪽 집계, overview 는 투자자 쪽 카드다.
 * 한쪽이 비어도 다른 쪽은 그대로 보여준다. 화면 단위로 죽이지 않는다.
 */
export async function loadInvestorsBoard(): Promise<InvestorsBoard> {
  const [stats, overview] = await Promise.all([
    backendGet(BACKEND_ROUTES.guruStats),
    backendGet(BACKEND_ROUTES.guruOverview),
  ]);

  if (!stats && !overview) return EMPTY;

  const cut = (rows: GuruStatStockResponse[] | undefined) => (rows ?? []).slice(0, STOCK_LIMIT);
  const held = cut(stats?.mostHeld);
  const bought = cut(stats?.mostBought);
  const sold = cut(stats?.mostSold);

  const investorRows = (overview?.investors ?? []).slice(0, INVESTOR_LIMIT);

  // 세 표와 투자자 카드에 나오는 티커를 한 번에 받아 온다.
  const tickers = [
    ...held.map((row) => row.ticker),
    ...bought.map((row) => row.ticker),
    ...sold.map((row) => row.ticker),
    ...investorRows.map((row) => row.topHolding?.ticker),
  ].filter((ticker): ticker is string => typeof ticker === 'string' && ticker !== '');

  const logos = await loadLogos(tickers);

  const investors: GuruInvestor[] = investorRows.map((row) => {
    const { firm, person } = splitInvestorName(row.name);
    const top = row.topHolding;
    const topTicker = top?.ticker ?? null;

    return {
      id: row.cik,
      // 한글 표기가 있으면 그걸 쓰고, 없으면 공시에 적힌 영문 이름을 그대로 둔다.
      person: investorNameByCik(row.cik) ?? person,
      firm,
      quarter: quarterLabel(row.reportDate),
      lagLabel: lagLabelOf(row.quartersBehind, row.isStale),
      total: usdLabel(row.totalValue),
      topLabel: top
        ? `${(topTicker === null ? null : koreanSymbolName(topTicker)) ?? topTicker ?? top.nameOfIssuer} · ${top.weight.toFixed(1)}%`
        : null,
      topTicker: topTicker ?? top?.nameOfIssuer ?? null,
      topLogo: topTicker === null ? null : (logos[topTicker.toUpperCase()] ?? null),
      positions: `${row.positionCount.toLocaleString('ko-KR')}종목`,
      newLabel: `신규 ${row.newCount.toLocaleString('ko-KR')}`,
      exitLabel: `매도 ${countLabel(row.exitCount, EXITS_LIMIT)}`,
    };
  });

  const asOf = stats?.asOf ?? overview?.asOf ?? null;
  const filing = overview?.filing;

  return {
    asOfLabel: asOf === null ? null : quarterLabel(asOf),
    filingLabel:
      filing == null
        ? null
        : `추적 ${filing.totalInvestors}명 중 ${filing.asOfCount}명이 이번 분기를 제출했어요`,
    stocks: {
      held: held.map((row) => toStock(row, 'held', logos)),
      bought: bought.map((row) => toStock(row, 'bought', logos)),
      sold: sold.map((row) => toStock(row, 'sold', logos)),
    },
    investors,
  };
}
