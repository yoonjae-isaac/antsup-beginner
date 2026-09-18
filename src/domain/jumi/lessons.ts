/**
 * 레슨(= 한 주제) 레지스트리. 라우팅·SEO·스텝 네비·다음 화 연결의 단일 소스다.
 *
 * 주제마다 라우트를 나눈 이유는 검색 유입이다 — 'ETF가 뭔가요' 'ISA 뭔가요' 는
 * 각각 독립된 검색어라, 한 페이지에 몰아넣으면 어느 쪽으로도 잡히지 않는다.
 */

interface StepBase {
  /** 라우트 세그먼트. 빈 문자열이면 루트('/')다. */
  slug: string;
  /** 스텝 네비에 뜨는 짧은 이름. 제목을 그대로 쓰면 길어서 안 들어간다. */
  railLabel: string;
  /** 화면에 뜨는 카드 제목. */
  heading: string;
}

/** 대사가 준비돼 라우트가 생기는 레슨. */
export interface Lesson extends StepBase {
  ready: true;
  /** <title>. 검색 결과에 그대로 노출된다. */
  seoTitle: string;
  seoDescription: string;
  /**
   * 세금·한도·증권사처럼 바뀌는 정보를 다루는 레슨에 기준시점 고지를 붙인다.
   * 대사에서 숫자를 뺐다는 사실만으로는 부족하다 — 언제 기준인지 화면에 남아야 한다.
   */
  figuresNotice?: true;
}

/** 아직 대사가 없는 주제. 스텝 네비에 자리만 보여주고 링크는 걸지 않는다. */
export interface PlannedStep extends StepBase {
  ready: false;
}

export type Step = Lesson | PlannedStep;

/**
 * 전체 커리큘럼 순서. 스텝 네비가 이 순서 그대로 그린다.
 *
 * ready:false 인 주제는 라우트도 sitemap 항목도 만들지 않는다 — 대사 없이 등록하면
 * 빈 페이지가 색인된다. 세율·한도·증권사 정보가 들어가는 주제(broker·account-types·
 * tax-fee·kr-vs-us)는 beginner-onboarding 패키지의 검증된 수치를 근거로 쓰고,
 * 숫자는 '약/대략 + 가입·매매 시점 확인' 으로만 서술해야 한다.
 */
