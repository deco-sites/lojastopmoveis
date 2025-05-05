import AddToCartButton from "$store/components/product/AddToCartButton.tsx";
import Icon from "$store/components/ui/Icon.tsx";


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
      <a
        href={`https://api.whatsapp.com/send/?phone=5585988025359&text&type=phone_number&app_absent=0`}
        class="lg:max-w-[600px]  justify-center w-full h-[46px] bg-[#049548] rounded-full border border-black border-solid lg:hidden flex "
        aria-label="Chat on WhatsApp"
        target="blank"
        >
          <Icon id="WhatsappLogo" class="pt-[10px] pl-[10px]" size={40} stroke="0.01" />
          <button
            class=" text-white p-2 text-sm lg:text-base" 
            aria-label="Chat on WhatsApp"
            >
            Quero comprar pelo WhatsApp
          </button>
      </a>
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
