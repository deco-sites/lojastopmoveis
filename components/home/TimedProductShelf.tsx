import type { Product } from "apps/commerce/types.ts";
import { AppContext } from "apps/vtex/mod.ts";
import CountdownTimer from "site/islands/CountdownTimer.tsx";
import { ResponsiveConditionals, } from "$store/components/ui/BannerCarousel.tsx";
import { HighLight } from "$store/components/product/ProductHighlights.tsx";
import type { Layout as CardLayout } from "$store/components/product/ProductCard.tsx";
import LocalProductShelf from "site/components/home/LocalProductShelf.tsx";
import { type SectionProps } from "@deco/deco";
import { type LoaderReturnType } from "@deco/deco";
interface Props {
    productShelf: LoaderReturnType<Product[] | null>;
    /**
     *  @title Cor da Moldura
     *  @default #ED2D26
     *  @format color
    */
    frameColor: string;
    /**
     *  @title Título da Moldura
     *  @default Ofertas da Semana!
    */
    titleFrame: string;
    /**
     *  @title Cor do Título da Moldura
     *  @format color
     *  @default #FFFFFF
    */
    colorTitleFrame: string;
    /**
     *  @title Sub Título da Moldura
     *  @default Estas Ofertas Expiram em
    */
    subTitleFrame: string;
    /**
     *  @title Cor do Sub Título da Moldura
     *  @format color
     *  @default #FFFFFF
    */
    colorSubTitleFrame: string;
    /**
     *  @title Temporizador regressivo
     *  @format date
    */
    countdownTimerDate: string;
    /**
     *  @title Temporizador regressivo Horas:minutos:segundos
     *  @description Padrão HH:MM:SS (Horas:Minutos:Segundos)
    */
    countdownTimerHours: string;
    /**
     *  @title Cor de fundo do CountDown
     *  @format color
     *  @default #AB00C2
    */
    countdownFrameColor: string;
    /**
     *  @title Cor das flags no CountDown
     *  @format color
     *  @default #FFFFFF
    */
    countdownTextColor: string;
    /**
     *  @title Cor das números no CountDown
     *  @format color
     *  @default #FFFFFF
    */
    countdownNumberColor: string;
    /**
     *  @title Cor dos dots na Prateleira
     *  @format color
     *  @default #591212
    */
    dotSliderColor: string;
    productShelfConfig: {
        highlights?: HighLight[];
        layout?: {
            headerAlignment?: "center" | "left";
            headerfontSize?: "Normal" | "Large";
            color?: "primary" | "secondary";
            itemsPerPage?: {
                screenWidth?: number;
                itemsQuantity?: number;
            }[];
        };
        showPaginationArrows?: ResponsiveConditionals;
        cardLayout?: CardLayout;
    };
}
export function loader(props: Props, _req: Request, ctx: AppContext) {
    if (!props.productShelf)
        return { success: false, ...props };
    return { success: true, ...props };
}
const TimedProductShelf = (props: SectionProps<typeof loader>) => {
    if (!props.success)
        return null;
    const { productShelf, colorSubTitleFrame, colorTitleFrame, countdownTimerDate, frameColor, subTitleFrame, titleFrame, countdownTimerHours, productShelfConfig, countdownFrameColor, countdownTextColor, countdownNumberColor, dotSliderColor } = props;
    const countdownDateTimeString = `${countdownTimerDate}T${countdownTimerHours}`;
    const countdownDateTime = new Date(countdownDateTimeString);
    const currentDateTime = new Date();
    const offset = currentDateTime.getTimezoneOffset();
    const localDateTime = new Date(currentDateTime.getTime() - offset * 60 * 1000);
    const isCurrentDateTime = countdownDateTime.toISOString() === localDateTime.toISOString();
    if (!productShelf || isCurrentDateTime)
        return null;
    return (<div style={{ backgroundColor: frameColor }} className="rounded-lg md:rounded-none mb-8">
            <div className="container w-full m-auto px-[24px]">
                <div className="flex flex-col items-center justify-center mb-[15px] md:flex-row md:justify-between">
                    <span className="font-bold text-[26px] uppercase md:text-[36px]" style={{ color: colorTitleFrame }}>{titleFrame}</span>
                    <span className="font-normal text-base md:text-[22px]" style={{ color: colorSubTitleFrame }}>{subTitleFrame}</span>
                    <CountdownTimer textColor={countdownTextColor} frameColor={countdownFrameColor} timeDate={countdownTimerDate} timeHour={countdownTimerHours} numberColor={countdownNumberColor}/>
                </div>
                <LocalProductShelf products={productShelf} cardLayout={productShelfConfig.cardLayout} highlights={productShelfConfig.highlights} layout={productShelfConfig.layout} showPaginationArrows={productShelfConfig.showPaginationArrows} dotSliderColor={dotSliderColor}/>
            </div>
        </div>);
};
export default TimedProductShelf;
