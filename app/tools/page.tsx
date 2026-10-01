import type { Metadata } from 'next';
import PageShell from '@/components/layout/PageShell';
import ToolsBoardView from '@/components/tools/ToolsBoardView';
import { toolsMetadata } from '@/config/site';

export const metadata: Metadata = toolsMetadata();

// 바깥에서 오는 값이 없다 — 계산은 전부 브라우저에서 돈다. 레슨처럼 완전 정적이다.

export default function Page() {
  return (
    <PageShell>
      <ToolsBoardView />
    </PageShell>
  );
}
