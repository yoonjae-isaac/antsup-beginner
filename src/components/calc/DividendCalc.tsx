'use client';

import CalcField from '@/components/calc/CalcField';
import CalcShell, { CalcAside, CalcNote, CalcResult } from '@/components/calc/CalcShell';
import { readAll, useNumberField } from '@/components/calc/numberField';
import { DEFAULTS, dividend } from '@/domain/calc/formulas';
import { exactWon, manWon, percent, wonHint } from '@/domain/calc/format';

const TITLE = '배당 계산기';
const LEAD = '세금을 떼고 실제로 얼마가 들어오는지, 그리고 배당수익률이 몇 %인지 봐요.';

/**
 * 배당 세전·세후와 배당수익률.
 *
 * 원본(cash-bite `dividend`)은 세율 15.4% 를 모듈 상수로 박아 두고 결과만 보여준다.
 * 여기서는 **입력칸으로 뺐다**. 세율은 바뀌고, 이 서비스는 화면에서 숫자를 단정하지
 * 않기로 했다. 입력으로 두면 그게 가정이라는 사실이 화면에 남고, 바뀌었을 때
 * 사용자가 직접 고쳐 쓸 수 있다.
 */
export default function DividendCalc() {
  const qty = useNumberField(100);
  const price = useNumberField(100000);
  const dps = useNumberField(3000);
  const taxPct = useNumberField(DEFAULTS.dividendTaxPct);

  const values = readAll([qty, price, dps, taxPct]);
  const result = values === null ? null : dividend(values[0], values[1], values[2], values[3]);

  return (
    <CalcShell
      fields={
        <>
          <CalcField field={qty} label="갖고 있는 수량" unit="주" />
          <CalcField field={price} hint={wonHint(price.value)} label="주가" unit="원" />
          <CalcField field={dps} hint={wonHint(dps.value)} label="한 주당 받는 배당금" unit="원" />
          <CalcField decimal field={taxPct} label="배당소득세 (가정)" unit="%" />
        </>
      }
      lead={LEAD}
      result={
        result === null ? null : (
          <CalcResult label="세금 떼고 받는 돈" value={exactWon(result.net)}>
            <CalcAside>
              <span>
                떼기 전 <b className="font-mono text-cb-foreground">{manWon(result.gross)}</b>
              </span>
              <span>
                세금 <b className="font-mono text-cb-foreground">{manWon(result.tax)}</b>
              </span>
              <span>
                배당수익률{' '}
                <b className="font-mono text-cb-foreground">{percent(result.yieldPct)}</b>
              </span>
            </CalcAside>

            <CalcNote>
              세율은 바뀔 수 있어요. 미리 채워둔 값은 지금 흔히 쓰는 기준일 뿐이라, 받기 전에
              한 번 확인하고 바꿔 넣어 주세요.
            </CalcNote>
          </CalcResult>
        )
      }
      title={TITLE}
    />
  );
}
