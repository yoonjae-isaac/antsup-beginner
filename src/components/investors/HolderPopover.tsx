'use client';

import { useId, useRef, useState } from 'react';
import type { GuruHolder } from '@/domain/investors/investors';

interface HolderPopoverProps {
  /** 버튼에 보일 문구('거장 9명 보유'). */
  label: string;
  /** 팝업 머리말('이 종목을 들고 있는 거장'). */
  title: string;
  holders: readonly GuruHolder[];
}

const EMPTY = '누가 들고 있는지는 아직 정리되지 않았어요.';

/**
 * 보유 거장 수를 눌러 누가 들고 있는지 보는 팝업.
 *
 * 마우스는 올리면 열리고, 터치는 눌러야 열린다 — cash-bite 는 hover 만 써서
 * 휴대폰에서는 열 방법이 아예 없다. 주린이는 대부분 휴대폰으로 본다.
 * 두 입력을 구분하지 않으면 터치에서 hover 가 합성돼 열렸다가 click 으로 곧바로
 * 닫히므로, pointerdown 에서 입력 종류를 기억해 둔다.
 */
export default function HolderPopover({ label, title, holders }: HolderPopoverProps) {
  const [open, setOpen] = useState(false);
  const pointerType = useRef('mouse');
  const panelId = useId();

  return (
    <span className="relative inline-flex">
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className="cursor-help rounded underline decoration-cb-border-strong decoration-dotted underline-offset-4 transition-colors hover:text-cb-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cb-point"
        onBlur={() => setOpen(false)}
        onClick={() => {
          if (pointerType.current !== 'mouse') setOpen((value) => !value);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpen(false);
        }}
        onPointerDown={(event) => {
          pointerType.current = event.pointerType;
        }}
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') setOpen(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') setOpen(false);
        }}
        type="button"
      >
        {label}
      </button>

      {open && (
        <span
          className="absolute right-0 bottom-full z-30 mb-2 block w-[248px] rounded-2xl border border-cb-border bg-cb-surface p-3.5 text-left shadow-[0_18px_44px_-16px_rgba(0,0,0,0.8)] lg:w-[268px]"
          id={panelId}
          role="tooltip"
        >
          <span className="mb-2.5 block border-b border-cb-border pb-2.5 text-xs font-bold text-cb-foreground">
            {title}
          </span>

          {holders.length === 0 ? (
            <span className="block text-[11.5px] leading-relaxed text-cb-muted">{EMPTY}</span>
          ) : (
            <span className="flex flex-col gap-2">
              {holders.map((holder, index) => (
                <span className="flex items-center gap-2" key={`${holder.name}-${index}`}>
                  <span className="min-w-0 grow truncate text-xs font-bold text-cb-foreground">
                    {holder.name}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] tabular-nums text-cb-muted">
                    {holder.value}
                  </span>
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      holder.direction === 'buy'
                        ? 'bg-cb-negative/15 text-cb-negative'
                        : holder.direction === 'sell'
                          ? 'bg-cb-positive/15 text-cb-positive'
                          : 'bg-white/8 text-cb-muted'
                    }`}
                  >
                    {holder.changeLabel}
                  </span>
                </span>
              ))}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
