import Icon from "$store/components/ui/Icon.tsx";
import { useState, useMemo } from "preact/hooks";
import { ResponseReview } from "./ReviewsAndRatings.tsx";

export interface ReviewsProps {
    reviews: ResponseReview;
}

function timeAgo(searchDate: string): string {
    const date = new Date(searchDate);

    if (isNaN(date.getTime())) {
        throw new Error("Data inválida");
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);

    const units: [number, string][] = [
        [60 * 60 * 24 * 365, "ano"],
        [60 * 60 * 24 * 30, "mês"],
        [60 * 60 * 24, "dia"],
        [60 * 60, "hora"],
        [60, "minuto"],
        [1, "segundo"]
    ];

    for (const [seconds, label] of units) {
        const value = Math.floor(diffSec / seconds);
        if (value >= 1) {
            return `${value} ${label}${value > 1 ? "s" : ""} atrás`;
        }
    }

    return "agora mesmo";
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

function Reviews({ reviews }: ReviewsProps) {
    const [sortBy, setSortBy] = useState("recent");
    const [ratingFilter, setRatingFilter] = useState("all");
    const [language, setLanguage] = useState("PT");

    const filteredReviews = useMemo(() => {
        let result = [...reviews.data];

        if (ratingFilter !== "all") {
            result = result.filter(r => r.rating === Number(ratingFilter));
        }

        result.sort((a, b) => {
            switch (sortBy) {
                case "recent":
                    return new Date(b.searchDate).getTime() - new Date(a.searchDate).getTime();
                case "oldest":
                    return new Date(a.searchDate).getTime() - new Date(b.searchDate).getTime();
                case "best":
                    return b.rating - a.rating;
                case "worst":
                    return a.rating - b.rating;
                default:
                    return 0;
            }
        });

        return result;
    }, [reviews, sortBy, ratingFilter, language]);

    return (
        <div class="mt-10">
            {reviews.data.length === 0 ? (
                <span class="not-italic font-bold text-[16px] leading-[22px] text-[#4A4B51]">Nenhuma avaliação :(</span>
            ) : (
                <div class="flex flex-col w-full">
                    <div className="flex flex-1 gap-2 w-full mb-10 lg:mb-8 sm:max-w-96">
                        <select
                            className="border rounded-lg p-2 font-condensed not-italic font-normal text-base leading-[18px] text-[#3F3F40]"
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                        >
                            <option class="font-condensed not-italic font-normal text-base leading-[18px] text-[#3F3F40]" value="recent">Mais recentes</option>
                            <option class="font-condensed not-italic font-normal text-base leading-[18px] text-[#3F3F40]" value="oldest">Mais antigo</option>
                            <option class="font-condensed not-italic font-normal text-base leading-[18px] text-[#3F3F40]" value="best">Melhor avaliado</option>
                            <option class="font-condensed not-italic font-normal text-base leading-[18px] text-[#3F3F40]" value="worst">Mais baixa</option>
                        </select>

                        <select
                            className="border flex-1 rounded-lg p-2 font-condensed not-italic font-normal text-base leading-[18px] text-[#3F3F40]"
                            value={ratingFilter}
                            onChange={e => setRatingFilter(e.target.value)}
                        >
                            <option value="all" class="font-condensed not-italic font-normal text-base leading-[18px] text-[#3F3F40]">Todos</option>
                            {[1, 2, 3, 4, 5].map(n => (
                                <option key={n} value={n} class="font-condensed not-italic font-normal text-base leading-[18px] text-[#3F3F40]">
                                    {n} estrela{n > 1 && "s"}
                                </option>
                            ))}
                        </select>

                        <select
                            className="border flex-1 rounded-lg p-2 font-condensed not-italic font-normal text-base leading-[18px] text-[#3F3F40]"
                            value={language}
                            onChange={e => setLanguage(e.target.value)}
                        >
                            <option value="PT" class="font-condensed not-italic font-normal text-base leading-[18px] text-[#3F3F40]">PT</option>
                        </select>
                    </div>
                    <div class="w-full flex flex-col ">
                        {filteredReviews.length === 0 ? (
                            <span class="not-italic font-bold text-[16px] leading-[22px] text-[#4A4B51]">Nenhuma avaliação :(</span>
                        ) : (
                            filteredReviews.map((review, index) => {
                                return (
                                    <>
                                        <div key={index} className="flex flex-col w-full h-auto gap-3">
                                            <div className="flex justify-start items-center gap-2">
                                                <GenerateStar ratingValue={review.rating} />
                                                <span className="not-italic font-medium text-base leading-[30px] text-[#1C1C1D]">
                                                    {review.title}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="not-italic font-normal text-sm leading-[16px] text-[#707279]">
                                                    Enviado há <strong>{timeAgo(review.searchDate)}</strong> por{" "}
                                                    <strong>{review.reviewerName}</strong>
                                                </span>
                                                <p className="not-italic font-normal text-sm leading-[24px] lg:text-base lg:leading-[22px] text-[#4A4B51]">
                                                    {review.text}
                                                </p>
                                            </div>
                                        </div>
                                        {index < filteredReviews.length - 1 && (
                                            <hr className="border-t border-[#C5C6CB] my-4" />
                                        )}
                                    </>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>);
}

export default Reviews;