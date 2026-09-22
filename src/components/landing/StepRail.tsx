'use client';

import Link from 'next/link';
import { Fragment, useEffect, useMemo, useRef } from 'react';
import { groupStepsByPart, lessonPath } from '@/domain/jumi/lessons';
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
 *
 * 부(1부·2부) 머리글로 끊는다. 열여섯 개를 한 줄로 늘어놓으면 어디까지가 '시작하는 데
 * 필요한 것'인지 안 보여서, 첫 매수만 하려던 사람이 남은 길이에 질린다.
 */
export default function StepRail({ currentSlug }: StepRailProps) {
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const currentRef = useRef<HTMLLIElement>(null);
  const groups = useMemo(() => groupStepsByPart(), []);

  useEffect(() => {
    const nav = navRef.current;
    const list = listRef.current;
    const current = currentRef.current;
    if (!nav || !list || !current) return;

    // 현재 단계가 레일 밖에 있으면 자기 위치를 알 수 없다. 좁은 화면은 가로(목록),
    // 넓은 화면은 세로(레일 자체)로 넘치므로 두 축을 같이 맞춘다 — 넘치지 않는 축은
    // 대입해도 그대로라 아무 일도 일어나지 않는다.
    //
    // scrollIntoView 는 페이지까지 같이 움직이므로 컨테이너만 직접 옮긴다.
    // offsetLeft/Top 은 offsetParent 가 무엇이냐에 따라 기준이 달라져서, 두 배치를
    // 한 식으로 다루려고 화면 좌표 차이로 계산한다.
    const box = current.getBoundingClientRect();
    list.scrollLeft += box.left - list.getBoundingClientRect().left - (list.clientWidth - box.width) / 2;
    nav.scrollTop += box.top - nav.getBoundingClientRect().top - (nav.clientHeight - box.height) / 2;
  }, []);

  return (
    <nav
      ref={navRef}
      aria-label={STEP_RAIL_LABEL}
      /*
        2부가 붙어 항목이 16개 + 머리글 2개가 됐다. 세로 레일이 그만큼 길어져서
        낮은 화면에서는 위아래가 잘린다 — 잘리면 현재 단계가 화면 밖일 수도 있다.
        화면 높이를 넘지 않게 묶고, 넘칠 때만 레일 안에서 스크롤시킨다.
      */
      className="mb-5 lg:fixed lg:top-1/2 lg:right-4 lg:mb-0 lg:max-h-[calc(100dvh-2rem)] lg:w-36 lg:-translate-y-1/2 lg:overflow-y-auto xl:right-6 xl:w-48"
    >
      <ol
        ref={listRef}
        className="flex gap-2 overflow-x-auto px-5 pb-2 md:px-8 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {groups.map((group) => (
          <Fragment key={group.id}>
            {/*
              부 머리글. 목록 안에 같이 두는 이유는 가로 스크롤 때문이다 — 밖으로 빼면
              한 줄 흐름이 끊겨서 칩이 부마다 따로 스크롤된다.
            */}
            <li className="flex shrink-0 items-center pr-1 text-[11px] font-bold tracking-[0.08em] whitespace-nowrap text-cb-muted lg:px-2.5 lg:pt-3 lg:pb-1 xl:px-3">
              {group.label}
            </li>

            {group.steps.map(({ step, number }) => {
              const isCurrent = step.ready && step.slug === currentSlug;
              const shape =
                'flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs whitespace-nowrap transition-colors lg:rounded-xl lg:px-2.5 lg:py-2 xl:px-3 xl:text-sm';

              const order = (
                <span
                  aria-hidden="true"
                  className={
                    isCurrent ? 'font-bold opacity-80' : step.ready ? 'opacity-60' : 'opacity-50'
                  }
                >
                  {number}
                </span>
              );

              return (
                <li key={step.slug} ref={isCurrent ? currentRef : undefined}>
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
                      {order}
                      {step.railLabel}
                    </Link>
                  ) : (
                    <span
                      className={`${shape} cursor-default border border-dashed border-cb-border-strong text-cb-muted opacity-70`}
                    >
                      {order}
                      {step.railLabel}
                    </span>
                  )}
                </li>
              );
            })}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
