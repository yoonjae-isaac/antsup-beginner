import Link from 'next/link';
import { CTA_LABEL } from '@/domain/jumi/landingCopy';

interface CtaSectionProps {
  /** 다음 레슨 경로. 마지막 레슨이면 없다. */
  href?: string;
}

const SHAPE =
  'block w-full rounded-full bg-cb-point px-6 py-4 text-center text-base font-bold text-cb-on-point transition-colors hover:bg-cb-point-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cb-point active:scale-[0.99] md:mx-auto md:w-fit md:px-14 md:py-5 md:text-lg';

/**
 * 하단 CTA.
 *
 * 다음 레슨이 있으면 진짜 링크가 되고, 아직 없으면 자리만 잡는 버튼으로 남는다.
 * 모바일은 전면 버튼, PC 는 컬럼 폭만큼 늘리면 과해서 내용 폭으로 줄여 가운데 둔다.
 */
export default function CtaSection({ href }: CtaSectionProps) {
  return (
    <section className="px-5 pt-9 pb-14 md:px-8 md:pt-12 md:pb-24">
      {href ? (
        <Link href={href} className={SHAPE}>
          {CTA_LABEL}
        </Link>
      ) : (
        <button type="button" className={SHAPE}>
          {CTA_LABEL}
        </button>
      )}
    </section>
  );
}
