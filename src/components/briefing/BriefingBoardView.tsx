import Link from 'next/link';
import JumiAvatar from '@/components/jumi/JumiAvatar';
import { BRIEFING_ARCHIVE_PATH } from '@/domain/briefing/route';
import type { Briefing, BriefingRisk, IssueTone } from '@/domain/briefing/types';
import { CALENDAR_PATH } from '@/domain/calendar/route';
import { JUMI_ART } from '@/domain/jumi/artwork';
import {
  BRIEFING_CLOSING_NOTE,
  BRIEFING_HEADING,
  BRIEFING_JUMI_LEAD,
  BRIEFING_LEAD,
  BRIEFING_SOURCE_NAME,
  BRIEFING_SOURCE_NOTE,
  BRIEFING_SOURCE_URL,
  BRIEFING_STOCK_NOTE,
} from '@/domain/jumi/landingCopy';

interface BriefingBoardViewProps {
  briefing: Briefing;
}

/** 오른 쪽이 빨강. 다른 화면과 같은 규칙이어야 한다. */
const TONE: Record<IssueTone, { text: string; className: string }> = {
  positive: { text: '좋은 소식', className: 'bg-cb-negative/16 text-[#ff8a93]' },
  negative: { text: '조심할 것', className: 'bg-cb-positive/16 text-[#93b4f8]' },
  neutral: { text: '그냥 소식', className: 'bg-white/8 text-cb-muted' },
};

const RISK: Record<BriefingRisk['level'], { text: string; className: string }> = {
  high: { text: '높음', className: 'bg-cb-negative/16 text-[#ff8a93]' },
  mid: { text: '보통', className: 'bg-cb-trader/18 text-cb-trader' },
  low: { text: '낮음', className: 'bg-white/8 text-cb-muted' },
};

/**
 * 장전 브리핑 화면.
 *
 * 글이 길고 어렵다 — 주린이한테 설명 없이 HBM4E·Section 122 가 나온다. 그래서
 * '오늘 한 문단' 을 제일 크게 두고 나머지는 `<details>` 로 접었다. 한 문단만 읽고
 * 나가도 성립하는 게 이 화면의 기준이다.
 *
 * 서버 컴포넌트다. 접기는 전부 `<details>` 라 자바스크립트가 필요 없다.
 */
