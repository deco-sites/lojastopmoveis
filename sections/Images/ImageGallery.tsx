import {
  DESKTOP_COLUMNS,
  MOBILE_COLUMNS,
} from "$store/components/ui/BannerGrid.tsx";
import type { Image as LiveImage } from "deco-sites/std/components/types.ts";
import Image from "deco-sites/std/components/Image.tsx";
import { Head } from "$fresh/runtime.ts";

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
  itemPerPageDesktop?: 1 | 2 | 3 | 4 | 5;
  /** @description Items per page Mobile */
  itemPerPageMobile?: 1 | 2;
  /** @description Enable hover effect on images */
  hoverEffect?: boolean;
}

export default function ImageGallery(props: Props) {
  const { images, itemPerPageMobile = 1, itemPerPageDesktop = 3, hoverEffect } =
    props;

  return (
    <section
      class={`w-full h-full grid justify-center lg:gap-8 gap-5 my-12 max-md:my-8 ${
        MOBILE_COLUMNS[itemPerPageMobile ?? 1]
      }} ${DESKTOP_COLUMNS[itemPerPageDesktop ?? 3]}`}
    >
      {images.map((item) => (
        <a
          target={item.blank ? "_blank" : "_self"}
          href={item.href}
          class="block relative overflow-hidden rounded-xl w-full m-auto group"
        >
          {item.title && (
            <span class="absolute bottom-0 mb-[30px] bg-primary rounded-full px-10 py-[17px] left-1/2 -translate-x-1/2 z-30 max-sm:text-[19px] text-[19px] lg:text-[19px] font-bold text-base-100 whitespace-nowrap">
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
            loading={item.preload ? "eager" : "lazy"}
            class={`w-full h-full scale-100 ${
              hoverEffect ? "group-hover:scale-125" : ""
            } transition-all duration-700`}
            src={item.image}
            alt={item.alt}
            decoding="async"
            width={400}
            height={400}
          />
        </a>
      ))}
    </section>
  );
}
