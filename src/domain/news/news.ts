import { backendGet } from '@/config/backend';
import {
  BACKEND_ROUTES,
  type NewsArticleResponse,
  type NewsDigestResponse,
  type NewsMarket,
} from '@/config/backendRoutes';
import type { DigestEntry, MarketNews, NewsArticle, NewsSnapshot } from '@/domain/news/types';

/** 목록에 올릴 기사 수. 더 받아봐야 초보가 훑을 분량을 넘는다. */
const ARTICLE_LIMIT = 12;

/** 다이제스트 조회 수. 매시 생성이라 하루치가 24건을 넘지 않는다. */
const DIGEST_LIMIT = 24;

const KST = 'Asia/Seoul';

/** KST HH:mm. 서버에서만 부른다. */
function kstTime(iso: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: KST,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso));
}

/** KST 기준 오늘 날짜(YYYY-MM-DD). digestDate 와 같은 형식으로 맞춘다. */
function kstToday(now: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: KST,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

function kstDateLabel(isoDate: string): string {
  const [, month, day] = isoDate.split('-');
  return `${Number(month)}월 ${Number(day)}일`;
}

/**
 * 첫 문장만 잘라 낸다.
 * 종결부호를 못 찾으면 통째로 돌려준다 — 잘못 자르느니 긴 게 낫고, 넘치는 건 CSS 가 막는다.
 */
function firstSentence(text: string): string {
  const match = text.match(/^[\s\S]*?[.!?](\s|$)/);
  return (match ? match[0] : text).trim();
}

/** '방금 / N분 전 / N시간 전 / N일 전'. */
function relativeTime(iso: string, now: Date): string {
  const minutes = Math.floor((now.getTime() - new Date(iso).getTime()) / 60_000);
  if (!Number.isFinite(minutes) || minutes < 1) return '방금';
  if (minutes < 60) return `${minutes}분 전`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;

  return `${Math.floor(hours / 24)}일 전`;
}

/**
 * 같은 날짜(digestDate) 회차만 남긴다.
 *
 * 백엔드는 날짜를 가리지 않고 최신순으로 주기 때문에, 그대로 쓰면 어제 회차가
 * '오늘의 흐름' 아래에 섞여 들어온다. 가장 최근 날짜 하나만 취하고, 그게 오늘이
 * 아니면 화면에 날짜를 밝힌다.
 */
function toDigests(
  rows: readonly NewsDigestResponse[],
  now: Date,
): { digests: DigestEntry[]; staleDateLabel: string | null } {
  const newestDate = rows[0]?.digestDate;
  if (!newestDate) return { digests: [], staleDateLabel: null };

  const digests = rows
    .filter((row) => row.digestDate === newestDate)
    .map((row) => ({
      time: kstTime(row.generatedAt),
      text: row.summary,
      preview: firstSentence(row.summary),
    }));

  return {
    digests,
    staleDateLabel: newestDate === kstToday(now) ? null : kstDateLabel(newestDate),
  };
}

function toArticles(rows: readonly NewsArticleResponse[], now: Date): NewsArticle[] {
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    url: row.url,
    summary: row.summary ?? '',
    // publisher 는 비는 일이 있다. 빈 칸을 두느니 출처 줄에서 아예 뺀다.
    publisher: row.publisher ?? '',
    ago: relativeTime(row.publishedAt, now),
  }));
}

async function loadMarket(market: NewsMarket, now: Date): Promise<MarketNews> {
  const [articles, digests] = await Promise.all([
    backendGet(BACKEND_ROUTES.newsArticles, { market, limit: ARTICLE_LIMIT }),
    backendGet(BACKEND_ROUTES.newsDigests, { market, limit: DIGEST_LIMIT }),
  ]);

  const digestPart = toDigests(Array.isArray(digests) ? digests : [], now);

  return {
    digests: digestPart.digests,
    staleDateLabel: digestPart.staleDateLabel,
    articles: toArticles(Array.isArray(articles) ? articles : [], now),
  };
}

/**
 * 두 시장을 한 번에 받아 둔다.
 *
 * 시장 전환을 쿼리스트링으로 받으면 searchParams 때문에 페이지가 매 요청 렌더로 바뀐다.
 * 양쪽을 미리 실어 보내고 토글은 클라이언트에서 끝내면 ISR 로 남고, 전환도 즉시다.
 * 한 쪽이 비어도 다른 쪽은 그대로 보여준다 — 화면 단위로 죽이지 않는다.
 */
export async function loadNewsSnapshot(): Promise<NewsSnapshot> {
  // 상대 시각·오늘 판정이 한 렌더 안에서 어긋나지 않게 기준 시각을 하나로 고정한다.
  const now = new Date();
  const [kr, us] = await Promise.all([loadMarket('KR', now), loadMarket('US', now)]);

  return { KR: kr, US: us };
}
