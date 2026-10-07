'use client';

import { useSyncExternalStore } from 'react';
import { MAX_MY_STOCKS, type MyStock } from './types';

/**
 * 담아 둔 종목 저장 키.
 *
 * 본체(cash-bite)의 포트폴리오 키와 섞이지 않게 접두사를 따로 둔다 — 같은 ants-up.com 을
 * 두 앱이 번갈아 쓰게 되는데, 저쪽은 수량·평단까지 들고 있어 모양 자체가 다르다.
 * v1 을 붙여 둔 건 나중에 모양이 바뀌면 옛 값을 읽지 않고 버리기 위해서다.
 */
const STORAGE_KEY = 'antsup-my-stocks-v1';

const listeners = new Set<() => void>();

/**
 * getSnapshot 은 상태가 같으면 같은 참조를 줘야 한다 — 매번 새 배열을 만들면
 * React 가 끝없이 다시 그린다. 그래서 파싱 결과를 들고 있다가 바뀔 때만 갈아 끼운다.
 */
let cache: MyStock[] | null = null;

/** 서버에는 브라우저 저장소가 없다. 빈 목록으로 그리고, 마운트 뒤 React 가 바꿔 끼운다. */
const EMPTY: MyStock[] = [];

function isMyStock(value: unknown): value is MyStock {
  if (value === null || typeof value !== 'object') return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.code === 'string' && typeof row.name === 'string' && typeof row.market === 'string'
  );
}

function readStored(): MyStock[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;

    // 한 줄이 깨져 있다고 전부 버리지 않는다 — 읽히는 것만 살린다.
    const rows = parsed.filter(isMyStock).slice(0, MAX_MY_STOCKS);
    return rows.length > 0 ? rows : EMPTY;
  } catch {
    // 사생활 보호 모드·저장소 차단에서는 접근 자체가 던진다.
    return EMPTY;
  }
}

function emit(): void {
  for (const listener of listeners) listener();
}

function write(rows: MyStock[]): void {
  cache = rows;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
  } catch {
    // 저장이 막혀도 이번 세션 동안은 화면이 돌아가게 둔다.
  }
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  // 다른 탭에서 담거나 뺀 것도 따라간다. 같은 사람이 탭 두 개를 열어 두는 일은 흔하다.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return;
    cache = null;
    emit();
  };
  window.addEventListener('storage', onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

function getSnapshot(): MyStock[] {
  cache ??= readStored();
  return cache;
}

function getServerSnapshot(): MyStock[] {
  return EMPTY;
}

/** 담아 둔 종목. 서버 렌더와 첫 페인트에서는 빈 배열이고, 마운트 직후 실제 값으로 바뀐다. */
export function useMyStocks(): MyStock[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * 담기. 이미 있으면 아무 일도 하지 않고, 꽉 찼으면 false 를 돌려준다 —
 * 조용히 버리면 눌렀는데 아무 반응이 없는 화면이 된다.
 */
export function addMyStock(stock: MyStock): boolean {
  const rows = getSnapshot();
  if (rows.some((row) => row.code === stock.code)) return true;
  if (rows.length >= MAX_MY_STOCKS) return false;

  write([...rows, stock]);
  return true;
}

export function removeMyStock(code: string): void {
  const rows = getSnapshot();
  const next = rows.filter((row) => row.code !== code);
  if (next.length !== rows.length) write(next);
}
