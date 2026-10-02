/**
 * Google 태그·광고·소유확인 설정의 단일 소스.
 *
 * 셋 다 환경변수가 없으면 조용히 꺼진다 — 로컬·프리뷰에서 운영 속성에 데이터가
 * 섞이지 않게 하려는 것이고, 값이 비어도 빌드와 화면은 그대로 돌아간다.
 *
 * `process.env.NEXT_PUBLIC_*` 는 빌드 시점에 문자열로 치환되므로 반드시
 * 이렇게 전체 이름을 적어야 한다. 동적 접근(`process.env[key]`)은 치환되지 않는다.
 */

/** Google Tag Manager 컨테이너 ID (GTM-XXXXXXX). GA4 는 이 컨테이너 안에서 설정한다. */
export const GTM_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_KEY?.trim() || '';

/** AdSense 퍼블리셔 ID (ca-pub-...). 승인 전에는 비워 둔다. */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || '';

/**
 * Search Console 소유확인 메타 태그 값.
 *
 * ants-up.com 은 **도메인 속성**(DNS TXT)으로 등록되어 있어 이 값이 필요 없다.
 * 서브도메인을 URL 접두어 속성으로 따로 등록할 때만 쓰려고 자리를 남겨 둔다.
 */
export const GOOGLE_SITE_VERIFICATION =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() || '';

/**
 * consent mode v2 기본값 — 전부 denied 로 시작한다.
 *
 * GTM 스니펫보다 **먼저** 실행되어야 한다. 순서가 뒤집히면 동의 배너를 띄우기도 전에
 * 쿠키가 깔린다. `<head>` 안에서 인라인 `<script>` 로 넣는 이유도 그것이다
 * (next/script 는 실행 시점을 보장해 주지 않는다).
 *
 * `wait_for_update:500` 은 저장된 동의값을 읽어 update 를 보낼 때까지 태그가
 * 0.5초 기다리게 한다. 없으면 재방문자가 매번 denied 로 한 번 집계된다.
 */
export const CONSENT_INIT_SCRIPT =
  `window.dataLayer=window.dataLayer||[];` +
  `function gtag(){dataLayer.push(arguments);}` +
  `gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',` +
  `ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});`;

/** GTM 컨테이너 로더. GTM_ID 가 있을 때만 삽입한다. */
export function gtmScript(id: string): string {
  return (
    `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});` +
    `var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';` +
    `j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;` +
    `f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${id}');`
  );
}

/**
 * 이번 이벤트가 쓰지 않는 파라미터를 비우기 위한 키 목록.
 *
 * dataLayer 는 push 한 값을 계속 들고 있어서, 비우지 않으면 GTM 변수가 이전 값을
 * 그대로 읽어 다음 이벤트에 섞여 나간다. 새 파라미터를 쓰는 이벤트를 추가하면
 * 여기에도 키를 넣어야 한다.
 *
 * 지금은 보내는 커스텀 이벤트가 없어 비어 있다.
 */
const TRACKED_PARAM_KEYS: readonly string[] = [];

/**
 * GTM dataLayer 로 커스텀 이벤트를 보낸다.
 *
 * **page_view 는 여기서 보내지 않는다** — GA4 향상된 측정이 단독으로 담당한다.
 * 직접 push 하면 모든 페이지뷰가 2배로 집계된다.
 *
 * `currency` 는 GA4 예약어라 맞춤 측정기준으로 등록할 수 없다. 통화를 보내야 하면
 * `display_currency` 같은 다른 이름을 쓴다.
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;

  const payload: Record<string, unknown> = { event: name, ...params };
  for (const key of TRACKED_PARAM_KEYS) {
    if (!(key in payload)) payload[key] = undefined;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}
