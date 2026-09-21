/**
 * 거장 이름 한글 표기.
 *
 * 백엔드는 영문만 준다. 게다가 두 군데서 모양이 다르다 —
 * 투자자 카드는 'Berkshire Hathaway (Warren Buffett)' 전체 문자열에 CIK 가 같이 오고,
 * 종목별 보유 거장 목록(`/13f/stats` 의 holders)은 인물명 'Warren Buffett' 만 온다.
 * 그래서 한 곳에 적고 두 가지 색인으로 뽑아 쓴다.
 *
 * 실제 추적 대상 19명(GET /disclosure/13f/investors) 기준이고, 여기 없으면
 * 공시의 영문 이름을 그대로 쓴다 — 임의로 음차하면 검색해도 안 나오는 이름이 된다.
 */
const INVESTORS: readonly { cik: string; person: string; ko: string }[] = [
  { cik: '1067983', person: 'Warren Buffett', ko: '워런 버핏' },
  { cik: '1336528', person: 'Bill Ackman', ko: '빌 애크먼' },
  { cik: '1649339', person: 'Michael Burry', ko: '마이클 버리' },
  { cik: '921669', person: 'Carl Icahn', ko: '칼 아이칸' },
  { cik: '1656456', person: 'David Tepper', ko: '데이비드 테퍼' },
  { cik: '1061768', person: 'Seth Klarman', ko: '세스 클라먼' },
  { cik: '1489933', person: 'David Einhorn', ko: '데이비드 아인혼' },
  { cik: '949509', person: 'Howard Marks', ko: '하워드 막스' },
  { cik: '1040273', person: 'Daniel Loeb', ko: '대니얼 로브' },
  { cik: '1345471', person: 'Nelson Peltz', ko: '넬슨 펠츠' },
  { cik: '1647251', person: 'Chris Hohn', ko: '크리스 혼' },
  { cik: '1167483', person: 'Chase Coleman', ko: '체이스 콜먼' },
  { cik: '1549575', person: 'Mohnish Pabrai', ko: '모니시 파브라이' },
  { cik: '1096343', person: 'Thomas Gayner', ko: '토머스 게이너' },
  { cik: '1709323', person: 'Li Lu', ko: '리 루' },
  { cik: '1037389', person: 'Jim Simons', ko: '짐 사이먼스' },
  { cik: '1697748', person: 'Cathie Wood', ko: '캐시 우드' },
  { cik: '1350694', person: 'Ray Dalio', ko: '레이 달리오' },
  { cik: '1029160', person: 'George Soros', ko: '조지 소로스' },
];

const BY_CIK = new Map(INVESTORS.map((item) => [item.cik, item.ko]));
const BY_PERSON = new Map(INVESTORS.map((item) => [item.person.toLowerCase(), item.ko]));

/** CIK 로 찾기 — 투자자 카드용. 회사명·인물명은 공시마다 흔들리지만 CIK 는 안 바뀐다. */
export function investorNameByCik(cik: string): string | null {
  return BY_CIK.get(cik) ?? null;
}

/** 인물명으로 찾기 — 종목별 보유 거장 목록용. CIK 가 안 와서 이름으로 맞출 수밖에 없다. */
export function investorNameByPerson(person: string): string | null {
  return BY_PERSON.get(person.trim().toLowerCase()) ?? null;
}
