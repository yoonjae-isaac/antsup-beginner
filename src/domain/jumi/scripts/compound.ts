import type { ChoicePoint, JumiLine } from '../types';

/**
 * 주제 15 — 시간이 돈이 된다는 게 뭐예요? (2부 ④)
 *
 * 원본: cash-bite `src/domain/learn/articles.ts` 의 `compound-and-rule-of-72`.
 * 원본의 뼈대 —
 * (1) 복리는 지난 수익에도 다시 수익이 붙는 구조라 뒤로 갈수록 곡선이 가팔라진다,
 * (2) 72 ÷ 연 수익률 ≒ 자산이 두 배 되는 햇수,
 * (3) 최대 변수는 수익률이 아니라 **시간**이다.
 *
 * 수익률 숫자는 예시로만 쓰고 약속처럼 쓰지 않는다 — 7%는 계산의 출발점이지
 * 받게 될 값이 아니다.
 */
export const LINES: readonly JumiLine[] = [
  {
    id: 'compound-1',
    text: '투자 얘기에서 ‘복리’라는 말 많이 들으셨죠. 이자에 또 이자가 붙는 거예요.',
  },
  {
    id: 'compound-2',
    text: '100만원이 한 해 7% 늘면 107만원이 되잖아요. 다음 해에는 100만원이 아니라 107만원에 7%가 붙어요.',
  },
  {
    id: 'compound-3',
    text: '1년만 보면 몇만원이에요. 그런데 10년, 20년이 되면 이야기가 달라져요.',
  },
  {
    id: 'compound-4',
    text: '재미있는 셈법이 하나 있어요. 72를 수익률로 나누면 돈이 두 배 되는 햇수가 대충 나와요.',
  },
  {
    id: 'compound-5',
    text: '연 7%면 72 ÷ 7이니까 약 10년이에요. 6%면 12년이고요.',
  },
  {
    id: 'compound-6',
    text: '1%포인트 차이가 2년을 당기는 거예요.',
  },
  {
    id: 'compound-7',
    text: '그게 함정이에요. 수익률은 제 마음대로 되는 게 아니거든요.',
  },
  {
    id: 'compound-8',
    text: '대신 기간은 제가 정할 수 있어요. 복리에서 제일 센 건 사실 수익률이 아니라 시간이에요.',
  },
  {
    id: 'compound-9',
    text: '일찍 시작해서 오래 두는 것. 재미없지만 이게 제일 확실해요.',
  },
  {
    id: 'compound-10',
    text: '기간이랑 수익률을 바꿔보시면, 넣은 돈보다 불어난 돈이 언제부터 커지는지 보이실 거예요.',
  },
];

export const CHOICES: readonly ChoicePoint[] = [
  {
    id: 'compound-choice-1',
    afterLineId: 'compound-2',
    // 둘 다 "1년은 작지만 10년, 20년은 다르다" 로 답이 된다.
    options: [
      { id: 'compound-choice-1-a', text: '그게 그렇게 큰가요?' },
      { id: 'compound-choice-1-b', text: '1년에 몇만원 차이 아니에요?' },
    ],
  },
  {
    id: 'compound-choice-2',
    afterLineId: 'compound-6',
    // 둘 다 "수익률은 내 마음대로 안 된다, 기간이 내 몫이다" 로 답이 된다.
    options: [
      { id: 'compound-choice-2-a', text: '그럼 수익률이 제일 중요하네요?' },
      { id: 'compound-choice-2-b', text: '높은 수익률을 찾아야겠어요.' },
    ],
  },
];
