'use client';

import { useId } from 'react';
import type { NumberField } from '@/components/calc/numberField';

interface CalcFieldProps {
  label: string;
  /** 입력칸 안 오른쪽에 붙는 단위. 값과 같은 줄에 없으면 무슨 수인지 안 읽힌다. */
  unit: string;
  field: NumberField;
  /** 값을 사람 말로 되읽어 준다('10만원'). null 이면 줄 자체를 그리지 않는다. */
  hint?: string | null;
  /** %·년처럼 소수점이 필요한 칸. 휴대폰 키패드에 점이 뜨게 한다. */
  decimal?: boolean;
}

/**
 * 계산기 입력칸 하나.
 *
 * cash-bite 의 계산기와 다른 점이 셋이다 —
 * (1) `type="number"` 를 쓰지 않는다. 스피너가 붙고 콤마가 섞이면 값을 통째로 버린다.
 *     대신 text + inputMode 로 두고 읽는 쪽에서 콤마를 걷어낸다.
 * (2) `inputMode` 를 준다. 휴대폰에서 숫자 키패드가 바로 뜬다 — 주린이는 대부분
 *     휴대폰으로 보고, 금액 입력에서 자판을 바꾸다가 그만둔다.
 * (3) 아래에 되읽기 줄을 둔다. 여기서 제일 많이 나는 실수가 식이 아니라 자릿수라,
 *     '100000' 을 '10만원' 으로 되읽어 주는 게 결과보다 먼저 필요하다.
 */
export default function CalcField({ label, unit, field, hint, decimal }: CalcFieldProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12.5px] leading-snug font-bold text-cb-muted" htmlFor={id}>
        {label}
      </label>

      <div className="flex items-center gap-2 rounded-xl border border-cb-border-strong bg-cb-bg px-3 focus-within:border-cb-point">
        <input
          className="min-w-0 grow bg-transparent py-3 text-right font-mono text-[15px] font-bold tabular-nums text-cb-foreground outline-none"
          id={id}
          inputMode={decimal === true ? 'decimal' : 'numeric'}
          onChange={(event) => field.set(event.target.value)}
          type="text"
          value={field.raw}
        />
        <span className="shrink-0 text-xs text-cb-muted">{unit}</span>
      </div>

      {hint !== null && hint !== undefined && (
        <p className="text-right text-[11px] text-cb-muted">= {hint}</p>
      )}
    </div>
  );
}
