'use client';

import CalcField from '@/components/calc/CalcField';
import CalcShell, { CalcAside, CalcNote, CalcResult } from '@/components/calc/CalcShell';
import SplitBar from '@/components/calc/SplitBar';
import { readAll, useNumberField } from '@/components/calc/numberField';
import { DEFAULTS, compound, yearsToDouble } from '@/domain/calc/formulas';
import { decimal, loose, roughWon, wonHint } from '@/domain/calc/format';

const TITLE = '복리 계산기';
const LEAD = '지금 있는 돈에 매달 얼마씩 더하면 몇 년 뒤에 얼마가 되는지 봐요.';

/**
 * 복리 + 72법칙.
 *
 * 원본(cash-bite `compound`)과 식은 같다. 다른 건 72법칙을 같은 카드에 붙였다는 점이다 —
 * 원본은 `rule72` 를 별도 계산기로 뒀는데, 레슨에서 둘은 한 이야기라 따로 두면
 * '그래서 두 배까지 몇 년인데' 를 확인하러 다른 화면으로 가야 한다.
 */
export default function CompoundCalc() {
  const initial = useNumberField(10000000);
  const monthly = useNumberField(500000);
  const ratePct = useNumberField(DEFAULTS.annualRatePct);
  const years = useNumberField(10);

  const values = readAll([initial, monthly, ratePct, years]);
  const result = values === null ? null : compound(values[0], values[1], values[2], values[3]);
  const double = values === null ? 0 : yearsToDouble(values[2]);

  return (
    <CalcShell
      fields={
        <>
          <CalcField
            field={initial}
            hint={wonHint(initial.value)}
            label="지금 있는 돈"
            unit="원"
          />
          <CalcField
            field={monthly}
            hint={wonHint(monthly.value)}
            label="매달 넣을 돈"
            unit="원"
          />
          <CalcField decimal field={ratePct} label="연 수익률 (가정)" unit="%" />
          <CalcField decimal field={years} label="기간" unit="년" />
        </>
      }
      lead={LEAD}
      result={
        result === null || values === null ? null : (
          <CalcResult label={`${loose(values[3])}년 뒤`} value={roughWon(result.finalAmount)}>
            <SplitBar
              left={{ label: `넣은 돈 ${roughWon(result.contributed)}`, amount: result.contributed }}
              right={{ label: `불어난 돈 ${roughWon(result.gain)}`, amount: Math.max(0, result.gain) }}
            />

            <CalcAside>
              <span>
                72 ÷ {loose(values[2])} ={' '}
                <b className="font-mono text-cb-foreground">
                  {double > 0 ? `약 ${decimal(double)}년` : '-'}
                </b>
                이면 두 배가 돼요
              </span>
            </CalcAside>

            <CalcNote>
              기간을 늘려 보세요. 넣은 돈은 일정하게 느는데 불어난 돈은 뒤로 갈수록 빨라져요.
              복리에서 제일 센 게 수익률이 아니라 시간이라는 게 이 뜻이에요.
            </CalcNote>
          </CalcResult>
        )
      }
      title={TITLE}
    />
  );
}
