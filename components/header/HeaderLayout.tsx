import { ICartProps } from "$store/components/minicart/Cart.tsx";
import { EditableProps as SearchbarProps } from "$store/components/search/Searchbar.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import Buttons from "$store/islands/HeaderButton.tsx";
import Modals from "$store/islands/HeaderModals.tsx";
import SearchBar from "$store/islands/HeaderSearchbar.tsx";
import BuyWarning from "$store/islands/BuyWarning.tsx";

export interface Props {
  /**
   * @title Minicart settings
   */
  minicart: ICartProps;
  /**
   * @title Search bar settings
   */
  searchbar: SearchbarProps;
}

function HeaderLayout(
  {
    minicart,
    searchbar,
  }: Props,
) {
  return (
    <header class="z-50 py-2">
      <div class="flex justify-between items-center lg:p-0">
        <div class="flex items-center gap-5">
          <Buttons variant="menu" />
          <a href="/" class="" aria-label="Store logo">
            <Icon id="Logo" class="max-w-[33vw] w-[54.1px] h-[40px] md:w-[94.6px] md:h-[70px]" width={94.6} height={70} />
          </a>
        </div>
        <div class="max-lg:hidden flex justify-between">
        </div>
        <div class="flex items-center w-auto lg:justify-between xl:gap-8 lg:gap-2">
          <div class="flex items-center xl:gap-4 lg:gap-2">
            <Buttons variant="search" />
            <SearchBar searchbar={{ ...searchbar, variant: "mobile" }} />
            <Buttons variant="wishlist" />
            <div class="max-lg:hidden rounded-full border-2 border-solid no-animation relative btn-square btn-ghost flex items-center justify-center group">
              <Icon
                class="text-base-content"
                id="User"
                width={24}
                height={25}
                strokeWidth={1}
              />
              <div class="absolute hidden hover:flex group-hover:flex bg-secondary text-[#FFFFFF] top-[40px] shadow whitespace-nowrap p-[24px] flex-col z-10 gap-[6px] rounded-[10px]">
                <a href="/my-account">Minha conta</a>
                <a href="/my-account/orders">Meus pedidos</a>
                <a href="/my-account/orders">Meus favoritos</a>
                <div class="h-[1px] bg-secondary-content w-[160px] my-[14px]"/>
              </div>
            </div>
            <Buttons variant="cart" />
          </div>
        </div>
      </div>

      <Modals
        minicart={minicart}
      />

      <BuyWarning />
    </header>
  );
}

export default HeaderLayout;
