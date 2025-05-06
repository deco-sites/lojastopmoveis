import { asset } from "$fresh/runtime.ts";
import type { JSX } from "preact";

export type PaymentIcons =
  | "Visa"
  | "Elo"
  | "Mastercard"
  | "Visa"
  | "Pix"
  | "AmericanExpress"
  | "Boleto";

export type SocialIcons =
  | "Twitter"
  | "Linkedin"
  | "Pinterest"
  | "YouTube"
  | "Tiktok"
  | "WhatsApp"
  | "Instagram"
  | "Facebook"
  | "YouTubeOutline"
  | "WhatsAppOutline"
  | "InstagramOutline"
  | "FacebookOutline";
export type AvailableIcons =
  | "Refresh"
  | "Menu"
  | "ChevronLeft"
  | "ChevronRight"
  | "ChevronUp"
  | "ChevronDown"
  | "QuestionMarkCircle"
  | "User"
  | "Cart"
  | "ShoppingCart"
  | "Bars3"
  | "Heart"
  | "HeartOutline"
  | "HeartFull"
  | "MagnifyingGlass"
  | "XMark"
  | "XMarkSearch"
  | "Plus"
  | "PlusFilter"
  | "Minus"
  | "MapPin"
  | "Phone"
  | "Logo"
  | "LogoFooter"
  | "LogoMobile"
  | "Truck"
  | "Discount"
  | "Return"
  | "Deco"
  | "Discord"
  | "Email"
  | "Trash"
  | "FilterList"
  | "ArrowsPointingOut"
  | "WhatsApp"
  | "newWhatsApp" 
  | "WhatsappLogo"
  | "newInstagram"
  | "newFacebook"
  | "ArrowsPointingOut"
  | "checkIcon"
  | "SearchBar"
  | "ArrowRight"
  | "ArrowLeft"
  | "LogoSeo"
  | "ReturnArrow"
  | "SadFace"
  | "LeftArrowFigma"
  | "RightArrowFigma"
  | "LeftArrowBanner"
  | "RightArrowBanner"
  | "Wishlist"
  | "MinhaConta"
  | "FaleConosco"
  | "NossasLojas"
  | "AllCategories" 
  | "Wrench";

interface Props extends JSX.SVGAttributes<SVGSVGElement> {
  /**
   * Symbol id from element to render. Take a look at `/static/icons.svg`.
   *
   * Example: <Icon id="Bell" />
   */
  id: AvailableIcons | SocialIcons | PaymentIcons;
  size?: number;
}

function Icon({
  id,
  strokeWidth = 16,
  size,
  width,
  height,
  ...otherProps
}: Props) {
  return (
    <svg
      {...otherProps}
      width={width ?? size}
      height={height ?? size}
      strokeWidth={strokeWidth}
    >
      <use href={asset(`/sprites.svg#${id}`)} />
    </svg>
  );
}

export default Icon;
