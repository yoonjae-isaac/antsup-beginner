import type { ReactNode } from 'react';
import { SPEAKER_LABEL } from '@/domain/jumi/landingCopy';
import type { Speaker } from '@/domain/jumi/types';

interface SpeechBubbleProps {
  speaker: Speaker;
  children: ReactNode;
}

/**
 * 화자 구분은 배경색 + 꼬리(깎이지 않은 모서리) 방향으로 한다.
 * 좌우 정렬은 말풍선을 배치하는 쪽이 정하므로 여기서는 관여하지 않는다.
 */
const TONE: Record<Speaker, string> = {
  jumi: 'bg-cb-tile text-cb-foreground rounded-bl-md',
  user: 'bg-cb-point text-cb-on-point rounded-br-md',
};

export default function SpeechBubble({ speaker, children }: SpeechBubbleProps) {
  return (
    <p
      className={`max-w-[85%] rounded-3xl px-4 py-3 text-[0.9375rem] leading-[1.65] md:max-w-[78%] md:px-5 md:py-3.5 md:text-base ${TONE[speaker]}`}
    >
      {/* 색·정렬로만 표현된 화자 정보를 텍스트로도 남긴다(스크린리더·검색봇). */}
      <span className="sr-only">{SPEAKER_LABEL[speaker]}: </span>
      {children}
    </p>
  );
}
