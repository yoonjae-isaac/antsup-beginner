import JumiAvatar from '@/components/jumi/JumiAvatar';
import HomeLink from '@/components/layout/HomeLink';
import { JUMI_ART } from '@/domain/jumi/artwork';
import { MASCOT_NAME, MASCOT_ROLE } from '@/domain/jumi/landingCopy';

/**
 * 첫 레슨이 아닌 레슨 페이지의 머리말.
 * 히어로(주미의 첫 인사)는 처음 만나는 자리에서만 의미가 있으므로,
 * 여기서는 돌아갈 길과 화자가 누구인지만 짧게 남긴다.
 */
export default function LessonIntro() {
  return (
    <header className="px-5 pt-7 md:px-8 md:pt-11">
      <HomeLink />

      <div className="mt-5 flex items-center gap-2.5 md:mt-7">
        <JumiAvatar art={JUMI_ART.greeting} size="sm" />
        <p className="text-sm text-cb-muted md:text-base">
          {MASCOT_ROLE} {MASCOT_NAME}
        </p>
      </div>
    </header>
  );
}
