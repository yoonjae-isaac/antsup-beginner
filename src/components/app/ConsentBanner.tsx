'use client';

import Link from 'next/link';
import { useEffect, useSyncExternalStore } from 'react';
import { PRIVACY_PATH } from '@/domain/legal/route';

/**
 * 저장 키. 본체(cash-bite)의 `cashbite-consent` 와 일부러 다르게 둔다 —
 * 같은 ants-up.com 을 두 앱이 번갈아 쓰게 되는데, 키를 공유하면 한쪽에서 한 선택이
 * 다른 쪽 배너까지 건너뛰게 만든다.
 */
const CONSENT_KEY = 'antsup-consent';

/** `ask` = 아직 고르지 않음(배너를 띄울 상태). */
type Consent = 'granted' | 'denied' | 'ask';

/**
 * localStorage 를 외부 스토어로 읽는다.
 *
 * effect 안에서 setState 로 저장값을 반영하는 쪽이 짧지만, 그건 마운트 직후
 * 연쇄 렌더를 만들어 lint(react-hooks/set-state-in-effect)가 막는다.
 * useSyncExternalStore 는 서버 스냅샷과 클라이언트 스냅샷을 React 가 직접
 * 갈아 끼우므로 hydration 불일치 경고도 나지 않는다.
 */
const listeners = new Set<() => void>();

/** getSnapshot 은 같은 상태에서 같은 참조를 돌려줘야 해서 값을 캐시한다. */
let cache: Consent | null = null;

function readStored(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    if (v === 'granted' || v === 'denied') return v;
  } catch {
    /* 시크릿 창·저장소 차단 — 매 방문 새로 묻는다. */
  }
  return 'ask';
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): Consent {
  cache ??= readStored();
  return cache;
}

/**
 * 서버에는 localStorage 가 없다. `denied` 로 답해 배너를 서버 HTML 에 넣지 않는다 —
 * `ask` 로 답하면 이미 동의한 사람 화면에서도 배너가 한 번 깜빡였다 사라진다.
 */
function getServerSnapshot(): Consent {
  return 'denied';
}

function persist(value: 'granted' | 'denied'): void {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* 저장에 실패해도 이번 방문의 선택은 그대로 반영한다. */
  }
  cache = value;
  for (const notify of listeners) notify();
}

type Gtag = (...args: unknown[]) => void;

/**
 * consent mode v2 업데이트.
 *
 * `window.gtag` 는 layout 의 인라인 기본값 스크립트가 정의한다. 아직 안 돌았으면
 * 조용히 포기한다 — 기본값이 denied 라 아무것도 안 하는 쪽이 안전하다.
 */
function updateConsent(granted: boolean): void {
  const w = window as unknown as { gtag?: Gtag };
  if (typeof w.gtag !== 'function') return;

  const v = granted ? 'granted' : 'denied';
  w.gtag('consent', 'update', {
    ad_storage: v,
    ad_user_data: v,
    ad_personalization: v,
    analytics_storage: v,
  });
}

/**
 * 쿠키·광고 동의 배너(경량 CMP).
 *
 * 최초 방문에만 뜨고, 선택은 localStorage 에 남겨 재방문 때 자동으로 적용한다.
 * GA·AdSense 정책 요건이라 GTM 을 켜는 이상 같이 있어야 한다.
 */
export default function ConsentBanner() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (consent === 'ask') return;
    updateConsent(consent === 'granted');
  }, [consent]);

  if (consent !== 'ask') return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-3 md:p-4">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-3 rounded-2xl border border-cb-border bg-cb-surface p-4 shadow-lg sm:flex-row sm:items-center">
        <p className="flex-1 text-xs leading-relaxed text-cb-muted md:text-sm">
          이 사이트는 방문 분석과 광고를 위해 쿠키를 사용합니다. 자세한 내용은{' '}
          <Link href={PRIVACY_PATH} className="text-cb-point hover:underline">
            개인정보처리방침
          </Link>
          을 참고하세요.
        </p>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => persist('denied')}
            className="rounded-lg border border-cb-border px-4 py-2 text-xs font-semibold text-cb-muted transition-colors hover:text-cb-foreground"
          >
            거부
          </button>
          <button
            type="button"
            onClick={() => persist('granted')}
            className="rounded-lg bg-cb-point px-4 py-2 text-xs font-bold text-cb-on-point transition-colors hover:bg-cb-point-hover"
          >
            동의
          </button>
        </div>
      </div>
    </div>
  );
}
