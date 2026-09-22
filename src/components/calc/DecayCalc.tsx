'use client';

import CalcField from '@/components/calc/CalcField';
import CalcShell, { CalcNote, CalcResult } from '@/components/calc/CalcShell';
import { readAll, useNumberField } from '@/components/calc/numberField';
import { roundTripResult } from '@/domain/calc/formulas';
import { loose, percent } from '@/domain/calc/format';

const TITLE = '왕복하면 얼마나 깎이나';
const LEAD =
  '지수가 올랐다가 원래 자리로 돌아온 상황이에요. 지수는 본전인데 배수 상품은 어디에 있는지 봐요.';

/**
 * 표에 세울 상품. 배수와 이름만 다르고 계산은 같다.
 *
 * 3배를 뺀 이유가 있다 — 한 왕복에서는 `k배` 와 `(1-k)배` 의 결과가 **항상 같다**
 * (둘 다 (1+3u)(1-2u)/(1+u) 로 정리된다). 그래서 3배와 곱버스를 나란히 두면 숫자가
 * 똑같이 찍혀서 계산이 틀린 것처럼 보인다. 국내에서 주린이가 실제로 만나는 건
 * 2배와 곱버스라, 그 둘만 남겼다.
 */
const PRODUCTS: readonly { multiple: number; label: string }[] = [
  { multiple: 1, label: '지수 그대로' },
  { multiple: 2, label: '2배 (레버리지)' },
  { multiple: -2, label: '-2배 (곱버스)' },
];

/**
 * 변동성 끌림 시연.
 *
 * 다른 계산기와 달리 사용자 상황이 아니라 **한 장면**을 넣는다. 이 레슨에서 보여줘야
 * 하는 건 내 손익이 아니라 '지수가 제자리인데 왜 내 돈만 줄었나'이기 때문이다.
 *
 * 무작위 경로를 굴리지 않고 한 번의 왕복만 쓴다 — 결과를 손으로 검산할 수 있어야
 * 믿기고, 주린이가 의심해야 할 대상은 계산기가 아니라 상품 쪽이다.
 */
export default function DecayCalc() {
  const upPct = useNumberField(10);

  const values = readAll([upPct]);
  const rows =
    values === null
      ? null
      : PRODUCTS.map((product) => ({
          ...product,
          changePct: (roundTripResult(values[0], product.multiple) - 1) * 100,
        }));

  const leveraged = rows?.find((row) => row.multiple === 2);

  return (
    <CalcShell
      fields={
        <CalcField
          decimal
          field={upPct}
          label="지수가 얼마나 올랐다 돌아왔나"
          unit="%"
        />
      }
      lead={LEAD}
      result={
        rows === null || leveraged === undefined || values === null ? null : (
          <CalcResult
            label="지수는 본전인데, 2배 상품은"
            value={percent(leveraged.changePct)}
          >
            <ul className="mt-4 flex flex-col gap-2">
              {rows.map((row) => (
                <li className="flex items-center gap-3" key={row.label}>
                  <span className="min-w-0 grow text-[12.5px] text-cb-muted">{row.label}</span>
                  <span
                    className={`shrink-0 font-mono text-[13px] font-bold tabular-nums ${
                      row.changePct < -0.05 ? 'text-cb-down' : 'text-cb-foreground'
                    }`}
                  >
                    {row.changePct < -0.05 ? percent(row.changePct) : '본전'}
                  </span>
                </li>
              ))}
            </ul>

            <CalcNote>{noteFor(values[0], leveraged.changePct)}</CalcNote>
          </CalcResult>
        )
      }
      title={TITLE}
    />
  );
}

/**
 * 계산기가 실제보다 **후하다**는 사실을 반드시 남긴다.
 *
 * 여기엔 운용 보수도, 추적 오차도, 왕복을 여러 번 하는 경우도 안 들어 있다.
 * 셋 다 결과를 더 나쁘게 만들 뿐이라, 이 숫자를 상한으로 읽게 해야 한다.
 */
function noteFor(upPct: number, leveragedPct: number): string {
  if (upPct <= 0) {
    return '지수가 움직인 폭을 넣어 보세요. 왕복 폭이 클수록 배수 상품이 더 많이 깎여요.';
  }

  return `지수는 ${loose(upPct)}% 올랐다가 그대로 돌아와서 본전인데, 2배 상품은 ${percent(leveragedPct)}가 됐어요. 게다가 이건 딱 한 번 왕복했을 때고, 운용 보수도 빼지 않은 숫자예요. 실제로는 이보다 더 깎여요.`;
}
