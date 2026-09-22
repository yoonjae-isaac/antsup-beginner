import Link from 'next/link';
import { CTA_FINISH_LABEL, CTA_LABEL } from '@/domain/jumi/landingCopy';
import { findNextLesson, lessonPath } from '@/domain/jumi/lessons';

interface CtaSectionProps {
  /** 지금 보고 있는 레슨. 다음 화가 있는지는 여기서 직접 찾는다. */
  slug: string;
}

const SHAPE =
  'block w-full rounded-full bg-cb-point px-6 py-4 text-center text-base font-bold text-cb-on-point transition-colors hover:bg-cb-point-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cb-point active:scale-[0.99] md:mx-auto md:w-fit md:px-14 md:py-5 md:text-lg';

/**
 * 하단 CTA.
 *
 * 다음 레슨이 있으면 그리로, 커리큘럼의 마지막이면 홈 허브로 보낸다.
 * 예전에는 마지막에서 눌리지 않는 버튼만 남겼는데, 2부가 붙으면서 여기가 진짜
 * 끝이 됐다 — 다 읽은 사람 앞에 '다음 이야기'라고 적힌 죽은 버튼을 두면
 * 끝난 건지 고장 난 건지 알 수가 없다.
 *
 * 모바일은 전면 버튼, PC 는 컬럼 폭만큼 늘리면 과해서 내용 폭으로 줄여 가운데 둔다.
 */
export default function CtaSection({ slug }: CtaSectionProps) {
  const next = findNextLesson(slug);

  return (
    <section className="px-5 pt-9 pb-14 md:px-8 md:pt-12 md:pb-24">
      <Link className={SHAPE} href={next ? lessonPath(next.slug) : '/'}>
        {next ? CTA_LABEL : CTA_FINISH_LABEL}
      </Link>
    </section>
  );
}
