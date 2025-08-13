import { useUser } from "apps/vtex/hooks/useUser.ts";
import Icon from "$store/components/ui/Icon.tsx";
import { useState } from "preact/hooks";

type RegisterProps = {
    authCookie: string | null | undefined;
    productId: string;
};

function StarSelector({
    value,
    onChange,
}: {
    value: number;
    onChange: (rating: number) => void;
}) {
    const [hovered, setHovered] = useState<number>(0);
    const totalStars = 5
    const effectiveValue = hovered > 0 ? hovered : value;

    return (
        <div class="flex flex-col gap-2">
            <div class="flex gap-1 sm:gap-2 items-center" aria-label="Seletor de avaliação">
                {Array.from({ length: totalStars }, (_, idx) => {
                    const starIndex = idx + 1;
                    const filled = starIndex <= effectiveValue;
                    return (
                        <button
                            key={starIndex}
                            type="button"
                            class="p-0 m-0 bg-transparent border-0 cursor-pointer"
                            onClick={() => {
                                onChange(starIndex);
                                setHovered(0);
                            }}
                            onMouseEnter={() => setHovered(starIndex)}
                            onMouseLeave={() => setHovered(0)}
                            aria-label={`${starIndex} ${starIndex === 1 ? "estrela" : "estrelas"}`}
                        >
                            <Icon
                                id={filled ? "StarYellow" : "StarGray"}
                                width={20}
                                height={20}
                                class="text-secondary"
                            />
                        </button>
                    );
                })}
                <span class="ml-2 text-[13px] text-[#4A4B51]">{value > 0 ? `${value}/5` : ""}</span>
            </div>
        </div>
    );
}

