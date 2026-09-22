import type { ChoicePoint, JumiLine } from '../types';
import * as accountTypes from './accountTypes';
import * as afterBuy from './afterBuy';
import * as averaging from './averaging';
import * as beforeBuying from './beforeBuying';
import * as broker from './broker';
import * as buySell from './buySell';
import * as compound from './compound';
import * as dividend from './dividend';
import * as etf from './etf';
import * as krVsUs from './krVsUs';
import * as mindset from './mindset';
import * as riskyProducts from './riskyProducts';
import * as savingsGoal from './savingsGoal';
import * as stockBasics from './stockBasics';
import * as stopLoss from './stopLoss';
import * as taxFee from './taxFee';
import * as terms from './terms';

/**
 * 레슨 대사의 단일 소스 — **주제별로 한 파일**이다.
 *
 * 파일 안에서 `LINES`(주미 대사)와 `CHOICES`(사용자 선택지)를 나눠 두되 같은 파일에 둔다.
 * 선택지는 '어느 걸 골라도 다음 대사로 답이 되어야 한다'는 제약으로 대사와 묶여 있어서,
 * 둘을 다른 파일로 떼면 한쪽만 고치고 어긋나는 사고가 난다. 그림(artwork.ts)은
 * 그 제약이 없으므로 지금처럼 따로 관리한다.
 *
 * ── 대사 작성 규칙 ────────────────────────────────────────────────
 * 톤: 다정함은 수단이고 목적은 '초보가 진짜로 이해하는 것'이다.
 *     귀여운 표현이 설명을 흐리면 표현을 버린다. 손실 가능성도 숨기지 않는다.
 *     어려운 말에는 반드시 일상 비유를 붙인다(조각·피자·바구니).
 *
 * 숫자: 세율·한도·수수료처럼 바뀌는 수치는 단정해서 쓰지 않는다. 주미의 다정한 말투는
 *     초보가 그대로 사실로 믿게 만들기 때문에 더 위험하다. 그런 주제는
 *     '약/대략 + 가입·매매 시점 확인' 으로만 서술한다.
 *
 * 출처: 투자 내용은 beginner-onboarding 패키지(검증 이력 있음)를 근거로 한다.
 *     각 주제 파일 상단에 어느 항목에서 가져왔는지 적어 둘 것.
 */

/** 레슨 slug → 주미 대사. lessons.ts 의 STEPS 와 짝이 맞아야 한다. */
export const LESSON_LINES: Record<string, readonly JumiLine[]> = {
  'stock-basics': stockBasics.LINES,
  'buy-sell': buySell.LINES,
  mindset: mindset.LINES,
  broker: broker.LINES,
  'account-types': accountTypes.LINES,
  'before-buying': beforeBuying.LINES,
  etf: etf.LINES,
  'tax-fee': taxFee.LINES,
  'kr-vs-us': krVsUs.LINES,
  terms: terms.LINES,
  'after-buy': afterBuy.LINES,

  // 2부 — 사고 난 뒤. 이 다섯은 원본이 cash-bite 의 학습 글이라, 각 파일 머리에
  // 어느 글에서 왔고 무엇을 빠뜨리면 안 되는지 적어 뒀다.
  averaging: averaging.LINES,
  'stop-loss': stopLoss.LINES,
  dividend: dividend.LINES,
  'risky-products': riskyProducts.LINES,
  compound: compound.LINES,
  'savings-goal': savingsGoal.LINES,
};

/** 레슨 slug → 사용자 선택지. */
export const LESSON_CHOICES: Record<string, readonly ChoicePoint[]> = {
  'stock-basics': stockBasics.CHOICES,
  'buy-sell': buySell.CHOICES,
  mindset: mindset.CHOICES,
  broker: broker.CHOICES,
  'account-types': accountTypes.CHOICES,
  'before-buying': beforeBuying.CHOICES,
  etf: etf.CHOICES,
  'tax-fee': taxFee.CHOICES,
  'kr-vs-us': krVsUs.CHOICES,
  terms: terms.CHOICES,
  'after-buy': afterBuy.CHOICES,

  averaging: averaging.CHOICES,
  'stop-loss': stopLoss.CHOICES,
  dividend: dividend.CHOICES,
  'risky-products': riskyProducts.CHOICES,
  compound: compound.CHOICES,
  'savings-goal': savingsGoal.CHOICES,
};
