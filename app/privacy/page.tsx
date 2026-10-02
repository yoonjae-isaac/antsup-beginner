import type { Metadata } from 'next';
import { privacyMetadata } from '@/config/site';
import { PRIVACY_INTRO, PRIVACY_SECTIONS } from '@/domain/legal/content';
import LegalPage from '@/views/LegalPage';

export const metadata: Metadata = privacyMetadata();

// 바깥 데이터가 없는 완전 정적 문서다.

export default function Page() {
  return (
    <LegalPage title="개인정보처리방침" intro={PRIVACY_INTRO} sections={PRIVACY_SECTIONS} />
  );
}
