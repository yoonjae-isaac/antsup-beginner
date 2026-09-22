import type { ChoicePoint, JumiLine } from '../types';

/**
 * 주제 16 — 매달 얼마씩 넣어야 해요? (2부 ⑤, 커리큘럼의 마지막)
 *
 * 원본: cash-bite `src/domain/learn/articles.ts` 의 `savings-goal`.
 * 원본의 뼈대 —
 * (1) '얼마 모을 수 있을까'를 '얼마가 필요한가'로 뒤집으면 숫자가 나온다,
 * (2) 매달 같은 금액을 넣으면 쌀 때 많이·비쌀 때 적게 사게 된다,
 * (3) 수익률은 통제 밖이고, 적립 습관과 기간은 통제 안이다.
 *
 * 마지막 레슨이라 다음 화 CTA 가 없다 — 끝맺는 말로 닫는다.
 */
export const LINES: readonly JumiLine[] = [
  {
    id: 'savings-goal-1',
    text: '이제 마지막이에요. 질문을 하나 뒤집어 볼게요.',
  },
  {
    id: 'savings-goal-2',
    text: '보통 ‘얼마나 모을 수 있을까’를 생각하시잖아요. 그걸 ‘얼마가 필요한가’로 바꿔보는 거예요.',
  },
  {
    id: 'savings-goal-3',
    text: '앞의 질문은 답이 안 나와요. 뒤의 질문은 숫자가 나와요.',
  },
  {
    id: 'savings-goal-4',
    text: '‘10년 뒤에 1억’이라고 정하면, 매달 얼마를 넣어야 하는지가 바로 계산돼요.',
  },
  {
    id: 'savings-goal-5',
    text: '그 숫자를 보면 둘 중 하나예요. 할 만하거나, 목표를 좀 낮춰야 하거나.',
  },
  {
    id: 'savings-goal-6',
    text: '어느 쪽이든 막연한 것보다는 나아요.',
  },
  {
    id: 'savings-goal-7',
    text: '매달 같은 금액을 넣으면 쌀 때는 많이 사고, 비쌀 때는 적게 사게 돼요. 평단이 알아서 관리되는 셈이에요.',
  },
  {
    id: 'savings-goal-8',
    text: '언제 사야 하나 고민하지 않아도 되는 게 제일 커요.',
  },
  {
    id: 'savings-goal-9',
    text: '다만 수익률은 가정이에요. 그대로 된다는 뜻이 아니라, 계획을 세울 기준을 하나 잡아두는 거예요.',
  },
  {
    id: 'savings-goal-10',
    text: '목표를 넣어보시면 매달 얼마인지 나와요. 여기까지 오셨으면 시작 준비는 다 된 거예요.',
  },
];

export const CHOICES: readonly ChoicePoint[] = [
  {
    id: 'savings-goal-choice-1',
    afterLineId: 'savings-goal-2',
    // 둘 다 "앞은 답이 안 나오고 뒤는 숫자가 나온다" 로 답이 된다.
    options: [
      { id: 'savings-goal-choice-1-a', text: '뭐가 달라지는데요?' },
      { id: 'savings-goal-choice-1-b', text: '그게 왜 더 나아요?' },
    ],
  },
  {
    id: 'savings-goal-choice-2',
    afterLineId: 'savings-goal-6',
    // 둘 다 "매달 넣으면 쌀 때 많이 사게 된다" 로 답이 된다.
    options: [
      { id: 'savings-goal-choice-2-a', text: '매달 넣는 게 그렇게 좋아요?' },
      { id: 'savings-goal-choice-2-b', text: '한 번에 넣는 거랑 뭐가 달라요?' },
    ],
  },
];
