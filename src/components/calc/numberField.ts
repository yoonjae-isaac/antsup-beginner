'use client';

import { useState } from 'react';

export interface NumberField {
  /** 사용자가 친 그대로. 지우는 중('', '1.')에도 그대로 둬야 입력이 튀지 않는다. */
  raw: string;
  /** 숫자로 읽은 값. 비었거나 숫자가 아니면 null. */
  value: number | null;
  set: (next: string) => void;
}

/**
 * 콤마·공백을 걷어내고 숫자로 읽는다. 읽을 수 없으면 null.
 *
 * 음수를 거르는 이유는 이 계산기들이 전부 수량·가격·비율이기 때문이다 —
 * 마이너스가 들어오면 식은 돌지만 결과가 말이 안 된다.
 */
function parseNumber(raw: string): number | null {
  const cleaned = raw.replace(/[,\s]/g, '');
  if (cleaned === '') return null;

  const value = Number(cleaned);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

/**
 * 계산기 입력칸 하나의 상태.
 *
 * 값을 숫자가 아니라 **문자열로** 들고 있는 게 요점이다. 숫자로 들고 있으면
 * 칸을 다 지웠을 때 0 이 되어버려서, 지우고 새로 치려던 사람이 매번 0 을 먼저
 * 지워야 한다. 빈 칸은 빈 칸으로 두고, 결과 쪽에서 '아직 없음'으로 다룬다.
 */
export function useNumberField(initial: number): NumberField {
  const [raw, setRaw] = useState(String(initial));

  return { raw, value: parseNumber(raw), set: setRaw };
}

/**
 * 모든 칸이 채워졌을 때만 값을 돌려준다.
 *
 * 빈 칸을 0 으로 치면 엉뚱한 답이 자신 있게 뜬다 — 수량이 0 인데 평단이 나오는 식이다.
 * 한 칸이라도 비면 화면은 결과 대신 안내를 보여줘야 한다.
 */
export function readAll(fields: readonly NumberField[]): number[] | null {
  const values: number[] = [];

  for (const field of fields) {
    if (field.value === null) return null;
    values.push(field.value);
  }

  return values;
}
