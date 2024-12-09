import { useSignal } from "@preact/signals";
import { 
    BUTTON_VARIANTS,
    ButtonVariant } from "$store/components/minicart/Cart.tsx";
import AddToCartButton from "$store/islands/AddToCartButton.tsx";

interface Props{
    name: string;
    discount: number;
    productGroupId: string;
    price: number;
    seller: string;
    skuId: string;
    label?: string;
    ctaVariant: ButtonVariant | undefined;
}

const AddToCartLocal = ({ name, discount, productGroupId, price, seller, skuId, label, ctaVariant }:Props)=> {
    const quantity = useSignal(1);

    const increaseQuantity = () => {
        quantity.value += 1;
    };

    const decreaseQuantity = () => {
        if (quantity.value > 1) {
            quantity.value -= 1;
        }
    };

    const addToCartButtonClassNames = (variant: string | undefined) =>
        `lg:text-sm font-medium text-xs whitespace-nowrap w-full btn max-md:min-h-12 max-md:h-12 max-md:m-auto max-md:px-10 max-md:max-w-full md:w-auto btn-${BUTTON_VARIANTS[variant ?? "primary"]
        }`;

    return(
        <div className="flex flex-col w-full gap-[8px] items-center md:flex-row md:gap-0 md:justify-between">
            <div className="flex flex-row items-center justify-center gap-[4px]">
                <button onClick={increaseQuantity} aria-label="Aumentar quantidade"  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                        <path d="M5 9.53003H14M9.5 5.03003V14.03" stroke="#444444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div className="border border-[#ED2A24] w-[37px] h-[37px] rounded-[6px] px-[10px] py-[13px] flex items-center justify-center">
                    <span className="font-bold text-sm text-center text=[#444444]">{quantity.value}</span>
                </div>
                <button onClick={decreaseQuantity} aria-label="Diminuir quantidade" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                        <path d="M5 9.53003L14 9.53003" stroke="#444444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
            <AddToCartButton
                quantity={quantity.value}
                name={name}
                discount={discount}
                productGroupId={productGroupId}
                price={price}
                sellerId={seller}
                skuId={skuId}
                label={label}
                classes={addToCartButtonClassNames(ctaVariant)}
            />
        </div>
    );
}

export default AddToCartLocal;