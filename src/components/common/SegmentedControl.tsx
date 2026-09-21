'use client';

interface SegmentedControlProps<T extends string> {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  /** 좁은 화면에서 폭을 꽉 채울지. 시장 토글처럼 둘뿐일 때 쓴다. */
  fill?: true;
}

/** 시장·보기 전환에 쓰는 알약 토글. 눌린 쪽만 채운다. */
export default function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  fill,
}: SegmentedControlProps<T>) {
  return (
    <div
      aria-label={label}
      className={`flex shrink-0 rounded-full border border-cb-border bg-[#16161a] p-1 ${
        fill ? '' : 'self-start'
      }`}
      role="group"
    >
      {options.map((option) => (
        <button
          aria-pressed={option.value === value}
          className={`cursor-pointer rounded-full px-4 py-2 text-[13px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cb-point lg:px-5 lg:text-sm ${
            fill ? 'grow lg:grow-0' : ''
          } ${
            option.value === value
              ? 'bg-cb-foreground text-[#16161a]'
              : 'text-cb-muted hover:text-cb-foreground'
          }`}
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
