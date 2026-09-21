import names from './symbolNames.json';

/**
 * 코드 → 한글 종목명.
 *
 * cash-bite `src/data/stockSymbols.*.json` 에서 nameKo 만 추려 왔다(KOSPI·KOSDAQ·
 * NASDAQ·NYSE·AMEX, 14,099개). 원본은 3.6MB 지만 nameEn·market 을 버리면 385KB 다.
 *
 * 원본이 바뀌면 손으로 고치지 말고 다시 추출할 것.
 *
 * 서버에서만 부른다 — 385KB 를 브라우저로 내려보낼 이유가 없다. 화면에는 이미
 * 이름이 박힌 문자열만 간다.
 */
const SYMBOL_NAMES = names as Record<string, string>;

/**
 * 한글 종목명. 없으면 null.
 *
 * 'BRK.B' 처럼 클래스가 붙은 티커는 카탈로그 표기와 어긋날 수 있어 점·하이픈을
 * 지운 형태도 한 번 더 찾아본다.
 */
export function koreanSymbolName(code: string): string | null {
  const upper = code.trim().toUpperCase();
  if (upper === '') return null;

  return SYMBOL_NAMES[upper] ?? SYMBOL_NAMES[upper.replace(/[.-]/g, '')] ?? null;
}
