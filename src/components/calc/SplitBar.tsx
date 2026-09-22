interface SplitBarProps {
  /** 왼쪽 조각. 파랑으로 칠한다. */
  left: { label: string; amount: number };
  /** 오른쪽 조각. 빨강으로 칠한다. */
  right: { label: string; amount: number };
}

/**
 * 두 조각으로 나뉜 막대.
 *
 * 평단 계산기에서는 '원래 넣은 돈 / 더 넣는 돈', 복리 계산기에서는
 * '넣은 돈 / 불어난 돈' 이다. 둘 다 숫자만 보면 크기 감이 안 오는데,
 * 비율로 그려 두면 한눈에 들어온다.
 *
 * 색은 화면 전체의 규칙을 따른다 — 늘어난 쪽이 빨강이다.
 */
export default function SplitBar({ left, right }: SplitBarProps) {
  const total = left.amount + right.amount;
  const leftPct = total > 0 ? (left.amount / total) * 100 : 0;

  return (
    <>
      <div
        aria-hidden="true"
        className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-cb-tile"
      >
        <span className="bg-cb-positive" style={{ width: `${leftPct}%` }} />
        <span className="bg-cb-negative" style={{ width: `${100 - leftPct}%` }} />
      </div>

      <p className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-cb-muted">
        <span>
          <span aria-hidden="true" className="text-cb-positive">
            ■{' '}
          </span>
          {left.label}
        </span>
        <span>
          <span aria-hidden="true" className="text-cb-negative">
            ■{' '}
          </span>
          {right.label}
        </span>
      </p>
    </>
  );
}
