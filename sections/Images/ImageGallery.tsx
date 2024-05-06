import {
  DESKTOP_COLUMNS,
  MOBILE_COLUMNS,
} from "$store/components/ui/BannerGrid.tsx";
import type { Image as LiveImage } from "deco-sites/std/components/types.ts";
import Image from "apps/website/components/Image.tsx";
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
  itemPerPageDesktop?: 1 | 2 | 3 | 4 | 5 | 6;
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
      class={`w-full h-full lg:grid justify-center lg:gap-8 gap-5 my-12 max-md:my-8 flex flex-wrap ${
        MOBILE_COLUMNS[itemPerPageMobile ?? 1]
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
          <Image
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
  );
}
