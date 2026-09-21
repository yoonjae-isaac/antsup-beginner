import PreviewIcon from '@/components/home/PreviewIcon';
import { PREVIEW_QUOTE_TITLE } from '@/domain/jumi/landingCopy';
import type { InvestorQuote } from '@/domain/preview/quotes';

interface QuoteCardProps {
  quote: InvestorQuote;
  /** 0-based. 화면에는 1부터 센 값을 보여준다. */
  index: number;
  total: number;
}

/** 오늘의 투자자 명언 카드. 날짜가 같으면 누가 열어도 같은 문장이 나온다. */
export default function QuoteCard({ quote, index, total }: QuoteCardProps) {
  return (
    <article className="flex size-full flex-col overflow-hidden rounded-[22px] border border-cb-border bg-cb-surface p-5 lg:rounded-3xl lg:p-7">
      <header className="flex items-center gap-2.5">
        <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[10px] bg-cb-tile text-cb-trader lg:size-9 lg:rounded-xl">
          <PreviewIcon name="quote" />
        </span>
        <h2 className="text-[12.5px] font-bold text-cb-foreground lg:text-[13px]">
          {PREVIEW_QUOTE_TITLE}
        </h2>
        <span className="ml-auto rounded-full bg-cb-hover px-2 py-0.5 font-mono text-[10.5px] tabular-nums text-cb-muted lg:px-2.5 lg:text-[11px]">
          {index + 1} / {total}
        </span>
      </header>

      {/*
        카드 높이는 고정인데 명언 길이는 25자부터 164자까지 제각각이라 넘칠 수 있다.
        50개 중 49개는 58자 이하라 여기 크기로 다 들어가고, 남는 하나(164자)만
        줄 수로 잘린다 — 그 하나 때문에 나머지 49개의 글씨를 줄이지는 않는다.
      */}
      {/*
        lg 에서 my-auto 로 세로 가운데에 세운다. 명언은 대부분 두세 줄이라 위로 붙이면
        카드 한가운데가 텅 빈다. 좁은 카드는 애초에 남는 공간이 없어 그대로 위에 둔다.
      */}
      <blockquote className="mt-3 line-clamp-3 text-sm leading-[1.5] font-bold tracking-tight text-balance lg:my-auto lg:line-clamp-6 lg:text-[23px] lg:leading-[1.62]">
        {quote.text}
      </blockquote>

      <div className="mt-auto flex items-center gap-2.5 pt-3 lg:mt-0 lg:gap-3 lg:pt-4">
        {/*
          이름 첫 글자 배지. 인물 사진을 쓰면 초상권과 출처가 따라붙는데,
          명언 카드가 감당할 무게가 아니다.
        */}
        <span
          aria-hidden="true"
          className="flex size-7 shrink-0 items-center justify-center rounded-full border border-cb-trader/35 bg-cb-trader/15 text-xs font-black text-cb-trader lg:size-[42px] lg:text-[15px]"
        >
          {quote.author.charAt(0)}
        </span>
        {/*
          가로 카드에서는 이름과 소속이 한 줄에 나란히 선다. 가운뎃점이 없으면
          붙은 span 두 개가 '존 C. 보글뱅가드 그룹 창립자' 한 덩어리로 읽힌다.
          lg 에서는 위아래로 나뉘므로 점을 뺀다.
        */}
        <cite className="flex items-center gap-1.5 not-italic lg:flex-col lg:items-start lg:gap-[3px]">
          <span className="text-xs font-bold lg:text-sm">{quote.author}</span>
          <span className="text-[11.5px] text-cb-muted lg:hidden">·</span>
          <span className="text-[11.5px] text-cb-muted lg:text-xs">{quote.role}</span>
        </cite>
      </div>

      <div
        aria-hidden="true"
        className="mt-[22px] hidden h-[3px] overflow-hidden rounded-full bg-cb-hover lg:block"
      >
        <div
          className="h-full rounded-full bg-cb-trader"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>
    </article>
  );
}
