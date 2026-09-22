'use client';

import CalcField from '@/components/calc/CalcField';
import CalcShell, { CalcAside, CalcNote, CalcResult } from '@/components/calc/CalcShell';
import SplitBar from '@/components/calc/SplitBar';
import { readAll, useNumberField } from '@/components/calc/numberField';
import { averaging } from '@/domain/calc/formulas';
import { decimal, exactWon, manWon, shares, wonHint } from '@/domain/calc/format';

const TITLE = '평단 계산기';
const LEAD = '더 산 뒤에 평단이 얼마가 되는지, 그리고 이 종목에 돈이 얼마나 실리는지 같이 봐요.';

/**
 * 물타기·불타기 뒤의 평단.
 *
 * 원본(cash-bite `averaging` 도구)은 새 평단·총 수량·총 투자금 셋을 나란히 보여준다.
 * 여기서는 **들어간 돈이 몇 배가 되는지**를 한 줄로 덧붙인다. 레슨이 말하려는 게
 * 평단이 아니라 그쪽이기 때문이다 — 평단만 보면 물타기는 언제나 이득으로 보인다.
 */
export default function AveragingCalc() {
  const holdingQty = useNumberField(10);
  const avgPrice = useNumberField(100000);
  const addQty = useNumberField(10);
  const addPrice = useNumberField(80000);

  const values = readAll([holdingQty, avgPrice, addQty, addPrice]);
  const result = values === null ? null : averaging(values[0], values[1], values[2], values[3]);

  return (
    <CalcShell
      fields={
        <>
          <CalcField field={holdingQty} label="지금 갖고 있는 수량" unit="주" />
          <CalcField
            field={avgPrice}
            hint={wonHint(avgPrice.value)}
            label="지금 평단"
            unit="원"
          />
          <CalcField field={addQty} label="더 살 수량" unit="주" />
          <CalcField
            field={addPrice}
            hint={wonHint(addPrice.value)}
            label="더 살 가격"
            unit="원"
          />
        </>
      }
      lead={LEAD}
      result={
        values === null || result === null ? null : (
          <CalcResult label="새 평단" value={exactWon(result.newAvg)}>
            <CalcAside>
              <span>
                총 수량 <b className="font-mono text-cb-foreground">{shares(result.totalQty)}</b>
              </span>
              <span>
                들어간 돈{' '}
                <b className="font-mono text-cb-foreground">{manWon(result.totalAmount)}</b>
              </span>
            </CalcAside>

            <SplitBar
              left={{ label: `원래 넣은 돈 ${manWon(result.baseAmount)}`, amount: result.baseAmount }}
              right={{ label: `더 넣는 돈 ${manWon(result.addAmount)}`, amount: result.addAmount }}
            />

            <CalcNote>{noteFor(result.baseAmount, result.totalAmount, values[1], result.newAvg)}</CalcNote>
          </CalcResult>
        )
      }
      title={TITLE}
    />
  );
}

/**
 * 결과를 한 문장으로. 물타기와 불타기는 평단이 움직이는 방향이 반대라 문장도 갈라야 한다 —
 * 불타기에 '평단이 내려가는 대신' 이라고 쓰면 그대로 거짓말이 된다.
 */
function noteFor(base: number, total: number, oldAvg: number, newAvg: number): string {
  if (base <= 0 || total <= base) {
    return '수량과 가격을 넣으면 이 종목에 돈이 얼마나 실리는지 같이 보여드릴게요.';
  }

  const times = decimal(total / base);
  if (newAvg > oldAvg) {
    const up = Math.round(((newAvg - oldAvg) / oldAvg) * 100);
    return `평단이 ${up}% 올라가는 대신, 잘 가고 있는 쪽에 무게를 싣는 거예요. 이 종목에 실린 돈은 ${times}배가 돼요.`;
  }

  const down = Math.round(((oldAvg - newAvg) / oldAvg) * 100);
  return `평단은 ${down}% 내려가요. 그런데 이 종목에 실린 돈은 ${times}배가 돼요 — 여기서 더 떨어지면 잃는 돈도 그만큼 커져요.`;
}
