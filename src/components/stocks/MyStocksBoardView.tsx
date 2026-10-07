import JumiAvatar from '@/components/jumi/JumiAvatar';
import MyStockList from '@/components/stocks/MyStockList';
import StockSearch from '@/components/stocks/StockSearch';
import { JUMI_ART } from '@/domain/jumi/artwork';
import { MY_STOCKS_LEAD, MY_STOCKS_TITLE } from '@/domain/jumi/landingCopy';

const JUMI_LEAD = '사고파는 화면이 아니에요. 눈에 담아 두고 오늘 얼마인지만 보는 자리예요.';

/**
 * /my-stocks 본문.
 *
 * 이 컴포넌트 자체는 서버에서 그려진다 — 제목과 고지는 바깥 데이터를 보지 않는다.
 * 브라우저 저장소를 읽는 건 안쪽의 StockSearch·MyStockList 둘뿐이고, 그래서 이 페이지는
 * 색인에 들어가도 빈 화면이 아니라 '무엇을 하는 곳인지'가 적힌 화면으로 잡힌다.
 */
export default function MyStocksBoardView() {
  return (
    <>
      <h1 className="text-[1.65rem] leading-snug font-bold tracking-tight lg:text-[2.5rem]">
        {MY_STOCKS_TITLE}
      </h1>
      <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-cb-muted lg:text-[15px]">
        {MY_STOCKS_LEAD}
      </p>

      <div className="mt-[18px] flex items-center gap-2.5 lg:mt-6 lg:gap-3">
        <JumiAvatar art={JUMI_ART.greeting} size="sm" />
        <p className="text-[13px] leading-snug lg:text-sm">{JUMI_LEAD}</p>
      </div>

      <div className="mt-7 lg:mt-9">
        <StockSearch />
      </div>

      <div className="mt-8 lg:mt-10">
        <MyStockList />
      </div>
    </>
  );
}
