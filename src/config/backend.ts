/**
 * cash-bite-backend 호출 — 서버 구간 전용.
 *
 * 환경변수에 NEXT_PUBLIC_ 을 붙이지 않는 것이 이 파일의 핵심이다.
 * 이 레포는 공개 저장소이고 NEXT_PUBLIC_ 값은 브라우저 번들에 그대로 박힌다.
 * 접두사가 없으면 브라우저에서는 undefined 라 백엔드 주소도 내부 키도 새지 않는다.
 * 대신 이 모듈은 반드시 서버 컴포넌트에서만 불러야 한다 — 클라이언트에서 부르면
 * 값이 비어 그냥 동작하지 않는다.
 *
 * cash-bite 는 브라우저 호출을 위해 /api/be 프록시를 두지만, 여기서 쓰는 데이터는
 * 홈이 서버에서 그릴 때 한 번 필요할 뿐이라 프록시 라우트를 만들지 않았다.
 */

/** 백엔드 응답 봉투 — 성공 { data } / 실패 { error }. */
interface SuccessEnvelope<T> {
  data: T;
}

/**
 * 백엔드에서 JSON 을 받아 봉투를 벗긴다.
 *
 * 실패는 전부 null 로 떨어뜨린다 — 이 데이터는 홈의 곁다리이지 본문이 아니다.
 * 백엔드가 죽었다고 해서 주미 허브까지 같이 죽으면 안 된다.
 */
export async function backendGet<T>(path: string, revalidateSeconds: number): Promise<T | null> {
  const baseUrl = process.env.API_BASE_URL?.trim();
  if (!baseUrl) return null;

  const headers: Record<string, string> = { Accept: 'application/json' };
  const internalKey = process.env.INTERNAL_API_KEY?.trim();
  if (internalKey) headers['x-internal-key'] = internalKey;

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}${path}`, {
      headers,
      next: { revalidate: revalidateSeconds },
    });
    if (!response.ok) return null;

    const body: unknown = await response.json();
    if (body === null || typeof body !== 'object' || !('data' in body)) return null;

    return (body as SuccessEnvelope<T>).data;
  } catch {
    return null;
  }
}
