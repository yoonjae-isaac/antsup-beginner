import type { ChoicePoint, JumiLine } from '../types';

/**
 * 주제 5 — 사기 전에 뭘 봐야 해요? (첫 매수 전 5가지 질문)
 *
 * 원본: beginner-onboarding 패키지 `steps.checklist` 의 5개 질문.
 * 설명문을 주미 대화체로 옮기면서, 4번(분할매수)에는 원본 `buyWhat.autoInvest.caution`
 * 의 경고를 붙였다 — '나눠 사면 손해를 안 본다'는 오해가 실제로 가장 흔하다.
 */
export const LINES: readonly JumiLine[] = [
  {
    id: 'before-1',
    text: '사고 싶은 게 생기셨어요? 그럼 사기 전에 딱 다섯 가지만 스스로한테 물어봐요. 여기서 막히면 아직 살 때가 아니에요.',
  },
  {
    id: 'before-2',
    text: '첫째, 이 돈 없어도 괜찮아요? 당장 생활에 문제 없는 여윳돈인지부터요. 빌린 돈이나 곧 써야 할 돈은 안 돼요.',
  },
  {
    id: 'before-3',
    text: '둘째, 왜 사려고 하세요? ‘남이 사길래’, ‘뉴스에서 봤으니까’가 이유라면 그건 위험 신호예요.',
  },
  {
    id: 'before-4',
    text: '저도 그랬어요. 그래서 더 말씀드리는 거예요. 남을 따라 산 건 값이 흔들릴 때 버틸 근거가 하나도 없거든요.',
  },
  {
    id: 'before-5',
    text: '셋째, 얼마까지 잃으면 인정할 수 있어요? 이건 꼭 사기 전에, 마음이 차분할 때 정해두세요. 떨어지고 나서 정하려고 하면 못 정해요.',
  },
  {
    id: 'before-6',
    text: '넷째, 한 번에 다 넣을 거예요, 나눠서 넣을 거예요? 나눠 사면 하필 제일 비싼 날 전부 넣어버리는 실수가 줄어요.',
  },
  {
    id: 'before-7',
    text: '나눠 사는 게 손해를 막아주진 않아요. 값이 계속 내려가면 나눠 사도 손해예요. 다만 ‘지금 살까 말까’를 매번 고민하는 스트레스가 줄어드는 거예요.',
  },
  {
    id: 'before-8',
    text: '마지막 다섯째, 이 회사가 뭐 하는 곳인지 한 줄로 설명할 수 있어요? 못 하겠으면 아직이에요. 모르는 것에 돈을 넣는 거니까요.',
  },
];

export const CHOICES: readonly ChoicePoint[] = [
  {
    id: 'before-choice-1',
    afterLineId: 'before-3',
    // 둘 다 "저도 그랬어요 — 따라 산 건 버틸 근거가 없다" 로 답이 된다.
    options: [
      { id: 'before-choice-1-a', text: '다들 그렇게 시작하지 않나요?' },
      { id: 'before-choice-1-b', text: '저도 그래서 샀던 것 같아요…' },
    ],
  },
  {
    id: 'before-choice-2',
    afterLineId: 'before-6',
    // 둘 다 "나눠 사도 손해는 난다, 줄어드는 건 스트레스" 로 답이 된다.
    options: [
      { id: 'before-choice-2-a', text: '나눠 사면 손해를 안 보나요?' },
      { id: 'before-choice-2-b', text: '그럼 무조건 나눠 사는 게 나아요?' },
    ],
  },
];
