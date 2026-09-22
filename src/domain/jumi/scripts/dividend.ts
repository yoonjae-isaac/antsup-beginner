import type { ChoicePoint, JumiLine } from '../types';

/**
 * 주제 14 — 가만히 있어도 돈이 들어와요? (2부 ③)
 *
 * 원본: cash-bite `src/domain/learn/articles.ts` 의 `dividend-basics`.
 * 원본의 뼈대 —
 * (1) 배당수익률 = 주당 배당금 ÷ 주가. 주가가 내리면 수익률은 올라간다,
 * (2) 세금을 떼고 들어오므로 '받는 돈'은 세후로 봐야 한다,
 * (3) 배당락 — 권리가 넘어가면 주가가 배당만큼 조정되는 경향이 있다.
 *
 * 세율은 대사에 숫자로 쓰지 않는다. 계산기에 기본값으로 채워 두고 사용자가 바꾸게 하며,
 * 그것이 '가정'이라는 사실은 계산기와 하단 고지(CALC_NOTICE)가 말한다.
 */
export const LINES: readonly JumiLine[] = [
  {
    id: 'dividend-1',
    text: '주식을 들고만 있어도 돈이 들어올 때가 있어요. 그걸 배당이라고 해요.',
  },
  {
    id: 'dividend-2',
    text: '회사가 한 해 번 돈 중 일부를 주주한테 나눠주는 거예요. 주가가 오르든 내리든 그것과는 별개로요.',
  },
  {
    id: 'dividend-3',
    text: '아무 회사나 주는 건 아니에요. 주는 회사가 있고, 안 주는 회사가 있어요.',
  },
  {
    id: 'dividend-4',
    text: '얼마나 주는지는 배당수익률로 봐요. 주가 10만원짜리가 한 해에 3천원을 주면 3%예요.',
  },
  {
    id: 'dividend-5',
    text: '여기서 헷갈리기 쉬운 게 하나 있어요. 배당수익률은 주가가 내리면 올라가요.',
  },
  {
    id: 'dividend-6',
    text: '주는 돈은 그대로인데 주가만 내려간 거니까요. 그러니까 수익률이 높다고 꼭 좋은 회사인 건 아니에요.',
  },
  {
    id: 'dividend-7',
    text: '세금을 떼고 들어와요. 그래서 ‘얼마 받는다’는 항상 세금 뗀 뒤로 보는 습관을 들이셔야 해요.',
  },
  {
    id: 'dividend-8',
    text: '세율은 바뀔 수 있어서 계산기에 직접 넣으실 수 있게 해뒀어요. 지금 흔히 쓰는 값을 미리 채워뒀으니 받기 전에 한 번 확인해 보세요.',
  },
  {
    id: 'dividend-9',
    text: '마지막으로 하나만요. 배당 받을 권리가 넘어가는 날이 지나면, 주가가 배당만큼 빠지는 경우가 많아요.',
  },
  {
    id: 'dividend-10',
    text: '그래서 배당만 노리고 그 직전에 샀다가 바로 파는 건, 생각보다 남는 게 없어요.',
  },
  {
    id: 'dividend-11',
    text: '얼마가 들어오는지 한번 계산해 볼까요?',
  },
];

export const CHOICES: readonly ChoicePoint[] = [
  {
    id: 'dividend-choice-1',
    afterLineId: 'dividend-2',
    // 둘 다 "아무 회사나 주는 건 아니고, 얼마나 주는지는 배당수익률로 본다" 로 이어진다.
    options: [
      { id: 'dividend-choice-1-a', text: '아무 주식이나 주는 거예요?' },
      { id: 'dividend-choice-1-b', text: '얼마나 주는데요?' },
    ],
  },
  {
    id: 'dividend-choice-2',
    afterLineId: 'dividend-6',
    // 둘 다 "세금을 떼고 들어온다" 로 답이 된다.
    options: [
      { id: 'dividend-choice-2-a', text: '받은 돈은 다 제 거예요?' },
      { id: 'dividend-choice-2-b', text: '세금도 떼나요?' },
    ],
  },
];
