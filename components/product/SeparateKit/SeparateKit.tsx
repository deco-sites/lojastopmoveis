import type { Product } from "apps/commerce/types.ts";
import { formatPrice } from "$store/sdk/format.ts";
import { useOffer } from "$store/sdk/useOffer.ts";
import AddToCartButton from "$store/islands/AddToCartButton.tsx";

interface SeparateKitProps {
    classMainBody?: string;
    isAccessoryOrSparePartFor: Product[];
};

function SeparateKitItem({ item }: { item: Product }) {
    const { price = 0, listPrice, seller, availability, installment } = useOffer(item.offers);

    return (
        <li className="flex flex-row items-start justify-start gap-4 w-full h-auto p-[24px_16px] isolate bg-white border border-[#C5C6CB] rounded-[8px]">
            <div className="w-20 h-20 flex min-w-20 min-h-20 lg:w-28 lg:h-28">
                <img src={item.image[0].url} alt={item.name} className="w-full h-auto object-cover" />
            </div>

            <div className="flex flex-col gap-2 min-w-0">
                <span className="font-condensed not-italic font-normal text-[14px] leading-[19px] text-[#4A4B51] truncate block w-full">
                    {item.name}
                </span>

                <div className="flex flex-col gap-1">
                    <div className="flex flex-row gap-1 items-center">
                        <span className="font-condensed not-italic font-normal text-[14px] leading-[16px] text-[#C5C6CB]">{formatPrice(listPrice, item.offers.priceCurrency)}</span>
                        <span className="font-condensed not-italic font-medium text-[16px] leading-[24px] text-[#ED2D26]">{formatPrice(price, item.offers.priceCurrency)}</span>
                    </div>
                    <span className="font-condensed not-italic font-normal text-[14px] leading-[20px] text-[#707279]">
                        ou {installment?.billingDuration}x de {formatPrice(
                            installment?.billingIncrement,
                            item.offers.priceCurrency,
                        )}
                    </span>
                </div>

                <AddToCartButton
                    skuId={item.productID}
                    sellerId={seller}
                    price={price ?? 0}
                    discount={price && listPrice ? listPrice - price : 0}
                    name={item.name}
                    productGroupId={""}
                    quantity={1}
                    label="Adicionar ao carrinho"
                    mobileLabel="Adicionar ao carrinho"
                    classes="btn-outline btn-block border-secondary text-secondary w-full lg:max-w-[275px] transition-all font-bold text-sm tracking-[1px] py-[8px] px-[10px] hover:btn-secondary"
                />
            </div>
        </li>
    )
}

function SeparateKit({
    classMainBody = "",
    isAccessoryOrSparePartFor
}: SeparateKitProps) {
    if (!isAccessoryOrSparePartFor) return <></>;

    return (
        <div className={`flex-col gap-4 w-full h-auto items-start ${classMainBody}`}>
            <span className="font-condensed not-italic font-semibold text-[18px] leading-[20px] text-center text-[#2E2E2E]">Que tal completar sua cozinha?</span>
            <div className="flex flex-row w-full h-auto">
                <ul className="flex flex-col gap-4 w-full h-auto list-none">
                    {isAccessoryOrSparePartFor.map((item) => (
                        <SeparateKitItem key={item.id} item={item} />
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default SeparateKit;