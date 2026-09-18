import Link from 'next/link';
import JumiAvatar from '@/components/jumi/JumiAvatar';
import { JUMI_ART } from '@/domain/jumi/artwork';
import { BACK_TO_HOME, MASCOT_NAME, MASCOT_ROLE } from '@/domain/jumi/landingCopy';

/**
 * 루트가 아닌 레슨 페이지의 머리말.
 * 히어로(주미의 첫 인사)는 처음 만나는 자리에서만 의미가 있으므로,
 * 여기서는 돌아갈 길과 화자가 누구인지만 짧게 남긴다.
 */
export default function LessonIntro() {
  return (
    <header className="px-5 pt-8 md:px-8 md:pt-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-cb-muted transition-colors hover:text-cb-foreground md:text-base"
      >
        <span aria-hidden="true">←</span>
        {BACK_TO_HOME}
      </Link>

      <div className="mt-6 flex items-center gap-2.5 md:mt-8">
        <JumiAvatar art={JUMI_ART.greeting} size="sm" />
        <p className="text-sm text-cb-muted md:text-base">
          {MASCOT_ROLE} {MASCOT_NAME}
        </p>
      </div>
    </header>
  );
}
