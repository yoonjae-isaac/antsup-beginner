/**
 * 내 주식 경로 — 홈 오비트 버튼·홈 카드·사이트맵·메타데이터가 전부 여기를 본다.
 * 브라우저가 부르는 두 라우트 핸들러도 같이 둔다 — 셋이 흩어지면 하나만 고치고 만다.
 */
export const MY_STOCKS_PATH = '/my-stocks';

/** 종목 검색. symbolMarkets·symbolNames 가 서버에만 있어 브라우저는 이 길로만 찾는다. */
export const MY_STOCKS_SEARCH_API = '/api/my-stocks/search';

/** 담아 둔 종목 묶음 시세. 백엔드 주소와 내부 키를 서버에 가둬 두기 위한 프록시다. */
export const MY_STOCKS_QUOTES_API = '/api/my-stocks/quotes';

/** 종목 한 건의 관련 뉴스. 목록에서 종목을 펼칠 때만 부른다. */
export const MY_STOCKS_NEWS_API = '/api/my-stocks/news';
