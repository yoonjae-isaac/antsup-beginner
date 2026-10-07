import symbols from './symbols.json';
import type { StockMarket, SymbolHit } from './types';

/**
 * 종목 카탈로그 — **서버에서만** 부른다.
 *
 * 1MB 다. 브라우저로 내려보낼 이유가 없고(한 번에 보여 주는 건 여덟 줄뿐이다),
 * 이 레포는 공개라 번들이 그만큼 커지면 첫 로딩에 그대로 드러난다.
 * app/api/my-stocks/{search,news} 라우트 핸들러와 koreanSymbolName() 만 이 파일을 본다.
 *
 * 원본은 cash-bite `src/data/stockSymbols.{kospi,kosdaq,nasdaq,nyse,amex}.json` 이다
 * (KOSPI·KOSDAQ·NASDAQ·NYSE·AMEX, 14,099종목). 손으로 고치지 말고 다시 추출할 것.
 * 한 파일에 세 필드를 같이 두는 건 나눠 두면 한쪽만 다시 뽑아 어긋나기 때문이다 —
 * 실제로 이름과 시장을 따로 두었다가 합쳤다.
 */
type CatalogRow = [nameKo: string, nameEn: string, market: StockMarket];

// JSON 을 그대로 읽으면 각 줄이 string[] 로 추론된다 — 길이도 시장 값도 타입이 모른다.
// 추출 스크립트가 세 칸을 보장하므로 unknown 을 거쳐 한 번에 고정한다.
const CATALOG = symbols as unknown as Record<string, CatalogRow>;

/** 한 번에 돌려줄 최대 건수. 자동완성이 화면을 다 덮지 않을 만큼. */
export const SEARCH_LIMIT = 8;

/**
 * 점수가 낮을수록 먼저. cash-bite 의 TickerAutocomplete.matchSymbols 를 그대로 옮겼다 —
 * 같은 카탈로그를 두 서비스가 다르게 정렬하면 같은 말을 쳤는데 다른 종목이 1등으로 나온다.
 *
 * 정확히 같으면 코드와 한글명만 본다(영문명은 제외). 저쪽이 그렇게 돼 있고,
 * 영문명은 'INC'·'CORP' 같은 꼬리가 붙어 통째로 일치하는 일이 사실상 없다.
 *
 * 영문명은 **미국 종목에만 있다**. 원본의 KOSPI·KOSDAQ 에는 nameEn 이 아예 없어서
 * 'samsung' 으로는 삼성전자가 안 잡힌다 — cash-bite 도 같다.
 */
function scoreOf(query: string, code: string, ko: string, en: string): number {
  if (code === query || ko === query) return 0;
  if (code.startsWith(query)) return 1;
  if (ko.startsWith(query) || (en !== '' && en.startsWith(query))) return 2;
  if (code.includes(query)) return 3;
  if (ko.includes(query) || (en !== '' && en.includes(query))) return 4;
  return -1;
}

export function searchSymbols(rawQuery: string, limit = SEARCH_LIMIT): SymbolHit[] {
  const query = rawQuery.trim().toLowerCase();
  if (query === '') return [];

  const scored: { hit: SymbolHit; score: number }[] = [];
  for (const [code, [nameKo, nameEn, market]] of Object.entries(CATALOG)) {
    const score = scoreOf(query, code.toLowerCase(), nameKo.toLowerCase(), nameEn.toLowerCase());
    if (score < 0) continue;

    scored.push({ hit: { code, name: nameKo, market }, score });
  }

  scored.sort((a, b) => a.score - b.score || a.hit.name.localeCompare(b.hit.name, 'ko'));
  return scored.slice(0, limit).map((entry) => entry.hit);
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
  const row = CATALOG[code];

  return row ? { code, name: row[0], market: row[2] } : null;
}

/**
 * 한글 종목명. 없으면 null.
 *
 * 'BRK.B' 처럼 클래스가 붙은 티커는 카탈로그 표기와 어긋날 수 있어 점·하이픈을
 * 지운 형태도 한 번 더 찾아본다.
 */
export function koreanSymbolName(code: string): string | null {
  const upper = code.trim().toUpperCase();
  if (upper === '') return null;

  const row = CATALOG[upper] ?? CATALOG[upper.replace(/[.-]/g, '')];
  return row ? (row[0] || null) : null;
}
