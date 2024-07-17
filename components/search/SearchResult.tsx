import Filters from "$store/components/search/Filters.tsx";
import SearchControls from "$store/islands/SearchControls.tsx";
import { SendEventOnLoad } from "$store/sdk/analytics.tsx";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { useOffer } from "$store/sdk/useOffer.ts";
import ProductGallery, { Columns } from "../product/ProductGallery.tsx";
import type { LoaderReturnType } from "$live/types.ts";
import type { ProductListingPage } from "apps/commerce/types.ts";
import Sort from "$store/islands/Sort.tsx";
import Breadcrumb from "$store/components/ui/Breadcrumb.tsx";
import SearchPagination from "$store/components/search/SearchPagination.tsx";
import { Section } from "$live/blocks/section.ts";
import { HighLight } from "$store/components/product/ProductHighlights.tsx";
import { logger } from "../../../deco/mod.ts";

export interface Props {
  page: LoaderReturnType<ProductListingPage | null>;
  /**
   * @description Use drawer for mobile like behavior on desktop. Aside for rendering the filters alongside the products
   */
  variant?: "aside" | "drawer";
  /**
   * @description Number of products per line on grid
   */
  columns: Columns;
  /**
   * @description Flags, displayed when  products are found
   */
  highlights?: HighLight[];
  /**
   * 
   * @description Not found section, displayed when no products are found
   */
  notFoundSection: Section;
}

function Result({
  page,
  variant,
  highlights
}: Omit<Omit<Props, "page">, "notFoundSection"> & {
  page: ProductListingPage;
  
}) {
  const { products, filters, breadcrumb, pageInfo, sortOptions } = page;

  const productsFound = (
    <h6 class="text-primary font-medium">
      Produtos encontrados: <strong>{pageInfo.records} resultados</strong>
    </h6>
  );
  
  return (
    <>
      <div>
        <div class="flex flex-row gap-8">
          {variant === "aside" && filters.length > 0 && (
            <aside class="hidden lg:block w-min mt-1 min-w-[270px]">
              <Filters filters={filters} />
            </aside>
          )}
          <div class="flex flex-col gap-5 w-full">
            <div class="flex justify-between items-center gap-2.5">
              <div class="hidden lg:block">
                {productsFound}
              </div>
              <SearchControls
                sortOptions={sortOptions}
                filters={filters}
                breadcrumb={breadcrumb}
                displayFilter={variant === "drawer"}
              />
              {sortOptions.length > 0
                ? (
                  <label class="flex gap-[20px] w-1/2 lg:w-auto items-center">
                    <span class="text-primary text-sm max-lg:hidden whitespace-nowrap lg:inline">
                      Ordenar
                    </span>
                    <Sort sortOptions={sortOptions} />
                  </label>
                )
                : null}
            </div>
            <div class="lg:hidden text-sm -order-1">
              {productsFound}
            </div>
            <div class="flex-grow">
              <ProductGallery products={products} highlights={highlights }/>
              <SearchPagination pageInfo={pageInfo} />
            </div>
          </div>
        </div>
      </div>
      <SendEventOnLoad
        event={{
          name: "view_item_list",
          params: {
            // TODO: get category name from search or cms setting
            item_list_name: "",
            item_list_id: "",
            items: page.products?.map((product) =>
              mapProductToAnalyticsItem({
                ...useOffer(product.offers),
                product,
                breadcrumbList: page.breadcrumb,
              })
            ),
          },
        }}
      />
    </>
  );
}

function SearchResult(
  {
    page,
    notFoundSection: { Component: NotFoundSection, props: notFoundProps },
    ...props
  }: Props,
) {
  if (!page || !page.products || page.products.length === 0) {
    return <NotFoundSection {...notFoundProps} />;
  }

  logger.info('Page Data: ', page);
  console.log('Page Data: ', page);
  return <Result {...props} page={page} />;
}

export default SearchResult;
