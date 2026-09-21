import { ARTICLES_EMPTY } from '@/domain/news/copy';
import type { NewsArticle } from '@/domain/news/types';

interface ArticleListProps {
  articles: readonly NewsArticle[];
}

/**
 * 기사 목록.
 *
 * 기사마다 카드로 감싸지 않는다 — 테두리를 두르면 화면이 조각나서 정작 읽어야 할
 * 제목이 묻힌다. 실선 한 줄로만 나누고 크기를 제목에 몰아준다.
 *
 * 썸네일은 두지 않는다. 백엔드가 image 를 주긴 하지만 제3자 도메인이라
 * next/image 를 못 쓰고(와일드카드 remotePatterns 는 공개 이미지 프록시가 된다),
 * 핫링크를 막는 언론사가 섞여 있어 목록 중간에 깨진 칸이 생긴다.
 */
export default function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return <p className="py-8 text-sm leading-relaxed text-cb-muted">{ARTICLES_EMPTY}</p>;
  }

  return (
    <ul>
      {articles.map((article) => (
        <li key={article.id}>
          <a
            className="group block border-t border-cb-border py-[18px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cb-point lg:py-[22px]"
            href={article.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            <h3 className="text-[15px] leading-[1.45] font-bold tracking-tight transition-colors group-hover:text-cb-point lg:text-lg">
              {article.title}
            </h3>

            {/* 요약은 넓은 화면에서만. 좁은 화면에서는 제목 두 줄이 이미 충분히 길다. */}
            {article.summary !== '' && (
              <p className="mt-2 hidden truncate text-sm leading-relaxed text-cb-muted lg:block">
                {article.summary}
              </p>
            )}

            <p className="mt-2 flex items-center gap-[7px] text-[11.5px] lg:mt-2.5 lg:gap-2 lg:text-[12.5px]">
              {article.publisher !== '' && (
                <>
                  <span className="font-bold text-[#b6b6c0]">{article.publisher}</span>
                  <span aria-hidden="true" className="text-[#43434c]">
                    ·
                  </span>
                </>
              )}
              <span className="font-mono tabular-nums text-cb-muted">{article.ago}</span>
            </p>
          </a>
        </li>
      ))}
    </ul>
  );
}
