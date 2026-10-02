import type { Metadata } from 'next';
import { termsMetadata } from '@/config/site';
import { TERMS_SECTIONS } from '@/domain/legal/content';
import LegalPage from '@/views/LegalPage';

export const metadata: Metadata = termsMetadata();

// 바깥 데이터가 없는 완전 정적 문서다.
// 경로가 /terms 가 아닌 이유는 src/domain/legal/route.ts 참고(레슨 slug 와 충돌).

export default function Page() {
  return <LegalPage title="이용약관" sections={TERMS_SECTIONS} />;
}