function Register({ authCookie, productId, appKeyCurrent, appTokenCurrent }: RegisterProps) {
    const [rating, setRating] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errors, setErrors] = useState<{
        title?: string;
        name?: string;
        comment?: string;
        rating?: string;
        general?: string;
    }>({});
    const { user } = useUser();

    const handleSubmit = async (e: Event) => {
        e.preventDefault();

        setSuccessMessage("");
        setErrors({});

        const form = e.currentTarget as HTMLFormElement | null;
        const formData = form ? new FormData(form) : new FormData();

        const title = String(formData.get("title") || "").trim();
        const name = String(formData.get("name") || "").trim();
        const comment = String(formData.get("comment") || "").trim();
        const newErrors: typeof errors = {};

        if (!title) newErrors.title = "Título é obrigatório.";
        if (!name) newErrors.name = "Nome é obrigatório.";
        if (!comment) newErrors.comment = "Comentário é obrigatório.";
        if (!rating || rating < 1 || rating > 5) newErrors.rating = "Selecione uma nota de 1 a 5.";
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);

            return;
        }

        const payload = {
            productId,
            rating,
            title,
            text: comment,
            reviewerName: name,
            approved: false,
        };

        try {
            setIsSubmitting(true);

            const response = await fetch("/api/review", {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                    "content-type": "application/json",
                    "accept": "application/json",
                    "VtexidClientAutCookie": authCookie
                },
            });

            if (!response.ok) {
                let message = "Falha ao enviar sua avaliação.";

                try {
                    const data = await response.json();
                    if (data?.message) message = data.message;
                } catch (_) { }

                setErrors({ general: message });

                return;
            }

            setSuccessMessage("Avaliação enviada com sucesso! Aguarde aprovação.");
            setIsOpen(false);

            if (form) form.reset();

            setRating(0);
        } catch (err) {
            console.log(err);

            setErrors({ general: "Ocorreu um erro inesperado. Tente novamente." });
        } finally {
            setIsSubmitting(false);
        }
    };

    console.log("user.value?.givenName: ", user.value?.givenName);

    if (!user.value?.givenName) return (
        <div>
            <a href="/my-account" class="font-condensed not-italic font-semibold text-[14px] leading-[16px] text-center tracking-[1px] underline uppercase text-[#ED2A24]">faça login para avaliar</a>
        </div>
    );

    return (
        <div class="w-full">
            <button
                type="button"
                class="flex w-full h-auto bg-transparent border-none outline-none"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-expanded={isOpen}
                aria-controls="review-form"
            >
                <span class="font-condensed not-italic font-semibold text-[14px] leading-[16px] text-center tracking-[1px] underline uppercase text-[#ED2A24]">
                    Escreva uma avaliação
                </span>
            </button>

            {successMessage && (
                <div class="text-green-600 text-sm mt-2" aria-live="polite">{successMessage}</div>
            )}

            <form id="review-form" class={`flex flex-col gap-4 mt-4 ${isOpen ? "block" : "hidden"}`} onSubmit={handleSubmit}>
                {errors.general && (
                    <div class="text-red-600 text-sm" aria-live="polite">{errors.general}</div>
                )}

                <fieldset class="flex flex-col gap-3">
                    <div class="flex flex-col gap-1">
                        <label class="not-italic font-medium text-[16px] leading-[30px] text-[#1C1C1D]" for="title">Revise o título<span class="text-red-600"> *</span></label>
                        <input id="title" name="title" required aria-invalid={Boolean(errors.title)} class={`border rounded px-3 py-2 not-italic font-normal text-[14px] leading-[19px] text-[#4A4B51] ${errors.title ? "border-red-500" : "border-[#E5E7EB]"}`} />
                        {errors.title && <p class="text-red-600 text-sm">{errors.title}</p>}
                    </div>

                    <div class="flex flex-col gap-1">
                        <label class="not-italic font-medium text-[16px] leading-[30px] text-[#1C1C1D]" for="rating">Avalie o produto de 1 a 5 estrelas<span class="text-red-600"> *</span></label>
                        <StarSelector value={rating} onChange={setRating} />
                        <input type="hidden" name="rating" value={String(rating)} />
                        {errors.rating && <p class="text-red-600 text-sm">{errors.rating}</p>}
                    </div>

                    <div class="flex flex-col gap-1">
                        <label class="not-italic font-medium text-[16px] leading-[30px] text-[#1C1C1D]" for="name">Seu nome<span class="text-red-600"> *</span></label>
                        <input id="name" name="name" required defaultValue={user?.name ?? ""} aria-invalid={Boolean(errors.name)} class={`border rounded px-3 py-2 not-italic font-normal text-[14px] leading-[19px] text-[#4A4B51] ${errors.name ? "border-red-500" : "border-[#E5E7EB]"}`} />
                        {errors.name && <p class="text-red-600 text-sm">{errors.name}</p>}
                    </div>

                    <div class="flex flex-col gap-1">
                        <label class="not-italic font-medium text-[16px] leading-[30px] text-[#1C1C1D]" for="location">Sua localização</label>
                        <input id="location" name="location" class="border border-[#E5E7EB] rounded px-3 py-2 not-italic font-normal text-[14px] leading-[19px] text-[#4A4B51]" />
                    </div>

                    <div class="flex flex-col gap-1">
                        <label class="not-italic font-medium text-[16px] leading-[30px] text-[#1C1C1D]" for="comment">Escreva um comentário<span class="text-red-600"> *</span></label>
                        <textarea id="comment" name="comment" required aria-invalid={Boolean(errors.comment)} class={`border rounded px-3 py-2 not-italic font-normal text-[14px] leading-[19px] text-[#4A4B51] min-h-[84px] ${errors.comment ? "border-red-500" : "border-[#E5E7EB]"}`}></textarea>
                        {errors.comment && <p class="text-red-600 text-sm">{errors.comment}</p>}
                    </div>
                </fieldset>

                <div>
                    <button
                        type="submit"
                        class="px-4 py-2 bg-[#ED2A24] text-white rounded disabled:opacity-60"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Enviando..." : "Enviar avaliação"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Register;