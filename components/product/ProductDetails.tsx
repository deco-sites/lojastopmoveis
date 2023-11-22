import { useSignal } from "@preact/signals";
import { useId } from "preact/hooks";
import ShippingSimulation from "$store/islands/ShippingSimulation.tsx";
import Breadcrumb from "$store/components/ui/Breadcrumb.tsx";
import Button from "$store/components/ui/Button.tsx";
import Image from "deco-sites/std/components/Image.tsx";
import SliderJS from "$store/islands/SliderJS.tsx";
import OutOfStock from "$store/islands/OutOfStock.tsx";
import { useOffer } from "$store/sdk/useOffer.ts";
import { formatPrice } from "$store/sdk/format.ts";
import { SendEventOnLoad } from "$store/sdk/analytics.tsx";
import { mapProductToAnalyticsItem } from "deco-sites/std/commerce/utils/productToAnalyticsItem.ts";
import type { ProductDetailsPage } from "deco-sites/std/commerce/types.ts";
import type { LoaderReturnType } from "$live/types.ts";
import AddToCartActions from "$store/islands/AddToCartActions.tsx";
import ProductDetailsImages from "$store/islands/ProductDetailsImages.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import { getShareLink } from "$store/sdk/shareLinks.tsx";

import ProductSelector from "./ProductVariantSelector.tsx";

export type Variant = "front-back" | "slider" | "auto";

export type ShareableNetwork = "Facebook" | "Twitter" | "Email" | "WhatsApp";

export interface Props {
  page: LoaderReturnType<ProductDetailsPage | null>;
  /**
   * @title Product view
   * @description Ask for the developer to remove this option since this is here to help development only and should not be used in production
   */
  variant?: Variant;
  shipmentPolitics?: {
    label: string;
    link: string;
  };
  shareableNetworks?: ShareableNetwork[];
}

const WIDTH = 500;
const HEIGHT = 500;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

/**
 * Rendered when a not found is returned by any of the loaders run on this page
 */
function NotFound() {
  return (
    <div class="w-full flex justify-center items-center py-28">
      <div class="flex flex-col items-center justify-center gap-6">
        <span class="font-medium text-2xl">Página não encontrada</span>
        <a href="/">
          <Button>Voltar à página inicial</Button>
        </a>
      </div>
    </div>
  );
}

