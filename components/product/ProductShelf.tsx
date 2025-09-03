import type { Layout as CardLayout } from "$store/components/product/ProductCard.tsx";
import ProductCard from "$store/components/product/ProductCard.tsx";
import { CONDITIONAL_RESPONSIVE_PARAMS, ResponsiveConditionals, } from "$store/components/ui/BannerCarousel.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import Header from "$store/components/ui/SectionHeader.tsx";
import Slider from "$store/components/ui/Slider.tsx";
import SliderJS from "$store/islands/SliderJS.tsx";
import { SendEventOnLoad } from "$store/sdk/analytics.tsx";
import { useOffer } from "$store/sdk/useOffer.ts";
import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { useId } from "preact/hooks";
import { HighLight } from "$store/components/product/ProductHighlights.tsx";
import { type LoaderReturnType } from "@deco/deco";
import { AppContext } from "site/apps/site.ts";
import { Tags } from "site/loaders/getTags.ts";
export interface Props {
  products: LoaderReturnType<Product[] | null>;
  highlights?: HighLight[];
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

  /** @hide true */

  tags?: Tags;

  /** @hide true */
  device?: string; 
}
interface DotsProps {
  images?: Product[];
  interval?: number;
  className: string;
}
function Dots({ images, interval = 0 }: DotsProps) {
  return (<>
    <ul class={`carousel justify-center col-span-full gap-2 z-10 row-start-4`}>
      {images?.map((_, index) => (
        <li
          class={`carousel-item   lg:${ (index % 4 === 0) ? "" : "hidden"
            }`}
        >
          <Slider.Dot index={index}>
            <div class={`py-5`}>
              <div class="w-4 h-4 group-disabled:opacity-100 opacity-20 rounded-full bg-primary" style={{ animationDuration: `${interval}s` }} />
            </div>
          </Slider.Dot>
        </li>
      ))}
    </ul>
  </>);
}
function ProductShelf({ products, title, layout, cardLayout, seeMore, showPaginationArrows, highlights, tags, device }: Props) {
  function generateRandomId(prefix = "id", length = 8): string {
    const randomValue = Math.random().toString(36).substr(2, length); // Gera um string base-36 aleatório
    return `${prefix}-${randomValue}`;
  }
  
  const customId = generateRandomId();
  const id = useId();
  

    
  if (!products || products.length === 0) {
    return null;
  }
  return (<div class="w-full pb-8 flex flex-col lg:gap-7 lg:pb-10">
    <div class="flex items-center justify-between relative pb-3">
      <Header title={title || ""} description="" fontSize={layout?.headerfontSize || "Large"} alignment={layout?.headerAlignment || "center"} color={layout?.color || "primary"} />
      {seeMore && seeMore.url !== "_" || seeMore?.label ? (
        <span className="text-emphasis font-normal text-sm lowercase">
          <a href={seeMore.url} className="underline focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label={`Saiba mais sobre ${seeMore.label}`}>
            {seeMore.label}
          </a>
        </span>
      ) : null}
    </div>

    <div id={id+customId} class="grid grid-cols-[48px_1fr_48px] px-0 grid-rows-[1fr_48px_1fr_48px]">
      <Slider class="carousel carousel-center lg:carousel-start space-x-4 p-4 md:gap-6 col-span-full max-w-full sm:space-x-0 row-span-full py-2 mb-12">
        {products?.map((product, index) => (<Slider.Item index={index} class="carousel-item !w-[250px]">
          <ProductCard product={product} itemListName={title} layout={cardLayout} highlights={highlights} tags={tags} device={device} index={index} />
        </Slider.Item>))}
      </Slider>

      <>
        <div class={`flex items-center justify-center z-20  col-start-1 row-start-2  ${CONDITIONAL_RESPONSIVE_PARAMS[showPaginationArrows ? showPaginationArrows : "Always"]}`}>
          <Slider.PrevButton style={{
            minHeight: "28px",
          }} class="btn btn-circle border-none shadow-md bg-white lg:opacity-60 lg:hover:bg-white lg:hover:opacity-100 max-md:min-h-0 max-md:h-[24px] max-md:w-[24px]">
            <Icon class="text-primary max-md:w-[18px]" size={32} id="LeftArrowBanner" />
          </Slider.PrevButton>
        </div>
        <div class={`flex items-center justify-center z-20 col-start-3 row-start-2 ${CONDITIONAL_RESPONSIVE_PARAMS[showPaginationArrows ? showPaginationArrows : "Always"]}`}>
          <Slider.NextButton style={{
            minHeight: "28px",
          }} class="btn btn-circle border-none shadow-md bg-white lg:opacity-60 lg:hover:bg-white lg:hover:opacity-100 max-md:min-h-0 max-md:h-[24px] max-md:w-[24px]">
            <Icon class="text-primary max-md:w-[18px]" size={32} id="RightArrowBanner" />
          </Slider.NextButton>
        </div>
        <Dots images={products} className={CONDITIONAL_RESPONSIVE_PARAMS["Always"]} />
      </>

      <SendEventOnLoad event={{
        name: "view_item_list",
        params: {
          item_list_name: title,
          items: products.map((product) => mapProductToAnalyticsItem({
            product,
            ...(useOffer(product.offers)),
          })),
        },
      }} />
      <SliderJS rootId={id+customId} infinite itemsPerPage={layout?.itemsPerPage?.reduce((initial, { screenWidth, itemsQuantity }) => ({
        ...initial,
        [screenWidth?.toString() ?? "0"]: itemsQuantity ?? 1,
      }), {})} />
    </div>
  </div>);
}
export default ProductShelf;


export const loader = async (props: Props, _req: Request, ctx: AppContext) => {
  const tags = await ctx.invoke.site.loaders.getTags();
  const device = ctx.device

  return {
    ...props,
    tags: tags,
    device: device   
  };
};