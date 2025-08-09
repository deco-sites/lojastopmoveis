import Icon from "$store/components/ui/Icon.tsx";
import { type FnContext, type SectionProps, type LoaderReturnType } from "@deco/deco";
import type { ProductDetailsPage } from "apps/commerce/types.ts";
import Debug from "site/islands/Debug.tsx";

interface Props {
    product: LoaderReturnType<ProductDetailsPage | null>;
}

function GenerateStar(ratingValue: number) {
  const totalStars = 5;
  const filledStars = Math.max(0, Math.min(totalStars, Math.round(ratingValue)));

  return (
    <div class="flex gap-1 sm:gap-2">
      {Array.from({ length: totalStars }, (_, index) => (
        <Icon
          id={index < filledStars ? "StarYellow" : "StarGray"}
          width={20}
          height={20}
          class="text-secondary"
        />
      ))}
    </div>
  );
}

export const loader = async (
    page: Props,
    _req: Request,
    ctx: FnContext,
) => {
    const { product } = page.product;
    const { aggregateRating, review } = product;
    
    return {
        aggregateRating, 
        review
    }
};

function ReviewsAndRatings(
    { aggregateRating, review }: SectionProps<ReturnType<typeof loader>>,
) {

    return (
        <div class="container w-full m-auto px-5">
            <Debug data={{ aggregateRating, review }} />
            <div class="">
                <span class="font-condensed not-italic font-medium text-[20px] leading-[32px] text-[#2E2E2E] mb-2">O que estão dizendo</span>
                <div class="flex flex-row gap-4 items-center justify-start mb-5">
                    <div class="">
                        <GenerateStar ratingValue={aggregateRating.ratingValue} />
                    </div>
                    <div class="flex flex-row gap-2 items-center">
                        <span class="not-italic font-semibold text-[14px] sm:text-[16px] leading-[22px] text-black">Nota média: {aggregateRating.ratingValue}</span>
                        <span class="not-italic font-normal text-[14px] sm:text-[16px] leading-[18px] text-black">({aggregateRating.reviewCount} avaliações)</span>
                    </div>
                </div>
                <div>
                    <span class="font-condensed not-italic font-semibold text-[14px] leading-[16px] text-center tracking-[1px] underline uppercase text-[#ED2A24]">faça login para avaliar</span>
                </div>
                <div class="mt-10">
                    { review.length === 0 ? (
                        <span class="not-italic font-bold text-[16px] leading-[22px] text-[#4A4B51]">Nenhuma avaliação :(</span>
                    ) : (
                        <div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReviewsAndRatings;