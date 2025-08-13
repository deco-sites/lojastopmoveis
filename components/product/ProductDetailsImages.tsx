import Slider from "$store/components/ui/Slider.tsx";
import SliderJS from "$store/islands/SliderJS.tsx";
import type { ImageObject, Product } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { HighLight } from "$store/components/product/ProductHighlights.tsx";
import ProductHighlights from "$store/components/product/ProductHighlights.tsx";
import WishlistIcon from "$store/islands/WishlistButton.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

interface Props {
  images: ImageObject[];
  width: number;
  height: number;
  aspect: string;
  product: Product;
  highlights?: HighLight[];
  device: string;
  url: string;
}

function ProductDetailsImages(
  { images, width, height, aspect, product, highlights, device }: Props,
) {
  const video = product && product.video || [];
  const media = [...images, ...video].filter((item) => item["@type"] === "VideoObject" ? item.contentUrl : item.url);
  const currentSlide = useSignal(0);
  const sliderId = `product-slider-${product.productID}`;

  const {
    productID,
    isVariantOf,
  } = product;

  const productGroupID = isVariantOf?.productGroupID;

  const imagecustom = product.image?.find((i) => i["@type"] === "ImageObject");
  const iconPlayer =
    "https://topmoveis.vtexcommercestable.com.br/arquivos/icon-play-video.png";

  const currentIsVideo = media[currentSlide.value]?.["@type"] === "VideoObject";
  const firstVideoIndex = media.findIndex((item) =>
    item["@type"] === "VideoObject"
  );
  const hasVideo = firstVideoIndex !== -1;

  const goToVideo = () => {
    if (firstVideoIndex !== -1) {
      const slider = document.getElementById(sliderId)?.querySelector(
        "[data-slider]",
      ) as HTMLUListElement;
      const targetItem = slider?.querySelector(
        `[data-slider-item="${firstVideoIndex}"]`,
      ) as HTMLLIElement;

      if (slider && targetItem) {
        slider.scrollTo({
          left: targetItem.offsetLeft,
          behavior: "smooth",
        });
        currentSlide.value = firstVideoIndex;
        setTimeout(() => {
          const iframe = targetItem.querySelector("iframe") as HTMLIFrameElement | null;
          if (iframe) {
            const src = iframe.getAttribute("src") ?? "";
            if (!src.includes("autoplay=1")) {
              const separator = src.includes("?") ? "&" : "?";
              iframe.setAttribute("src", `${src}${separator}autoplay=1`);
            }
          }
        }, 600);
      }
    }
  };

  useEffect(() => {
    const slider = document.getElementById(sliderId)?.querySelector(
      "[data-slider]",
    );
    if (!slider) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute("data-slider-item") || "0",
            );
            currentSlide.value = index;
          }
        });
      },
      { threshold: 0.6, root: slider },
    );

    const items = slider.querySelectorAll("[data-slider-item]");
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [sliderId]);

  return (
    <>
      <div id={sliderId}>
        <SliderJS rootId={sliderId} scroll="smooth" />
        <div class="flex flex-col xl:flex-row-reverse relative lg:items-start gap-4">
          {/* Image Slider */}
          <div class="relative xl:pl-32">
            <Slider class="carousel carousel-center gap-6 box-border lg:box-content lg:w-[600px] 2xl:w-[727px] w-full px-4 lg:px-0">
              {media.map((img, index) => (
                <Slider.Item
                  index={index}
                  class="carousel-item w-full aspect-square"
                >
                  <div class="relative block h-0 w-full pb-[100%] ">
                    {img["@type"] === "VideoObject" &&
                      (
                        <iframe
                          class="m-w-[600px] w-full h-[385px] lg:h-[600px]"
                          width={width}
                          height={height}
                          title={img?.name}
                          src={img.contentUrl!}
                          frameborder={0}
                          loading="lazy"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        >
                        </iframe>
                      )}
                    {img["@type"] === "ImageObject" &&
                      renderImage({
                        img,
                        index,
                        aspect,
                        width,
                        height,
                        device,
                      })}
                  </div>
                </Slider.Item>
              ))}
            </Slider>

            {/* Video Button */}
            {hasVideo && !currentIsVideo && (
              <button
                type="button"
                onClick={goToVideo}
                class="absolute md:bottom-5 -bottom-2 md:right-4 right-0 bg-secondary hover:bg-opacity-90 text-white p-1 rounded-[4px] flex items-center gap-1 transition-all duration-300 z-10"
                aria-label="Ver vídeo do produto"
              >
                <Icon id="Play" class="w-5 h-5" />
                <span class="text-sm font-medium">Vídeo</span>
              </button>
            )}
            <div class="absolute w-full right-0 top-0 xl:pl-32">
              {/* Discount tag */}
              <div class="flex justify-between w-full">
                {
                  /* {price && listPrice && price !== listPrice
                  ? (
                    <DiscountBadge
                      price={price}
                      listPrice={listPrice}
                      className="lg:left-auto lg:right-0 left-4"
                    />
                  )
                  : null} */
                }

                <WishlistIcon
                  productGroupID={productGroupID}
                  productID={productID}
                  tailwind="col-start-1 col-start-1 justify-self-end !h-[36px] !w-[36px] items-end"
                  tailwindIcon="scale-150"
                />

                <div class="grid gap-y-2 w-full">
                  {product && (
                    <ProductHighlights
                      product={product}
                      highlights={highlights}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div class="lg:max-w-[500px] lg:self-start xl:self-start xl:left-0 xl:absolute xl:max-h-full xl:overflow-y-scroll xl:scrollbar-none max-lg:hidden">
            <ul
              class={`flex gap-4 overflow-auto lg:max-h-min lg:flex-1 lg:justify-start xl:flex-col-reverse`}
            >
              {media.map((img, index) => (
                <li class="min-w-[75px] lg:h-fit lg:min-w-[130px]">
                  <Slider.Dot index={index}>
                    {img["@type"] === "VideoObject" &&
                      (
                        <div class={`relative`}>
                          <Image
                            style={{ aspectRatio: aspect }}
                            class="border-neutral hover:border-secondary-focus group-disabled:border-secondary-focus border-2 rounded-[10px]"
                            width={width / 5}
                            height={height / 5}
                            src={imagecustom?.url!}
                            alt={img.alternateName}
                          />
                          <img
                            class={`absolute w-[50px] top-2/4 -translate-y-1/2 -translate-x-1/2 left-2/4 border-neutral hover:border-secondary-focus group-disabled:border-secondary-focus border-2 rounded-[10px]`}
                            src={iconPlayer}
                          />
                        </div>
                      )}
                    {img["@type"] === "ImageObject" &&
                      (
                        <Image
                          style={{ aspectRatio: aspect }}
                          class="border-neutral hover:border-secondary-focus group-disabled:border-secondary-focus border-2 rounded-[10px]"
                          width={width / 5}
                          height={height / 5}
                          src={img?.url!}
                          alt={img.alternateName}
                        />
                      )}
                  </Slider.Dot>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <a
          href={`https://api.whatsapp.com/send/?phone=5585988025359&text&type=phone_number&app_absent=0`}
          class="lg:max-w-[85%]  justify-center w-full mt-[25px] lg:ml-[15%] h-[40px] bg-[#049548] rounded-full border border-solid lg:flex hidden "
          aria-label="Chat on WhatsApp"
          target="blank"
        >
          <Icon
            id="WhatsappLogo"
            class="pt-[7px] pl-[10px] lg:pl-0"
            size={40}
            stroke="0.01"
          />
          <button
            type="button"
            class=" text-white p-2 text-sm lg:text-base font-bold"
            aria-label="Chat on WhatsApp"
          >
            Gostei do produto, quero comprar pelo WhatsApp
          </button>
        </a>
      </div>
    </>
  );
}

function renderImage({ img, index, aspect, width, height, device }: {
  img: ImageObject;
  index: number;
  aspect: string;
  width: number;
  height: number;
  device: string;
}) {
  const isMobile = device === "mobile";

  const image = (
    <Image
      class={isMobile
        ? "absolute top-0 left-0 w-full block object-cover font-['blur-up:_auto','object-fit:_cover'] h-auto align-middle"
        : "transition duration-150 opacity-100  lg:hover:opacity-0 hover:duration-300 lg:w-full"}
      sizes="(max-width: 480px) 576px, 576px"
      style={{ aspectRatio: aspect }}
      src={img?.url!}
      alt={img.alternateName}
      width={width}
      height={height}
      // Preload LCP image for better web vitals
      fetchPriority={index === 0 ? "high" : "auto"}
      preload={index === 0}
      loading={index === 0 ? "eager" : "lazy"}
    />
  );

  return isMobile ? image : (
    <figure
      style={`background-image: url(${img?.url!}); background-size: 250%;`}
      onMouseMove={(e: MouseEvent) => {
        const zoomer = e.currentTarget as HTMLElement;
        const offsetX = e.offsetX;
        const offsetY = e.offsetY;
        const x = offsetX / (zoomer.offsetWidth) * 100;
        const y = offsetY / (zoomer.offsetHeight) * 100;

        zoomer!.style.backgroundPosition = x + "% " + y + "%";
      }}
      class="overflow-hidden cursor-zoom-in relative group/zoomer"
    >
      {image}
    </figure>
  );
}

export default ProductDetailsImages;
