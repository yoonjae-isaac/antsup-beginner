'use client';

import CalcField from '@/components/calc/CalcField';
import CalcShell, { CalcAside, CalcNote, CalcResult } from '@/components/calc/CalcShell';
import { readAll, useNumberField } from '@/components/calc/numberField';
import { DEFAULTS, monthlyForGoal } from '@/domain/calc/formulas';
import { exactWon, loose, roughWon, wonHint } from '@/domain/calc/format';

const TITLE = '목표 적립 계산기';
const LEAD = '모으고 싶은 돈과 기간을 넣으면, 매달 얼마씩 넣어야 하는지 거꾸로 나와요.';

export default function SavingsGoalCalc() {
  const target = useNumberField(100000000);
  const years = useNumberField(10);
  const ratePct = useNumberField(DEFAULTS.annualRatePct);

  const values = readAll([target, years, ratePct]);
  const monthly = values === null ? null : monthlyForGoal(values[0], values[1], values[2]);

  return (
    <CalcShell
      fields={
        <>
          <CalcField
            field={target}
            hint={wonHint(target.value)}
            label="모으고 싶은 돈"
            unit="원"
          />
          <CalcField decimal field={years} label="기간" unit="년" />
          <CalcField decimal field={ratePct} label="연 수익률 (가정)" unit="%" />
        </>
      }
      lead={LEAD}
      result={
        monthly === null || values === null ? null : (
          <CalcResult label="매달 넣어야 할 돈" value={exactWon(monthly)}>
            <CalcAside>
              <span>
                직접 넣는 돈{' '}
                <b className="font-mono text-cb-foreground">{roughWon(paidIn(monthly, values[1]))}</b>
              </span>
              <span>
                불어나는 몫{' '}
                <b className="font-mono text-cb-foreground">
                  {roughWon(Math.max(0, values[0] - paidIn(monthly, values[1])))}
                </b>
              </span>
            </CalcAside>

            <CalcNote>{noteFor(values[1], values[2])}</CalcNote>
          </CalcResult>
        )
      }
      title={TITLE}
    />
  );
}

/** 기간 동안 내 주머니에서 실제로 나가는 돈. 나머지는 불어난 몫이다. */
function paidIn(monthly: number, years: number): number {
  return monthly * Math.round(years * 12);
}

/**
 * 기간을 바꿔 보게 미는 문장.
 *
 * 이 계산기의 첫 결과는 대개 '생각보다 큰 금액'이고, 거기서 그만두면 목표만 포기한다.
 * 기간을 늘리는 쪽이 매달 부담을 가장 크게 줄인다는 걸 알려주는 게 이 줄의 일이다.
 */
function noteFor(years: number, ratePct: number): string {
  const base = `수익률 ${loose(ratePct)}%는 가정이에요. 그대로 된다는 뜻이 아니라 계획을 세울 기준을 하나 잡아둔 거예요.`;

  if (years < 20) {
    return `${base} 금액이 부담되면 기간부터 늘려 보세요 — 수익률을 올리는 것보다 확실하고, 제가 정할 수 있는 쪽이에요.`;
  }

  return base;
}