export const STEPS: readonly Step[] = [
  {
    ready: true,
    slug: '',
    railLabel: '주식이 뭔가요',
    heading: '주식은 도박이 아니에요',
    seoTitle: '주식 처음이세요? 주미와 함께 시작해요',
    seoDescription:
      '주식이 처음이라 막막한가요? 주식개미 주미가 ‘주식은 도박이 아니에요’부터 쉬운 말로 차근차근 알려드려요. 주린이를 위한 주식 기초 가이드.',
  },
  {
    ready: true,
    slug: 'buy-sell',
    railLabel: '사고팔기',
    heading: '사고판다는 게 무슨 말이에요?',
    seoTitle: '매수·매도가 뭔가요? 주가와 시가총액 쉽게',
    seoDescription:
      '주식을 사고파는 매수·매도, 주가가 오르내리는 원리, 그리고 시가총액까지. 주식개미 주미가 피자 비유로 주린이도 알아듣게 설명해요.',
  },
  {
    ready: true,
    slug: 'mindset',
    railLabel: '나는 어떤 투자자',
    heading: '나는 어떤 투자자일까요?',
    seoTitle: '트레이더 vs 가치투자자, 나는 어느 쪽일까',
    seoDescription:
      '짧게 사고파는 트레이더와 오래 들고 가는 가치투자자. 정답은 없고 성향이 다를 뿐이에요. 고른 쪽에 맞춰 주식개미 주미가 필요한 원칙만 알려드려요.',
  },
  {
    ready: true,
    slug: 'broker',
    railLabel: '증권사 고르기',
    heading: '증권계좌, 어디서 만들까요?',
    figuresNotice: true,
    seoTitle: '증권계좌 개설, 어느 증권사로 할까요?',
    seoDescription:
      '스마트폰으로 10~20분이면 열리는 증권계좌. 토스·한국투자·미래에셋·삼성·키움을 무엇을 기준으로 고르면 되는지 주식개미 주미가 알려드려요.',
  },
  {
    ready: true,
    slug: 'account-types',
    railLabel: '계좌 종류',
    heading: 'CMA·ISA·IRP가 뭐가 달라요?',
    figuresNotice: true,
    seoTitle: 'CMA·ISA·IRP 차이, 뭐부터 만들까요?',
    seoDescription:
      '비상금은 CMA, 몇 년 뒤 쓸 돈은 ISA, 노후 돈은 IRP. 돈을 3층으로 나눠 보면 계좌 종류가 정리돼요. 주미가 우산 비유로 쉽게 설명해요.',
  },
  {
    ready: true,
    slug: 'before-buying',
    railLabel: '사기 전 확인',
    heading: '사기 전에 뭘 봐야 해요?',
    seoTitle: '주식 사기 전 체크리스트 5가지',
    seoDescription:
      '첫 매수 전에 스스로에게 물어볼 5가지. 여윳돈인지, 왜 사는지, 얼마까지 잃어도 되는지. 주식개미 주미가 하나씩 짚어드려요.',
  },
  {
    ready: true,
    slug: 'etf',
    railLabel: 'ETF',
    heading: 'ETF가 뭔가요?',
    seoTitle: 'ETF가 뭔가요? 초보도 아는 분산투자',
    seoDescription:
      'ETF는 주식 여러 개를 한 바구니에 담은 상품이에요. 왜 초보에게 권하는지, 그리고 ETF도 떨어질 수 있다는 점까지 주미가 솔직하게 알려드려요.',
  },
  {
    ready: true,
    slug: 'tax-fee',
    railLabel: '세금·수수료',
    heading: '세금이랑 수수료는요?',
    figuresNotice: true,
    seoTitle: '주식 세금과 수수료, 국내·미국 뭐가 다를까',
    seoDescription:
      '국내 주식은 팔 때 거래세, 미국 주식은 번 돈에 세금과 직접 신고. 초보가 알아야 할 뼈대만 주식개미 주미가 정리해드려요.',
  },
  {
    ready: true,
    slug: 'kr-vs-us',
    railLabel: '국장·미장',
    heading: '국장이랑 미장, 뭐가 달라요?',
    figuresNotice: true,
    seoTitle: '국장 미장 차이, 환율까지 쉽게',
    seoDescription:
      '미국 주식은 달러로 사고팔아서 주가가 올라도 환율 때문에 손해가 날 수 있어요. 숫자 예시로 주미가 보여드릴게요.',
  },
  {
    ready: true,
    slug: 'terms',
    railLabel: '용어 10개',
    heading: '뉴스가 읽히는 용어 10개',
    seoTitle: '주식 용어 10개, 한 줄씩만 알면 돼요',
    seoDescription:
      '지수·시가총액·PER·배당·지정가·손절까지. 뉴스와 주식 앱이 읽히기 시작하는 최소한의 용어를 주식개미 주미가 한 줄씩 풀어드려요.',
  },
  {
    ready: true,
    slug: 'after-buy',
    railLabel: '사고 난 뒤',
    heading: '사고 나서는 뭘 해요?',
    seoTitle: '주식 산 뒤에 뭘 해야 하나요?',
    seoDescription:
      '매일 안 봐도 되고, 팔 기준은 미리 정하고, 하락은 정상이에요. 사고 난 뒤가 진짜라는 걸 주식개미 주미가 알려드려요.',
  },
];

/** 실제로 라우트가 되는 레슨만. 순서는 STEPS 를 따른다. */
export const LESSONS: readonly Lesson[] = STEPS.filter((step): step is Lesson => step.ready);

/** 루트('/')가 보여주는 레슨. 목록의 첫 항목이라는 약속이다. */
export const ROOT_LESSON = LESSONS[0];

export function findLesson(slug: string): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.slug === slug);
}

/**
 * 하단 CTA 가 가리킬 다음 레슨.
 * 아직 안 쓴 주제는 건너뛴다 — 없는 페이지로 보낼 수는 없기 때문이다.
 * 마지막이면 undefined(버튼은 자리만 남는다).
 */
export function findNextLesson(slug: string): Lesson | undefined {
  const index = LESSONS.findIndex((lesson) => lesson.slug === slug);
  return index === -1 ? undefined : LESSONS[index + 1];
}

/** 레슨 slug 를 실제 경로로. 루트 레슨은 '/' 다. */
export function lessonPath(slug: string): string {
  return slug === '' ? '/' : `/${slug}`;
}
