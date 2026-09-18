import type { ChoicePoint, DialogueSegment, JumiLine } from './types';

/**
 * 주미 대사를 선택지 지점에서 끊어 '묶음' 배열로 만든다.
 *
 * 두 콘텐츠 소스를 따로 관리하기 위한 순수 함수다 — 어느 쪽 파일도 상대를
 * import 하지 않고, 합치는 책임만 여기가 진다.
 */
export function buildDialogueSegments(
  lines: readonly JumiLine[],
  choices: readonly ChoicePoint[],
): DialogueSegment[] {
  const segments: DialogueSegment[] = [];
  let buffer: JumiLine[] = [];

  for (const line of lines) {
    buffer.push(line);

    const choice = choices.find((candidate) => candidate.afterLineId === line.id);
    if (choice) {
      segments.push({ lines: buffer, choice });
      buffer = [];
    }
  }

  if (buffer.length > 0) {
    segments.push({ lines: buffer });
    return segments;
  }

  // 마지막 대사에 선택지가 달린 경우 — 눌러도 이어질 내용이 없으므로 선택지를 버린다.
  const last = segments.at(-1);
  if (last?.choice) {
    segments[segments.length - 1] = { lines: last.lines };
  }

  return segments;
}
