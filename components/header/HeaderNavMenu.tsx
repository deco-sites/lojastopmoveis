import Modals from "$store/islands/HeaderModals.tsx";
import NavItem, { INavItem } from "./NavItem.tsx";
import { megaMenuDefaultItems } from "./constants.ts";

export interface Props {
  /**
   * @title Items do menu
   * @description Items do menu desktop e mobile
   */
  navItems?: INavItem[];
}

function HeaderNavMenu(
  {
    navItems = megaMenuDefaultItems as INavItem[],
  }: Props,
) {
  return (
    <div class="z-50">
      <div class="flex justify-between items-center lg:p-0">
        <ul class="hidden xl:flex justify-between flex-1 whitespace-nowrap gap-[5px]">
          {navItems && navItems?.length
            ? navItems?.map((item) => <NavItem key={item.label} item={item} />)
            : null}
        </ul>
      </div>

      <Modals
        menu={{ items: navItems }}
      />
    </div>
  );
}

export default HeaderNavMenu;
