import { useUI } from "$store/sdk/useUI.ts";
import Icon from "$store/components/ui/Icon.tsx";
import type { Image as LiveImage } from "deco-sites/std/components/types.ts";

export interface INavItem {
  label: string;
  href?: string;
  highlighted?: boolean;
  children?: INavItem[];
  variant?: "CommonChild" | "AllCategories" | "WithBrands" | "Other";
  image?: Image;
}

export interface Image {
  src?: LiveImage;
  alt?: string;
  href?: string;
}

function splitNatItems(children: INavItem[], number = 6) {
  const slices = [];
  const totalSlices = Math.ceil(children.length / number);

  for (let i = 0; i < totalSlices; i++) {
    slices.push(children.slice(i * number, (i + 1) * number));
  }

  return slices;
}

function NavItemDropDown(
  { elements, variant, image }: {
    elements?: INavItem[];
    variant?: string;
    image?: Image;
  },
) {
  const { headerHeight } = useUI();
  if (!elements || !elements?.length) {
    return <span />;
  }
  if (variant === "WithBrands") {
    if (!elements[0].children) {
      return <></>;
    }
    const navItemsCol = splitNatItems(elements[0].children, 5);
    return (
      <div
        class="absolute hidden hover:flex group-hover:flex bg-base-100 z-50 items-start justify-center gap-6 w-full shadow-md"
        style={{ top: "0px", left: "0px", marginTop: headerHeight.value }}
      >
        <div class="container w-full pt-5 pb-5 m-auto flex items-start gap-16 justify-between">
          {elements.map((element) => {
            return (
              <div class="mr-[83px]">
                {element.href
                  ? (
                    <a
                      href={element.href || ""}
                      class="hover:font-extrabold font-bold hover:underline transition-all duration-300"
                    >
                      <span class="text-secondary">{element.label}</span>
                    </a>
                  )
                  : <span class="text-secondary">{element.label}</span>}
                  <div class="flex mt-4 gap-[40px]">
                  {navItemsCol.map((column) => (
                  <ul class="flex items-start justify-start flex-col">
                    {column.map((node) => (
                      <li class="mb-3">
                        <a
                          class="text-sm text-primary hover:font-bold hover:underline transition-all duration-300"
                          href={node.href || ""}
                        >
                          <span>{node.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ))}
                </div>
              </div>
            );
          })}
          {image && (
            <a href={image.href || ""}>
              <img
                src={image.src}
                alt={image.alt || "Banner vertical do menu"}
                class="h-full w-auto justify-self-end"
              />
            </a>
          )}
        </div>
      </div>
    );
  }
  const navItemsCol = variant === "AllCategories"
    ? splitNatItems(elements, 16)
    : splitNatItems(elements, 5);
  return (
    <div
      class="absolute hidden hover:flex group-hover:flex bg-base-100 z-50 items-start justify-center gap-6 w-full shadow-md"
      style={{ top: "0px", left: "0px", marginTop: headerHeight.value }}
    >
      <div class="container w-full pt-5 pb-[5.25rem] m-auto px-5 flex items-start justify-start gap-[3rem] ">
        {navItemsCol.map((column) => (
          <ul class="flex items-start justify-start flex-col ">
            {column.map((node) => (
              <li class="mb-3">
                <a
                  class="text-sm text-primary hover:font-bold hover:underline transition-all duration-300"
                  href={node.href || ""}
                >
                  <span>{node.label}</span>
                </a>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

function NavItem({ item }: { item: INavItem }) {
  const { href, label, children, highlighted, variant, image } = item;
  return (
    <li
      class={`group flex items-center ${
        highlighted ? "2xl:2-[260px]" : "flex-1"
      } justify-center`}
    >
      <a
        href={href}
        class={`px-4 py-2 my-2 w-full text-center group-hover:bg-white rounded-3xl ${
          highlighted ? "bg-white rounded-3xl flex justify-center gap-2" : ""
        }`}
      >
        {highlighted && (
          <Icon id="AllCategories" width={18} height={18} strokeWidth={1} />
        )}
        <span
          class={`relative text-xs  transition-all font-bold duration-300 ${
            highlighted
              ? "text-base-content"
              : "text-white group-hover:text-primary"
          }`}
        >
          {label}
        </span>
      </a>
      <NavItemDropDown variant={variant} elements={children} image={image} />
    </li>
  );
}

export default NavItem;
