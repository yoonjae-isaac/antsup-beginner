/**
 * 주미가 다음 말을 준비하는 동안 뜨는 '입력 중' 말풍선.
 *
 * 스크린리더에는 감춘다 — 점 세 개는 정보가 없고, 실제 대사는 뜨는 순간
 * aria-live 로 읽힌다. 점만 계속 읽어주면 방해가 된다.
 */
export default function TypingIndicator() {
  return (
    <p
      aria-hidden="true"
      className="flex w-fit items-center gap-1.5 rounded-3xl rounded-bl-md bg-cb-tile px-4 py-[1.1rem]"
    >
      <span className="typing-dot size-1.5 rounded-full bg-cb-muted" />
      <span className="typing-dot size-1.5 rounded-full bg-cb-muted" />
      <span className="typing-dot size-1.5 rounded-full bg-cb-muted" />
    </p>
  );
}
