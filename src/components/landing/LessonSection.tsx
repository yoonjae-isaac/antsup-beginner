'use client';

import { useEffect, useMemo, useState } from 'react';
import LessonCalc from '@/components/calc/LessonCalc';
import JumiAvatar from '@/components/jumi/JumiAvatar';
import SpeechBubble from '@/components/jumi/SpeechBubble';
import TypingIndicator from '@/components/jumi/TypingIndicator';
import { JUMI_ART } from '@/domain/jumi/artwork';
import { buildDialogueSegments } from '@/domain/jumi/dialogueSegments';
import {
  CALC_NOTICE,
  CHOICE_GROUP_LABEL,
  CHOICE_HINT,
  FIGURES_NOTICE,
} from '@/domain/jumi/landingCopy';
import type { Lesson } from '@/domain/jumi/lessons';
import type { ChoiceOption, ChoicePoint, JumiLine, TrackId } from '@/domain/jumi/types';

interface LessonSectionProps {
  lesson: Lesson;
  lines: readonly JumiLine[];
  choices: readonly ChoicePoint[];
  /** 위에 히어로가 h1 을 갖고 있으면 2, 이 제목이 그 페이지의 h1 이면 1. */
  headingLevel: 1 | 2;
}

/** 주미가 다음 말풍선을 올리기까지의 간격. 길면 기다림이 되고 짧으면 대화가 아니다. */
const LINE_INTERVAL_MS = 900;

/** 묶음이 끝나고 선택지가 뜨기까지의 뜸. 대사와 동시에 뜨면 읽을 틈이 없다. */
const CHOICE_DELAY_MS = 320;

const ROW = 'flex items-start gap-2 md:gap-3';
const AVATAR_SLOT = 'size-9 shrink-0 md:size-10';

/** 레슨 하단 고지 — 계산기 유무에 따라 문구만 갈리고 모양은 같다. */
const NOTICE_SHAPE =
  'mt-6 rounded-xl border border-cb-border bg-cb-tile px-4 py-3 text-xs leading-relaxed text-cb-muted md:mt-8 md:px-5 md:py-4 md:text-sm';

/**
 * 지금 트랙에서 실제로 할 대사만. 트랙이 안 붙은 대사는 항상 포함된다.
 * 트랙을 고르기 전(undefined)에는 트랙 대사가 전부 빠진다 — 그 묶음은 어차피 잠겨 있다.
 */
function linesForTrack(
  lines: readonly JumiLine[],
  track: TrackId | undefined,
): readonly JumiLine[] {
  return lines.filter((line) => !line.track || line.track === track);
}

/**
 * 한 레슨의 대화 카드.
 *
 * 미연시처럼 주미 대사는 한 마디씩 시간차로 올라오고, 선택지 지점에서 멈춘다.
 * 사용자가 답장을 고르면 그게 사용자 말풍선이 되고 다음 묶음이 이어진다.
 *
 * 선택지는 보통 2개지만 분기는 없다 — 어느 쪽을 골라도 같은 설명으로 합류한다.
 * 예외가 성향 레슨(mindset)이고, 거기서는 고른 선택지가 트랙을 켠다.
 *
 * 진행 상태가 필요해 이 부분만 클라이언트 컴포넌트다(useState, 상태관리 라이브러리 없음).
 * 대신 **모든 대사를 처음부터 DOM 에 두고 CSS 로 가린다** — 아직 열리지 않은 대사도,
 * 고르지 않은 트랙의 대사도 서버 HTML 에 그대로 담기고 검색봇이 읽는다.
 */
