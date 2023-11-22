import type { LoaderReturnType } from "$live/types.ts";
import type { Layout as CardLayout } from "$store/components/product/ProductCard.tsx";
import ProductCard from "$store/components/product/ProductCard.tsx";
import {
  CONDITIONAL_RESPONSIVE_PARAMS,
  ResponsiveConditionals,
} from "$store/components/ui/BannerCarousel.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import Header from "$store/components/ui/SectionHeader.tsx";
import Slider from "$store/components/ui/Slider.tsx";
import SliderJS from "$store/islands/SliderJS.tsx";
import { SendEventOnLoad } from "$store/sdk/analytics.tsx";
import { useOffer } from "$store/sdk/useOffer.ts";
import type { Product } from "deco-sites/std/commerce/types.ts";
import { mapProductToAnalyticsItem } from "deco-sites/std/commerce/utils/productToAnalyticsItem.ts";
import { useId } from "preact/hooks";

export interface Props {
  products: LoaderReturnType<Product[] | null>;

  title?: string;
  seeMore?: {
    url: string;
    label: string;
  };
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
}

interface DotsProps {
  images?: Product[];
  interval?: number;
  className: string;
}

function Dots({ images, interval = 0 }: DotsProps) {
  return (
    <>
      <ul
        class={`carousel justify-center col-span-full gap-2 z-10 row-start-4`}
      >
        {images?.map((_, index) => (
          <Slider.Dot index={index}>
            <div
              class={`py-5 ${
                ((index === 0) || (index % 4 === 0)) ? "" : "lg:hidden"
              }`}
            >
              <div
                class="w-3 h-3 group-disabled:opacity-100 opacity-20 rounded-full bg-primary"
                style={{ animationDuration: `${interval}s` }}
              />
            </div>
          </Slider.Dot>
        ))}
      </ul>
    </>
  );
}

function ProductShelf({
  products,
  title,
  layout,
  cardLayout,
  seeMore,
  showPaginationArrows,
}: Props) {
  const id = useId();

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div class="w-full pb-8 flex flex-col lg:gap-7 lg:pb-10">
      <div class="flex items-center justify-between relative pb-3">
        <Header
          title={title || ""}
          description=""
          fontSize={layout?.headerfontSize || "Large"}
          alignment={layout?.headerAlignment || "center"}
          color={layout?.color || "primary"}
        />
        {seeMore
          ? (
            <span class="text-emphasis font-normal text-sm lowercase">
              <a href={seeMore.url}>
                {seeMore.label}
              </a>
            </span>
          )
          : null}
      </div>

      <div
        id={id}
        class="grid grid-cols-[48px_1fr_48px] px-0 grid-rows-[1fr_48px_1fr_48px]"
      >
        <Slider class="carousel carousel-start gap-6 col-span-full row-span-full py-2 mb-12">
          {products?.map((product, index) => (
            <Slider.Item
              index={index}
              class="carousel-item w-[270px]"
            >
              <ProductCard
                product={product}
                itemListName={title}
                layout={cardLayout}
              />
            </Slider.Item>
          ))}
        </Slider>

        <>
          <div
            class={`flex items-center justify-center z-10 col-start-1 row-start-2  ${
              CONDITIONAL_RESPONSIVE_PARAMS[
                showPaginationArrows ? showPaginationArrows : "Always"
              ]
            }`}
          >
            <Slider.PrevButton
              style={{
                minHeight: "28px",
              }}
              class="btn btn-circle border-none shadow-md bg-white lg:opacity-60 lg:hover:bg-white lg:hover:opacity-100"
            >
              <Icon
                size={32}
                id="LeftArrowFigma"
              />
            </Slider.PrevButton>
          </div>
          <div
            class={`flex items-center justify-center z-10 col-start-3 row-start-2 ${
              CONDITIONAL_RESPONSIVE_PARAMS[
                showPaginationArrows ? showPaginationArrows : "Always"
              ]
            }`}
          >
            <Slider.NextButton
              style={{
                minHeight: "28px",
              }}
              class="btn btn-circle border-none shadow-md bg-white lg:opacity-60 lg:hover:bg-white lg:hover:opacity-100"
            >
              <Icon
                size={32}
                id="RightArrowFigma"
              />
            </Slider.NextButton>
          </div>
          <Dots
            images={products}
            className={CONDITIONAL_RESPONSIVE_PARAMS["Always"]}
          />
        </>

        <SendEventOnLoad
          event={{
            name: "view_item_list",
            params: {
              item_list_name: title,
              items: products.map((product) =>
                mapProductToAnalyticsItem({
                  product,
                  ...(useOffer(product.offers)),
                })
              ),
            },
          }}
        />
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
}

export default ProductShelf;
