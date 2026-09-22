/**
 * 계산기 숫자 표기.
 *
 * 주린이가 가장 자주 틀리는 건 식이 아니라 **자릿수**다. 0 이 여섯 개인지 일곱 개인지
 * 세다가 한 자리를 놓친다. 그래서 정확한 값(`exactWon`)과 읽기 쉬운 값(`roughWon`)을
 * 나눠 두고, 화면은 자리마다 둘 중 맞는 쪽을 쓴다.
 */

const MAN = 10_000;
const EOK = 100_000_000;

/** 1800000 → '1,800,000원'. 가격·평단처럼 정확해야 하는 자리에 쓴다. */
export function exactWon(value: number): string {
  if (!Number.isFinite(value)) return '-';
  return `${Math.round(value).toLocaleString('ko-KR')}원`;
}

/**
 * 1234567 → '123만 4,567원'. 자릿수를 세지 않아도 되면서 **값은 그대로**인 표기.
 *
 * 실제로 내거나 받는 돈에는 이쪽을 쓴다. 세금 46,200원을 '4만원'이라고 쓰면
 * 6,200원이 아무 표시 없이 사라지는데, 그건 읽기 쉬워진 게 아니라 틀린 것이다.
 */
export function manWon(value: number): string {
  if (!Number.isFinite(value)) return '-';

  const won = Math.round(value);
  if (won < MAN) return exactWon(won);

  // 억까지 올려 묶는다 — 안 그러면 1억이 '10,000만원' 으로 나와서 되레 못 읽는다.
  const eok = Math.floor(won / EOK);
  const man = Math.floor((won % EOK) / MAN);
  const rest = won % MAN;

  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok.toLocaleString('ko-KR')}억`);
  if (man > 0) parts.push(`${man.toLocaleString('ko-KR')}만`);
  if (rest > 0) parts.push(rest.toLocaleString('ko-KR'));

  return `${parts.join(' ')}원`;
}

/**
 * 106632200 → '약 1억 663만원'. 만 단위 아래를 버린 어림값이다.
 *
 * **몇 년 뒤 얼마가 된다** 같은 추정에만 쓴다. 그런 숫자는 1원 단위까지 맞을 리가
 * 없어서 오히려 정확한 척하면 안 된다. 버린 자리가 있으면 '약'이 붙으므로,
 * 어림값이라는 사실이 화면에 그대로 남는다.
 */
export function roughWon(value: number): string {
  if (!Number.isFinite(value)) return '-';

  const won = Math.round(value);
  if (won < MAN) return exactWon(won);

  const totalMan = Math.floor(won / MAN);
  const dropped = won % MAN !== 0;
  const eok = Math.floor(totalMan / (EOK / MAN));
  const man = totalMan % (EOK / MAN);

  const text =
    eok === 0
      ? `${man.toLocaleString('ko-KR')}만원`
      : man === 0
        ? `${eok.toLocaleString('ko-KR')}억원`
        : `${eok.toLocaleString('ko-KR')}억 ${man.toLocaleString('ko-KR')}만원`;

  return dropped ? `약 ${text}` : text;
}

/** 3 → '3.0%'. 소수 한 자리가 기본이다 — 배당수익률·손익비가 정수로 떨어지는 일이 드물다. */
export function percent(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return '-';
  return `${value.toLocaleString('ko-KR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

/** 20 → '20주'. */
export function shares(value: number): string {
  if (!Number.isFinite(value)) return '-';
  return `${Math.round(value).toLocaleString('ko-KR')}주`;
}

/** 10.285… → '10.3'. 배(倍)·비율처럼 자릿수를 고정해야 읽기 좋은 자리에 쓴다. */
export function decimal(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return '-';
  return value.toLocaleString('ko-KR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/**
 * 7 → '7', 7.5 → '7.5'. 소수 자리를 **필요할 때만** 붙인다.
 *
 * 사용자가 직접 친 값을 문장 안에 되읽어 줄 때 쓴다. `decimal` 로 하면 '7' 을 친
 * 사람에게 '7.0' 이라고 돌려주게 되고, 자리를 0 으로 고정하면 7.5 가 8 로 반올림돼
 * 실제 계산과 다른 숫자가 화면에 남는다.
 */
export function loose(value: number, maxDigits = 1): string {
  if (!Number.isFinite(value)) return '-';
  return value.toLocaleString('ko-KR', { maximumFractionDigits: maxDigits });
}

/**
 * 입력칸 아래에 붙는 도움말. 100000 을 치면 '10만원' 이라고 되읽어 준다.
 *
 * 만 미만은 되읽을 필요가 없어(자릿수를 셀 일이 없다) null 을 준다 — 호출부는
 * null 이면 도움말 줄 자체를 그린다.
 */
export function wonHint(value: number | null): string | null {
  if (value === null || !Number.isFinite(value) || value < MAN) return null;
  // 되읽기 줄이 원래 값과 다르면 도와주는 게 아니라 헷갈리게 한다 — 어림값은 쓰지 않는다.
  return manWon(value);
}
