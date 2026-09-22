/**
 * 레슨(= 한 주제) 레지스트리. 라우팅·SEO·스텝 네비·다음 화 연결의 단일 소스다.
 *
 * 주제마다 라우트를 나눈 이유는 검색 유입이다 — 'ETF가 뭔가요' 'ISA 뭔가요' 는
 * 각각 독립된 검색어라, 한 페이지에 몰아넣으면 어느 쪽으로도 잡히지 않는다.
 */

import type { CalcKey } from '@/domain/calc/keys';

/**
 * 커리큘럼의 부(部).
 *
 * 1부는 계좌를 만들어 첫 매수를 누르기까지, 2부는 그 뒤에 바로 부딪히는 질문들이다.
 * 나눈 이유는 스텝 네비다 — 열여섯 개를 한 줄로 늘어놓으면 어디까지가 '시작하는 데
 * 필요한 것'인지 보이지 않는다.
 */
export type PartId = 'start' | 'after';

export const PARTS: readonly { id: PartId; label: string }[] = [
  { id: 'start', label: '1부 · 시작하기' },
  { id: 'after', label: '2부 · 사고 난 뒤' },
];

interface StepBase {
  /** 라우트 세그먼트. 루트('/')는 레슨이 아니라 홈 허브라 여기 없다. */
  slug: string;
  part: PartId;
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
  /**
   * 대화 끝에 붙는 계산기. 읽은 내용을 그 자리에서 숫자로 확인시키는 자리다.
   *
   * 고지 문구가 `figuresNotice` 와 다르다 — 그쪽은 '숫자를 일부러 안 적었다'고
   * 말하는데 계산기는 숫자를 보여 주므로, 계산기가 있으면 CALC_NOTICE 를 쓴다.
   */
  calc?: CalcKey;
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
    part: 'start',
    slug: 'stock-basics',
    railLabel: '주식이 뭔가요',
    heading: '주식은 도박이 아니에요',
    seoTitle: '주식 처음이세요? 주미와 함께 시작해요',
    seoDescription:
      '주식이 처음이라 막막한가요? 주식개미 주미가 ‘주식은 도박이 아니에요’부터 쉬운 말로 차근차근 알려드려요. 주린이를 위한 주식 기초 가이드.',
  },
  {
    ready: true,
    part: 'start',
    slug: 'buy-sell',
    railLabel: '사고팔기',
    heading: '사고판다는 게 무슨 말이에요?',
    seoTitle: '매수·매도가 뭔가요? 주가와 시가총액 쉽게',
    seoDescription:
      '주식을 사고파는 매수·매도, 주가가 오르내리는 원리, 그리고 시가총액까지. 주식개미 주미가 피자 비유로 주린이도 알아듣게 설명해요.',
  },
  {
    ready: true,
    part: 'start',
    slug: 'mindset',
    railLabel: '나는 어떤 투자자',
    heading: '나는 어떤 투자자일까요?',
    seoTitle: '트레이더 vs 가치투자자, 나는 어느 쪽일까',
    seoDescription:
      '짧게 사고파는 트레이더와 오래 들고 가는 가치투자자. 정답은 없고 성향이 다를 뿐이에요. 고른 쪽에 맞춰 주식개미 주미가 필요한 원칙만 알려드려요.',
  },
  {
    ready: true,
    part: 'start',
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
    part: 'start',
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
    part: 'start',
    slug: 'before-buying',
    railLabel: '사기 전 확인',
    heading: '사기 전에 뭘 봐야 해요?',
    seoTitle: '주식 사기 전 체크리스트 5가지',
    seoDescription:
      '첫 매수 전에 스스로에게 물어볼 5가지. 여윳돈인지, 왜 사는지, 얼마까지 잃어도 되는지. 주식개미 주미가 하나씩 짚어드려요.',
  },
  {
    ready: true,
    part: 'start',
    slug: 'etf',
    railLabel: 'ETF',
    heading: 'ETF가 뭔가요?',
    seoTitle: 'ETF가 뭔가요? 초보도 아는 분산투자',
    seoDescription:
      'ETF는 주식 여러 개를 한 바구니에 담은 상품이에요. 왜 초보에게 권하는지, 그리고 ETF도 떨어질 수 있다는 점까지 주미가 솔직하게 알려드려요.',
  },
  {
    ready: true,
    part: 'start',
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
    part: 'start',
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
    part: 'start',
    slug: 'terms',
    railLabel: '용어 10개',
    heading: '뉴스가 읽히는 용어 10개',
    seoTitle: '주식 용어 10개, 한 줄씩만 알면 돼요',
    seoDescription:
      '지수·시가총액·PER·배당·지정가·손절까지. 뉴스와 주식 앱이 읽히기 시작하는 최소한의 용어를 주식개미 주미가 한 줄씩 풀어드려요.',
  },
  {
    ready: true,
    part: 'start',
    slug: 'after-buy',
    railLabel: '사고 난 뒤',
    heading: '사고 나서는 뭘 해요?',
    seoTitle: '주식 산 뒤에 뭘 해야 하나요?',
    seoDescription:
      '매일 안 봐도 되고, 팔 기준은 미리 정하고, 하락은 정상이에요. 사고 난 뒤가 진짜라는 걸 주식개미 주미가 알려드려요.',
  },

  // ── 2부 ─ 사고 난 뒤 ────────────────────────────────────────────────
  // 1부가 첫 매수까지라면, 여기는 계좌에 종목이 담긴 다음 순서대로 부딪히는 질문들이다.
  // 떨어졌다(물타기) → 언제 파나(손절) → 돈이 들어왔다(배당) → 오래 하면(복리) →
  // 그럼 얼마씩(목표). 다섯 편 모두 끝에 계산기가 붙는다.
  {
    ready: true,
    part: 'after',
    slug: 'averaging',
    railLabel: '물타기·불타기',
    heading: '내렸을 때 더 사도 될까요?',
    calc: 'averaging',
    seoTitle: '물타기 뜻과 평단 계산, 해도 될 때와 안 될 때',
    seoDescription:
      '내려서 더 사면 평단은 내려가지만 그 종목에 실린 돈은 늘어나요. 물타기와 불타기의 차이를 주식개미 주미가 평단 계산기로 같이 보여드려요.',
  },
  {
    ready: true,
    part: 'after',
    slug: 'stop-loss',
    railLabel: '손절·손익비',
    heading: '언제 팔아야 해요?',
    calc: 'stop-target',
    seoTitle: '손절가는 사기 전에 정하는 거예요 — 손익비까지',
    seoDescription:
      '얼마에 자르고 얼마에 챙길지 미리 정하는 법. 승률보다 손익비를 먼저 보는 이유를 주식개미 주미가 계산기로 알려드려요.',
  },
  {
    ready: true,
    part: 'after',
    slug: 'dividend',
    railLabel: '배당',
    heading: '가만히 있어도 돈이 들어와요?',
    calc: 'dividend',
    seoTitle: '배당금과 배당수익률, 세금 떼면 얼마 받나요?',
    seoDescription:
      '배당수익률은 주가가 내리면 올라가요. 세금을 떼고 실제로 얼마가 들어오는지 주식개미 주미가 배당 계산기로 보여드려요.',
  },
  {
    ready: true,
    part: 'after',
    slug: 'risky-products',
    railLabel: '위험한 상품',
    heading: '2배, 인버스, 월배당?',
    calc: 'decay',
    seoTitle: '레버리지·인버스·커버드콜, 사기 전에 알아야 할 것',
    seoDescription:
      '2배 상품은 지수가 제자리로 돌아와도 마이너스예요. 곱버스와 커버드콜 월배당이 무엇을 대가로 받는 돈인지 주식개미 주미가 숫자로 보여드려요.',
  },
  {
    ready: true,
    part: 'after',
    slug: 'compound',
    railLabel: '복리',
    heading: '시간이 돈이 된다는 게 뭐예요?',
    calc: 'compound',
    seoTitle: '복리와 72법칙, 두 배 되는 데 몇 년 걸릴까',
    seoDescription:
      '72를 수익률로 나누면 돈이 두 배 되는 햇수가 나와요. 복리에서 제일 센 게 수익률이 아니라 시간인 이유를 주미가 계산기로 보여드려요.',
  },
  {
    ready: true,
    part: 'after',
    slug: 'savings-goal',
    railLabel: '목표 세우기',
    heading: '매달 얼마씩 넣어야 해요?',
    calc: 'savings-goal',
    seoTitle: '목표 금액에서 거꾸로 — 매달 얼마를 넣어야 하나',
    seoDescription:
      '‘10년 뒤 1억’을 정하면 매달 얼마가 필요한지 나와요. 막연한 계획을 숫자로 바꾸는 법을 주식개미 주미가 알려드려요.',
  },
];

