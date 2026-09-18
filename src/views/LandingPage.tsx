import CtaSection from '@/components/landing/CtaSection';
import HeroSection from '@/components/landing/HeroSection';
import LessonSection from '@/components/landing/LessonSection';
import StepRail from '@/components/landing/StepRail';
import SiteFooter from '@/components/layout/SiteFooter';
import { findNextLesson, lessonPath, type Lesson } from '@/domain/jumi/lessons';
import { LESSON_CHOICES, LESSON_LINES } from '@/domain/jumi/scripts';

interface LandingPageProps {
  lesson: Lesson;
}

/**
 * 루트 화면 — 주미를 처음 만나는 자리라 히어로(첫 인사)가 붙는다.
 *
 * 레이아웃은 md(768px) 하나를 경계로 모바일/PC 두 벌이다.
 * PC 는 전체 폭으로 늘리지 않고 중앙 컬럼 + 좌우 여백을 유지한다 —
 * 대화가 가로로 길어지면 카톡 같은 느낌이 사라지고 읽기도 나빠진다.
 */
export default function LandingPage({ lesson }: LandingPageProps) {
  const next = findNextLesson(lesson.slug);

  return (
    <>
      <main className="mx-auto w-full max-w-md md:max-w-2xl">
        <HeroSection />
        <StepRail currentSlug={lesson.slug} />
        <LessonSection
          lesson={lesson}
          lines={LESSON_LINES[lesson.slug]}
          choices={LESSON_CHOICES[lesson.slug]}
          headingLevel={2}
        />
        <CtaSection href={next && lessonPath(next.slug)} />
      </main>

      <SiteFooter width="reading" />
    </>
  );
}
