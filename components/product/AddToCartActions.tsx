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

  return (
    <div class="flex max-lg:flex-col-reverse w-full max-lg:gap-[10px] gap-[30px]">
      <AddToCartButton
        skuId={productID}
        sellerId={seller}
        price={price ?? 0}
        discount={price && listPrice ? listPrice - price : 0}
        name={productName}
        productGroupId={productGroupID}
        quantity={1}
        label="Adicionar ao carrinho"
        mobileLabel="Adicionar ao carrinho"
        classes="btn-outline btn-block border-secondary text-secondary transition-all font-bold text-sm tracking-[1px] py-[12px] px-10 hover:btn-secondary"
      />
      <AddToCartButton
        hideIcon
        skuId={productID}
        sellerId={seller}
        price={price ?? 0}
        discount={price && listPrice ? listPrice - price : 0}
        name={productName}
        productGroupId={productGroupID}
        quantity={1}
        label="Comprar Agora"
        mobileLabel="Comprar Agora"
        redirect
        classes="btn-secondary btn-block transition-all font-bold text-sm tracking-[1px] py-[12px] px-10"
      />
    </div>
  );
}
