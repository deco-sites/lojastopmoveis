import {
  DESKTOP_COLUMNS,
  MOBILE_COLUMNS,
} from "$store/components/ui/BannerGrid.tsx";
import type { Image as LiveImage } from "deco-sites/std/components/types.ts";
import { Head } from "$fresh/runtime.ts";
import Slider from "../../components/ui/Slider.tsx";
import SliderJS from "../../islands/SliderJS.tsx";
import { useId } from "preact/hooks";
import Icon from "../../components/ui/Icon.tsx";
import { AppContext } from "site/apps/site.ts";
import Image from "apps/website/components/Image.tsx";
import Header from "$store/components/ui/SectionHeader.tsx";

export type ResponsiveConditionals =
  | "Always"
  | "Desktop Only"
  | "Mobile Only"
  | "Never";
export const CONDITIONAL_RESPONSIVE_PARAMS: Record<
  ResponsiveConditionals,
  string
> = {
  "Always": "flex",
  "Desktop Only": "lg:flex max-lg:hidden",
  "Mobile Only": "max-lg:flex lg:hidden",
  "Never": "hidden",
};
export interface ImageGalleryItem {
  /** @description Title */
  title?: string;
  /** @description Image url */
  image: LiveImage;
  /** @description Alt text */
  alt: string;
  /** @description Link */
  href?: string;
  /** @description Abrir em nova página? */
  blank?: boolean;
  preload?: boolean;
}
export interface Props {
  title?: string;
  /** @description Banners */
  images: ImageGalleryItem[];
  /** @description Items per page Desktop */
  itemPerPageDesktop?: 1 | 2 | 3 | 4 | 5 | 6;
  /** @description Items per page Mobile */
  itemPerPageMobile?: 1 | 2;
  /** @description Enable hover effect on images */
  hoverEffect?: boolean;
  device?: string;
  interval?: number;
  /**
   * @title Show pagination arrows?
   */
  showPaginationArrows?: ResponsiveConditionals;
  /**
   * @title Show pagination dots?
   * @default Always
   */
  showPaginationDots?: ResponsiveConditionals;

  layout?: {
    headerAlignment?: "center" | "left";
    headerfontSize?: "Normal" | "Large";
    color?: "primary" | "secondary";
    itemsPerPage?: {
      screenWidth?: number;
      itemsQuantity?: number;
    }[];
  };
}
interface DotsProps {
  images?: ImageGalleryItem[];
  /**
   * @description Check this option when this banner is the biggest image on the screen for image optimizations
   */
  interval?: number;
  /**
   * @title Show pagination arrows?
   */
  className: string;
}
function Dots({ images, className, interval = 0 }: DotsProps) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @property --dot-progress {
            syntax: '<percentage>';
            inherits: false;
            initial-value: 0%;
          }
          `,
        }}
      />
      <ul
        class={`carousel justify-center hidden lg:inline-flex col-span-full gap-2 z-10 row-start-4 max-lg:mt-[0.625rem]`}
      >
        {images?.map((_, index) => (
          <li class="carousel-item">
            <Slider.Dot index={index}>
              <div class="py-5">
                <div
                  class="w-4 h-4 group-disabled:opacity-100 opacity-20 rounded-full bg-primary"
                  style={{ animationDuration: `${interval}s` }}
                />
              </div>
            </Slider.Dot>
          </li>
        ))}
      </ul>
    </>
  );
}
interface ButtonsProps {
  className: string;
}
function Buttons({ className }: ButtonsProps) {
  return (
    <>
      <div
        class={`lg:flex hidden items-center justify-center z-20  col-start-1 row-start-2 ${className}`}
      >
        <Slider.PrevButton class="btn btn-circle border-none shadow-md bg-white lg:opacity-60 lg:hover:bg-white lg:hover:opacity-100 max-md:min-h-0 max-md:h-[24px] max-md:w-[24px]">
          <Icon
            class="text-primary max-md:w-[18px]"
            size={32}
            id="LeftArrowBanner"
          />
        </Slider.PrevButton>
      </div>
      <div
        class={`lg:flex hidden items-center justify-center z-20 col-start-3 row-start-2 ${className}`}
      >
        <Slider.NextButton class="btn btn-circle border-none shadow-md bg-white lg:opacity-60 lg:hover:bg-white lg:hover:opacity-100 max-md:min-h-0 max-md:h-[24px] max-md:w-[24px]">
          <Icon
            class="text-primary max-md:w-[18px]"
            size={32}
            id="RightArrowBanner"
          />
        </Slider.NextButton>
      </div>
    </>
  );
}

export default function BrandGallery(props: Props) {
  const {
    title,
    images,
    layout,
    itemPerPageMobile = 2,
    itemPerPageDesktop = 3,
    hoverEffect, showPaginationArrows,
    showPaginationDots,
    interval,

  } = props;

  const id = useId();

  return (
    <section
      class={`w-full pb-8 flex flex-col lg:gap-7 lg:pb-10`}
    >
      <div class="flex items-center justify-between relative pb-3">
        <Header title={title || ""} description="" fontSize={layout?.headerfontSize || "Large"} alignment={layout?.headerAlignment || "center"} color={layout?.color || "primary"} />
      </div>
      <div id={id} class="grid grid-cols-[48px_1fr_48px] px-0 grid-rows-[1fr_48px_1fr_48px]">
        <Slider class="container carousel carousel-start gap-5 lg:gap-6 col-span-full row-span-full py-2 mb-0 lg:mb-8 lg:mb-0'}">
          {images.map((item, index) => (
            <Slider.Item
              index={index}
              class={`carousel-item max-w-[60px] lg:w-[230px] lg:max-w-[230px]`}
            >
              <a
                target={item.blank ? "_self" : "_blank"}
                href={item.href}
                class="relative overflow-hidden cursor-pointer rounded-xl w-full lg:w-[80%] max-w-[70px] lg:max-w-[120px] lg:w-full m-auto group flex flex-col-reverse items-center"
              >
                {item.title && (
                  <span class=" text-primary bottom-0 mb-[30px] px-10 py-[17px] left-1/2 z-30 max-sm:text-[12px] text-[19px] lg:text-[19px] font-bold whitespace-nowrap">
                    {item.title}
                  </span>
                )}
                {item.preload && (
                  <Head>
                    <link
                      as="image"
                      rel="preload"
                      href={item.image}
                    />
                  </Head>
                )}
                <img
                  preload={undefined}
                  loading={"lazy"}
                  class={`w-full h-full scale-100 ${hoverEffect ? "group-hover:scale-110" : ""
                    } transition-all duration-700`}
                  src={item.image}
                  alt={"imagem de " + item.alt}
                  decoding="async"
                  width={300}
                  height={300}
                />
              </a>
            </Slider.Item>
          ))}
        </Slider>
        <Buttons
          className={CONDITIONAL_RESPONSIVE_PARAMS[
            showPaginationArrows ? showPaginationArrows : "Always"
          ]}
        />
        <Dots
          images={images}
          interval={interval}
          className={CONDITIONAL_RESPONSIVE_PARAMS[
            showPaginationDots ? showPaginationDots : "Always"
          ]}
        />
        <SliderJS
          rootId={id}
          interval={interval && interval * 1e3}
          infinite
        />
      </div>
    </section>
  );
}

export const loader = (props: Props, _req: Request, ctx: AppContext) => {
  return { ...props, device: ctx.device };
};