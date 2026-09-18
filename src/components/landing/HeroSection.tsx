import JumiAvatar from '@/components/jumi/JumiAvatar';
import SpeechBubble from '@/components/jumi/SpeechBubble';
import { JUMI_ART } from '@/domain/jumi/artwork';
import { HERO_LINES } from '@/domain/jumi/heroScript';
import { HERO_HEADING, MASCOT_NAME, MASCOT_ROLE } from '@/domain/jumi/landingCopy';

/** 히어로 — 주미가 먼저 말을 거는 장면. */
export default function HeroSection() {
  return (
    // 위에 홈 링크 머리말이 오므로 여기서 상단 여백을 다 먹지 않는다.
    <section aria-labelledby="hero-heading" className="px-5 pt-6 pb-9 md:px-8 md:pt-10 md:pb-12">
      <h1
        id="hero-heading"
        className="text-center text-[1.75rem] leading-snug font-bold tracking-tight md:text-[2.5rem]"
      >
        {HERO_HEADING}
      </h1>

      <div className="mt-7 flex flex-col items-center gap-2.5 md:mt-10 md:gap-3">
        <JumiAvatar art={JUMI_ART.greeting} size="lg" />
        <p className="text-sm text-cb-muted md:text-base">
          {MASCOT_ROLE} {MASCOT_NAME}
        </p>
      </div>

      {/*
        히어로는 주미가 먼저 건네는 인사라 기다릴 이유가 없다 — 타이머 없이
        CSS 지연만으로 순서대로 띄운다. 덕분에 이 섹션은 서버 컴포넌트로 남는다.
      */}
      <div className="mt-6 flex flex-col gap-2 md:mt-9 md:gap-2.5">
        {HERO_LINES.map((line, index) => (
          <div
            key={line.id}
            className="bubble-in"
            style={{ animationDelay: `${index * 520}ms` }}
          >
            <SpeechBubble speaker="jumi">{line.text}</SpeechBubble>
          </div>
        ))}
      </div>
    </section>
  );
}