export default function BriefingBoardView({ briefing }: BriefingBoardViewProps) {
  return (
    <>
      <div>
        <span className="text-xs font-bold tracking-[0.18em] text-cb-point lg:text-[13px]">
          {briefing.dateLabel}
        </span>
        <h1 className="mt-2 text-[1.65rem] leading-snug font-bold tracking-tight lg:text-[2.5rem]">
          {BRIEFING_HEADING}
        </h1>
        {/*
          남의 글이라 출처를 밝혀야 하는데, 따로 칸을 두는 대신 설명 문장 안에 넣는다.
          첫 화면에서 제목 바로 아래라 스크롤 없이 읽힌다.
        */}
        <p className="mt-2 text-[13.5px] leading-relaxed text-cb-muted lg:text-[15px]">
          {BRIEFING_LEAD}{' '}
          <a
            className="text-cb-point underline-offset-4 hover:underline"
            href={BRIEFING_SOURCE_URL}
            rel="noopener noreferrer nofollow"
            target="_blank"
          >
            {BRIEFING_SOURCE_NAME}
          </a>
          {BRIEFING_SOURCE_NOTE}
        </p>
      </div>

      {/* 오늘 글이 아니면 언제 것인지 밝힌다 — 휴장일에는 직전 거래일 글이 온다. */}
      {!briefing.isToday && (
        <p className="mt-5 rounded-xl border border-cb-border bg-cb-surface px-4 py-3 text-[12.5px] leading-relaxed text-cb-muted lg:text-[13px]">
          오늘은 장이 쉬어서 새 브리핑이 없어요. <b className="text-cb-foreground">{briefing.dateLabel}</b> 에 나온 가장 최근 글을 보여드릴게요.
        </p>
      )}

      <div className="mt-[18px] flex items-center gap-2.5 lg:mt-6 lg:gap-3">
        <JumiAvatar art={JUMI_ART.greeting} size="sm" />
        <p className="text-[13px] leading-snug text-cb-foreground lg:text-sm">
          {BRIEFING_JUMI_LEAD}
        </p>
      </div>

      {/* 오늘 한 문단 — 이 화면의 본체 */}
      <section className="mt-6 rounded-2xl border border-cb-point/30 bg-cb-point/[0.07] p-5 lg:mt-8 lg:p-7">
        <h2 className="text-[11.5px] font-bold tracking-[0.1em] text-[#9dbbf5] lg:text-xs">
          오늘 한 문단
        </h2>
        <p className="mt-3 text-[15px] leading-[1.8] text-cb-foreground lg:text-[17px]">
          {briefing.summaryLine}
        </p>
      </section>

      <div className="mt-9 flex flex-col gap-9 lg:mt-12 lg:flex-row lg:items-start lg:gap-14">
        <div className="lg:w-[62%] lg:shrink-0">
          {briefing.issues.length > 0 && (
            <section>
              <SectionTitle count={briefing.issues.length}>오늘의 이슈</SectionTitle>
              <div className="mt-3 flex flex-col gap-3 lg:mt-4">
                {briefing.issues.map((issue, index) => {
                  const tone = TONE[issue.tone];
                  // 앞 두 건만 펼쳐 둔다. 다섯 건이 전부 열려 있으면 화면이 글 더미가 된다.
                  const body = (
                    <>
                      {issue.summary !== '' && (
                        <p className="mt-3 text-[13.5px] leading-[1.75] text-[#b6b6c0] lg:text-sm">
                          {issue.summary}
                        </p>
                      )}
                      {issue.stocks.length > 0 && (
                        <>
                          <ul className="mt-3.5 flex flex-wrap gap-1.5">
                            {issue.stocks.map((stock) => (
                              <li
                                className="flex items-baseline gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-cb-foreground"
                                key={`${stock.name}-${stock.code ?? ''}`}
                              >
                                {stock.name}
                                {stock.code !== null && (
                                  <span className="font-mono text-[10.5px] text-cb-muted">
                                    {stock.code}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                          <p className="mt-3 text-[11.5px] text-cb-muted lg:text-xs">
                            {BRIEFING_STOCK_NOTE}
                          </p>
                        </>
                      )}
                    </>
                  );

                  const head = (
                    <>
                      <span className="flex size-[22px] shrink-0 items-center justify-center rounded-md bg-white/7 font-mono text-[11.5px] font-bold text-cb-muted">
                        {issue.rank}
                      </span>
                      <span className="grow text-[15px] leading-snug font-bold text-cb-foreground lg:text-[17px]">
                        {issue.title}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-[3px] text-[10.5px] font-bold lg:text-[11px] ${tone.className}`}
                      >
                        {tone.text}
                      </span>
                    </>
                  );

                  return index < 2 ? (
                    <article
                      className="rounded-2xl border border-cb-border bg-cb-surface p-[18px] lg:p-6"
                      key={issue.rank}
                    >
                      <div className="flex items-start gap-2.5 lg:items-center">{head}</div>
                      {body}
                    </article>
                  ) : (
                    <details
                      className="rounded-2xl border border-cb-border bg-cb-surface px-[18px] lg:px-6"
                      key={issue.rank}
                    >
                      <summary className="flex cursor-pointer list-none items-start gap-2.5 py-[18px] lg:items-center lg:py-5">
                        {head}
                      </summary>
                      <div className="pb-[18px] lg:pb-6">{body}</div>
                    </details>
                  );
                })}
              </div>
            </section>
          )}

          {briefing.newThemes.length > 0 && (
            <section className="mt-10">
              <SectionTitle count={briefing.newThemes.length}>새로 뜬 테마</SectionTitle>
              <div className="mt-3 flex flex-col gap-3 lg:mt-4">
                {briefing.newThemes.map((theme) => (
                  <article
                    className="rounded-2xl border border-cb-border bg-cb-surface p-[18px] lg:p-6"
                    key={theme.name}
                  >
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-[15px] font-bold text-cb-foreground lg:text-base">
                        {theme.name}
                      </h3>
                      {theme.horizon !== null && (
                        <span className="rounded-full bg-white/6 px-2.5 py-[3px] text-[10.5px] font-bold text-cb-muted">
                          {theme.horizon}
                        </span>
                      )}
                    </div>
                    {theme.trigger !== '' && (
                      <p className="mt-2.5 text-[13px] leading-relaxed text-[#b6b6c0] lg:text-[13.5px]">
                        {theme.trigger}
                      </p>
                    )}
                    {theme.stocks.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {theme.stocks.map((stock) => (
                          <li
                            className="flex items-baseline gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-cb-foreground"
                            key={`${stock.name}-${stock.code ?? ''}`}
                          >
                            {stock.name}
                            {stock.code !== null && (
                              <span className="font-mono text-[10.5px] text-cb-muted">
                                {stock.code}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                    {theme.risk !== null && (
                      <p className="mt-3.5 border-t border-cb-border pt-3 text-[12.5px] leading-relaxed text-cb-muted">
                        <b className="font-bold text-cb-trader">걸림돌</b> {theme.risk}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* 곁다리 — 테마·일정·위험 */}
        <div className="flex grow flex-col gap-6">
          {briefing.themes.length > 0 && (
            <section className="rounded-2xl border border-cb-border bg-cb-surface p-5 lg:p-6">
              <h2 className="text-[15px] font-bold text-cb-foreground lg:text-base">
                오늘 움직일 테마
              </h2>
              <ul className="mt-3.5">
                {briefing.themes.slice(0, 4).map((theme, index) => (
                  <li
                    className={`flex gap-3 py-3 ${index > 0 ? 'border-t border-cb-border' : 'pt-0'}`}
                    key={theme.theme}
                  >
                    <span
                      className={`w-[18px] shrink-0 font-mono text-[13px] font-bold ${
                        index < 2 ? 'text-cb-trader' : 'text-cb-muted'
                      }`}
                    >
                      {theme.rank}
                    </span>
                    <div className="min-w-0 grow">
                      <p className="text-sm font-bold text-cb-foreground">{theme.theme}</p>
                      {theme.reason !== '' && (
                        <p className="mt-1 text-xs leading-snug text-cb-muted">{theme.reason}</p>
                      )}
                      {theme.leaders.length > 0 && (
                        <p className="mt-1.5 text-[11.5px] text-[#6f6f78]">
                          {theme.leaders.join(' · ')}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {briefing.themes.length > 4 && (
                <details className="mt-1">
                  <summary className="cursor-pointer list-none rounded-xl border border-white/10 py-2.5 text-center text-[12.5px] text-cb-muted">
                    나머지 {briefing.themes.length - 4}개 보기
                  </summary>
                  <ul>
                    {briefing.themes.slice(4).map((theme) => (
                      <li className="flex gap-3 border-t border-cb-border py-3" key={theme.theme}>
                        <span className="w-[18px] shrink-0 font-mono text-[13px] font-bold text-cb-muted">
                          {theme.rank}
                        </span>
                        <div className="min-w-0 grow">
                          <p className="text-sm font-bold text-cb-foreground">{theme.theme}</p>
                          {theme.reason !== '' && (
                            <p className="mt-1 text-xs leading-snug text-cb-muted">
                              {theme.reason}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </section>
          )}

          {briefing.schedules.length > 0 && (
            <section className="rounded-2xl border border-cb-border bg-cb-surface p-5 lg:p-6">
              {/*
                출처 필드 이름은 weekly_schedules 지만 7/24 만료 같은 먼 날짜가 섞여 온다.
                '이번 주'라고 적으면 화면이 거짓말을 한다.
              */}
              <h2 className="text-[15px] font-bold text-cb-foreground lg:text-base">
                다가오는 일정
              </h2>
              <ul className="mt-3.5">
                {briefing.schedules.map((schedule, index) => (
                  <li
                    className={`flex items-center gap-3 py-2.5 ${index > 0 ? 'border-t border-cb-border' : 'pt-0'}`}
                    key={`${schedule.date}-${schedule.event}`}
                  >
                    <span className="w-[62px] shrink-0 font-mono text-[12.5px] font-bold text-cb-foreground">
                      {schedule.date}
                    </span>
                    <span className="grow text-[13px] leading-snug text-[#b6b6c0]">
                      {schedule.event}
                    </span>
                    {schedule.market !== '' && (
                      <span className="shrink-0 rounded-full bg-white/6 px-2 py-[3px] text-[10.5px] text-cb-muted">
                        {schedule.market}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-3.5 text-xs text-cb-muted">
                전체 일정은{' '}
                <Link className="text-cb-point underline-offset-4 hover:underline" href={CALENDAR_PATH}>
                  증시 일정
                </Link>
                에서 볼 수 있어요.
              </p>
            </section>
          )}

          {briefing.risks.length > 0 && (
            <section className="rounded-2xl border border-cb-border bg-cb-surface p-5 lg:p-6">
              <h2 className="text-[15px] font-bold text-cb-foreground lg:text-base">지켜볼 위험</h2>
              <ul className="mt-3.5">
                {briefing.risks.slice(0, 3).map((risk, index) => (
                  <li
                    className={`flex gap-3 py-3 ${index > 0 ? 'border-t border-cb-border' : 'pt-0'}`}
                    key={risk.name}
                  >
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-[3px] text-[10.5px] font-bold ${RISK[risk.level].className}`}
                    >
                      {RISK[risk.level].text}
                    </span>
                    <div className="min-w-0 grow">
                      <p className="text-[13.5px] font-bold text-cb-foreground">{risk.name}</p>
                      {risk.status !== '' && (
                        <p className="mt-1 text-xs leading-snug text-cb-muted">{risk.status}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {briefing.risks.length > 3 && (
                <details className="mt-1">
                  <summary className="cursor-pointer list-none rounded-xl border border-white/10 py-2.5 text-center text-[12.5px] text-cb-muted">
                    나머지 {briefing.risks.length - 3}개 보기
                  </summary>
                  <ul>
                    {briefing.risks.slice(3).map((risk) => (
                      <li className="flex gap-3 border-t border-cb-border py-3" key={risk.name}>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-[3px] text-[10.5px] font-bold ${RISK[risk.level].className}`}
                        >
                          {RISK[risk.level].text}
                        </span>
                        <div className="min-w-0 grow">
                          <p className="text-[13.5px] font-bold text-cb-foreground">{risk.name}</p>
                          {risk.status !== '' && (
                            <p className="mt-1 text-xs leading-snug text-cb-muted">{risk.status}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </section>
          )}
        </div>
      </div>

      {briefing.scans.length > 0 && (
        <section className="mt-10 lg:mt-14">
          <SectionTitle>오늘 시장 한눈에</SectionTitle>
          <dl className="mt-3 grid grid-cols-1 gap-x-14 rounded-2xl border border-cb-border bg-cb-surface px-5 py-2 lg:mt-4 lg:grid-cols-2 lg:px-7">
            {briefing.scans.map((scan) => (
              <div className="flex gap-4 border-b border-cb-border py-3.5 last:border-b-0" key={scan.label}>
                <dt className="w-[108px] shrink-0 text-[13px] font-bold text-cb-foreground lg:w-[130px]">
                  {scan.label}
                </dt>
                <dd className="m-0 grow text-[12.5px] leading-relaxed text-cb-muted lg:text-[13px]">
                  {scan.detail}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/*
        출처의 애널리스트 코멘트는 싣지 않는다 — '분할 매수·손절 라인 필수' 같은 매매
        지시가 문장 안에 섞여 있어서, 출처를 밝혀도 우리 화면에 올릴 글이 아니다.
        대신 이 페이지가 누구 글인지는 맨 위 출처 칸이 계속 말하고 있다.
      */}
      <p className="mt-9 border-t border-cb-border pt-6 text-[11.5px] leading-relaxed text-cb-muted lg:mt-12 lg:text-xs">
        {BRIEFING_CLOSING_NOTE}
      </p>

      <p className="mt-5 text-[13px] lg:text-sm">
        <Link
          className="text-cb-point underline-offset-4 hover:underline"
          href={BRIEFING_ARCHIVE_PATH}
        >
          지난 브리핑 보기 →
        </Link>
      </p>
    </>
  );
}

function SectionTitle({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <h2 className="text-base font-bold tracking-tight lg:text-xl">
      {children}
      {count !== undefined && (
        <span className="ml-2 font-mono text-[13px] font-normal text-cb-muted lg:text-[15px]">
          {count}
        </span>
      )}
    </h2>
  );
}
