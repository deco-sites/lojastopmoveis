import type { BreadcrumbList } from "deco-sites/std/commerce/types.ts";

interface Props {
  itemListElement: BreadcrumbList["itemListElement"];
  class?: string;
}

function Breadcrumb({ class: _class, itemListElement = [] }: Props) {
  const items = [{ name: "Home", item: "/" }, ...itemListElement];

  return (
    <div
      class={`breadcrumbs ${_class} ${items.length <= 1 ? "h-0 p-0" : "py-5"}`}
    >
      <ul class={``}>
        {items
          .filter(({ name, item }) => name && item)
          .map(({ name, item }, index) => {
            if (
              (index > 1 && index != items.length - 1) || items.length <= 1
            ) return;
            return (
              <li
                class={`text-primary text-sm opacity-60 last:opacity-100 last:overflow-hidden first:before:!content-none before:!ml-2 before:!mr-[10px] before:!h-2 before:!border-t-0 before:!rotate-0 before:!border-r-[#B8B8BC] before:!border-r before:!opacity-100`}
              >
                <a class="!block !text-ellipsis !overflow-hidden" href={item}>
                  {name}
                </a>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default Breadcrumb;
