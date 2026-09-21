import { DIGEST_EMPTY, DIGEST_LATEST_BADGE } from '@/domain/news/copy';
import type { DigestEntry } from '@/domain/news/types';

interface DigestTimelineProps {
  entries: readonly DigestEntry[];
  openIndex: number;
  onOpen: (index: number) => void;
}

/**
 * 다이제스트 회차를 시간축에 세운다.
 *
 * 최신 한 건만 크게 걸지 않는 게 핵심이다 — 회차는 앞에서 다룬 사건을 빼고
 * 생성되므로 뒤로 갈수록 가벼워진다. 저녁에 들어온 사람이 그날 가장 덜 중요한
 * 내용을 헤드라인으로 보게 된다.
 * 그래서 접힌 줄에도 첫 문장을 남긴다. 시간만 있으면 뭘 펼칠지 고를 수 없고,
 * 오전의 큰 건이 접혔다는 이유로 안 보이면 안 된다.
 */
export default function DigestTimeline({ entries, openIndex, onOpen }: DigestTimelineProps) {
  if (entries.length === 0) {
    return (
      <p className="rounded-[20px] border border-cb-border bg-cb-surface px-5 py-6 text-sm leading-relaxed text-cb-muted lg:rounded-3xl lg:px-7 lg:py-8">
        {DIGEST_EMPTY}
      </p>
    );
  }

  return (
    <div className="rounded-[20px] border border-cb-point/25 bg-cb-surface px-[18px] py-1 lg:rounded-3xl lg:px-7 lg:py-2">
      {/* 세로 실선은 점을 잇는 장식이라 스크린리더에서는 뺀다. */}
      <ol className="relative before:absolute before:top-[26px] before:bottom-6 before:left-1 before:w-px before:bg-white/10 before:content-[''] lg:before:left-[5px]">
        {entries.map((entry, index) => {
          const open = index === openIndex;

          return (
            <li
              className="relative py-4 pl-6 not-first:border-t not-first:border-cb-border lg:py-5 lg:pl-[30px]"
              key={entry.time}
            >
              <span
                aria-hidden="true"
                className={`absolute left-0 size-[9px] rounded-full border transition-colors lg:size-[11px] ${
                  open
                    ? 'top-[21px] border-cb-point bg-cb-point shadow-[0_0_0_3px_rgba(91,141,239,0.16)] lg:top-6 lg:shadow-[0_0_0_4px_rgba(91,141,239,0.16)]'
                    : 'top-[21px] border-white/20 bg-[#23232a] lg:top-6'
                }`}
              />

              <button
                aria-expanded={open}
                className="group block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cb-point lg:flex lg:items-center lg:gap-3"
                onClick={() => onOpen(index)}
                type="button"
              >
                <span className="flex items-center gap-2 lg:contents">
                  <time
                    className={`shrink-0 font-mono text-[12.5px] font-bold tabular-nums lg:text-sm ${
                      open ? 'text-cb-foreground' : 'text-cb-muted'
                    }`}
                  >
                    {entry.time}
                  </time>

                  {index === 0 && (
                    <span className="shrink-0 rounded-full bg-cb-point/15 px-2 py-0.5 text-[10.5px] font-bold text-cb-point lg:px-2.5 lg:text-[11px]">
                      {DIGEST_LATEST_BADGE}
                    </span>
                  )}

                  {!open && (
                    <span aria-hidden="true" className="ml-auto text-[#55555f] lg:hidden">
                      <PlusIcon />
                    </span>
                  )}
                </span>

                {!open && (
                  <>
                    <span className="mt-1.5 block truncate text-[13.5px] leading-normal text-[#b6b6c0] group-hover:text-cb-foreground lg:mt-0 lg:grow lg:text-[15px]">
                      {entry.preview}
                    </span>
                    <span
                      aria-hidden="true"
                      className="hidden shrink-0 text-[#55555f] group-hover:text-cb-muted lg:block"
                    >
                      <PlusIcon />
                    </span>
                  </>
                )}
              </button>

              {open && (
                <p className="mt-2.5 text-[14.5px] leading-[1.78] text-cb-foreground lg:mt-3.5 lg:text-[19px] lg:leading-[1.85] lg:tracking-[-0.005em]">
                  {entry.text}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[15px] lg:size-[17px]"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}
