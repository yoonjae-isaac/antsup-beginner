import type { ChoicePoint, JumiLine } from '../types';

/**
 * 주제 12 — 내렸을 때 더 사도 될까요? (2부 ①)
 *
 * 원본: cash-bite `src/domain/learn/articles.ts` 의 `averaging-down-up`.
 * 원본이 못박은 것 중 빠뜨리면 안 되는 것 —
 * (1) 물타기는 '싸져서'가 아니라 '여전히 괜찮아서' 하는 것이다,
 * (2) 평단이 내려간 만큼 그 종목에 실린 돈은 늘어난다,
 * (3) 불타기는 평단이 올라가지만 손해가 아니며, 대신 손절선 관리가 더 중요해진다.
 * '평단이 내려가니까 이득'으로 읽히면 이 레슨은 실패한 것이다.
 */
export const LINES: readonly JumiLine[] = [
  {
    id: 'averaging-1',
    text: '‘물타기’라는 말 들어보셨어요? 사둔 주식이 내렸을 때 더 사는 걸 그렇게 불러요.',
  },
  {
    id: 'averaging-2',
    text: '더 사면 제가 산 평균 가격, 그러니까 평단이 내려가요. 10만원에 10주를 샀는데 8만원에 10주를 더 사면 평단이 9만원이 되는 식이에요.',
  },
  {
    id: 'averaging-3',
    text: '평단만 보면 그래요. 그런데 같이 늘어난 게 하나 더 있어요. 이 회사에 들어간 제 돈이요.',
  },
  {
    id: 'averaging-4',
    text: '100만원이던 게 180만원이 됐잖아요. 여기서 더 떨어지면 잃는 돈도 그만큼 커져요.',
  },
  {
    id: 'averaging-5',
    text: '그래서 물타기는 ‘싸져서’ 하는 게 아니라, ‘그래도 여전히 괜찮은 회사라서’ 하는 거예요.',
  },
  {
    id: 'averaging-6',
    text: '구분하는 방법이 하나 있어요. 이 회사를 오늘 처음 봤다고 쳐볼게요. 그래도 사고 싶으세요? 아니라면 더 살 이유도 없는 거예요.',
  },
  {
    id: 'averaging-7',
    text: '네, 그건 ‘불타기’라고 불러요. 오른 값에 더 사니까 평단은 올라가요.',
  },
  {
    id: 'averaging-8',
    text: '대신 잘 가고 있는 쪽에 무게를 더 싣는 거예요. 평단이 올라간다고 손해가 난 건 아니에요.',
  },
  {
    id: 'averaging-9',
    text: '다만 이미 오른 가격에 사는 거라, 어디서 멈출지를 더 분명히 정해두셔야 해요.',
  },
  {
    id: 'averaging-10',
    text: '어느 쪽이든 누르기 전에 두 가지만 정하고 가요. 이 종목에 얼마까지 넣을지, 그리고 틀렸을 때 어디서 접을지.',
  },
  {
    id: 'averaging-11',
    text: '말로만 들으면 잘 안 와닿아요. 직접 숫자를 넣어보실래요?',
  },
];

export const CHOICES: readonly ChoicePoint[] = [
  {
    id: 'averaging-choice-1',
    afterLineId: 'averaging-2',
    // 둘 다 "평단은 내려가지만 실린 돈은 늘어난다" 로 답이 된다.
    options: [
      { id: 'averaging-choice-1-a', text: '그럼 좋은 거 아니에요?' },
      { id: 'averaging-choice-1-b', text: '평단이 내려가면 이득이잖아요?' },
    ],
  },
  {
    id: 'averaging-choice-2',
    afterLineId: 'averaging-6',
    // 둘 다 "그건 불타기" 로 답이 된다.
    options: [
      { id: 'averaging-choice-2-a', text: '오를 때 더 사는 것도 있어요?' },
      { id: 'averaging-choice-2-b', text: '그럼 올랐을 때는요?' },
    ],
  },
];
