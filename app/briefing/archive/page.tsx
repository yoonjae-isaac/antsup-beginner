import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/layout/PageShell';
import { briefingArchiveMetadata } from '@/config/site';
import { loadBriefingList } from '@/domain/briefing/briefing';
import { BRIEFING_PATH } from '@/domain/briefing/route';
import { BRIEFING_SOURCE_NAME } from '@/domain/jumi/landingCopy';

export const metadata: Metadata = briefingArchiveMetadata();

/** 목록은 하루 한 줄씩만 늘어난다. 본문과 같은 창이면 충분하다. */
export const revalidate = 3600;

/** 보존이 30일이 아니라 무기한이라 목록은 끊어서 받는다. */
const LIST_LIMIT = 30;

const HEADING = '지난 브리핑';
const LEAD = '날마다 장 시작 전에 올라온 글이에요. 그날 무슨 이야기가 많았는지 한 줄씩 볼 수 있어요.';
const EMPTY = '아직 쌓인 브리핑이 없어요.';

export default async function Page() {
  const items = await loadBriefingList(LIST_LIMIT);

  return (
    <PageShell>
      <h1 className="text-[1.65rem] leading-snug font-bold tracking-tight lg:text-[2.5rem]">
        {HEADING}
      </h1>
      <p className="mt-2 text-[13.5px] leading-relaxed text-cb-muted lg:text-[15px]">{LEAD}</p>
      <p className="mt-2 text-[12.5px] leading-relaxed text-cb-muted">
        글은 {BRIEFING_SOURCE_NAME}가 썼어요.
      </p>

      {items.length === 0 ? (
        <p className="mt-8 text-sm leading-relaxed text-cb-muted">{EMPTY}</p>
      ) : (
        <ul className="mt-7 lg:mt-9">
          {items.map((item, index) => (
            <li className={index > 0 ? 'border-t border-cb-border' : ''} key={item.date}>
              {/*
                가장 최근 글만 /briefing 으로 보낸다. 지난 날짜를 여는 화면은 아직 없다 —
                없는 곳으로 보내느니 날짜와 한 줄만 보여주는 편이 낫다.
              */}
              {index === 0 ? (
                <Link
                  className="flex flex-col gap-1.5 py-[18px] transition-colors hover:bg-cb-hover lg:flex-row lg:gap-6 lg:py-6"
                  href={BRIEFING_PATH}
                >
                  <span className="w-[120px] shrink-0 font-mono text-[13px] font-bold text-cb-point">
                    {item.dateLabel}
                  </span>
                  <span className="grow text-[13.5px] leading-relaxed text-cb-foreground lg:text-[15px]">
                    {item.summaryLine}
                  </span>
                  <span className="shrink-0 text-xs text-cb-muted lg:self-center">보기 →</span>
                </Link>
              ) : (
                <div className="flex flex-col gap-1.5 py-[18px] lg:flex-row lg:gap-6 lg:py-6">
                  <span className="w-[120px] shrink-0 font-mono text-[13px] font-bold text-cb-muted">
                    {item.dateLabel}
                  </span>
                  <span className="grow text-[13.5px] leading-relaxed text-[#b6b6c0] lg:text-[15px]">
                    {item.summaryLine}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
