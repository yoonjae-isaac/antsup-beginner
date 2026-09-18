'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { lessonPath, STEPS } from '@/domain/jumi/lessons';
import { STEP_RAIL_LABEL } from '@/domain/jumi/landingCopy';

interface StepRailProps {
  currentSlug: string;
}

/**
 * 스텝 네비 — 주제 사이를 바로 점프한다.
 *
 * 화면 폭에 따라 자리가 다르다.
 *  - lg(1024px) 이상: **오른쪽 여백에 고정한 세로 레일.** 흐름에서 빼두었기 때문에
 *    본문 컬럼은 그대로 화면 정중앙에 남는다(2단 배치로 만들면 본문이 오른쪽으로 밀린다).
 *    레일 폭은 남는 여백에 맞춘다 — lg 에서 한쪽 여백이 176px 뿐이라 144px,
 *    xl 부터 여백이 넉넉해져 192px 로 넓힌다.
 *  - 그 아래: 카드 위 가로 스크롤 칩. 본문 448~672px 옆에 레일을 세울 여백이
 *    물리적으로 안 나온다. 억지로 띄우면 본문을 덮는다.
 *
 * 아직 대사가 없는 주제도 회색으로 보여준다 — 앞으로 뭐가 오는지 알 수 있고,
 * 링크가 아니라 span 이라 눌러도 빈 페이지로 가지 않는다.
 */
export default function StepRail({ currentSlug }: StepRailProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const currentRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const current = currentRef.current;
    if (!list || !current) return;

    // 가로 스크롤일 때 현재 단계가 화면 밖에 있으면 자기 위치를 알 수 없다.
    // scrollIntoView 는 페이지까지 같이 움직이므로 컨테이너만 직접 옮긴다.
    list.scrollLeft = current.offsetLeft - (list.clientWidth - current.clientWidth) / 2;
  }, []);

  return (
    <nav
      aria-label={STEP_RAIL_LABEL}
      className="mb-5 lg:fixed lg:top-1/2 lg:right-4 lg:mb-0 lg:w-36 lg:-translate-y-1/2 xl:right-6 xl:w-48"
    >
      <ol
        ref={listRef}
        className="flex gap-2 overflow-x-auto px-5 pb-2 md:px-8 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {STEPS.map((step, index) => {
          const isCurrent = step.ready && step.slug === currentSlug;
          const shape =
            'flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs whitespace-nowrap transition-colors lg:rounded-xl lg:px-2.5 lg:py-2 xl:px-3 xl:text-sm';

          const number = (
            <span
              aria-hidden="true"
              className={
                isCurrent ? 'font-bold opacity-80' : step.ready ? 'opacity-60' : 'opacity-50'
              }
            >
              {index + 1}
            </span>
          );

          return (
            <li key={step.slug || 'root'} ref={isCurrent ? currentRef : undefined}>
              {step.ready ? (
                <Link
                  href={lessonPath(step.slug)}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`${shape} ${
                    isCurrent
                      ? 'bg-cb-point font-bold text-cb-on-point'
                      : 'bg-cb-tile text-cb-foreground hover:bg-cb-hover'
                  }`}
                >
                  {number}
                  {step.railLabel}
                </Link>
              ) : (
                <span
                  className={`${shape} cursor-default border border-dashed border-cb-border-strong text-cb-muted opacity-70`}
                >
                  {number}
                  {step.railLabel}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
