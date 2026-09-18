import type { ChoicePoint, JumiLine } from '../types';

/** 주제 1 — 주식은 도박이 아니에요 (루트). 회사를 나눈 '조각' 비유를 세우는 자리다. */
export const LINES: readonly JumiLine[] = [
  {
    id: 'basics-1',
    text: '삼성전자, 다들 한 번쯤 들어보셨죠? 엄청 큰 회사예요. 그런데 이 회사를 아주 잘게, 잘게 나눠서 조각으로 팔거든요.',
  },
  {
    id: 'basics-2',
    text: '그 조각 하나를 여러분이 가질 수 있어요. 그게 바로 ‘주식’이에요.',
  },
  {
    id: 'basics-3',
    text: '회사가 장사를 잘하면, 그 조각을 갖고 싶어 하는 사람이 많아져요. 그럼 조각 값이 자연스럽게 올라가요.',
  },
  {
    id: 'basics-4',
    text: '1000원에 산 조각이 2000원이 되면, 1000원이 남는 거예요. 물론 반대로 떨어질 수도 있어요. 그건 솔직하게 말씀드릴게요.',
  },
  {
    id: 'basics-5',
    text: '중요한 건 이거예요. 내가 직접 뭘 잘해야 하는 게 아니에요. 잘하는 회사에 살짝 얹혀가는 거거든요. 그래서 도박이랑은 달라요.',
  },
  {
    id: 'basics-6',
    text: '그게요, 오히려 아무것도 안 하는 것도 위험할 수 있어요. 물가가 오르면, 가만히 있는 돈은 살 수 있는 게 점점 줄어들거든요.',
  },
];

export const CHOICES: readonly ChoicePoint[] = [
  {
    id: 'basics-choice-1',
    afterLineId: 'basics-1',
    // 둘 다 "그 조각이 주식이에요" 로 답이 된다.
    options: [
      { id: 'basics-choice-1-a', text: '어… 조각이요?' },
      { id: 'basics-choice-1-b', text: '그걸 제가 살 수 있는 거예요?' },
    ],
  },
  {
    id: 'basics-choice-2',
    afterLineId: 'basics-5',
    // 둘 다 "가만히 있는 돈은 물가에 깎인다" 로 답이 된다.
    options: [
      { id: 'basics-choice-2-a', text: '그럼 가만히 두는 게 안전한 거 아니에요?' },
      { id: 'basics-choice-2-b', text: '그럼 그냥 저축만 하면 안 돼요?' },
    ],
  },
];
