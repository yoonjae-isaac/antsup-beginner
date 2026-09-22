'use client';

import CalcField from '@/components/calc/CalcField';
import CalcShell, { CalcAside, CalcNote, CalcResult } from '@/components/calc/CalcShell';
import { readAll, useNumberField } from '@/components/calc/numberField';
import { positionSize, stopTarget } from '@/domain/calc/formulas';
import { decimal, exactWon, loose, manWon } from '@/domain/calc/format';

const TITLE = '손절·목표가 계산기';
const LEAD =
  '얼마에 자르고 얼마에 챙길지 넣어 보세요. 계좌에서 감당할 손실까지 넣으면 얼마어치 살지도 나와요.';

/**
 * 손절가·목표가·손익비, 그리고 살 금액.
 *
 * 원본(cash-bite `stop-target`)은 손절가·목표가·손익비 셋만 돌려준다. 여기에는
 * 계좌 크기와 감당할 손실(`positionSize`)을 더해 **얼마어치 살지**까지 낸다.
 * 레슨의 마지막 대사가 그 얘기이고, 초보가 실제로 막히는 지점도 거기다 —
 * 손절선을 정해도 몇 주를 살지 모르면 결국 감으로 산다.
 */
export default function StopTargetCalc() {
  const buyPrice = useNumberField(100000);
  const stopPct = useNumberField(5);
  const takePct = useNumberField(15);
  const account = useNumberField(10000000);
  const riskPct = useNumberField(2);

  const values = readAll([buyPrice, stopPct, takePct, account, riskPct]);

  const plan = values === null ? null : stopTarget(values[0], values[1], values[2]);
  const sizing = values === null ? null : positionSize(values[3], values[4], values[1]);

  return (
    <CalcShell
      fields={
        <>
          <CalcField field={buyPrice} hint={wonOrNull(buyPrice.value)} label="살 가격" unit="원" />
          <CalcField decimal field={stopPct} label="여기까지 내려가면 판다" unit="%" />
          <CalcField decimal field={takePct} label="여기까지 오르면 챙긴다" unit="%" />
          <CalcField
            field={account}
            hint={wonOrNull(account.value)}
            label="계좌에 있는 돈 전부"
            unit="원"
          />
          <CalcField
            decimal
            field={riskPct}
            label="한 번에 잃어도 되는 비율"
            unit="%"
          />
        </>
      }
      lead={LEAD}
      result={
        plan === null || sizing === null || values === null ? null : (
          <CalcResult label="손익비" value={decimal(plan.riskReward)}>
            <CalcAside>
              <span>
                손절가{' '}
                <b className="font-mono text-cb-positive">{exactWon(plan.stopPrice)}</b>
              </span>
              <span>
                목표가{' '}
                <b className="font-mono text-cb-negative">{exactWon(plan.takePrice)}</b>
              </span>
            </CalcAside>

            <div className="mt-4 rounded-xl bg-cb-bg px-3.5 py-3">
              <p className="text-[11.5px] text-cb-muted">이 계획이면 살 수 있는 금액</p>
              <p className="mt-1 font-mono text-[17px] font-bold tabular-nums text-cb-foreground">
                {manWon(sizing.positionAmount)}
              </p>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-cb-muted">
                손절선에 닿아도 잃는 돈이 {manWon(sizing.maxLoss)}, 계좌의 {loose(values[4])}
                %에서 멈춰요.
              </p>
            </div>

            <CalcNote>{noteFor(plan.riskReward)}</CalcNote>
          </CalcResult>
        )
      }
      title={TITLE}
    />
  );
}

function wonOrNull(value: number | null): string | null {
  if (value === null || value < 10_000) return null;
  return manWon(value);
}

/**
 * 손익비를 말로 풀어 준다.
 *
 * 1 을 경계로 문장이 갈린다 — 1 미만이면 '승률이 높아도 계좌가 줄어든다'가
 * 이 계산기가 해야 할 경고이고, 그걸 빼면 숫자만 보고 괜찮은 줄 안다.
 */
function noteFor(riskReward: number): string {
  if (!Number.isFinite(riskReward) || riskReward <= 0) {
    return '손절 폭을 넣으면 손익비를 계산해 드릴게요.';
  }

  const ratio = decimal(riskReward);

  if (riskReward < 1) {
    return `한 번 맞혀서 버는 것보다 한 번 틀려서 잃는 게 커요(손익비 ${ratio}). 이런 매매를 반복하면 많이 맞혀도 계좌는 줄어들어요.`;
  }

  return `한 번 맞히면 ${ratio}번 틀린 걸 메워요. 그래서 열 번 중 절반을 못 맞혀도 버틸 수 있어요.`;
}
