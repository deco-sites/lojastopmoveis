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
import AddToCartActions from "$store/islands/AddToCartActions.tsx";
import ProductDetailsImages from "$store/islands/ProductDetailsImages.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import { getShareLink } from "$store/sdk/shareLinks.tsx";
import { HighLight } from "$store/components/product/ProductHighlights.tsx";
import SimilarSelector from "site/components/product/SimilarSelector.tsx";
import { type FnContext, type SectionProps } from "@deco/deco";
import { type LoaderReturnType } from "@deco/deco";
import { Tags } from "site/loaders/getTags.ts";
import { isFlag } from "site/components/product/Flags/utils/useFlag.ts";
import FlagCustom from "site/components/product/Flags/FlagCustom.tsx";
import { Device } from "apps/website/matchers/device.ts";
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

  /** @hide true */

  tags: Tags | null;
}
const WIDTH = 250;
const HEIGHT = 250;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;
const URL_DEFAULT = "https://topmoveis.myvtex.com";

type RangeType = {
    total: number;
    from: number;
    to: number;
};

type ReviewsType = {
  id: string;
  productId: string;
  rating: number;
  title: string;
  text: string;
  reviewerName: string;
  shopperId: string;
  reviewDateTime: string;
  searchDate: string;
  verifiedPurchaser: boolean;
  sku: string | null;
  approved: boolean;
  location: string | null;
  locale: string | null;
  pastReviews: string | null;
};

type RatingType = {
  average: number;
  totalCount: number;
  starsFive: number;
  starsFour: number;
  starsThree: number;
  starsTwo: number;
  starsOne: number;
};

export type ResponseReview = {
  data: ReviewsType[];
  range: RangeType;
}
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
function ProductInfo({ page, shareableNetworks, tags, reviews, aggregateRating }: {
  page: ProductDetailsPage;
  shipmentPolitics?: Props["shipmentPolitics"];
  shareableNetworks?: Props["shareableNetworks"];
  tags: Props["tags"];
  reviews: ResponseReview;
  aggregateRating: RatingType;
}) {
  const { breadcrumbList, product } = page;
  const {
    description,
    productID,
    offers,
    name,
    isVariantOf,
    url,
    additionalProperty,
  } = product;
  const { price = 0, listPrice, seller, availability, installment } = useOffer(
    offers,
  );
  const forPrice = product.offers?.offers[0].priceSpecification[1].price;
  const discount = listPrice && listPrice > price;
  const vendorName = product.offers?.offers[0].sellerName;
  const flagCustom = Array.isArray(tags?.flagCustom) ? tags.flagCustom : null;


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
          <span class=" text-sm !text-[#ed2d26]">
            {vendorName}
          </span>
        </div>

        <div class="mt-2 mb-4 flex items-center justify-start gap-2">
          <GenerateStar ratingValue={aggregateRating.average} />
          <div class="border-b border-[#1C1C1D]">
            <a href="#reviews-and-ratings" class="font-condensed not-italic font-normal text-[14px] leading-[18px] no-underline text-[#1C1C1D]">{reviews.range.total === 0 ? `(${reviews.range.total})  Seja o primeiro a avaliar` : `(${reviews.range.total})  Ver  avaliações`}</a>
          </div>
        </div>

        <div class="pt-1 gap-1 flex flex-col">
          {flagCustom && flagCustom.map((flag, idx) =>
            isFlag(flag, additionalProperty) && (
              <FlagCustom
                key={idx}
                deno-lint-ignore no-explicit-any
                formatFlag={flag.formatFlag?.optionsFormat as any}
                type="ProductDetails"
              />
            )
          )}
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
                {/* Aqui */}
                <span class="font-medium text-lg !text-[#ed2d2c]">
                  {formatPrice(forPrice, offers!.priceCurrency!)}
                </span>
                {
                  /* <span class="font-bold max-lg:text-[10px] max-lg:px-[5px] text-[12px] text-secondary border border-secondary uppercase rounded-md px-[10px] py-[2px] tracking-[2px] text-center">
                  10% de desconto no boleto
                </span> */
                }
              </div>
            </div>
            <div class="flex flex-col">
              {/* Aqui */}
              <span class="text-2xl font-bold !text-[#ed2d2c]">
                ou {installment?.billingDuration}x de {formatPrice(
                  installment?.billingIncrement,
                  offers!.priceCurrency,
                )}
              </span>
            </div>
            <div class="flex items-center gap-[10px] py-[10px]">
              {/* Aqui */}
              <span class="font-bold text-2xl  leading-none !text-[#ed2d2c]">
                {formatPrice(price, offers?.priceCurrency)}
              </span>
              {discount && forPrice && (
                <span class="font-bold max-lg:text-[10px] max-lg:px-[5px] text-[13px] border border-[#4A4B51] rounded-md text-[#4A4B51] py-[2px] tracking-[2px] px-[10px] ">
                  {Math.round(((forPrice - price) / forPrice) * 100)}% OFF
                </span>
              )}
            </div>
          </div>
        )
        : null}
      {/* Sku Selector */}
      <div class="mt-4 sm:mt-5">
        <SimilarSelector product={product} />
        {/* <ProductSelector product={product} /> */}
      </div>
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
            category={product.category}
            
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
                  aria-label={`Compartilhar no ${network}`}
                >
                  <Icon id={network} size={20} />
                  <span class="sr-only">Compartilhar no {network}</span>
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
function Details(
  {
    page,
    variant,
    shipmentPolitics,
    shareableNetworks,
    highlights,
    device,
    tags,
    reviews, 
    aggregateRating,
  }: {
    page: ProductDetailsPage;
    variant: Variant;
    shipmentPolitics?: Props["shipmentPolitics"];
    shareableNetworks?: Props["shareableNetworks"];
    highlights?: HighLight[];
    device: string;
    tags: Tags | null;
    reviews: ResponseReview;
    aggregateRating: RatingType;
  },
) {
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
        <Breadcrumb itemListElement={filteredBreadcrumbList} />
        <div id={id} class="flex flex-col lg:flex-row gap-4 lg:justify-center">
          {/* Product Images */}
          <ProductDetailsImages
            images={product.image!}
            width={WIDTH}
            height={HEIGHT}
            aspect={ASPECT_RATIO}
            product={product}
            highlights={highlights}
            device={device}
            url={product.url!}
          />

          {/* Product Info */}
          <div class="w-full lg:pr-0 lg:pl-6">
            <ProductInfo
              page={page}
              shipmentPolitics={shipmentPolitics}
              shareableNetworks={shareableNetworks}
              tags={tags}
              reviews={reviews}
              aggregateRating={aggregateRating}
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
              Preload LCP image for better web vitals
              preload={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </li>
        ))}
      </ul>

      {/* Product Info */}
      <div class="px-4 lg:pr-0 lg:pl-6">
        <ProductInfo page={page} tags={tags} reviews={reviews} aggregateRating={aggregateRating} />
      </div>
    </div>
  );
}
function ProductDetails(
  {
    page,
    variant: maybeVar = "auto",
    shipmentPolitics,
    shareableNetworks,
    highlights,
    device,
    tags,
    reviews, 
    aggregateRating,
  }: Props & {device: Device} & SectionProps<ReturnType<typeof loader>>,
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
            device={device}
            tags={tags}
            reviews={reviews}
            aggregateRating={aggregateRating}
          />
        )
        : <NotFound />}
    </div>
  );
}

function GenerateStar({ ratingValue }: { ratingValue: number }) {
    const totalStars = 5;
    const filledStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;
    const emptyStars = totalStars - filledStars - (hasHalfStar ? 1 : 0);

    return (
        <div class="flex gap-1 sm:gap-2">
            {Array.from({ length: filledStars }, (_, index) => (
                <Icon
                    id="StarYellow"
                    width={20}
                    height={20}
                    class="text-secondary"
                />
            ))}

            {hasHalfStar && (
                <Icon
                    id="MidStarYellow"
                    width={20}
                    height={20}
                    class="text-secondary"
                />
            )}

            {Array.from({ length: emptyStars }, (_, index) => (
                <Icon
                    id="StarGray"
                    width={20}
                    height={20}
                    class="text-secondary"
                />
            ))}
        </div>
    );
}

export const loader = async (props: Props, _req: Request, ctx: FnContext) => {
  const tags = await ctx.invoke.site.loaders.getTags();
  const { productID } = props.page.product;
  const fetchJSON = async <T>(url: string): Promise<T> => {
      const res = await fetch(url);
      
      if (!res.ok) throw new Error(`Erro ao buscar ${url}: ${res.status}`);

      return res.json() as Promise<T>;
  };
  
  const [reviews, aggregateRating] = await Promise.all([
      fetchJSON<ResponseReview>(
      `${URL_DEFAULT}/reviews-and-ratings/api/reviews?product_id=${productID}`
      ),
      fetchJSON<RatingType>(
      `${URL_DEFAULT}/reviews-and-ratings/api/rating/${productID}`
      ),
  ]);

  return {
    ...props,
    device: ctx.device,
    tags: tags,
    reviews, 
    aggregateRating
  };
};
export default ProductDetails;