/** 실제로 라우트가 되는 레슨만. 순서는 STEPS 를 따른다. */
export const LESSONS: readonly Lesson[] = STEPS.filter((step): step is Lesson => step.ready);

/**
 * 커리큘럼의 첫 레슨. 홈에서 '주린이는 여기'가 향하는 곳이고,
 * 주미의 첫 인사(히어로)가 붙는 유일한 레슨이다.
 */
export const FIRST_LESSON = LESSONS[0];

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

/** 레슨 slug 를 실제 경로로. */
export function lessonPath(slug: string): string {
  return `/${slug}`;
}

/** 스텝 네비 한 부(部). `number` 는 전체를 통틀어 몇 번째인지 — 부가 바뀌어도 이어진다. */
export interface PartGroup {
  id: PartId;
  label: string;
  steps: readonly { step: Step; number: number }[];
}

/**
 * STEPS 를 부 단위로 묶는다.
 *
 * 순서는 PARTS 가 아니라 STEPS 를 따른다 — 두 배열이 어긋나도 화면에 뜨는 순서는
 * 커리큘럼 그대로여야 하고, 어느 부에도 못 들어간 단계가 조용히 사라지면 안 된다.
 */
export function groupStepsByPart(): PartGroup[] {
  const groups = new Map<PartId, { step: Step; number: number }[]>();

  STEPS.forEach((step, index) => {
    const bucket = groups.get(step.part);
    const entry = { step, number: index + 1 };
    if (bucket) bucket.push(entry);
    else groups.set(step.part, [entry]);
  });

  return [...groups].map(([id, steps]) => ({
    id,
    label: PARTS.find((part) => part.id === id)?.label ?? '',
    steps,
  }));
}