export default function LessonSection({
  lesson,
  lines,
  choices,
  headingLevel,
}: LessonSectionProps) {
  const segments = useMemo(() => buildDialogueSegments(lines, choices), [lines, choices]);

  const Heading = headingLevel === 1 ? 'h1' : 'h2';

  /** 고른 답장을 순서대로 쌓는다. 길이가 곧 진행 단계다. */
  const [picked, setPicked] = useState<readonly ChoiceOption[]>([]);
  /** 현재 묶음에서 지금까지 뜬 말풍선 수. 첫 줄은 기다리지 않고 바로 보여준다. */
  const [shownLines, setShownLines] = useState(1);

  /** 켜진 트랙. 트랙을 켜는 선택지는 레슨당 하나뿐이라 처음 것을 쓴다. */
  const activeTrack = picked.find((option) => option.track)?.track;

  /**
   * 계산기를 여는 시점 — 마지막 묶음의 대사가 전부 올라온 뒤다.
   *
   * 처음부터 보여주면 주미가 말하는 동안 아래에서 입력칸이 시선을 끌고, 대화를
   * 건너뛴 채로 숫자만 만지게 된다. 그러면 '평단이 내려간다'만 보고 이 레슨이
   * 말하려던 나머지 절반을 놓친다.
   *
   * 단, 잠겨 있는 동안에도 DOM 에는 둔다 — 대사와 같은 규칙이고, '평단 계산기'
   * 자체가 검색어라 색인에서 빠지면 안 된다.
   */
  const lastIndex = segments.length - 1;
  const lastLineCount = linesForTrack(segments[lastIndex]?.lines ?? [], activeTrack).length;
  const calcOpen = picked.length >= lastIndex && shownLines >= lastLineCount;

  useEffect(() => {
    const segment = segments[picked.length];
    if (!segment) return;

    const trackLines = linesForTrack(segment.lines, activeTrack);
    if (shownLines >= trackLines.length) return;

    // 모션을 줄이기로 한 사용자는 기다리게 하지 않는다 — 간격 0 이면 한 틱씩
    // 곧바로 이어져 사실상 즉시 전부 등장한다. 경로를 하나로 유지하는 게 핵심이다.
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const interval = prefersReducedMotion ? 0 : LINE_INTERVAL_MS;

    const timer = setTimeout(() => setShownLines((count) => count + 1), interval);
    return () => clearTimeout(timer);
  }, [segments, picked.length, activeTrack, shownLines]);

  function choose(option: ChoiceOption) {
    setPicked((prev) => [...prev, option]);
    setShownLines(1);
  }

  return (
    // 카드 형태도 본체의 .glass-panel 과 같게 — surface + 얇은 테두리 + 같은 그림자, 반경 1.25rem.
    <article
      aria-labelledby="lesson-heading"
      className="mx-4 rounded-[1.25rem] border border-cb-border bg-cb-surface px-4 py-7 shadow-[var(--cb-shadow-elevated)] md:mx-8 md:px-8 md:py-11"
    >
      <Heading
        id="lesson-heading"
        className="text-center text-xl font-bold tracking-tight md:text-[1.75rem]"
      >
        {lesson.heading}
      </Heading>

      {/* JS 가 없으면 선택지를 누를 수 없다 — 그때는 가린 대사를 전부 펼쳐 읽게 한다. */}
      <noscript>
        <style>{'[data-locked]{display:block!important}'}</style>
      </noscript>

      <ol className="mt-6 flex flex-col gap-2.5 md:mt-9 md:gap-3">
        {segments.map((segment, segmentIndex) => {
          const isPast = segmentIndex < picked.length;
          const isCurrent = segmentIndex === picked.length;
          const isLocked = !isPast && !isCurrent;

          const trackLines = linesForTrack(segment.lines, activeTrack);
          const visibleCount = isPast ? trackLines.length : isCurrent ? shownLines : 0;
          // 고르지 않은 트랙의 대사는 DOM 에는 남기고 가리기만 한다(검색봇은 읽는다).
          const shownIds = new Set(trackLines.slice(0, visibleCount).map((line) => line.id));
          const firstShownId = trackLines[0]?.id;

          const isTyping = isCurrent && shownLines < trackLines.length;
          const pickedText = picked[segmentIndex]?.text;

          return (
            <li key={segment.lines[0].id} hidden={isLocked} data-locked={isLocked ? '' : undefined}>
              <div
                className="flex flex-col gap-2.5 md:gap-3"
                // 새 묶음이 열릴 때 스크린리더가 읽도록. 첫 묶음은 페이지 로드분이라 제외.
                aria-live={segmentIndex === 0 ? undefined : 'polite'}
              >
                {segment.lines.map((line) => {
                  const isLineLocked = !shownIds.has(line.id);

                  return (
                    <div
                      key={line.id}
                      hidden={isLineLocked}
                      data-locked={isLineLocked ? '' : undefined}
                    >
                      <div className={`bubble-in ${ROW}`}>
                        {/* 아바타를 생략한 줄에도 같은 폭을 비워 말풍선 시작선을 맞춘다. */}
                        <span className={AVATAR_SLOT}>
                          {line.id === firstShownId ? (
                            <JumiAvatar art={JUMI_ART.explaining} size="sm" />
                          ) : null}
                        </span>
                        <SpeechBubble speaker="jumi">{line.text}</SpeechBubble>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className={ROW}>
                    <span className={AVATAR_SLOT} />
                    <TypingIndicator />
                  </div>
                )}

                {segment.choice && pickedText !== undefined && (
                  <div className="bubble-in flex justify-end">
                    <SpeechBubble speaker="user">{pickedText}</SpeechBubble>
                  </div>
                )}

                {segment.choice && pickedText === undefined && !isTyping && (
                  <div
                    className="bubble-in flex flex-col items-end gap-2"
                    style={{ animationDelay: `${CHOICE_DELAY_MS}ms` }}
                  >
                    <p className="pr-1 text-xs text-cb-muted md:text-sm">{CHOICE_HINT}</p>
                    <div
                      role="group"
                      aria-label={CHOICE_GROUP_LABEL}
                      className="flex w-full flex-col items-end gap-2"
                    >
                      {segment.choice.options.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => choose(option)}
                          // 주미 말풍선(채워진 회색)과 확실히 달라야 '눌러야 하는 것'으로 읽힌다.
                          // 그래서 아웃라인 + 사용자 말풍선과 같은 색 계열(point)로 둔다 —
                          // 고르면 그대로 채워진 파란 말풍선이 되니 전환도 자연스럽다.
                          className="max-w-[85%] cursor-pointer rounded-3xl rounded-br-md border border-cb-point bg-transparent px-4 py-3 text-left text-[0.9375rem] leading-[1.65] text-cb-point transition-colors hover:bg-cb-point hover:text-cb-on-point focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cb-point active:bg-cb-point active:text-cb-on-point md:max-w-[78%] md:px-5 md:py-3.5 md:text-base"
                        >
                          {option.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/*
        계산기와 그 고지는 한 덩어리로 잠근다. 고지만 먼저 뜨면 '계산기에 미리 채워둔
        값은…' 이라고 말하는데 계산기는 아직 없는 상태가 된다.
      */}
      {lesson.calc !== undefined && (
        <div className="mt-3 md:mt-4" data-locked={calcOpen ? undefined : ''} hidden={!calcOpen}>
          <LessonCalc calc={lesson.calc} />
          <p className={NOTICE_SHAPE}>{CALC_NOTICE}</p>
        </div>
      )}

      {/*
        계산기가 없는 레슨의 고지. 문구가 다르다 — FIGURES_NOTICE 는 '숫자를 일부러
        적지 않았다'고 말하는데, 계산기가 있으면 그 말이 거짓이 된다.
      */}
      {lesson.figuresNotice === true && lesson.calc === undefined && (
        <p className={NOTICE_SHAPE}>{FIGURES_NOTICE}</p>
      )}
    </article>
  );
}
