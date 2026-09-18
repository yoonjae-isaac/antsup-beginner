import Link from 'next/link';
import { BACK_TO_HOME } from '@/domain/jumi/landingCopy';

/**
 * 홈(오비트 허브)으로 돌아가는 링크.
 *
 * 레슨 페이지마다 따로 적지 않고 여기 하나로 둔다 — 첫 레슨에만 빠져 있어서
 * 홈에서 들어오면 돌아갈 길이 없던 적이 있다.
 * py 로 손가락이 닿을 높이를 벌어 두었다(글자만 두면 20px 밖에 안 된다).
 */
export default function HomeLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1 rounded-lg py-2 text-sm text-cb-muted transition-colors hover:text-cb-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cb-point md:text-base"
    >
      <span aria-hidden="true">←</span>
      {BACK_TO_HOME}
    </Link>
  );
}
