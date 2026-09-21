/**
 * cash-bite-backend 호출 장치 — 서버 구간 전용.
 *
 * 엔드포인트를 추가할 때 여는 파일은 여기가 아니라 backendRoutes.ts 다.
 * 이 파일은 그 목록을 실제로 실행하는 부분만 갖는다.
 *
 * 환경변수에 NEXT_PUBLIC_ 을 붙이지 않는 것이 이 파일의 핵심이다.
 * 이 레포는 공개 저장소이고 NEXT_PUBLIC_ 값은 브라우저 번들에 그대로 박힌다.
 * 접두사가 없으면 브라우저에서는 undefined 라 백엔드 주소도 내부 키도 새지 않는다.
 * 대신 이 모듈은 반드시 서버 컴포넌트에서만 불러야 한다 — 클라이언트에서 부르면
 * 값이 비어 그냥 동작하지 않는다.
 *
 * cash-bite 는 브라우저 호출을 위해 /api/be 프록시를 두지만, 여기서 쓰는 데이터는
 * 서버에서 그릴 때 한 번 필요할 뿐이라 프록시 라우트를 만들지 않았다.
 * 브라우저에서 직접 불러야 하는 화면이 생기면 그때 프록시를 따로 둔다.
 */

/** 백엔드 응답 봉투 — 성공 { data } / 실패 { error }. */
interface SuccessEnvelope<T> {
  data: T;
}

/**
 * 엔드포인트 한 건.
 *
 * TResponse 는 런타임에 존재하지 않고 타입으로만 붙어 다닌다(`__response`).
 * 이것 때문에 호출하는 쪽이 응답 타입을 다시 적지 않아도 되고, 같은 엔드포인트를
 * 서로 다른 타입으로 읽는 일이 생기지 않는다.
 */
export interface BackendEndpoint<TResponse, TParams = void> {
  readonly path: string;
  /** ISR 창(초). 엔드포인트마다 신선도가 다르므로 목록이 들고 있는다. */
  readonly revalidate: number;
  /** 쿼리스트링이 필요한 엔드포인트만 둔다. */
  readonly query?: (params: TParams) => Record<string, string>;
  /** 타입 표식 전용. 값이 들어가는 일은 없다. */
  readonly __response?: TResponse;
}

/** backendRoutes.ts 에서 엔드포인트를 선언할 때 쓴다. */
export function defineEndpoint<TResponse, TParams = void>(
  definition: Omit<BackendEndpoint<TResponse, TParams>, '__response'>,
): BackendEndpoint<TResponse, TParams> {
  return definition;
}

/**
 * 엔드포인트를 호출하고 봉투를 벗긴다.
 *
 * 실패는 전부 null 이다 — 주소 미설정, 네트워크 오류, 4xx·5xx, 봉투가 아닌 응답까지.
 * 백엔드에서 오는 값은 화면의 곁다리이지 본문이 아니라서, 호출하는 쪽은 'null 이면
 * 그 부분만 접는다'만 지키면 된다. 백엔드가 죽었다고 페이지까지 죽으면 안 된다.
 */
export function backendGet<TResponse>(
  endpoint: BackendEndpoint<TResponse, void>,
): Promise<TResponse | null>;
export function backendGet<TResponse, TParams>(
  endpoint: BackendEndpoint<TResponse, TParams>,
  params: TParams,
): Promise<TResponse | null>;
export async function backendGet<TResponse, TParams>(
  endpoint: BackendEndpoint<TResponse, TParams>,
  params?: TParams,
): Promise<TResponse | null> {
  const baseUrl = process.env.API_BASE_URL?.trim();
  if (!baseUrl) return null;

  const headers: Record<string, string> = { Accept: 'application/json' };
  const internalKey = process.env.INTERNAL_API_KEY?.trim();
  if (internalKey) headers['x-internal-key'] = internalKey;

  const url = new URL(`${baseUrl.replace(/\/$/, '')}${endpoint.path}`);
  if (endpoint.query) {
    for (const [key, value] of Object.entries(endpoint.query(params as TParams))) {
      url.searchParams.set(key, value);
    }
  }

  try {
    const response = await fetch(url, {
      headers,
      next: { revalidate: endpoint.revalidate },
    });
    if (!response.ok) return null;

    const body: unknown = await response.json();
    if (body === null || typeof body !== 'object' || !('data' in body)) return null;

    return (body as SuccessEnvelope<TResponse>).data;
  } catch {
    return null;
  }
}
