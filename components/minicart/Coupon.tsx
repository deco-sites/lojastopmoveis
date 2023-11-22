import Button from "$store/components/ui/Button.tsx";
import { useSignal } from "@preact/signals";
import { useCart } from "deco-sites/std/packs/vtex/hooks/useCart.ts";
import { useRef } from "preact/hooks";

function Coupon() {
  const { cart, loading, addCouponsToCart } = useCart();
  const ref = useRef<HTMLInputElement>(null);
  const displayInput = useSignal(false);
  const coupon = cart.value?.marketingData?.coupon;

  const toggleInput = () => {
    displayInput.value = !displayInput.value;
  };

  const applyCouponToCart = (e: MouseEvent) => {
    e.preventDefault();

    const text = ref.current?.value;

    if (typeof text === "string") {
      addCouponsToCart({ text });
      toggleInput();
    }
  };

  return (
    <div class="flex justify-between flex-col items-start px-0 mb-6 w-full gap-4">
      <span class="text-xs text-primary font-medium">Cupom de desconto</span>
      <form class="flex gap-2 w-full justify-between lg:justify-start">
        <input
          id="coupon"
          name="coupon"
          ref={ref}
          class="border border-[#C5C6CB] outline-none rounded-[90px] placeholder-neutral p-3 h-10 text-xs w-full"
          type="text"
          value={coupon ?? ""}
          placeholder={"Digite seu cupom aqui"}
        />
        <Button
          class="h-9 !border border-base-content text-base-content font-bold tracking-[1px] text-xs px-[26px] w-fit"
          type="submit"
          htmlFor="coupon"
          loading={loading.value}
          onClick={applyCouponToCart}
        >
          OK
        </Button>
      </form>
    </div>
  );
}

export default Coupon;
