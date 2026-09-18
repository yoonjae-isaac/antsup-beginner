import type { JumiArt, JumiArtKey } from './types';

/**
 * 주미 그림 레지스트리 — 대사와 분리해 여기서만 관리한다.
 *
 * 캐릭터 확정 시안: 갈색 몸통의 개미. 주황색 조끼에 '주미' 이름표,
 * 노란 책가방, 연필을 쥔 손, 분홍 볼터치. 굵은 갈색 외곽선의 둥근 선화 스타일.
 * 2026-09-18 눈 수정본으로 교체(아래 에셋 3종과 app/icon·apple-icon 전부 같은 원본에서 나온다).
 *
 * 표현 방식은 '원형 유지'로 확정했다(2026-09-17). 그래서 여기 들어가는 그림은
 * 전신이 아니라 **얼굴~상반신 정사각 크롭본**(jumi-bust)이다 — 전신을 넣으면
 * 36px·128px 원형 안에서 몸통만 보인다. 원본 전신(jumi-full)은 이 레지스트리가
 * 아니라 OG 이미지에서 쓴다.
 *
 * 배경을 투명으로 따지 않고 원본의 크림색 종이 질감을 그대로 뒀다. 원형이 사각형을
 * 잘라내므로 안에서는 배경이 보이지 않는다.
 *
 * ⚠ **그림을 갈아끼울 땐 파일명 버전을 올릴 것**(jumi-bust-v2 → v3).
 * next/image 의 최적화 캐시는 원본 URL 로 키를 잡아서, 같은 이름에 다른 그림을
 * 덮어쓰면 옛 그림이 계속 나온다. 브라우저 캐시도 마찬가지다.
 * 실제로 2026-09-18 눈 수정본을 같은 이름으로 덮었다가 반영이 안 됐다.
 * (app/icon.png·apple-icon.png 는 Next 가 해시 쿼리를 붙여줘서 그냥 덮어써도 된다.)
 *
 * placeholderEmoji 는 src 가 비었을 때만 쓰이는 폴백이라 그대로 남겨둔다.
 * 표정별 그림이 더 나오면 키를 늘리고 해당 src 만 갈아끼우면 된다
 * (지금은 한 장뿐이라 두 키가 같은 파일을 본다).
 */
export const JUMI_ART: Record<JumiArtKey, JumiArt> = {
  greeting: {
    key: 'greeting',
    placeholderEmoji: '🐜',
    src: '/jumi/jumi-bust-v2.jpg',
    alt: '가방을 메고 연필을 든 채 반갑게 인사하는 주식개미 주미',
  },
  explaining: {
    key: 'explaining',
    placeholderEmoji: '🐜',
    src: '/jumi/jumi-bust-v2.jpg',
    alt: '연필을 들고 차근차근 설명하는 주식개미 주미',
  },
};
