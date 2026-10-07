import names from './symbolNames.json';
import markets from './symbolMarkets.json';
import type { StockMarket, SymbolHit } from './types';

/**
 * 종목 검색 — **서버에서만** 부른다.
 *
 * 카탈로그 두 파일을 합쳐 800KB 다. 브라우저로 내려보낼 이유가 없고(한 번에 보여 주는 건
 * 여덟 줄뿐이다), 이 레포는 공개라 번들이 그만큼 커지면 첫 로딩에 그대로 드러난다.
 * 그래서 app/api/my-stocks/search 라우트 핸들러만 이 파일을 부른다.
 *
 * symbolMarkets.json 은 symbolNames.json 과 같은 원본(cash-bite
 * `src/data/stockSymbols.{kospi,kosdaq,nasdaq,nyse,amex}.json`)에서 같이 추려 왔다.
 * 둘은 같은 14,099개 코드를 덮는다 — 한쪽만 다시 뽑으면 어긋나므로 늘 같이 뽑을 것.
 */
const SYMBOL_NAMES = names as Record<string, string>;
const SYMBOL_MARKETS = markets as Record<string, StockMarket>;

/** 한 번에 돌려줄 최대 건수. 자동완성이 화면을 다 덮지 않을 만큼. */
export const SEARCH_LIMIT = 8;

/**
 * 점수가 낮을수록 먼저. cash-bite 의 TickerAutocomplete.matchSymbols 를 그대로 옮겼다 —
 * 같은 카탈로그를 두 서비스가 다르게 정렬하면 같은 말을 쳤는데 다른 종목이 1등으로 나온다.
 *
 * 다른 점 하나: 저쪽은 영문명(nameEn)도 본다. 우리 카탈로그는 코드→한글명만 추려 와서
 * 'nvidia' 로는 못 찾고 'NVDA'·'엔비디아'로 찾는다. 영문명까지 받으려면 추출을 다시 해야 한다.
 */
function scoreOf(query: string, code: string, name: string): number {
  if (code === query || name === query) return 0;
  if (code.startsWith(query)) return 1;
  if (name.startsWith(query)) return 2;
  if (code.includes(query)) return 3;
  if (name.includes(query)) return 4;
  return -1;
}

/**
 * 코드 한 건 조회 — 서버에서만.
 *
 * 브라우저가 보낸 종목명을 그대로 믿지 않으려고 둔다. 관련 뉴스는 그 이름이 네이버
 * 검색어로 나가고 (market, query) 로 캐시되는데, 아무 문자열이나 통과시키면 남의 서버에
 * 임의 검색을 대신 쏴 주는 길이 된다. 브라우저는 코드만 보내고 이름은 여기서 찾는다.
 */
export function findSymbol(rawCode: string): SymbolHit | null {
  const code = rawCode.trim().toUpperCase();
  const name = SYMBOL_NAMES[code];
  const market = SYMBOL_MARKETS[code];

  return name && market ? { code, name, market } : null;
}

export function searchSymbols(rawQuery: string, limit = SEARCH_LIMIT): SymbolHit[] {
  const query = rawQuery.trim().toLowerCase();
  if (query === '') return [];

  const scored: { hit: SymbolHit; score: number }[] = [];
  for (const [code, name] of Object.entries(SYMBOL_NAMES)) {
    const score = scoreOf(query, code.toLowerCase(), name.toLowerCase());
    if (score < 0) continue;

    const market = SYMBOL_MARKETS[code];
    // 시장을 모르는 코드는 내보내지 않는다 — 배지가 빈 줄이 섞이느니 안 보이는 게 낫다.
    // 두 파일을 같이 뽑는 한 생기지 않는다.
    if (!market) continue;

    scored.push({ hit: { code, name, market }, score });
  }

  scored.sort((a, b) => a.score - b.score || a.hit.name.localeCompare(b.hit.name, 'ko'));
  return scored.slice(0, limit).map((entry) => entry.hit);
}
