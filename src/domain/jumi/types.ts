/**
 * 주미 콘텐츠의 타입 정의.
 *
 * 콘텐츠는 세 갈래로 나눠 관리한다 — 각각 바뀌는 이유가 다르기 때문이다.
 *   - 그림     : artwork.ts      (일러스트 교체)
 *   - 주미 대사 : jumiScript.ts   (설명 문구 수정)
 *   - 선택지 대사: choiceScript.ts (사용자 리액션 추가·삭제)
 */

/** 말풍선 화자. 색·정렬로 구분하는 유일한 기준. */
export type Speaker = 'jumi' | 'user';

/** 주미 그림 레지스트리 키 — 장면별로 다른 그림을 쓰기 위한 식별자. */
export type JumiArtKey = 'greeting' | 'explaining';

export interface JumiArt {
  key: JumiArtKey;
  /** 실제 그림이 준비되기 전까지 원형 안에 표시할 플레이스홀더. */
  placeholderEmoji: string;
  /** 실제 그림 경로(public 기준). 준비되면 여기만 채우면 된다. */
  src: string | null;
  /** 이미지 대체 텍스트 겸 스크린리더 설명. 플레이스홀더 상태에서도 쓰인다. */
  alt: string;
}

/**
 * 트랙 = 분기. 성향처럼 '고른 사람에게만 보여야 하는' 대사를 가를 때만 쓴다.
 * 대부분의 레슨은 트랙 없이 합류 방식이고, 그게 기본이다.
 */
export type TrackId = 'trader' | 'value';

/** 주미가 하는 말 한 마디 = 말풍선 하나. */
export interface JumiLine {
  id: string;
  text: string;
  /** 이 트랙을 고른 사람에게만 보인다. 없으면 모두에게 보인다. */
  track?: TrackId;
}

/** 선택지 한 개. 고르면 그대로 사용자 말풍선이 된다. */
export interface ChoiceOption {
  id: string;
  text: string;
  /** 고르면 이 트랙이 켜지고, 이후 같은 트랙의 대사만 보인다. */
  track?: TrackId;
}

/**
 * 선택지 지점 — afterLineId 대사 뒤에서 대화가 멈추고 options 가 제시된다.
 *
 * 어느 걸 골라도 다음 묶음은 같다(합류). 그래서 분기 데이터가 없고,
 * 대신 **모든 option 이 다음 묶음 첫 대사로 답이 되어야 한다**는 제약이 생긴다.
 */
export interface ChoicePoint {
  id: string;
  afterLineId: JumiLine['id'];
  options: readonly ChoiceOption[];
}

/**
 * 선택지로 끊긴 대화 한 묶음. buildDialogueSegments 의 산출물.
 * 마지막 묶음에는 choice 가 없다(누를 게 있으면 이어질 내용도 있어야 한다).
 */
export interface DialogueSegment {
  lines: readonly JumiLine[];
  choice?: ChoicePoint;
}
