import Button from "$store/components/ui/Button.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import { sendEvent } from "$store/sdk/analytics.tsx";
import { useUI } from "$store/sdk/useUI.ts";
import { useCart } from "apps/vtex/hooks/useCart.ts";

function SearchButton() {
  const { displaySearchbar } = useUI();

  return (
    <Button
      class="bg-stone-200 flex items-center justify-center border-[0] p-[10px] gap-2 text-xs xl:text-base"
      aria-label="search icon button"
      onClick={() => {
        displaySearchbar.value = !displaySearchbar.peek();
      }}
    >Pesquise aqui
      <Icon
        class="text-base-content"
        id="MagnifyingGlass"
        width={24}
        height={25}
        strokeWidth={1}
      />
    </Button>
  );
}

function MenuButton() {
  const { displayMenu } = useUI();

  return (
    <Button
      class="rounded-full border-2 border-solid no-animation btn-ghost relative flex justify-center items-center xl:hidden"
      aria-label="open menu"
      onClick={() => {
        displayMenu.value = true;
      }}
    >
      <Icon class="text-base-content" id="Menu" width={25} height={25} />
    </Button>
  );
}

function WishListButton() {
  return (
    <Button
      class="btn-square btn-ghost flex items-center justify-center"
      aria-label="wish icon button"
      onClick={() => {
        globalThis.window.location.href = "/wishlist";
      }}
    >
      <Icon
        class="text-base-content"
        id="Wishlist"
        width={24}
        height={25}
        strokeWidth={1}
      />
    </Button>
  );
}

function CartButton() {
  const { displayCart } = useUI();
  const { loading, cart, mapItemsToAnalyticsItems } = useCart();
  const totalItems = cart.value?.items.length || null;
  const currencyCode = cart.value?.storePreferencesData.currencyCode;
  const total = cart.value?.totalizers.find((item) => item.id === "Items");
  const discounts = cart.value?.totalizers.find((item) =>
    item.id === "Discounts"
  );

  const onClick = () => {
    displayCart.value = true;
    sendEvent({
      name: "view_cart",
      params: {
        currency: cart.value ? currencyCode! : "",
        value: total?.value
          ? (total?.value - (discounts?.value ?? 0)) / 100
          : 0,

        items: cart.value ? mapItemsToAnalyticsItems(cart.value) : [],
      },
    });
  };

  return (
    <Button
      class="btn-square btn-ghost relative flex justify-center items-center min-h-[48px] min-w-[48px]"
      aria-label="open cart"
      data-deco={displayCart.value && "open-cart"}
      loading={loading.value}
      onClick={onClick}
    >
      <div class="indicator">
        {totalItems && (
          <span class="indicator-item text-base-100 bg-secondary w-4 h-4 rounded-t-full rounded-r-full text-xs left-3 top-0 font-bold">
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        )}
        <Icon
          class="text-base-content"
          id="Cart"
          width={24}
          height={25}
          strokeWidth={1}
        />
      </div>
    </Button>
  );
}

function Buttons(
  { variant }: { variant: "cart" | "search" | "menu" | "wishlist" },
) {
  if (variant === "cart") {
    return <CartButton />;
  }

  if (variant === "search") {
    return <SearchButton />;
  }

  if (variant === "menu") {
    return <MenuButton />;
  }

  if (variant === "wishlist") {
    return <WishListButton />;
  }

  return null;
}

export default Buttons;