function ProductInfo(
  { page, shipmentPolitics, shareableNetworks }: {
    page: ProductDetailsPage;
    shipmentPolitics?: Props["shipmentPolitics"];
    shareableNetworks?: Props["shareableNetworks"];
  },
) {
  const {
    breadcrumbList,
    product,
  } = page;
  const {
    description,
    productID,
    offers,
    name,
    isVariantOf,
    url,
  } = product;
  const { price, listPrice, seller, availability, installment } = useOffer(
    offers,
  );

  return (
    <>
      {/* Code and name */}
      <div class="mt-4 sm:mt-0">
        <h1>
          <span class="text-[#4A4B51] text-2xl tracking-[1px]">
            {isVariantOf?.name}
          </span>
        </h1>
        {name && name?.length > 0 && (
          <div>
            <span class="text-sm text-base-300">
              Referência: {name}
            </span>
          </div>
        )}
      </div>
      {/* Prices */}
      {availability === "https://schema.org/InStock"
        ? (
          <div class="mt-5">
            <div class="flex flex-row gap-2 items-center">
              {listPrice !== price && (
                <span class="line-through text-base-300 text-xs">
                  {formatPrice(listPrice, offers!.priceCurrency!)}
                </span>
              )}
              <span class="font-medium text-[19px] text-primary">
                {formatPrice(price, offers!.priceCurrency!)}
              </span>
            </div>
            <div class="flex flex-col">
              <span>
                ou {installment?.billingDuration}x de {formatPrice(
                  installment?.billingIncrement,
                  offers!.priceCurrency,
                )}
              </span>
            </div>
          </div>
        )
        : null}
      {/* Sku Selector */}
      {availability === "https://schema.org/InStock"
        ? (
          <div class="mt-4 sm:mt-5">
            <ProductSelector product={product} />
          </div>
        )
        : null}
      {/* Add to Cart and Favorites button */}
      <div class="mt-4 lg:mt-10 flex gap-[30px]">
        {availability === "https://schema.org/InStock"
          ? (
            <>
              {seller && (
                <AddToCartActions
                  productID={productID}
                  seller={seller}
                  price={price}
                  listPrice={listPrice}
                  productName={name ?? ""}
                  productGroupID={product.isVariantOf?.productGroupID ?? ""}
                />
              )}
            </>
          )
          : <OutOfStock productID={productID} />}
      </div>
      {/* Shipping Simulation */}

      {availability === "https://schema.org/InStock"
        ? (
          <ShippingSimulation
            items={[{
              id: Number(product.sku),
              quantity: 1,
              seller: seller ?? "1",
            }]}
          />
        )
        : null}
      {/* Description card */}
      <details className="collapse collapse-plus mt-[30px]">
        <summary className="collapse-title border border-base-200 rounded-full py-3 px-[30px] !min-h-0 font-medium">
          Descrição
        </summary>
        <div className="readmore !flex-col text-xs px-0 pl-[30px] mt-3 leading-tight collapse-content text-base-300">
          <input type="checkbox" id="readmore" className="readmore-toggle" />
          <p
            className="readmore-content whitespace-break-spaces !line-clamp-none"
            dangerouslySetInnerHTML={{ __html: description ? description : "" }}
          >
          </p>
        </div>
      </details>
      {/* Share Product on Social Networks */}
      {shareableNetworks && (
        <div class="flex items-center gap-5 my-5">
          <span class="text-xs text-base-300">Compartilhar</span>
          <ul class="gap-2 flex items-center justify-between">
            {shareableNetworks.map((network) => (
              <li class="bg-secondary w-8 h-8 rounded-full hover:bg-primary group transition-all">
                <a
                  href={getShareLink({
                    network,
                    productName: isVariantOf?.name ?? name ?? "",
                    url: url ?? "",
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-center w-full h-full group-hover:text-white text-primary"
                >
                  <Icon id={network} width={20} height={20} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Analytics Event */}
      <SendEventOnLoad
        event={{
          name: "view_item",
          params: {
            items: [
              mapProductToAnalyticsItem({
                product,
                breadcrumbList,
                price,
                listPrice,
              }),
            ],
          },
        }}
      />
    </>
  );
}

/**
 * Here be dragons
 *
 * bravtexfashionstore (VTEX default fashion account) has the same images for different skus. However,
 * VTEX api does not return the same link for the same image. This causes the image to blink when
 * the user changes the selected SKU. To prevent this blink from happening, I created this function
 * bellow to use the same link for all skus. Example:
 *
 * {
    skus: [
      {
        id: 1
        image: [
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/123/a.jpg",
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/124/b.jpg",
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/125/c.jpg"
        ]
      },
      {
        id: 2
        image: [
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/321/a.jpg",
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/322/b.jpg",
          "https://bravtexfashionstore.vtexassets.com/arquivos/ids/323/c.jpg"
        ]
      }
    ]
  }

  for both skus 1 and 2, we have the same images a.jpg, b.jpg and c.jpg, but
  they have different urls. This function returns, for both skus:

  [
    "https://bravtexfashionstore.vtexassets.com/arquivos/ids/321/a.jpg",
    "https://bravtexfashionstore.vtexassets.com/arquivos/ids/322/b.jpg",
    "https://bravtexfashionstore.vtexassets.com/arquivos/ids/323/c.jpg"
  ]

  This is a very catalog dependent function. Feel free to change this as you wish
 */
const useStableImages = (product: ProductDetailsPage["product"]) => {
  const imageNameFromURL = (url = "") => {
    const segments = new URL(url).pathname.split("/");
    return segments[segments.length - 1];
  };

  const images = product.image ?? [];
  const allImages = product.isVariantOf?.hasVariant.flatMap((p) => p.image)
    .reduce((acc, img) => {
      if (img?.url) {
        acc[imageNameFromURL(img.url)] = img.url;
      }
      return acc;
    }, {} as Record<string, string>) ?? {};

  return images.map((img) => {
    const name = imageNameFromURL(img.url);

    return { ...img, url: allImages[name] ?? img.url };
  });
};

function Details({
  page,
  variant,
  shipmentPolitics,
  shareableNetworks,
}: {
  page: ProductDetailsPage;
  variant: Variant;
  shipmentPolitics?: Props["shipmentPolitics"];
  shareableNetworks?: Props["shareableNetworks"];
}) {
  const { product, breadcrumbList } = page;
  const filteredBreadcrumbList = breadcrumbList.itemListElement.filter((item) =>
    item.name!.length > 1
  );
  const id = `product-image-gallery:${useId()}`;
  const images = useStableImages(product);

  const open = useSignal(false);
  const zoomImage = useSignal(images[0].url);
  const zoomX = useSignal(0);
  const zoomY = useSignal(0);

  /**
   * Product slider variant
   */
  if (variant === "slider") {
    return (
      <>
        {/* Breadcrumb */}
        <Breadcrumb
          itemListElement={filteredBreadcrumbList}
        />
        <div
          id={id}
          class="flex flex-col lg:flex-row gap-4 lg:justify-center"
        >
          {/* Product Images */}
          <ProductDetailsImages
            images={images}
            width={WIDTH}
            height={HEIGHT}
            aspect={ASPECT_RATIO}
            product={product}
          />

          {/* Product Info */}
          <div class="w-full lg:pr-0 lg:pl-6">
            <ProductInfo
              page={page}
              shipmentPolitics={shipmentPolitics}
              shareableNetworks={shareableNetworks}
            />
          </div>
        </div>
        <SliderJS rootId={id}></SliderJS>
      </>
    );
  }

  /**
   * Product front-back variant.
   *
   * Renders two images side by side both on mobile and on desktop. On mobile, the overflow is
   * reached causing a scrollbar to be rendered.
   */
  return (
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-[50vw_25vw] lg:grid-rows-1 lg:justify-center">
      {/* Image slider */}
      <ul class="carousel carousel-center gap-6">
        {[images[0], images[1] ?? images[0]].map((img, index) => (
          <li class="carousel-item min-w-[100vw] lg:min-w-[24vw]">
            <Image
              sizes="(max-width: 640px) 100vw, 24vw"
              style={{ aspectRatio: ASPECT_RATIO }}
              src={img.url!}
              alt={img.alternateName}
              width={WIDTH}
              height={HEIGHT}
              // Preload LCP image for better web vitals
              preload={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </li>
        ))}
      </ul>

      {/* Product Info */}
      <div class="px-4 lg:pr-0 lg:pl-6">
        <ProductInfo page={page} />
      </div>
    </div>
  );
}

function ProductDetails(
  { page, variant: maybeVar = "auto", shipmentPolitics, shareableNetworks }:
    Props,
) {
  /**
   * Showcase the different product views we have on this template. In case there are less
   * than two images, render a front-back, otherwhise render a slider
   * Remove one of them and go with the best suited for your use case.
   */
  const variant = maybeVar === "auto"
    ? page?.product.image?.length && page?.product.image?.length < 2
      ? "front-back"
      : "slider"
    : maybeVar;

  return (
    <div class="py-0">
      {page
        ? (
          <Details
            page={page}
            variant={variant}
            shipmentPolitics={shipmentPolitics}
            shareableNetworks={shareableNetworks}
          />
        )
        : <NotFound />}
    </div>
  );
}

export default ProductDetails;
