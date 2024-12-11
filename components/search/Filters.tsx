import Avatar from "$store/components/ui/Avatar.tsx";
import { parseRange } from "deco-sites/std/utils/filters.ts";
import { formatPrice } from "$store/sdk/format.ts";

import type {
  Filter,
  FilterToggle,
  FilterToggleValue,
  ProductListingPage,
} from "apps/commerce/types.ts";

interface Props {
  filters: ProductListingPage["filters"];
}

const isToggle = (filter: Filter): filter is FilterToggle =>
  filter["@type"] === "FilterToggle";

function ValueItem({ url, selected, label, quantity, index }: FilterToggleValue & { index: number }) {
  const labelId = `checkbox-label-${index}`;

  return (
    <a href={`${url}&page=1`} class="flex items-center gap-2" rel="nofollow">
      <div
        role="checkbox"
        aria-checked={selected}
        tabIndex={0} 
        aria-labelledby={labelId}
        class="checkbox aria-checked:bg-none rounded-none h-4 w-4 border-primary"
      >
        {selected && (
          <div class="bg-primary w-full h-full border-white border-2" />
        )}
      </div>
      <span id={labelId} class="text-sm text-[#4A4B51]">
        {label}
        {quantity > 0 && (
          <span class="ml-1 text-sm text-[#4A4B51]">({quantity})</span>
        )}
      </span>
    </a>
  );
}

function FilterValues({ key, values }: FilterToggle) {
  const flexDirection =
    key === "tamanho" || key === "cor"
      ? "flex-row flex-wrap"
      : "flex-col md:max-h-[135px] md:overflow-auto scrollbar-list";

  return (
    <ul class={`flex gap-2 ${flexDirection}`}>
      {values.map((item, index) => {
        const { url, selected, value,  } = item;

        if (key === "cor" || key === "tamanho") {
          return (
            <li key={index}>
              <a href={url} rel="nofollow">
                <Avatar content={value} variant={"default"} active={selected} />
              </a>
            </li>
          );
        }

        if (key === "price") {
          const range = parseRange(item.value);

          return (
            range && (
              <li key={index}>
                <ValueItem
                  {...item}
                  index={index}
                  label={`${formatPrice(range.from)} - ${formatPrice(range.to)}`}
                />
              </li>
            )
          );
        }

        return (
          <li key={index}>
            <ValueItem {...item} index={index} />
          </li>
        );
      })}
    </ul>
  );
}

function Filters({ filters }: Props) {
  const _filters = filters.filter(isToggle);
  const selectedFilters = _filters.reduce<FilterToggleValue[]>(
    (initial, filter) => {
      const selected = filter.values.find((value) => value.selected);
      if (!selected) return initial;

      return [...initial, selected];
    },
    [],
  );

  return (
    <ul class="flex flex-col gap-2 text-primary">
      <li>
        <p class="font-normal tracking-[1px] mb-5 text-[19px] text-secondary">
          Filtrar por:
        </p>
        {selectedFilters.length > 0 &&
          selectedFilters.map((filter, index) => (
            <div class="mb-2" key={index}>
              <ValueItem {...filter} index={index} />
            </div>
          ))}
      </li>
      {_filters.map((filter, index) => (
        <li class="flex flex-col gap-4" key={index}>
          <details class="collapse collapse-plus" open>
            <summary class="collapse-title text-sm text-primary font-medium min-h-0 px-0 py-2.5 border-b mb-4 after:!right-[10px] after:text-[20px] after:!top-[10px] border-[#D7D7DA] after:!font-medium">
              {filter.label}
            </summary>
            <div class="collapse-content px-0 md:max-h-">
              <FilterValues {...filter} />
            </div>
          </details>
        </li>
      ))}
      <li class="flex justify-center">
        <a
          class="btn btn-outline gap-2 mx-4 border-secondary text-secondary uppercase font-bold w-full font-condensed lg:hidden"
          href="?"
          rel="nofollow"
        >
          Limpar Filtros
        </a>
      </li>
    </ul>
  );
}

export default Filters;