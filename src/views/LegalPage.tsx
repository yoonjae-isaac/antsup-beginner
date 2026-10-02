import PageShell from '@/components/layout/PageShell';
import { LEGAL_UPDATED, type LegalSection } from '@/domain/legal/content';

interface LegalPageProps {
  title: string;
  /** 본문 앞에 한 문단. 약관처럼 들머리가 없는 문서는 생략한다. */
  intro?: string;
  sections: LegalSection[];
}

/**
 * 정책 문서 공통 화면 — 개인정보처리방침·이용약관이 같은 틀을 쓴다.
 *
 * 허브 화면들과 달리 본문이 읽기용 글줄이라 폭을 좁게 잡는다. 주미도 그림도 넣지 않는다 —
 * 캐릭터가 말하는 형식이면 법적 고지로 읽히지 않는다.
 */
export default function LegalPage({ title, intro, sections }: LegalPageProps) {
  return (
    <PageShell>
      <article className="mx-auto w-full max-w-3xl">
        <h1 className="mb-2 text-2xl font-bold text-cb-foreground md:text-3xl">{title}</h1>
        <p className="mb-8 text-sm text-cb-muted">최종 개정일: {LEGAL_UPDATED}</p>

        <div className="space-y-7 text-sm leading-relaxed">
          {intro && <p className="text-cb-muted">{intro}</p>}

          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-2 text-lg font-bold text-cb-foreground">{section.title}</h2>

              {section.body && <p className="text-cb-muted">{section.body}</p>}

              {section.link && (
                <p className="text-cb-muted">
                  {section.link.pre}
                  <a
                    href={section.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cb-point hover:underline"
                  >
                    {section.link.label}
                  </a>
                  {section.link.post}
                </p>
              )}

              {section.items && (
                <ul className="list-disc space-y-1 pl-5 text-cb-muted">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>
    </PageShell>
  );
}
