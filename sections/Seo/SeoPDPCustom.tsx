import SeoPDP from "apps/commerce/sections/Seo/SeoPDPV2.tsx";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import { canonicalFromBreadcrumblist } from "apps/commerce/utils/canonical.ts";
import { AppContext } from "apps/commerce/mod.ts";
import {
  renderTemplateString,
  SEOSection,
} from "apps/website/components/Seo.tsx";

export interface Props {
  /** @title Data Source */
  jsonLD: ProductDetailsPage | null;
  omitVariants?: boolean;
  changePixPrice?: boolean;
  /** @title Title Override */
  title?: string;
  /** @title Description Override */
  description?: string;
}

export function loader(props: Props, _req: Request, ctx: AppContext) {
  const {
    titleTemplate = "",
    descriptionTemplate = "",
    ...seoSiteProps
  } = ctx.seo ?? {};
  const {
    title: titleProp,
    description: descriptionProp,
    jsonLD,
    omitVariants,
    changePixPrice,
  } = props;

  const title = renderTemplateString(
    titleTemplate,
    titleProp || jsonLD?.seo?.title || "",
  );
  const description = renderTemplateString(
    descriptionTemplate,
    descriptionProp || jsonLD?.seo?.description || "",
  );
  const image = jsonLD?.product.image?.[0]?.url;
  const canonical = jsonLD?.seo?.canonical
    ? jsonLD?.seo?.canonical
    : jsonLD?.breadcrumbList
    ? canonicalFromBreadcrumblist(jsonLD?.breadcrumbList)
    : undefined;
  const noIndexing = !jsonLD;

  if (omitVariants && jsonLD?.product.isVariantOf?.hasVariant) {
    jsonLD.product.isVariantOf.hasVariant = [];
  }

  const pixOffer = jsonLD && changePixPrice &&
    jsonLD?.product.offers?.offers[0].priceSpecification.find((spec) =>
      spec.name === "Pix"
    );

  if (pixOffer && jsonLD?.product.offers?.lowPrice) {
    const priceWithDiscount = jsonLD.product.offers.lowPrice * 100 * 95 / 100 /
      100;
    pixOffer.price = priceWithDiscount;
    pixOffer.billingIncrement = priceWithDiscount;
    jsonLD.product.offers.lowPrice = priceWithDiscount;
  }

  return {
    ...seoSiteProps,
    title,
    description,
    image,
    canonical,
    noIndexing,
    jsonLDs: [jsonLD],
  };
}

function Section(props: Props): SEOSection {
  return <SeoPDP {...props} />;
}

export default Section;
