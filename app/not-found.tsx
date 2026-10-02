import type { Metadata } from 'next';
import Link from 'next/link';
import JumiAvatar from '@/components/jumi/JumiAvatar';
import SiteFooter from '@/components/layout/SiteFooter';
import { SERVICE_NAME } from '@/config/site';
import { JUMI_ART } from '@/domain/jumi/artwork';

/**
 * noindex 는 적지 않는다 — Next 가 404 응답에 `<meta name="robots" content="noindex">` 를
 * 이미 넣어서, 여기서 또 지정하면 같은 태그가 두 번 나간다.
 */
export const metadata: Metadata = {
  title: `페이지를 찾을 수 없어요 · ${SERVICE_NAME}`,
};

/**
 * 없는 주소로 들어왔을 때.
 *
 * PageShell 을 쓰지 않는다 — 그쪽은 '홈으로 돌아가기'가 화면 위 작은 글씨로 붙는데,
 * 여기서는 돌아가는 것 말고 할 일이 없어서 본문 한가운데 버튼으로 둔다.
 *
 * 주소를 화면에 적지 않는 것도 의도다. 사용자가 친 주소를 그대로 되비추면
 * 잘못 친 사람에게 두 번 알려주는 꼴이고, 주미 말투와도 맞지 않는다.
 */
export default function NotFound() {
  return (
    <>
      <main className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 pt-20 pb-16 text-center lg:px-12 lg:pt-28">
        <JumiAvatar art={JUMI_ART.explaining} size="lg" />

        <h1 className="mt-7 text-xl font-bold text-cb-foreground md:text-2xl">
          어라, 여기엔 아무것도 없네요
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-cb-muted md:text-base">
          주소가 바뀌었거나, 아직 만들지 않은 페이지예요. 홈으로 가면 지금 볼 수 있는
          것들을 한눈에 보여드릴게요.
        </p>

        <Link
          href="/"
          className="mt-8 rounded-xl bg-cb-point px-5 py-3 text-sm font-bold text-cb-on-point transition-colors hover:bg-cb-point-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cb-point"
        >
          홈으로 가기
        </Link>
      </main>

      <SiteFooter width="hub" />
    </>
  );
}
