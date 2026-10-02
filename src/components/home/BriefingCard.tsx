import Link from 'next/link';
import PreviewIcon from '@/components/home/PreviewIcon';
import { BRIEFING_PATH } from '@/domain/briefing/route';
import type { Briefing } from '@/domain/briefing/types';
import {
  PREVIEW_BRIEFING_MORE,
  PREVIEW_BRIEFING_TITLE,
  BRIEFING_SOURCE_NAME,
} from '@/domain/jumi/landingCopy';

interface BriefingCardProps {
  briefing: Briefing;
}

/**
 * 장 시작 전 카드 — 브리핑의 한 문단만 싣는다.
 *
 * 이슈 목록도 테마도 넣지 않는다. 카드는 470px(좁은 화면은 192px)이고 그 안에
 * 목록을 욱여넣으면 어느 쪽도 읽히지 않는다. 한 문단이 이 글의 입구라서,
 * 그것만 보여주고 나머지는 페이지로 넘긴다.
 *
 * 출처를 카드에도 적는다 — 홈만 보고 지나가는 사람에게는 여기가 유일한 자리다.
 */
export default function BriefingCard({ briefing }: BriefingCardProps) {
  return (
    <Link
      className="flex size-full flex-col overflow-hidden rounded-[22px] border border-cb-border bg-cb-surface p-5 transition-colors hover:border-cb-border-strong hover:bg-cb-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cb-point lg:rounded-3xl lg:p-7"
      href={BRIEFING_PATH}
    >
      <header className="flex items-center gap-2.5">
        <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[10px] bg-cb-tile text-cb-trader lg:size-9 lg:rounded-xl">
          <PreviewIcon name="briefing" />
        </span>
        <h2 className="text-[12.5px] font-bold text-cb-foreground lg:text-[13px]">
          {PREVIEW_BRIEFING_TITLE}
        </h2>
        <span className="ml-auto text-[11px] text-cb-muted lg:text-xs">{briefing.dateLabel}</span>
      </header>

      {/*
        좁은 카드는 줄 수로 자르고 넓은 카드는 통째로 보여준다.
        한 문단이 171자쯤이라 모바일에서는 4줄이면 끝이 보인다.
      */}
      <p className="mt-3.5 line-clamp-4 text-[12.5px] leading-[1.7] text-cb-foreground lg:mt-6 lg:line-clamp-none lg:text-[15px] lg:leading-[1.85]">
        {briefing.summaryLine}
      </p>

      <p className="mt-auto flex items-center gap-1.5 pt-3 text-[11px] text-cb-muted lg:pt-5 lg:text-xs">
        <span>{BRIEFING_SOURCE_NAME} 제공</span>
        <span aria-hidden="true">·</span>
        <span>{PREVIEW_BRIEFING_MORE}</span>
      </p>
    </Link>
  );
}
