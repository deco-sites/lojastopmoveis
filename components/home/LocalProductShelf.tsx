import { useId } from "preact/hooks";
import type { Product } from "apps/commerce/types.ts";
import type { Layout as CardLayout } from "$store/components/product/ProductCard.tsx";
import {
    CONDITIONAL_RESPONSIVE_PARAMS,
    ResponsiveConditionals,
} from "$store/components/ui/BannerCarousel.tsx";
import Slider from "$store/components/ui/Slider.tsx";
import SliderJS from "$store/islands/SliderJS.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import { HighLight } from "$store/components/product/ProductHighlights.tsx";
import TimedProductCard from "$store/components/home/TimedProductCard.tsx";
import { Tags } from "site/loaders/getTags.ts";

interface DotsProps {
    images?: Product[];
    interval?: number;
    className: string;
    dotSliderColor: string;
}

export interface Props {
    products: Product[] | null;
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
    dotSliderColor: string;

    /** @hide true */
    tags?: Tags;
}

function Dots({ images, interval = 0, dotSliderColor }: DotsProps) {
    return (
        <ul class="carousel justify-center col-span-full gap-4 z-10 row-start-4 col-span-[1/2]">
            {images?.map((_, index) => (
                <li
                    class={`carousel-item   md:${((index === 0) || (index % 4 === 0)) ? "" : "hidden"
                        } ${((index === 0) || (index % 2 === 0)) ? "" : "hidden"}`}
                >
                    <Slider.Dot index={index}>
                        <div
                            class={`py-5 ${((index === 0) || (index % 4 === 0)) ? "" : "lg:hidden"
                                }`}
                        >
                            <div
                                class="w-3 h-3 group-disabled:opacity-100 opacity-20 rounded-full"
                                style={{ animationDuration: `${interval}s`, backgroundColor: dotSliderColor }}
                            />
                        </div>
                    </Slider.Dot>
                </li>
            ))}
        </ul>
    );
}

const LocalProductShelf = ({ products, cardLayout, layout, highlights, dotSliderColor, tags }: Props) => {
    const id = useId();

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div class="w-full pb-2 flex flex-col">
            <div
                id={id}
                class="grid grid-cols-[48px_1fr_48px] px-0 grid-rows-[1fr_48px_1fr_48px]"
            >
                <Slider class="carousel carousel-start gap-6 col-span-full row-span-full py-2 mb-12">
                    {products?.map((product, index) => (
                        <Slider.Item
                            index={index}
                            class="carousel-item !w-[300px] 2xl:!w-[320px]"
                        >
                            <TimedProductCard
                                product={product}
                                itemListName={""}
                                layout={cardLayout}
                                highlights={highlights}
                                tags={tags}
                            />
                        </Slider.Item>
                    ))}
                </Slider>

                <>
                    <div
                        class={`flex items-center justify-center z-10 col-start-1 row-start-2`}
                    >
                        <Slider.PrevButton
                            style={{
                                minHeight: "28px",
                            }}
                            class="btn btn-circle border-none shadow-md bg-white lg:opacity-60 lg:hover:bg-white lg:hover:opacity-100"
                        >
                            <Icon
                                class="text-primary"
                                size={32}
                                id="LeftArrowBanner"
                            />
                        </Slider.PrevButton>
                    </div>
                    <div
                        class={`flex items-center justify-center z-10 col-start-3 row-start-2`}
                    >
                        <Slider.NextButton
                            style={{
                                minHeight: "28px",
                            }}
                            class="btn btn-circle border-none shadow-md bg-white lg:opacity-60 lg:hover:bg-white lg:hover:opacity-100"
                        >
                            <Icon
                                class="text-primary"
                                size={32}
                                id="RightArrowBanner"
                            />
                        </Slider.NextButton>
                    </div>
                    <Dots
                        images={products}
                        className={CONDITIONAL_RESPONSIVE_PARAMS["Always"]}
                        dotSliderColor={dotSliderColor}
                    />
                </>

                <SliderJS
                    rootId={id}
                    infinite
                    itemsPerPage={layout?.itemsPerPage?.reduce(
                        (initial, { screenWidth, itemsQuantity }) => ({
                            ...initial,
                            [screenWidth?.toString() ?? "0"]: itemsQuantity ?? 1,
                        }),
                        {},
                    )}
                />
            </div>
        </div>
    );
};

export default LocalProductShelf;
