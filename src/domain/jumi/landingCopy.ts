import type { Speaker } from './types';

/**
 * 대사가 아닌 화면 문구 — 제목·라벨 등.
 * 주미가 '말하는' 것은 jumiScript.ts / choiceScript.ts 가 소유하고,
 * 레슨별 제목은 lessons.ts 가 소유한다.
 */

export const MASCOT_NAME = '주미';
export const MASCOT_ROLE = '주식개미';

export const HERO_HEADING = '주식, 처음이세요?';
export const CTA_LABEL = '다음 이야기 들으러 가기';
export const BACK_TO_HOME = '처음으로';

/** 눌러야 대화가 이어진다는 걸 알려주는 안내. 없으면 멈춘 화면으로 오해한다. */
export const CHOICE_HINT = '답장을 골라 대화를 이어가세요';
export const CHOICE_GROUP_LABEL = '주미에게 할 답장 선택';

export const STEP_RAIL_LABEL = '가이드 단계';

/**
 * 세금·한도·증권사 정보를 다루는 레슨 하단 고지.
 * 대사에서 숫자를 뺐다는 사실만으로는 부족하고, 언제 기준인지가 화면에 남아야 한다.
 */
export const FIGURES_NOTICE =
  '세율·한도·증권사 서비스는 자주 바뀌어서, 여기서는 구조만 설명하고 정확한 숫자는 일부러 적지 않았어요. 실제로 하실 땐 증권사 안내나 국세청에서 최신 기준을 확인해 주세요.';

/**
 * 스크린리더·검색봇에게 화자를 알려주는 라벨.
 * 화면에서는 색과 정렬로만 구분되므로, 그 정보를 텍스트로도 남긴다.
 */
export const SPEAKER_LABEL: Record<Speaker, string> = {
  jumi: MASCOT_NAME,
  user: '나',
};
