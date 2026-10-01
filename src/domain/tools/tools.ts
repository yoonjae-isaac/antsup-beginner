/**
 * 투자 도구 목록.
 *
 * 계산기 자체는 레슨 끝에 붙어 있다 — 방금 읽은 내용을 그 자리에서 숫자로
 * 확인하는 게 원래 목적이기 때문이다. 이 페이지는 그 반대 경우를 위한 자리다:
 * 설명은 이미 읽었고 계산만 다시 하고 싶을 때, 레슨 열여섯 개를 뒤지게 둘 수 없다.
 *
 * 목록을 손으로 적지 않고 LESSONS 에서 끌어오는 게 요점이다. 계산기가 붙은
 * 레슨이 늘거나 순서가 바뀌면 여기도 따라온다 — 두 벌을 두면 반드시 어긋난다.
 */

import type { CalcKey } from '@/domain/calc/keys';
import { LESSONS } from '@/domain/jumi/lessons';

export interface Tool {
  calc: CalcKey;
  /** 도구 이름. 계산기 카드 안의 제목과 같은 말을 쓴다. */
  name: string;
  /** 이 도구가 답해 주는 질문 한 줄. 이름만으로는 뭘 하는지 모른다. */
  question: string;
  /** 이 계산기가 나온 레슨. 설명이 필요하면 그쪽으로 보낸다. */
  slug: string;
  /** 그 레슨의 제목. '설명 읽으러 가기'가 어디로 가는지 미리 알려 준다. */
  lessonHeading: string;
}

/**
 * Record 로 적어 둔다 — CalcKey 가 늘면 여기서 타입 에러가 난다.
 * 목록에서 조용히 빠지는 것보다 빌드가 멈추는 편이 낫다.
 */
const TOOL_NAME: Record<CalcKey, string> = {
  averaging: '평단 계산기',
  'stop-target': '손절·목표가 계산기',
  dividend: '배당 계산기',
  decay: '변동성 끌림 계산기',
  compound: '복리 계산기',
  'savings-goal': '목표 금액 계산기',
};

const TOOL_QUESTION: Record<CalcKey, string> = {
  averaging: '더 사면 평단이 얼마가 되나요?',
  'stop-target': '어디서 자르고 어디서 챙기나요?',
  dividend: '세금 떼면 실제로 얼마 들어오나요?',
  decay: '2배 상품은 왜 제자리에 와도 손해인가요?',
  compound: '지금 넣으면 몇 년 뒤 얼마가 되나요?',
  'savings-goal': '목표까지 매달 얼마씩 넣어야 하나요?',
};

export const TOOLS: readonly Tool[] = LESSONS.flatMap((lesson) =>
  lesson.calc === undefined
    ? []
    : [
        {
          calc: lesson.calc,
          name: TOOL_NAME[lesson.calc],
          question: TOOL_QUESTION[lesson.calc],
          slug: lesson.slug,
          lessonHeading: lesson.heading,
        },
      ],
);

/** 처음 열었을 때 펼쳐 둘 도구. 커리큘럼 순서의 첫 번째다. */
export const FIRST_TOOL = TOOLS[0];

export function findTool(calc: CalcKey): Tool | undefined {
  return TOOLS.find((tool) => tool.calc === calc);
}
