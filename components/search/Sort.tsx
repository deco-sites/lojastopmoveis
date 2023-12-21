import { useMemo } from "preact/hooks";
import { ProductListingPage } from "apps/commerce/types.ts";
import Icon from "$store/components/ui/Icon.tsx";

const SORT_QUERY_PARAM = "sort";

const useSort = () =>
  useMemo(() => {
    const urlSearchParams = new URLSearchParams(window.location?.search);
    return urlSearchParams.get(SORT_QUERY_PARAM) ?? "";
  }, []);

// TODO: Replace with "search utils"
const applySort = (searchParam: string) => {
  const urlSearchParams = new URLSearchParams(window.location.search);

  urlSearchParams.set(SORT_QUERY_PARAM, searchParam);
  window.location.search = urlSearchParams.toString();
};

const labels = {
  "relevance:desc": "Relevância",
  "price:asc": "Menor preço",
  "price:desc": "Maior preço",
  "name:asc": "A - Z",
  "name:desc": "Z - A",
  "release:desc": "Data de lançamento",
  "orders:desc": "Mais vendidos",
  "discount:desc": "Melhor desconto",
};

type LabelKey = keyof typeof labels;

export type Props = Pick<ProductListingPage, "sortOptions">;

function Sort({ sortOptions }: Props) {
  const sort = useSort();

  return (
    <div
      id="sort"
      name="sort"
      class="dropdown dropdown-end w-full lg:auto"
    >
      <label
        tabIndex={0}
        class="btn justify-between w-full lg:w-[214px] btn-sm font-normal text-secondary border-secondary lg:text-base-200 h-[46px] lg:h-12 border lg:border-[#C5C6CB] bg-white hover:bg-white"
      >
        {sort
          ? <span class="text-base-content">{labels[sort as LabelKey]}</span>
          : (
            <>
              <span class=" uppercase text-secondary lg:text-base-content lg:hidden font-bold tracking-[1px] font-condensed">
                Ordenar
              </span>
              <span class="max-lg:hidden">Selecionar</span>
            </>
          )}
        <Icon
          id="ChevronDown"
          height={16}
          width={16}
          strokeWidth={2}
          class="text-base-content"
        />
      </label>
      <ul
        tabIndex={0}
        class="dropdown-content border border-[#ffff] mt-[10px] z-[100] px-0 py-[10px] menu shadow bg-base-100 rounded-[10px] w-full lg:w-[214px]"
      >
        {sortOptions.map(({ value, label }) => (
          <li
            class="text-xs text-primary h-9 hover:cursor-pointer px-2.5 md:opacity-70 hover:bg-neutral-200 flex justify-center"
            onClick={() => applySort(value)}
          >
            {labels[label as LabelKey]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sort;
