import type { Metadata } from 'next';
import { homeMetadata } from '@/config/site';
import HomePage from '@/views/HomePage';

export const metadata: Metadata = homeMetadata();

// route 파일은 얇게 — 화면 구성은 src/views 가 갖는다.
export default function Page() {
  return <HomePage />;
}
