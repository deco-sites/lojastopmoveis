import { Product } from "apps/commerce/types.ts";
import { HighLight } from "$store/components/product/ProductHighlights.tsx";
import ProductCard from "./ProductCard.tsx";
import { Tags } from "site/loaders/getTags.ts";

export interface Columns {
  mobile?: number;
  desktop?: number;
}

export interface Props {
  products: Product[] | null;
  highlights?: HighLight[];
  /** @hide true */
  tags?: Tags;

  /** @hide true */
  device?: string;
}

function ProductGallery({ products, highlights, tags, device }: Props) {
  return (
    <div class="grid grid-cols-2 gap-2 items-center sm:grid-cols-2 lg:grid-cols-4 lg:gap-[30px]">
      {products?.map((product, index) => (
        <ProductCard
          product={product}
          tags={tags}
          preload={index === 0}
          index={index}
          device={device}
          highlights={highlights}
          layout={{
            discount: { label: "OFF", variant: "secondary" },
            hide: { skuSelector: true, productDescription: true },
            basics: { contentAlignment: "Center", ctaVariation: "secondary" },
            onMouseOver: {
              image: "Zoom image",
              showCardShadow: true,
              showFavoriteIcon: true,
              showCta: true,
            },
          }}
        />
      ))}
    </div>
  );
}

export default ProductGallery;
