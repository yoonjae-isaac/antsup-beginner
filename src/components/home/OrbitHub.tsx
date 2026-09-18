import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import OrbitIcon from '@/components/home/OrbitIcon';
import { JUMI_ART } from '@/domain/jumi/artwork';
import {
  DIRECTION_VECTOR,
  ORBIT_EMPTY_DIRECTIONS,
  ORBIT_ENTRIES,
  type OrbitDirection,
} from '@/domain/jumi/homeOrbit';
import { MASCOT_NAME, MASCOT_ROLE, ORBIT_NAV_LABEL } from '@/domain/jumi/landingCopy';

/**
 * 링 반지름. 0~100 좌표계 기준이자 무대 크기에 대한 %라, 버튼 위치(CSS)와
 * 궤도 원(SVG)이 같은 숫자를 본다 — 둘을 따로 적으면 반드시 어긋난다.
 */
const ORBIT_RADIUS_UNITS = 35;
const INNER_RING_UNITS = 23;

/** 중심에서 뻗는 연결선. 아바타 밖에서 시작해 버튼 앞에서 끝난다. */
const LINE_START = 17;
const LINE_END = 27.5;

/** 노드마다 이만큼씩 어긋나게 띄운다. 동시에 움직이면 떠 있는 느낌이 죽는다. */
const FLOAT_STAGGER_MS = 700;

function slotStyle(direction: OrbitDirection, delayMs?: number): CSSProperties {
  const vector = DIRECTION_VECTOR[direction];

  return {
    '--ox': vector.x,
    '--oy': vector.y,
    ...(delayMs === undefined ? {} : { animationDelay: `${delayMs}ms` }),
  } as CSSProperties;
}

/**
 * 주미를 가운데 두고 여덟 방향으로 입구가 떠 있는 홈 허브.
 * 이동 연결은 아직 없다 — 자리와 형태만 잡아 둔 상태다.
 */
export default function OrbitHub() {
  return (
    <div
      className="relative aspect-square w-full max-w-[390px] lg:max-w-[600px]"
      style={{ '--orbit-radius': `${ORBIT_RADIUS_UNITS}%` } as CSSProperties}
    >
      {/* 궤도 링과 중심에서 뻗는 연결선. 버튼 위치와 같은 방향 벡터를 본다. */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r={ORBIT_RADIUS_UNITS}
          fill="none"
          stroke="var(--cb-border-strong)"
          strokeWidth="1"
          strokeDasharray="0.6 2.2"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx="50"
          cy="50"
          r={INNER_RING_UNITS}
          fill="none"
          stroke="var(--cb-border-subtle)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        {ORBIT_ENTRIES.map((entry) => {
          const vector = DIRECTION_VECTOR[entry.direction];

          return (
            <line
              key={entry.id}
              x1={50 + vector.x * LINE_START}
              y1={50 + vector.y * LINE_START}
              x2={50 + vector.x * LINE_END}
              y2={50 + vector.y * LINE_END}
              stroke="var(--cb-border-strong)"
              strokeWidth="1"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {/* 주미 — 허브의 중심. 은은한 링 글로우로 시선이 여기 먼저 닿게 한다. */}
      <div className="absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-cb-border-strong bg-cb-surface shadow-[0_0_0_9px_rgba(91,141,239,0.05),0_0_52px_rgba(91,141,239,0.16)] lg:size-[168px] lg:shadow-[0_0_0_14px_rgba(91,141,239,0.05),0_0_86px_rgba(91,141,239,0.16)]">
        <Image
          src={JUMI_ART.greeting.src ?? ''}
          alt={`${MASCOT_ROLE} ${MASCOT_NAME}`}
          width={168}
          height={168}
          priority
          className="size-full object-cover"
        />
      </div>

      {/* 아직 안 채운 칸. 미완성이 아니라 '여기에 더 붙는다'는 표시다. */}
      {ORBIT_EMPTY_DIRECTIONS.map((direction) => (
        <span
          key={direction}
          className="orbit-slot size-[13px] rounded-full border border-dashed border-cb-border-strong lg:size-[15px]"
          style={slotStyle(direction)}
        />
      ))}

      <nav aria-label={ORBIT_NAV_LABEL}>
        <ul>
          {ORBIT_ENTRIES.map((entry, index) => {
            const shell = `group flex w-[92px] flex-col items-center gap-2.5 rounded-2xl border-0 bg-transparent p-0 text-cb-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cb-point lg:w-auto lg:flex-row lg:gap-3 lg:rounded-full lg:py-2.5 lg:pr-5 lg:pl-2.5 lg:transition-colors ${
              entry.href ? 'cursor-pointer' : 'cursor-default'
            } ${
              entry.primary
                ? 'lg:border lg:border-cb-trader lg:bg-[#241A0B] lg:hover:bg-[#2C2010]'
                : 'lg:border lg:border-cb-border lg:bg-cb-surface lg:hover:border-cb-border-strong lg:hover:bg-cb-hover'
            }`;

            const body = (
              <>
                <span
                  className={`flex size-14 shrink-0 items-center justify-center rounded-[18px] transition-transform duration-200 group-hover:-translate-y-0.5 lg:size-[42px] lg:rounded-full lg:transition-none lg:group-hover:translate-y-0 ${
                    entry.primary
                      ? 'border border-cb-trader bg-cb-trader text-[#17120A]'
                      : 'border border-cb-border bg-cb-surface text-cb-point group-hover:border-cb-border-strong lg:border-0 lg:bg-[#15151A]'
                  }`}
                >
                  <OrbitIcon name={entry.icon} />
                </span>
                <span
                  className={`text-center text-[11.5px] leading-snug tracking-tight lg:text-[15px] lg:whitespace-nowrap ${
                    entry.primary
                      ? 'font-semibold text-cb-foreground'
                      : 'text-[#B6B6C0] lg:font-medium lg:text-cb-foreground'
                  }`}
                >
                  {entry.label}
                </span>
              </>
            );

            return (
              <li
                key={entry.id}
                className="orbit-slot orbit-node"
                style={slotStyle(entry.direction, index * FLOAT_STAGGER_MS)}
              >
                {entry.href ? (
                  <Link href={entry.href} className={shell}>
                    {body}
                  </Link>
                ) : (
                  // 아직 갈 곳이 없으면 disabled — 눌러도 아무 일이 없는 버튼을
                  // 살아 있는 척 두면 초보는 고장난 화면으로 읽는다.
                  <button type="button" disabled className={shell}>
                    {body}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
