import { useSignal } from "@preact/signals";
import { useCallback } from "preact/hooks";
import { useCart } from "apps/vtex/hooks/useCart.ts";
import { useUI } from "$store/sdk/useUI.ts";
import { sendEvent } from "$store/sdk/analytics.tsx";

export interface Options {
  skuId: string;
  sellerId?: string;
  price: number;
  discount: number;
  quantity: number;
  redirect?: boolean;
  /**
   * sku name
   */
  name: string;
  productGroupId: string;
}

export const useAddToCart = (
  {
    skuId,
    sellerId,
    price,
    discount,
    name,
    productGroupId,
    quantity,
    redirect,
  }: Options,
) => {
  const isAddingToCart = useSignal(false);
  const { displayBuyWarning } = useUI();
  const { addItems } = useCart();

  const onClick = useCallback(async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!sellerId) {
      return;
    }

    try {
      isAddingToCart.value = true;
      await addItems({
        orderItems: [{ id: skuId, seller: sellerId, quantity }],
      });

      sendEvent({
        name: "add_to_cart",
        params: {
          items: [{
            item_id: productGroupId,
            quantity,
            price,
            discount,
            item_name: name,
            item_variant: skuId,
          }],
        },
      });

      displayBuyWarning.value = true;
    } finally {
      isAddingToCart.value = false;
      if (redirect) {
        globalThis.window.location.href = "/checkout";
      }
      setTimeout(function () {
        displayBuyWarning.value = false;
      }, 3000);
    }
  }, [skuId, sellerId, quantity]);

  return { onClick, loading: isAddingToCart.value };
};
