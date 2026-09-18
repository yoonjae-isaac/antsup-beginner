import type { ChoicePoint, JumiLine } from '../types';

/**
 * 주제 6 — ETF가 뭔가요?
 *
 * 원본: beginner-onboarding 패키지 `steps.buyWhat.points[1]` + `approaches.passive`.
 * 원본이 분명히 못박은 세 가지 단서를 빠뜨리지 않는다 —
 * (1) 분산은 개별 기업 위험만 줄일 뿐 시장 전체 하락은 못 막는다,
 * (2) 테마·섹터 ETF 는 여전히 한쪽에 쏠려 있다,
 * (3) 레버리지 ETF 는 초보에게 권하지 않는다.
 * 'ETF는 안전하다'로 읽히면 이 레슨은 실패한 것이다.
 */
export const LINES: readonly JumiLine[] = [
  {
    id: 'etf-1',
    text: 'ETF요? 이름만 어려워 보이는데요, 쉽게 말하면 ‘주식 여러 개를 한 바구니에 담아서 통째로 파는 것’이에요.',
  },
  {
    id: 'etf-2',
    text: '한 주만 사도 그 바구니 안에 수십, 수백 개 회사가 같이 들어 있어요. 제가 일일이 고르지 않아도 되는 거죠.',
  },
  {
    id: 'etf-3',
    text: '좋은 점은 한 회사가 크게 휘청여도 충격이 나눠진다는 거예요. 계란을 한 바구니에 담지 말라는 말, 딱 그거예요.',
  },
  {
    id: 'etf-4',
    text: '그래서 처음 시작하는 분께 ‘ETF부터 해보세요’ 하는 얘기를 많이 들으실 거예요. 종목 고르는 부담이 확 줄거든요.',
  },
  {
    id: 'etf-5',
    text: '그 부분은 꼭 짚고 넘어갈게요. 나눠 담는 건 ‘한 회사가 휘청일 위험’을 줄여주는 거지, 값이 안 떨어지게 해주는 게 아니에요. 시장 전체가 내려가면 ETF도 같이 내려가요.',
  },
  {
    id: 'etf-6',
    text: '그리고 ETF라고 다 넓게 퍼져 있는 건 아니에요. 한 분야만 모아둔 것도 있는데, 그건 여전히 한쪽에 쏠려 있어서 많이 출렁여요.',
  },
  {
    id: 'etf-7',
    text: '특히 수익도 손실도 두세 배로 키우는 종류가 있어요. 이건 처음엔 권하지 않을게요. 오를 때만 두 배가 아니라, 내릴 때도 두 배거든요.',
  },
  {
    id: 'etf-8',
    text: '처음이라면 특정 분야를 콕 집은 게 아니라, 시장 전체를 넓게 따라가는 ETF부터가 마음이 편해요.',
  },
];

export const CHOICES: readonly ChoicePoint[] = [
  {
    id: 'etf-choice-1',
    afterLineId: 'etf-1',
    // 둘 다 "한 주에 수백 개가 들어 있어 고르지 않아도 된다" 로 답이 된다.
    options: [
      { id: 'etf-choice-1-a', text: '왜 굳이 바구니로 사요?' },
      { id: 'etf-choice-1-b', text: '한 주만 사도 여러 개가 들어있는 거예요?' },
    ],
  },
  {
    id: 'etf-choice-2',
    afterLineId: 'etf-4',
    // 둘 다 "분산은 하락을 막아주지 않는다" 로 답이 된다 — 가장 흔한 오해 두 가지다.
    options: [
      { id: 'etf-choice-2-a', text: '그럼 ETF는 안 떨어지는 거예요?' },
      { id: 'etf-choice-2-b', text: '아무 ETF나 사면 되는 거죠?' },
    ],
  },
];
