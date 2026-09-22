import type { ChoicePoint, JumiLine } from '../types';

/**
 * 주제 13 — 언제 팔아야 해요? (2부 ②)
 *
 * 원본: cash-bite `src/domain/learn/articles.ts` 의 `stop-loss-and-risk-reward`.
 * 원본의 뼈대 —
 * (1) 손절가는 살 때 같이 정한다(오른 다음에 정하면 감정이 정한다),
 * (2) 손익비 = 익절 폭 ÷ 손절 폭. 1 보다 크면 승률이 절반이 안 돼도 살아남는다,
 * (3) 한 매매에 계좌의 몇 %까지 잃을지를 정하면 살 금액이 역산된다.
 * '많이 맞히는 게 중요하다'로 읽히면 이 레슨은 실패한 것이다.
 */
export const LINES: readonly JumiLine[] = [
  {
    id: 'stop-loss-1',
    text: '사고 나서 제일 많이 받는 질문이 이거예요. “언제 팔아요?”',
  },
  {
    id: 'stop-loss-2',
    text: '답부터 드리면, 그건 사기 전에 정하는 거예요.',
  },
  {
    id: 'stop-loss-3',
    text: '오르거나 내린 다음에 정하려고 하면 늦어요. 그때는 숫자가 아니라 기분이 정하거든요.',
  },
  {
    id: 'stop-loss-4',
    text: '두 개만 정하면 돼요. ‘여기까지 내려가면 판다’, 그리고 ‘여기까지 오르면 챙긴다’.',
  },
  {
    id: 'stop-loss-5',
    text: '앞의 걸 손절, 뒤의 걸 익절이라고 불러요.',
  },
  {
    id: 'stop-loss-6',
    text: '10만원에 샀는데 5% 내려가면 팔고, 15% 오르면 챙긴다고 정했다 쳐볼게요.',
  },
  {
    id: 'stop-loss-7',
    text: '그러면 한 번 맞혔을 때 버는 게, 세 번 틀렸을 때 잃는 거랑 같아요. 이 비율을 손익비라고 해요.',
  },
  {
    id: 'stop-loss-8',
    text: '그게 흔한 오해예요. 많이 맞혀도 한 번에 크게 잃으면 남는 게 없어요.',
  },
  {
    id: 'stop-loss-9',
    text: '반대로 손익비가 크면, 열 번 중 서너 번만 맞혀도 계좌는 늘어나요.',
  },
  {
    id: 'stop-loss-10',
    text: '그래서 승률보다 손익비를 먼저 보셔야 해요.',
  },
  {
    id: 'stop-loss-11',
    text: '하나만 더요. 한 번 매매에 계좌 전체의 몇 %까지 잃어도 되는지도 미리 정해두세요. 그게 정해지면 얼마어치 살지도 따라 나와요.',
  },
  {
    id: 'stop-loss-12',
    text: '숫자로 보면 금방이에요. 넣어보실래요?',
  },
];

export const CHOICES: readonly ChoicePoint[] = [
  {
    id: 'stop-loss-choice-1',
    afterLineId: 'stop-loss-3',
    // 둘 다 "두 개만 정하면 된다" 로 답이 된다.
    options: [
      { id: 'stop-loss-choice-1-a', text: '그래도 미리 어떻게 알아요?' },
      { id: 'stop-loss-choice-1-b', text: '사기 전에 뭘 정해요?' },
    ],
  },
  {
    id: 'stop-loss-choice-2',
    afterLineId: 'stop-loss-7',
    // 둘 다 "많이 맞히는 게 중요한 게 아니다" 로 답이 된다 — 가장 흔한 오해다.
    options: [
      { id: 'stop-loss-choice-2-a', text: '많이 맞히는 게 중요한 거 아니에요?' },
      { id: 'stop-loss-choice-2-b', text: '그 비율이 왜 중요해요?' },
    ],
  },
];
