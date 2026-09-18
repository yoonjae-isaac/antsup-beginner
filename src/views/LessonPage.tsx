import CtaSection from '@/components/landing/CtaSection';
import LessonIntro from '@/components/landing/LessonIntro';
import LessonSection from '@/components/landing/LessonSection';
import StepRail from '@/components/landing/StepRail';
import { findNextLesson, lessonPath, type Lesson } from '@/domain/jumi/lessons';
import { LESSON_CHOICES, LESSON_LINES } from '@/domain/jumi/scripts';

interface LessonPageProps {
  lesson: Lesson;
}

/**
 * 루트가 아닌 레슨 화면.
 * 이미 주미를 만난 사람이 오는 자리라 인사를 반복하지 않고, 돌아갈 길만 남긴다.
 */
export default function LessonPage({ lesson }: LessonPageProps) {
  const next = findNextLesson(lesson.slug);

  return (
    <main className="mx-auto w-full max-w-md md:max-w-2xl">
      <LessonIntro />
      <div className="pt-6 md:pt-8">
        <StepRail currentSlug={lesson.slug} />
        <LessonSection
          lesson={lesson}
          lines={LESSON_LINES[lesson.slug]}
          choices={LESSON_CHOICES[lesson.slug]}
        />
      </div>
      <CtaSection href={next && lessonPath(next.slug)} />
    </main>
  );
}
