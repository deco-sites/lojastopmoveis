import QuantitySelector from "$store/components/ui/QuantitySelector.tsx";
import { useState } from "preact/hooks";
import AddToCartButton from "$store/components/product/AddToCartButton.tsx";

type Props = {
  productID: string;
  seller: string;
  price?: number;
  listPrice?: number;
  productName: string;
  productGroupID: string;
};

export default function AddToCartActions(
  { productID, seller, price, listPrice, productName, productGroupID }: Props,
) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div class="flex w-full gap-[30px] px-">
      <QuantitySelector
        quantity={quantity}
        onChange={(_quantity) => {
          setQuantity(_quantity);
        }}
      />
      <AddToCartButton
        skuId={productID}
        sellerId={seller}
        price={price ?? 0}
        discount={price && listPrice ? listPrice - price : 0}
        name={productName}
        productGroupId={productGroupID}
        quantity={quantity}
        label="Comprar agora"
        classes="btn-primary btn-block transition-all font-bold text-sm tracking-[1px] py-[12px] px-10"
      />
    </div>
  );
}
