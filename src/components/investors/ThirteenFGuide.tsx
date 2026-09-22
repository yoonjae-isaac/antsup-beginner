import JumiAvatar from '@/components/jumi/JumiAvatar';
import { JUMI_ART } from '@/domain/jumi/artwork';

const TITLE = '13F, 이렇게 읽으세요';
/**
 * 접혀 있을 때 보이는 한 줄. 이 화면에서 주미가 하는 말이기도 하다.
 * 설명서 소개('무엇이 들었는지')보다 결론을 먼저 보여준다 — 안 펼치는 사람이 더 많고,
 * 그 사람이 가져가야 할 게 이 문장이다.
 */
const LEAD = '따라 사는 것보다, 이 사람들이 왜 그 회사를 오래 들고 있는지를 보는 게 남아요.';

/**
 * 13F 사용설명서.
 *
 * 원본은 cash-bite 학습 글 `reading-13f` 다. 레슨으로 넣지 않고 이 화면에 붙인 이유는,
 * 이 글이 커리큘럼의 한 단계가 아니라 **이 페이지를 읽는 법**이기 때문이다.
 * 화면 위쪽에 '45일 지난 기록' 경고는 있는데 '그럼 어떻게 쓰느냐'가 없어서, 경고만
 * 읽고 내려온 사람은 결국 순위표를 쇼핑 목록으로 쓴다.
 *
 * 그래서 순위표 **위**, 시차 경고 바로 아래에 둔다. 아래에 두면 목록을 다 훑고
 * 내려온 사람만 만나는데, 그때는 이미 다 읽은 뒤다.
 *
 * 접어 두는 건 분량 때문이다. 펼친 채로 두면 순위표를 밀어내서, 데이터를 보러 온
 * 사람이 매번 지나쳐야 한다. 대신 접혀 있어도 본문은 DOM 에 남는다(details 기본 동작).
 */
export default function ThirteenFGuide() {
  return (
    <details className="group mt-[18px] rounded-2xl border border-cb-border bg-cb-surface lg:mt-6">
      <summary className="flex cursor-pointer list-none items-center gap-2.5 px-4 py-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cb-point lg:gap-3 lg:px-5 lg:py-4 [&::-webkit-details-marker]:hidden">
        <JumiAvatar art={JUMI_ART.explaining} size="sm" />

        <span className="min-w-0 grow">
          <span className="block text-[13.5px] font-bold text-cb-foreground lg:text-[15px]">
            {TITLE}
          </span>
          <span className="mt-0.5 block text-[11.5px] leading-snug text-cb-muted lg:text-xs">
            {LEAD}
          </span>
        </span>

        <svg
          aria-hidden="true"
          className="size-4 shrink-0 text-cb-muted transition-transform group-open:rotate-180 lg:size-[18px]"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>

      <div className="border-t border-cb-border px-4 pt-4 pb-5 lg:px-5 lg:pt-5 lg:pb-6">
        <Block title="무슨 자료예요?">
          미국에서 1억 달러 넘게 굴리는 기관은 분기마다 보유 주식을 공개해야 해요. 그 신고서가
          13F 예요. 버핏 같은 사람이 무엇을 샀고 팔았는지가 여기서 나와요.
        </Block>

        <Block title="여기서 볼 수 있는 것">
          분기가 끝난 날 기준으로 무슨 종목을 얼마나 들고 있었는지, 그리고 직전 분기와 비교해
          새로 담았는지·늘렸는지·줄였는지·전부 팔았는지를 볼 수 있어요.
        </Block>

        <Block title="여기서 볼 수 없는 것">
          <ul className="mt-1.5 flex list-disc flex-col gap-1.5 pl-4">
            <li>
              <b className="font-bold text-cb-foreground">지금도 갖고 있는지.</b> 분기가 끝나고
              최대 45일 뒤에 내는 보고서라, 그 사이에 이미 팔았을 수 있어요.
            </li>
            <li>
              <b className="font-bold text-cb-foreground">그 사람 재산 전부인지.</b> 공매도·채권·해외
              주식은 신고 대상이 아니에요. 여기 보이는 게 전부가 아니에요.
            </li>
            <li>
              <b className="font-bold text-cb-foreground">왜 샀는지.</b> 이유는 안 적혀 있어요.
              다른 거래와 짝을 맞추려고 담은 한쪽일 수도 있어요.
            </li>
          </ul>
        </Block>

        {/* 이 글의 결론. 접혀 있어도 요약 줄이 이 톤을 미리 알려준다. */}
        <p className="mt-4 rounded-xl border border-cb-point/30 bg-cb-point/8 px-3.5 py-3 text-[12.5px] leading-relaxed text-cb-foreground lg:px-4 lg:py-3.5 lg:text-[13.5px]">
          그래서 13F 는 정답을 베끼는 자료가 아니라 <b className="font-bold">후보를 고르는 자료</b>
          예요. 여러 사람이 같이 담은 종목이나 크게 늘린 종목을 출발점으로 두고, 왜 담았을지는
          직접 확인해 보세요. 그대로 따라 사면 두세 달 지난 가격을 쫓게 돼요.
        </p>
      </div>
    </details>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-3.5 first:mt-0">
      <h3 className="text-[12.5px] font-bold text-cb-foreground lg:text-[13.5px]">{title}</h3>
      <div className="mt-1 text-[12.5px] leading-relaxed text-cb-muted lg:text-[13.5px]">
        {children}
      </div>
    </div>
  );
}
