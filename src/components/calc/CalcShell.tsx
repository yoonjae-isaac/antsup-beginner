'use client';

import type { ReactNode } from 'react';

interface CalcShellProps {
  title: string;
  lead: string;
  /** 입력칸들. 좁은 화면 1열, 그 위 2열로 접힌다. */
  fields: ReactNode;
  /** 결과. 값이 아직 없으면 null 을 주면 안내 문구가 대신 뜬다. */
  result: ReactNode | null;
}

const EMPTY = '칸을 다 채우면 계산해 드릴게요.';

/**
 * 계산기 껍데기 — 레슨 대화 끝에 얹히는 카드.
 *
 * 말풍선보다 한 톤 단단하게 둔다. 대화와 같은 배경이면 주미가 한 말처럼 보이는데,
 * 여기는 읽는 곳이 아니라 **직접 만지는 곳**이라 경계가 보여야 한다.
 */
export default function CalcShell({ title, lead, fields, result }: CalcShellProps) {
  return (
    <section
      aria-label={title}
      className="rounded-2xl border border-cb-border-strong bg-cb-tile p-4 md:p-5"
    >
      <h3 className="text-[15px] font-bold text-cb-foreground">{title}</h3>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-cb-muted">{lead}</p>

      <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">{fields}</div>

      <div className="mt-5 border-t border-cb-border pt-4">
        {result ?? <p className="text-[12.5px] leading-relaxed text-cb-muted">{EMPTY}</p>}
      </div>
    </section>
  );
}

interface CalcResultProps {
  label: string;
  /** 대표값 하나. 이게 이 계산기의 답이다. */
  value: string;
  /** 대표값을 거드는 짧은 줄들. */
  children?: ReactNode;
}

/** 결과 블록 — 대표값을 크게 하나만 세우고 나머지는 아래에 붙인다. */
export function CalcResult({ label, value, children }: CalcResultProps) {
  return (
    <>
      <p className="text-[11.5px] text-cb-muted">{label}</p>
      <p className="mt-1 font-mono text-[28px] leading-none font-bold tabular-nums text-cb-foreground md:text-[32px]">
        {value}
      </p>
      {children}
    </>
  );
}

/** 결과 아래 곁가지 수치들 — 한 줄에 흘려 담는다. */
export function CalcAside({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-cb-muted">{children}</p>
  );
}

/** 결과를 한 문장으로 풀어 주는 줄. 숫자만 주고 끝내면 초보는 해석을 못 한다. */
export function CalcNote({ children }: { children: ReactNode }) {
  return <p className="mt-3.5 text-[12.5px] leading-relaxed text-cb-foreground">{children}</p>;
}
