import {
  DESKTOP_COLUMNS,
  MOBILE_COLUMNS,
} from "$store/components/ui/BannerGrid.tsx";
import type { Image as LiveImage } from "deco-sites/std/components/types.ts";
import Image from "apps/website/components/Image.tsx";
import { Head } from "$fresh/runtime.ts";
import Slider from "../../components/ui/Slider.tsx";
import SliderJS from "../../islands/SliderJS.tsx";
import { useId } from "preact/hooks";
import Icon from "../../components/ui/Icon.tsx";
import { AppContext } from "deco-sites/lojastopmoveis/apps/site.ts";
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
        class={`carousel justify-center col-span-full gap-2 z-10 row-start-4 ${className}`}
      >
        {images?.map((_, index) => (
          <li class="carousel-item">
            <Slider.Dot index={index}>
              <div class="py-5">
                <div
                  class="w-3 h-3 group-disabled:opacity-100 opacity-20 rounded-full bg-primary"
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
        class={`flex items-center justify-center z-10 col-start-1 row-start-2 ${className}`}
      >
        <Slider.PrevButton class="btn btn-circle border-none shadow-md bg-white lg:opacity-60 lg:hover:bg-white lg:hover:opacity-100">
          <Icon
            class="text-primary"
            size={32}
            id="LeftArrowBanner"
          />
        </Slider.PrevButton>
      </div>
      <div
        class={`flex items-center justify-center z-10 col-start-3 row-start-2 ${className}`}
      >
        <Slider.NextButton class="btn btn-circle border-none shadow-md bg-white lg:opacity-60 lg:hover:bg-white lg:hover:opacity-100">
          <Icon
            class="text-primary"
            size={32}
            id="RightArrowBanner"
          />
        </Slider.NextButton>
      </div>
    </>
  );
}

export default function ImageGallery(props: Props) {
  const {
    images,
    itemPerPageMobile = 2,
    itemPerPageDesktop = 3,
    hoverEffect,
    device,
    interval,
    showPaginationArrows,
    showPaginationDots,
  } = props;
  const id = useId();
  return (
    <>
      {device === "desktop"
        ? (
          <section
            class={`w-full h-full lg:grid justify-center lg:gap-4 gap-5 my-12 max-md:my-8 flex flex-wrap ${
              MOBILE_COLUMNS[itemPerPageMobile ?? 2]
            }} ${DESKTOP_COLUMNS[itemPerPageDesktop ?? 3]}`}
          >
            {images.map((item) => (
              <a
                target={item.blank ? "_self" : "_blank"}
                href={item.href}
                class="relative overflow-hidden rounded-xl w-[45%] lg:w-full m-auto group flex flex-col-reverse items-center"
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
                  class={`w-full h-full scale-100 ${
                    hoverEffect ? "group-hover:scale-110" : ""
                  } transition-all duration-700`}
                  src={item.image}
                  alt={"imagem de " + item.alt}
                  decoding="async"
                  width={300}
                  height={300}
                />
              </a>
            ))}
          </section>
        )
        : (
          <section
            id={id}
            class={`grid grid-cols-[48px_1fr_48px] sm:grid-cols-[70px_1fr_70px] grid-rows-[1fr_48px_1fr_64px]`}
          >
            <Slider class="carousel sm:gap-0 sm:carousel-center col-span-full row-[1/5]">
              {images.map((item, index) => (
                <Slider.Item
                  index={index}
                  class={`carousel-item lg:flex lg:justify-center !w-1/2	 ${
                    MOBILE_COLUMNS[itemPerPageMobile ?? 2]
                  } ${DESKTOP_COLUMNS[itemPerPageDesktop ?? 3]}`}
                >
                  <a
                    target={item.blank ? "_self" : "_blank"}
                    href={item.href}
                    class="relative overflow-hidden rounded-xl w-[80%] lg:w-full m-auto group flex flex-col-reverse items-center"
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
                      class={`w-full h-full scale-100 ${
                        hoverEffect ? "group-hover:scale-110" : ""
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
          </section>
        )}
    </>
  );
}
export const loader = (props: Props, _req: Request, ctx: AppContext) => {
  return { ...props, device: ctx.device };
};
