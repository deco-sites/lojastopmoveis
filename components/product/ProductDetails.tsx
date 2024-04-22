import { useSignal } from "@preact/signals";
import { useId } from "preact/hooks";
import ShippingSimulation from "$store/islands/ShippingSimulation.tsx";
import Breadcrumb from "$store/components/ui/Breadcrumb.tsx";
import Button from "$store/components/ui/Button.tsx";
import Image from "apps/website/components/Image.tsx";
import SliderJS from "$store/islands/SliderJS.tsx";
import OutOfStock from "$store/islands/OutOfStock.tsx";
import { useOffer } from "$store/sdk/useOffer.ts";
import { formatPrice } from "$store/sdk/format.ts";
import { SendEventOnLoad } from "$store/sdk/analytics.tsx";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import type { ProductDetailsPage } from "apps/commerce/types.ts";
import type { LoaderReturnType } from "$live/types.ts";
import AddToCartActions from "$store/islands/AddToCartActions.tsx";
import ProductDetailsImages from "$store/islands/ProductDetailsImages.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import { getShareLink } from "$store/sdk/shareLinks.tsx";
import { HighLight } from "$store/components/product/ProductHighlights.tsx";
import ProductSelector from "./ProductVariantSelector.tsx";
import SimilarSelector from "deco-sites/lojastopmoveis/components/product/SimilarSelector.tsx";

export type Variant = "front-back" | "slider" | "auto";

export type ShareableNetwork = "Facebook" | "Twitter" | "Email" | "WhatsApp";

export interface Props {
  page: LoaderReturnType<ProductDetailsPage | null>;
  /**
   * @description Flags, displayed when  products are found
   */
  highlights?: HighLight[];
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
    isSimilarTo,
    url,
  } = product;
  const { price = 0, listPrice, seller, availability, installment } = useOffer(
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
              Referência: {productID}
            </span>
          </div>
        )}
        <div class="flex gap-[2px]">
          <span class="text-[#4A4B51] text-sm">
            Vendido e entregue por:
          </span>
          <span class="text-secondary text-sm">
            LojasTopMoveis
          </span>
        </div>
      </div>
      {/* Prices */}
      {availability === "https://schema.org/InStock"
        ? (
          <div class="mt-4">
            <div class="flex flex-col items-start gap-2 ">
              {listPrice !== price && (
                <span class="line-through text-base-300 text-sm">
                  {formatPrice(listPrice, offers!.priceCurrency!)}
                </span>
              )}
              <div class="flex items-center gap-[10px]">
                <span class="font-medium text-lg text-secondary">
                  {formatPrice(price, offers!.priceCurrency!)}
                </span>
                {/* <span class="font-bold max-lg:text-[10px] max-lg:px-[5px] text-[12px] text-secondary border border-secondary uppercase rounded-md px-[10px] py-[2px] tracking-[2px] text-center">
                  10% de desconto no boleto
                </span> */}
              </div>
            </div>
            <div class="flex flex-col">
              <span class="text-secondary text-2xl font-bold">
                ou {installment?.billingDuration}x de {formatPrice(
                  installment?.billingIncrement,
                  offers!.priceCurrency,
                )}
              </span>
            </div>
            <div class="flex items-center gap-[10px] py-[10px]">
              <span class="font-bold text-2xl text-secondary leading-none">
                {formatPrice(price * 0.90, offers?.priceCurrency)}
              </span>
              <span class="font-bold max-lg:text-[10px] max-lg:px-[5px] text-[12px] border border-[#4A4B51] rounded-md text-[#4A4B51] py-[2px] tracking-[2px] px-[10px] ">
                10% de desconto no Pix ou boleto
              </span>
            </div>
          </div>
        )
        : null}
      {/* Sku Selector */}
      {availability === "https://schema.org/InStock"
        ? (
          <div class="mt-4 sm:mt-5">
            <SimilarSelector product={product} />
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
      {/* Info card */}
      <details className="collapse collapse-plus mt-[30px]">
        <summary className="after:!top-[.7rem] collapse-title border border-base-200 rounded-full py-3 px-[30px] !min-h-0 font-medium text-primary">
          Informações do produto
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
      {/* characteristics card */}
      <details className="collapse collapse-plus mt-[10px]">
        <summary className="after:!top-[.7rem] collapse-title border border-base-200 rounded-full py-3 px-[30px] !min-h-0 font-medium text-primary">
          Características do produto
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
          <span class="text-xs text-[#4A4B51]">Compartilhar</span>
          <ul class="gap-2 flex items-center justify-between">
            {shareableNetworks.map((network) => (
              <li class="bg-secondary w-8 h-8 rounded-full group transition-all">
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

function Details({
  page,
  variant,
  shipmentPolitics,
  shareableNetworks,
  highlights,
}: {
  page: ProductDetailsPage;
  variant: Variant;
  shipmentPolitics?: Props["shipmentPolitics"];
  shareableNetworks?: Props["shareableNetworks"];
  highlights?: HighLight[];
}) {
  const { product, breadcrumbList } = page;
  const filteredBreadcrumbList = breadcrumbList.itemListElement.filter((item) =>
    item.name!.length > 1
  );
  const id = `product-image-gallery:${useId()}`;

  const images = product.image!;

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
            images={product.image!}
            width={WIDTH}
            height={HEIGHT}
            aspect={ASPECT_RATIO}
            product={product}
            highlights={highlights}
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
  { page, variant: maybeVar = "auto", shipmentPolitics, shareableNetworks, highlights }:
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
            highlights={highlights}
          />
        )
        : <NotFound />}
    </div>
  );
}

export default ProductDetails;
