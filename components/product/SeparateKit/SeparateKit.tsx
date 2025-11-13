import type { Product } from "apps/commerce/types.ts";
import { formatPrice } from "$store/sdk/format.ts";
import AddToCartButton from "$store/islands/AddToCartButton.tsx";
interface SeparateKitProps {
    classMainBody?: string;
    kitProducts: Product[];
};

function apply_filters_to_installments_list(installmentsList: any, filteringRules: any) {
    let filteredInstallmentsList = installmentsList;

    if (filteringRules.paymentSystemName) {
        filteredInstallmentsList = filteredInstallmentsList.filter(
            installmentsOption =>
                installmentsOption.PaymentSystemName ===
                filteringRules.paymentSystemName
        );
    }

    if (filteringRules.installmentsQuantity) {
        filteredInstallmentsList = filteredInstallmentsList.filter(
            installmentsOption =>
                installmentsOption.NumberOfInstallments ===
                filteringRules.installmentsQuantity
        );
    }

    return filteredInstallmentsList;
}

function pick_max_installments_option(installmentsList: any, filteringRules: any) {
    const filteredInstallmentsList = filteringRules
        ? apply_filters_to_installments_list(installmentsList, filteringRules)
        : installmentsList;

    let [maxInstallmentOption] = filteredInstallmentsList;

    filteredInstallmentsList.forEach(installmentOption => {
        if (
            installmentOption.NumberOfInstallments >
            maxInstallmentOption.NumberOfInstallments
        ) {
            maxInstallmentOption = installmentOption;
        }
    });

    return maxInstallmentOption;
}

function SeparateKitItemKit({ item }: { item: Product }) {
    const { items } = item;
    const { name, images, sellers, itemId: productId } = items[0];
    const { Price, ListPrice, Installments } = sellers[0].commertialOffer;
    let Value, NumberOfInstallments;

    if(Installments && Array.isArray(Installments) && Installments.length > 0) {
        Value = pick_max_installments_option(Installments).Value;
        NumberOfInstallments = pick_max_installments_option(Installments).NumberOfInstallments;
    } else {
        Value = Price;
        NumberOfInstallments = 1;
    }

    return (
        <li className="flex flex-row items-start justify-start gap-4 w-full h-auto p-[24px_16px] isolate bg-white border border-[#C5C6CB] rounded-[8px]">
            <div className="w-20 h-20 flex min-w-20 min-h-20 lg:w-28 lg:h-28">
                <img src={images[0].imageUrl} alt={name} className="w-full h-auto object-cover" />
            </div>

            <div className="flex flex-col gap-2 min-w-0">
                <span className="font-condensed not-italic font-normal text-[14px] leading-[19px] text-[#4A4B51] truncate block w-full">
                    {name}
                </span>

                <div className="flex flex-col gap-1">
                    <div className="flex flex-row gap-1 items-center">
                        <span className="font-condensed not-italic font-normal text-[14px] leading-[16px] text-[#C5C6CB]">{formatPrice(ListPrice)}</span>
                        <span className="font-condensed not-italic font-medium text-[16px] leading-[24px] text-[#ED2D26]">{formatPrice(Price)}</span>
                    </div>
                    <span className="font-condensed not-italic font-normal text-[14px] leading-[20px] text-[#707279]">
                        ou {NumberOfInstallments}x de {formatPrice(Value)}
                    </span>
                </div>

                <AddToCartButton
                    skuId={productId}
                    sellerId={sellers[0].sellerId}
                    price={Price ?? 0}
                    discount={Price && ListPrice ? ListPrice - Price : 0}
                    name={name}
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
    kitProducts
}: SeparateKitProps) {
    if (!kitProducts) return <></>;

    return (
        <div className={`flex-col gap-4 w-full h-auto items-start ${classMainBody}`}>
            <span className="font-condensed not-italic font-semibold text-[18px] leading-[20px] text-center text-[#2E2E2E]">Que tal completar sua cozinha?</span>
            <div className="flex flex-row w-full h-auto">
                <ul className="flex flex-col gap-4 w-full h-auto list-none">
                    {kitProducts.map((item) => (
                        <SeparateKitItemKit item={item} />
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default SeparateKit;