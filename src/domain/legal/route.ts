/** 정책 문서 경로. 사이트맵·푸터·동의 배너가 같은 값을 본다. */
export const PRIVACY_PATH = '/privacy';

/**
 * 이용약관이 `/terms` 가 **아닌** 이유: 레슨 slug 에 이미 `terms`('주식 용어 10개')가 있다.
 *
 * 레슨은 `app/[slug]` 가 받는데 Next 는 정적 세그먼트를 동적보다 먼저 매칭하므로,
 * `app/terms/` 를 두면 레슨이 통째로 가려지고 사이트맵에도 같은 URL 이 두 번 실린다
 * (2026-10-02 실제로 그렇게 났다). 본체(cash-bite)와 경로가 어긋나지만 레슨이 먼저다.
 */
export const TERMS_PATH = '/terms-of-service';
