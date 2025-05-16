import Slider from "$store/components/ui/Slider.tsx";
import type { ImageObject, Product } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { HighLight } from "$store/components/product/ProductHighlights.tsx";
import ProductHighlights from "$store/components/product/ProductHighlights.tsx";
import WishlistIcon from "$store/islands/WishlistButton.tsx";
import Icon from "$store/components/ui/Icon.tsx";


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
  { images, width, height, aspect, product, highlights, device, }: Props,
) {

  const video = product && product.video || [];
  const midia = [...images, ...video];

  const {
    productID,
    isVariantOf,
  } = product;
  
  const productGroupID = isVariantOf?.productGroupID;

  const imagecustom = product.image?.find((i) => i["@type"] === "ImageObject");
  const iconPlayer =
    "https://topmoveis.vtexcommercestable.com.br/arquivos/icon-play-video.png";

  return (
    <>
      <div>
        <div class="flex flex-col xl:flex-row-reverse relative lg:items-start gap-4">
        {/* Image Slider */}
          <div class="relative xl:pl-32">
            <Slider class="carousel carousel-center gap-6 box-border lg:box-content lg:w-[600px] 2xl:w-[727px] w-full px-4 lg:px-0">
              {midia.map((img, index) => (
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
                          loading={"lazy"}
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
              {midia.map((img, index) => (
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
              <Icon id="WhatsappLogo" class="pt-[7px] pl-[10px] lg:pl-0" size={40} stroke="0.01" />
              <button
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