/**
 * 계산기가 쓰는 순수 함수.
 *
 * cash-bite 의 `src/domain/tools/calc.ts` 에서 필요한 다섯 개만 가져왔다.
 * 원본은 프레임워크·API 의존이 없어 식 자체는 그대로 옮겨도 된다.
 *
 * 한 가지만 다르다 — 원본은 세율·수익률을 **모듈 상수**로 박아 두고 결과만 보여준다.
 * 여기서는 전부 인자로 받는다. 세율은 바뀌고, 이 서비스는 화면에서 숫자를 단정하지
 * 않기로 했다. 기본값은 `DEFAULTS` 에 따로 두고, 화면은 그것을 '가정'으로 표시한다.
 */

/** 추가 매수 뒤의 평단. */
export interface AveragingResult {
  newAvg: number;
  totalQty: number;
  /** 이 종목에 들어간 돈 전부. 이 레슨이 실제로 보여주려는 값이다. */
  totalAmount: number;
  /** 원래 넣어둔 돈. 막대에서 '추가분'과 나눠 칠하는 데 쓴다. */
  baseAmount: number;
  addAmount: number;
}

export function averaging(
  holdingQty: number,
  avgPrice: number,
  addQty: number,
  addPrice: number,
): AveragingResult {
  const baseAmount = holdingQty * avgPrice;
  const addAmount = addQty * addPrice;
  const totalQty = holdingQty + addQty;
  const totalAmount = baseAmount + addAmount;

  return {
    newAvg: totalQty > 0 ? totalAmount / totalQty : 0,
    totalQty,
    totalAmount,
    baseAmount,
    addAmount,
  };
}

/** 손절가·목표가와 손익비. */
export interface StopTargetResult {
  stopPrice: number;
  takePrice: number;
  /** 익절 폭 ÷ 손절 폭. 1 보다 커야 승률이 낮아도 버틴다. */
  riskReward: number;
}

export function stopTarget(buyPrice: number, stopPct: number, takePct: number): StopTargetResult {
  return {
    stopPrice: buyPrice * (1 - stopPct / 100),
    takePrice: buyPrice * (1 + takePct / 100),
    riskReward: stopPct > 0 ? takePct / stopPct : 0,
  };
}

/** 한 번 매매에 걸 수 있는 금액 — 계좌에서 감당할 손실과 손절 폭으로 역산한다. */
export interface PositionSizeResult {
  maxLoss: number;
  positionAmount: number;
}

export function positionSize(
  account: number,
  riskPct: number,
  stopPct: number,
): PositionSizeResult {
  const maxLoss = account * (riskPct / 100);
  return {
    maxLoss,
    positionAmount: stopPct > 0 ? maxLoss / (stopPct / 100) : 0,
  };
}

/** 배당 — 세전·세후와 배당수익률. */
export interface DividendResult {
  gross: number;
  net: number;
  tax: number;
  yieldPct: number;
}

/** `taxRatePct` 는 화면에서 사용자가 바꾼다. 기본값은 `DEFAULTS.dividendTaxPct`. */
export function dividend(
  qty: number,
  price: number,
  dps: number,
  taxRatePct: number,
): DividendResult {
  const gross = qty * dps;
  const tax = gross * (taxRatePct / 100);

  return {
    gross,
    net: gross - tax,
    tax,
    yieldPct: price > 0 ? (dps / price) * 100 : 0,
  };
}

/** 복리 — 목돈에 매달 적립을 더해 월 단위로 굴린다. */
export interface CompoundResult {
  finalAmount: number;
  /** 내가 실제로 넣은 돈. */
  contributed: number;
  /** 불어난 부분. */
  gain: number;
}

export function compound(
  initial: number,
  monthly: number,
  annualRatePct: number,
  years: number,
): CompoundResult {
  const months = Math.round(years * 12);
  const rate = annualRatePct / 12 / 100;

  let balance = initial;
  for (let month = 0; month < months; month += 1) {
    balance = balance * (1 + rate) + monthly;
  }

  const contributed = initial + monthly * months;

  return {
    finalAmount: balance,
    contributed,
    gain: balance - contributed,
  };
}

/** 목표 금액에 닿기까지 매달 넣어야 하는 돈. */
export function monthlyForGoal(
  targetAmount: number,
  years: number,
  annualRatePct: number,
): number {
  const months = Math.round(years * 12);
  if (months <= 0) return 0;

  const rate = annualRatePct / 12 / 100;
  // 수익률 0 이면 등비급수 식의 분모가 0 이 된다. 그때는 그냥 나눠 담는 것과 같다.
  if (rate === 0) return targetAmount / months;

  return (targetAmount * rate) / ((1 + rate) ** months - 1);
}

/** 72법칙 — 돈이 두 배 되기까지의 햇수(어림값). */
export function yearsToDouble(annualRatePct: number): number {
  return annualRatePct > 0 ? 72 / annualRatePct : 0;
}

/**
 * 변동성 끌림 — 지수가 올랐다가 제자리로 돌아왔을 때 배수 상품이 서 있는 자리.
 *
 * 레버리지·인버스 상품은 누적이 아니라 **하루치**를 배수로 따라간다. 그래서 지수가
 * 왕복만 해도 배수 상품은 본전에 못 돌아온다. 이 함수가 그 한 왕복을 그대로 계산한다.
 *
 * 핵심은 '오른 만큼 내린다'가 같은 %가 아니라는 점이다. 10% 오른 뒤 제자리로 가려면
 * 10% 가 아니라 9.09% 를 내려야 하는데, 배수 상품은 그 9.09% 에 배수를 곱해 맞는다.
 *
 * @param multiple 1 = 지수 그대로, 2 = 2배, -2 = 곱버스
 * @returns 처음을 1 로 봤을 때의 최종 배율(1 이면 본전)
 */
export function roundTripResult(upPct: number, multiple: number): number {
  const up = upPct / 100;
  if (up <= -1) return 0;

  const downRate = up / (1 + up);
  const after = (1 + multiple * up) * (1 - multiple * downRate);

  // 실제 상품은 0 밑으로 내려가지 않는다 — 그 전에 청산된다.
  return Math.max(0, after);
}

/**
 * 계산기 입력의 기본값.
 *
 * 세율과 수익률은 **법이나 사실이 아니라 출발점**이다. 화면에서 바꿀 수 있어야 하고,
 * '(가정)' 표시가 함께 붙어야 한다. 값이 바뀌면 여기만 고친다.
 */
export const DEFAULTS = {
  /** 배당소득세 — 지방소득세를 포함한 원천징수 기준으로 흔히 쓰이는 값. */
  dividendTaxPct: 15.4,
  /** 장기 수익률 가정. 특정 상품의 약속이 아니라 계획을 세우기 위한 기준값이다. */
  annualRatePct: 7,
} as const;
