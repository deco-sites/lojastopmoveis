import Button from "$store/components/ui/Button.tsx";
import {
  Options as UseAddToCartProps,
  useAddToCart,
} from "$store/sdk/useAddToCart.ts";
import Icon from "$store/components/ui/Icon.tsx";

interface Props extends UseAddToCartProps {
  /**
   * @description Product id
   */
  sellerId: string;
  label?: string;
  classes?: string;
  hideIcon?: boolean;
  mobileLabel?: string;
  redirect?: boolean;
}

function AddToCartButton(
  {
    skuId,
    sellerId,
    discount,
    price,
    productGroupId,
    name,
    label,
    classes,
    quantity,
    hideIcon,
    mobileLabel,
    redirect,
  }: Props,
) {
  const props = useAddToCart({
    skuId,
    sellerId,
    discount,
    price,
    productGroupId,
    name,
    quantity,
    redirect,
  });

  return (
    <Button data-deco="add-to-cart" {...props} class={classes}>
      <p class="flex gap-2 items-center justify-center">
        {!hideIcon && <Icon id="ShoppingCart" width={24} height={20} />}
        <span class="2xl:hidden uppercase w-full font-condensed min-h-5	">
          {mobileLabel ?? "Carrinho"}
        </span>
        <span class="hidden 2xl:inline uppercase font-condensed min-h-5	">
          {label ?? "Adicionar ao carrinho"}
        </span>
      </p>
    </Button>
  );
}

export default AddToCartButton;
