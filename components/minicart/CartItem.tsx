import Button from "$store/components/ui/Button.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import QuantitySelector from "$store/components/ui/QuantitySelector.tsx";
import { sendEvent } from "$store/sdk/analytics.tsx";
import { formatPrice } from "$store/sdk/format.ts";
import { useSignal } from "@preact/signals";
import Image from "deco-sites/std/components/Image.tsx";
import { useCart } from "deco-sites/std/packs/vtex/hooks/useCart.ts";
import { useOffer } from "$store/sdk/useOffer.ts";

interface Props {
  index: number;
  currency: string;
}

function CartItem({ index, currency }: Props) {
  const {
    cart,
    updateItems,
    mapItemsToAnalyticsItems,
  } = useCart();
  const loading = useSignal(false);
  const item = cart.value!.items[index];
  const locale = cart.value?.clientPreferencesData.locale;
  const currencyCode = cart.value?.storePreferencesData.currencyCode;
  const { imageUrl, skuName, sellingPrice, listPrice, name, quantity } = item;

  const isGift = sellingPrice < 0.01;

  const installmentOptions = cart.value?.paymentData?.installmentOptions
    ?.reduce((highest, current) => {
      const highestLength = highest?.installments?.length ?? 0;
      const currentLength = current?.installments?.length ?? 0;

      return currentLength > highestLength ? current : highest;
    });

  const highestInstallment = installmentOptions?.installments?.slice(-1);

  const highestNumberInstallments = highestInstallment?.[0]?.count ?? 0;
  const interestRatePercent =
    ((highestInstallment?.[0]?.interestRate ?? 0) / 10000) + 1;

  return (
    <div class="pb-3 flex flex-row justify-between items-start gap-4 border-solid border-b-[1px] border-[#F7F7F7]">
      <div class="rounded-md min-w-[25%] max-w-[25%]">
        <Image
          src={imageUrl.replace("55-55", "200-200")}
          alt={skuName}
          width={100}
          height={100}
          class="object-cover object-center lg:w-[107px] lg:h-[107px] mix-blend-multiply"
        />
      </div>
      <div class="flex-grow overflow-hidden">
        <span class="text-xs text-[#4A4B51] lg:text-xs overflow-hidden block text-ellipsis whitespace-nowrap">
          {name}
        </span>
        <div class="flex items-center gap-2">
          {listPrice > sellingPrice && (
            <span class="line-through text-base-300 text-xs">
              {formatPrice(listPrice / 100, currencyCode!, locale)}
            </span>
          )}
          <span class="text-xs text-primary">
            {isGift
              ? "Grátis"
              : formatPrice(sellingPrice / 100, currency, locale)}
          </span>
        </div>
        {installmentOptions?.installments.length &&
            highestNumberInstallments > 1
          ? (
            <div>
              <span class="text-xs text-[#4A4B51]">
                ou em até {highestNumberInstallments}x de {""}
                {highestNumberInstallments
                  ? formatPrice(
                    Math.ceil(listPrice * interestRatePercent) /
                      highestNumberInstallments / 100,
                  )
                  : ""}
              </span>
            </div>
          )
          : (
            ""
          )}
        <div class="flex justify-between mt-2.5 items-center">
          <QuantitySelector
            disabled={loading.value || isGift}
            quantity={quantity}
            inputWidth={42}
            inputHeight={35}
            onChange={async (quantity) => {
              await updateItems({ orderItems: [{ index, quantity }] });
              const quantityDiff = quantity - item.quantity;

              if (!cart.value) {
                return;
              }

              sendEvent({
                name: quantityDiff < 0 ? "remove_from_cart" : "add_to_cart",
                params: {
                  items: mapItemsToAnalyticsItems({
                    items: [
                      {
                        ...item,
                        quantity: Math.abs(quantityDiff),
                      },
                    ],
                    marketingData: cart.value.marketingData,
                  }),
                },
              });
            }}
          />
          <Button
            onClick={() => {
              updateItems({ orderItems: [{ index, quantity: 0 }] });
              if (!cart.value) {
                return;
              }
              sendEvent({
                name: "remove_from_cart",
                params: {
                  items: mapItemsToAnalyticsItems({
                    items: [item],
                    marketingData: cart.value.marketingData,
                  }),
                },
              });
            }}
            disabled={loading.value || isGift}
            loading={loading.value}
            class="btn btn-ghost"
          >
            <Icon class="text-primary" id="Trash" width={20} height={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
