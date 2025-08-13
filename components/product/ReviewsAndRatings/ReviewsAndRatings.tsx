import Icon from "$store/components/ui/Icon.tsx";
import ReviewsAndRatingRegister from "$store/islands/ReviewsAndRatingRegister.tsx";
import Reviews from "$store/islands/Reviews.tsx";
import type { ProductDetailsPage } from "apps/commerce/types.ts";
import { Secret } from "apps/website/loaders/secret.ts";
import { getCookies } from "std/http/cookie.ts";
import { type FnContext, type SectionProps, type LoaderReturnType } from "@deco/deco";

const URL_DEFAULT = "https://topmoveis.myvtex.com";

interface Props {
    product: LoaderReturnType<ProductDetailsPage | null>;
}

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

export const loader = async (
    page: Props,
    _req: Request,
    ctx: FnContext,
) => {
    const { product } = page.product;
    const { productID } = product;
    const cookies = getCookies(_req.headers);
    const authCookie = cookies["VtexIdclientAutCookie"] || cookies["VtexIdclientAutCookie_topmoveis"];
    const fetchJSON = async <T>(url: string): Promise<T> => {
        const res = await fetch(url);
        
        if (!res.ok) throw new Error(`Erro ao buscar ${url}: ${res.status}`);

        return res.json() as Promise<T>;
    };

    const [review, aggregateRating] = await Promise.all([
        fetchJSON<ResponseReview>(
        `${URL_DEFAULT}/reviews-and-ratings/api/reviews?product_id=${productID}`
        ),
        fetchJSON<RatingType>(
        `${URL_DEFAULT}/reviews-and-ratings/api/rating?product_id=${productID}`
        ),
    ]);

    return {
        aggregateRating,
        review,
        authCookie,
        productId: productID
    }
};

function GenerateStar({ ratingValue }:{ ratingValue: number }) {
    const totalStars = 5;
    const filledStars = Math.max(0, Math.min(totalStars, Math.floor(ratingValue)));

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

function ReviewsAndRatings(
    { aggregateRating, review, authCookie, productId }: SectionProps<ReturnType<typeof loader>>,
) {

    return (
        <div class="container w-full m-auto px-5">
            <div class="pb-5">
                <span class="font-condensed not-italic font-medium text-[20px] leading-[32px] text-[#2E2E2E] lg:text-2xl lg:leading-8">O que estão dizendo</span>
                <div class="flex flex-row gap-4 items-center justify-start mb-5 mt-2">
                    <div class="">
                        <GenerateStar ratingValue={aggregateRating.average} />
                    </div>
                    <div class="flex flex-row gap-2 items-center">
                        <span class="not-italic font-semibold text-[14px] sm:text-[16px] leading-[22px] text-black">Nota média: {aggregateRating.average}</span>
                        <span class="not-italic font-normal text-[14px] sm:text-[16px] leading-[18px] text-black">({aggregateRating.totalCount} avaliações)</span>
                    </div>
                </div>
                <ReviewsAndRatingRegister authCookie={authCookie} productId={productId} />
                <Reviews reviews={review} />
            </div>
        </div>
    );
}

export default ReviewsAndRatings;