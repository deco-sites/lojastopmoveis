import {
    BUTTON_VARIANTS,
    ButtonVariant,
} from "$store/components/minicart/Cart.tsx";
import Avatar from "$store/components/ui/Avatar.tsx";
import WishlistIcon from "$store/islands/WishlistButton.tsx";
import { sendEventOnClick } from "$store/sdk/analytics.tsx";
import { formatPrice } from "$store/sdk/format.ts";
import { useOffer } from "$store/sdk/useOffer.ts";
import { useVariantPossibilities } from "$store/sdk/useVariantPossiblities.ts";
import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Image from "apps/website/components/Image.tsx";
import ProductHighlights from "$store/components/product/ProductHighlights.tsx";
import { HighLight } from "$store/components/product/ProductHighlights.tsx";
import AddToCartLocal from "site/islands/AddToCartLocal.tsx";
import { Tags } from "site/loaders/getTags.ts";
import { isFlag } from "site/components/product/Flags/utils/useFlag.ts";
import FlagCustom from "site/components/product/Flags/FlagCustom.tsx";
import { useDevice } from "@deco/deco/hooks";

export interface Layout {
    basics?: {
        contentAlignment?: "Left" | "Center";
        oldPriceSize?: "Small" | "Normal";
        ctaText?: string;
        mobileCtaText?: string;
        ctaVariation?: ButtonVariant;
        ctaMode?: "Go to Product Page" | "Add to Cart";
    };
    discount: {
        label: string;
        variant:
        | "primary"
        | "secondary"
        | "neutral"
        | "accent"
        | "emphasis"
        | "success"
        | "info"
        | "error"
        | "warning";
    };
    elementsPositions?: {
        skuSelector?: "Top" | "Bottom";
        favoriteIcon?: "Top right" | "Top left";
    };
    hide: {
        productName?: boolean;
        productDescription?: boolean;
        allPrices?: boolean;
        installments?: boolean;
        skuSelector?: boolean;
        cta?: boolean;
    };
    onMouseOver?: {
        image?: "Change image" | "Zoom image";
        showFavoriteIcon?: boolean;
        showSkuSelector?: boolean;
        showCardShadow?: boolean;
        showCta?: boolean;
    };
}

interface Props {
    product: Product;
    /** Preload card image */
    preload?: boolean;
    /**
     * @description Flags, displayed when  products are found
     */
    highlights?: HighLight[];
    /** @description used for analytics event */
    itemListName?: string;
    layout?: Layout;
    class?: string;

    /** @hide true */
    tags?: Tags;

    /** @hide true */
    index: number;
}

export const relative = (url: string) => {
    const link = new URL(url);
    return `${link.pathname}${link.search}`;
};

const WIDTH = 279;
const HEIGHT = 270;

