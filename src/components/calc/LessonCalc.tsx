'use client';

import AveragingCalc from '@/components/calc/AveragingCalc';
import CompoundCalc from '@/components/calc/CompoundCalc';
import DecayCalc from '@/components/calc/DecayCalc';
import DividendCalc from '@/components/calc/DividendCalc';
import SavingsGoalCalc from '@/components/calc/SavingsGoalCalc';
import StopTargetCalc from '@/components/calc/StopTargetCalc';
import type { CalcKey } from '@/domain/calc/keys';

const CALCS: Record<CalcKey, () => React.JSX.Element> = {
  averaging: AveragingCalc,
  'stop-target': StopTargetCalc,
  dividend: DividendCalc,
  decay: DecayCalc,
  compound: CompoundCalc,
  'savings-goal': SavingsGoalCalc,
};

/** 레슨이 지정한 계산기를 고른다. 키가 타입으로 막혀 있어 빠진 경우는 생기지 않는다. */
export default function LessonCalc({ calc }: { calc: CalcKey }) {
  const Calc = CALCS[calc];
  return <Calc />;
}
