'use client';

import Link from 'next/link';
import { useState } from 'react';
import LessonCalc from '@/components/calc/LessonCalc';
import JumiAvatar from '@/components/jumi/JumiAvatar';
import type { CalcKey } from '@/domain/calc/keys';
import { JUMI_ART } from '@/domain/jumi/artwork';
import { CALC_NOTICE } from '@/domain/jumi/landingCopy';
import { lessonPath } from '@/domain/jumi/lessons';
import { FIRST_TOOL, TOOLS, findTool } from '@/domain/tools/tools';

const HEADING = '투자 도구';
const LEAD = '레슨에 나온 계산기를 한자리에 모아 뒀어요. 설명은 건너뛰고 숫자만 보고 싶을 때 쓰세요.';
const JUMI_LEAD = '숫자는 마음대로 바꿔 보셔도 돼요. 망가지지 않아요.';
const PICK_LABEL = '도구 고르기';

/** 계산기 아래에 두는 길. 도구만 쓰다 막히면 돌아갈 설명이 있어야 한다. */
const LESSON_LINK_PREFIX = '이 도구가 나온 이야기';

export default function ToolsBoardView() {
  const [picked, setPicked] = useState<CalcKey>(FIRST_TOOL.calc);
  const tool = findTool(picked) ?? FIRST_TOOL;

  return (
    <>
      <h1 className="text-[1.65rem] leading-snug font-bold tracking-tight lg:text-[2.5rem]">
        {HEADING}
      </h1>
      <p className="mt-2 text-[13.5px] leading-relaxed text-cb-muted lg:text-[15px]">{LEAD}</p>

      <div className="mt-[18px] flex items-center gap-2.5 lg:mt-6 lg:gap-3">
        <JumiAvatar art={JUMI_ART.greeting} size="sm" />
        <p className="text-[13px] leading-snug text-cb-foreground lg:text-sm">{JUMI_LEAD}</p>
      </div>

      {/*
        알약 토글(SegmentedControl)을 쓰지 않는다 — 여섯 개를 한 줄에 넣으면 좁은
        화면에서 글자가 다 잘린다. 이름만으로는 뭘 하는 도구인지도 모른다.
      */}
      {/*
        좁은 화면에서도 두 칸이다. 한 칸으로 세우면 도구 여섯 개가 한 화면을 다 먹고,
        정작 계산기는 스크롤 아래로 밀려난다 — 계산하러 온 사람에게는 그게 빈 화면이다.
      */}
      <div
        aria-label={PICK_LABEL}
        className="mt-6 grid grid-cols-2 gap-2.5 lg:mt-9 lg:grid-cols-3 lg:gap-3.5"
        role="group"
      >
        {TOOLS.map((item) => {
          const on = item.calc === picked;

          return (
            <button
              aria-pressed={on}
              className={`cursor-pointer rounded-2xl border p-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cb-point lg:p-[18px] ${
                on
                  ? 'border-cb-point bg-cb-point/10'
                  : 'border-cb-border bg-cb-surface hover:border-cb-border-strong hover:bg-cb-hover'
              }`}
              key={item.calc}
              onClick={() => setPicked(item.calc)}
              type="button"
            >
              <span
                className={`block text-[13.5px] font-bold lg:text-[15px] ${
                  on ? 'text-cb-point' : 'text-cb-foreground'
                }`}
              >
                {item.name}
              </span>
              <span className="mt-1 block text-[12px] leading-normal text-cb-muted lg:mt-1.5 lg:text-[12.5px]">
                {item.question}
              </span>
            </button>
          );
        })}
      </div>

      {/*
        계산기 자체는 레슨에 붙는 것과 같은 컴포넌트다. 도구 페이지용으로 따로 만들면
        같은 계산식이 두 벌이 되고, 한쪽만 고쳐지는 날이 온다.
      */}
      <div className="mt-7 lg:mt-10 lg:max-w-3xl">
        <LessonCalc calc={tool.calc} />

        <p className="mt-4 text-[13px] lg:text-sm">
          <Link
            className="text-cb-point underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cb-point"
            href={lessonPath(tool.slug)}
          >
            {LESSON_LINK_PREFIX} · {tool.lessonHeading} →
          </Link>
        </p>

        <p className="mt-5 text-[11.5px] leading-relaxed text-cb-muted lg:mt-6 lg:text-[12.5px]">
          {CALC_NOTICE}
        </p>
      </div>
    </>
  );
}