function TimedProductCard(
    {
        product,
        preload,
        itemListName,
        layout,
        highlights,
        class: _class,
        tags,
        index,
    }: Props,
) {
    const {
        url,
        productID,
        name,
        image: images,
        offers,
        isVariantOf,
        additionalProperty,
    } = product;

    const productGroupID = isVariantOf?.productGroupID;
    const [front, back] = images ?? [];
    const { listPrice, price = 0, installment, seller, availability } =
        useOffer(
            offers,
        );

    const possibilities = useVariantPossibilities(product);
    const variants = Object.entries(Object.values(possibilities)[0] ?? {});

    const flagCustom = Array.isArray(tags?.flagCustom) ? tags.flagCustom : null;

    const device = useDevice();
    const isDesktop = device === "desktop";

    const isEager = isDesktop ? index < 4 : index < 1;

    const clickEvent = {
        name: "select_item" as const,
        params: {
            item_list_name: itemListName,
            items: [
                mapProductToAnalyticsItem({
                    product,
                    price,
                    listPrice,
                }),
            ],
        },
    };
    const l = layout;
    const align =
        !l?.basics?.contentAlignment || l?.basics?.contentAlignment == "Left"
            ? "left"
            : "center";
    const skuSelector = variants.map(([value, { urls }]) => (
        <li>
            <a href={urls[0]} alt="avatar">
                <Avatar
                    variant={"default"}
                    content={value}
                    active={urls[0] === url}
                />
            </a>
        </li>
    ));

    const addToCartButtonClassNames = (variant: string | undefined) =>
        `lg:text-sm font-medium text-xs whitespace-nowrap w-full btn max-md:min-h-12 max-md:h-12 max-md:m-auto max-md:px-10 max-md:max-w-full md:w-auto btn-${BUTTON_VARIANTS[variant ?? "primary"]
        }`;

    const cta = layout?.basics?.ctaMode === "Go to Product Page"
        ? (
            <a
                href={url && relative(url)}
                aria-label="view product"
                class={`min-w-[162px] ${addToCartButtonClassNames(layout?.basics?.ctaVariation)
                    }`}
            >
                <span class="max-lg:hidden flex font-medium">
                    {l?.basics?.ctaText || "Ver produto"}
                </span>
                <span class="lg:hidden flex font-medium">
                    {l?.basics?.mobileCtaText || "Add ao carrinho"}
                </span>
            </a>
        )
        : l?.basics?.mobileCtaText
            ? (
                <AddToCartLocal
                    name={product.name as string}
                    discount={price && listPrice ? listPrice - price : 0}
                    productGroupId={product.isVariantOf?.productGroupID ?? ""}
                    price={price as number}
                    seller={seller as string}
                    skuId={product.sku}
                    label={l?.basics?.ctaText}
                    ctaVariant={layout?.basics?.ctaVariation}
                />
            )
            : (
                <AddToCartLocal
                    name={product.name as string}
                    discount={price && listPrice ? listPrice - price : 0}
                    productGroupId={product.isVariantOf?.productGroupID ?? ""}
                    price={price as number}
                    seller={seller as string}
                    skuId={product.sku}
                    label={l?.basics?.ctaText}
                    ctaVariant={layout?.basics?.ctaVariation}
                />
            );

    const _price2: number = price as number;
    const listPrice2: number = listPrice as number;

    const forPrice = product.offers?.offers[0].price;

    const discountPrice = product.offers?.offers[0].priceSpecification.at(-2)
        ?.price;
    const discount = listPrice && listPrice > price;

    return (
        <div
            class={`bg-white card card-compact opacity-100 bg-opacity-100 group w-full p-2.5 pb-6 sm:p-5 h-[100%] border border-[#D7D7DA] lg:border-0 lg:border-transparent${align === "center" ? "text-center" : "text-start"
                } ${l?.onMouseOver?.showCardShadow
                    ? "lg:hover:shadow-lg shadow-black"
                    : ""
                } ${_class ? `${_class}` : ""}`}
            data-deco="view-product"
            id={`product-card-${productID}`}
            {...sendEventOnClick(clickEvent)}
        >
            {/* <div>{JSON.stringify(product)}</div> */}
            <figure
                class="relative rounded-lg"
                style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
            >
                {/* Wishlist button */}
                {/* <div
                    class={`absolute top-2 z-10
            ${
                        l?.elementsPositions?.favoriteIcon === "Top left"
                            ? "left-2"
                            : "right-2"
                    }
            ${
                        l?.onMouseOver?.showFavoriteIcon
                            ? "lg:hidden lg:group-hover:block"
                            : "lg:hidden"
                    }
          `}
                >
                    <WishlistIcon
                        productGroupID={productGroupID}
                        productID={productID}
                    />
                </div> */}
                <a
                    href={url && relative(url)}
                    aria-label="view product"
                    class="contents relative"
                >
                    <div class="absolute w-full h-full right-0 top-0">
                        <div class="grid grid-rows-5 w-full h-full">
                            {l?.onMouseOver?.showFavoriteIcon && (<WishlistIcon
                                productGroupID={productGroupID}
                                productID={productID}
                                tailwind="col-start-1 col-start-1 justify-self-end z-10"
                            />)}
                            {product && (
                                <ProductHighlights
                                    product={product}
                                    highlights={highlights}
                                    listPrice={listPrice2}
                                />
                            )}
                        </div>
                    </div>

                    <Image
                        src={front.url!}
                        alt={front.alternateName}
                        width={WIDTH}
                        height={HEIGHT}
                        class={`
              absolute rounded-lg w-full
              ${(!l?.onMouseOver?.image ||
                                l?.onMouseOver?.image == "Change image")
                                ? "duration-100 transition-opacity opacity-100 lg:group-hover:opacity-0"
                                : ""
                            }
              ${l?.onMouseOver?.image == "Zoom image"
                                ? "duration-100 transition-scale scale-100 lg:group-hover:scale-105"
                                : ""
                            }
            `}
                        sizes="(max-width: 640px) 50vw, 20vw"
                        preload={isEager}
                        loading={isEager ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={isEager ? "high" : "auto"}
                    />

                    {device === "desktop" && (
                        (!l?.onMouseOver?.image ||
                            l?.onMouseOver?.image == "Change image") && (
                            <Image
                                src={back?.url ?? front.url!}
                                alt={back?.alternateName ?? front.alternateName}
                                width={WIDTH}
                                height={HEIGHT}
                                class="absolute transition-opacity rounded-lg w-full opacity-0 lg:group-hover:opacity-100"
                                sizes="(max-width: 640px) 50vw, 20vw"
                                loading="lazy"
                                fetchPriority="auto"
                                decoding="async"
                            />
                        )
                    )}

                    {flagCustom && flagCustom.map((flag, idx) =>
                        isFlag(flag, additionalProperty) && (
                            <FlagCustom
                                key={idx}
                                // deno-lint-ignore no-explicit-any
                                formatFlag={flag.formatFlag
                                    ?.optionsFormat as any}
                            />
                        )
                    )}
                </a>
            </figure>
            {/* Prices & Name */}
            <div class="flex-auto flex flex-col justify-between">
                {/* SKU Selector */}
                {(!l?.elementsPositions?.skuSelector ||
                    l?.elementsPositions?.skuSelector === "Top") && (
                        <>
                            {l?.hide.skuSelector ? "" : (
                                <ul
                                    class={`flex items-center gap-2 w-full ${align === "center"
                                            ? "justify-center"
                                            : "justify-start"
                                        } ${l?.onMouseOver?.showSkuSelector
                                            ? "lg:hidden"
                                            : ""
                                        }`}
                                >
                                    {skuSelector}
                                </ul>
                            )}
                        </>
                    )}

                {l?.hide.productName && l?.hide.productDescription
                    ? ""
                    : (
                        <div class="flex flex-col gap-0 mt-[15px]">
                            {l?.hide.productName
                                ? ""
                                : (
                                    <h2 class="text-sm text-[#4A4B51] line-clamp-3 max-lg:min-h-[60px]">
                                        {isVariantOf?.name || name}
                                    </h2>
                                )}
                            {l?.hide.productDescription
                                ? ""
                                : (
                                    <p class="truncate text-sm lg:text-sm text-neutral">
                                        {product.description}
                                    </p>
                                )}
                        </div>
                    )}
                {availability === "https://schema.org/InStock"
                    ? (
                        <>
                            {l?.hide.allPrices
                                ? ""
                                : (
                                    <div class="flex flex-col mt-2">
                                        <div
                                            class={`flex items-center gap-2.5 ${l?.basics?.oldPriceSize ===
                                                    "Normal"
                                                    ? "lg:flex-row"
                                                    : ""
                                                } ${align === "center"
                                                    ? "justify-center"
                                                    : "justify-start"
                                                }`}
                                        >
                                            {(listPrice && price) &&
                                                listPrice > price && (
                                                    <p
                                                        class={`line-through text-[#C5C6CB] md:text-base text-[12px] ${l?.basics
                                                                ?.oldPriceSize ===
                                                                "Normal"
                                                                ? "md:text-base"
                                                                : ""
                                                            }`}
                                                    >
                                                        {formatPrice(
                                                            listPrice,
                                                            offers!.priceCurrency!,
                                                        )}
                                                    </p>
                                                )}
                                            {/* Aqui */}
                                            <p class="md:text-black text-secondary text-sm font-medium md:text-xl !text-[#ed2d25]">
                                                {formatPrice(
                                                    price,
                                                    offers!.priceCurrency!,
                                                )}
                                            </p>
                                        </div>
                                        {l?.hide.installments
                                            ? ""
                                            : (
                                                <div class="md:text-sm text-[12px] font-normal text-[#707279] mt-[5px] flex items-center justify-center md:!block">
                                                    ou {installment
                                                        ?.billingDuration}x de
                                                    {" "}
                                                    {formatPrice(
                                                        installment
                                                            ?.billingIncrement,
                                                        offers!.priceCurrency!,
                                                    )}
                                                </div>
                                            )}
                                        <div class="flex items-center gap-[10px] py-[10px]">
                                            {/* Aqui */}
                                            <span class="font-bold text-md text-secondary leading-none !text-[#ed2d25]">
                                                {formatPrice(
                                                    discountPrice,
                                                    offers?.priceCurrency,
                                                )}
                                            </span>
                                            {discount && forPrice &&
                                                discountPrice && (
                                                    <span class="font-bold max-lg:text-[10px] max-lg:px-[5px] text-[12px] border border-[#4A4B51] rounded-md text-[#4A4B51] py-[2px] tracking-[2px] px-[10px] ">
                                                        {Math.round(
                                                            ((forPrice -
                                                                discountPrice) /
                                                                forPrice) * 100,
                                                        )}% de desconto no Pix ou
                                                        boleto
                                                    </span>
                                                )}
                                        </div>
                                    </div>
                                )}
                        </>
                    )
                    : null}

                {/* SKU Selector */}
                {(l?.elementsPositions?.skuSelector === "Bottom" &&
                    availability === "https://schema.org/InStock") && (
                        <>
                            {l?.hide.skuSelector ? "" : (
                                <ul
                                    class={`flex items-center gap-2 w-full ${align === "center"
                                            ? "justify-center"
                                            : "justify-start"
                                        } ${l?.onMouseOver?.showSkuSelector
                                            ? "lg:hidden"
                                            : ""
                                        }`}
                                >
                                    {skuSelector}
                                </ul>
                            )}
                        </>
                    )}

                {availability === "https://schema.org/InStock"
                    ? (
                        <div
                            class={`w-full flex flex-col mt-[10px]
            ${l?.onMouseOver?.showSkuSelector ||
                                    l?.onMouseOver?.showCta
                                    ? "transition-opacity lg:opacity-0 lg:group-hover:opacity-100"
                                    : "lg:hidden"
                                }
          `}
                        >
                            {l?.onMouseOver?.showCta && cta}
                        </div>
                    )
                    : null}
            </div>
        </div>
    );
}

export default TimedProductCard;
