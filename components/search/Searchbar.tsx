/**
 * We use a custom route at /s?q= to perform the search. This component
 * redirects the user to /s?q={term} when the user either clicks on the
 * button or submits the form. Make sure this page exists in deco.cx/admin
 * of yout site. If not, create a new page on this route and add the appropriate
 * loader.
 *
 * Note that this is the most performatic way to perform a search, since
 * no JavaScript is shipped to the browser!
 */

import type { Layout as CardLayout } from "$store/components/product/ProductCard.tsx";
import ProductCard from "$store/components/product/ProductCard.tsx";
import Button from "$store/components/ui/Button.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import Slider from "$store/components/ui/Slider.tsx";
import Spinner from "$store/components/ui/Spinner.tsx";
import { sendEvent } from "$store/sdk/analytics.tsx";
import { useUI } from "$store/sdk/useUI.ts";
import { useAutocomplete } from "apps/vtex/hooks/useAutocomplete.ts";
import { useEffect, useRef } from "preact/compat";

function CloseButton() {
  const { displaySearchbar } = useUI();

  return (
    <Button
      arial-label="fechar searchbar"
      class="btn-outline btn !border text-sm px-10 border-secondary text-secondary hover:btn-secondary hidden lg:block"
      onClick={() => (displaySearchbar.value = false)}
    >
      Fechar
    </Button>
  );
}

// Editable props
export interface EditableProps {
  /**
   * @title Placeholder
   * @description Search bar default placeholder message
   * @default What are you looking for?
   */
  placeholder?: string;
  /**
   * @title Page path
   * @description When user clicks on the search button, navigate it to
   * @default /s
   */
  action?: string;
  /**
   * @title Term name
   * @description Querystring param used when navigating the user
   * @default q
   */
  name?: string;
  /**
   * TODO: Receive querystring from parameter in the server-side
   */
  query?: string;
  cardLayout: CardLayout;
}

export type Props = EditableProps & {
  variant?: "desktop" | "mobile";
  hide?: {
    cleanButton?: boolean;
    results?: boolean;
  };
  noContainer?: boolean;
};

function Searchbar({
  placeholder = "What are you looking for?",
  action = "/busca",
  name = "q",
  query,
  variant = "mobile",
  cardLayout,
  hide = { cleanButton: false, results: false },
  noContainer = false,
}: Props) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { setSearch, suggestions, loading } = useAutocomplete();
  const hasProducts = Boolean(suggestions.value?.products?.length);
  const hasTerms = Boolean(suggestions.value?.searches?.length);
  const notFound = !hasProducts && !hasTerms;
  const { displaySearchbar } = useUI();

  useEffect(() => {
    if (!searchInputRef.current) {
      return;
    }

    searchInputRef.current.focus();
  }, []);

  const Searchbar = (
    <div class="flex items-center gap-4">
      <form
        id="searchbar"
        action={action}
        class="flex-grow flex gap-3 rounded-full placeholder-base-200 px-4 py-2 border-2 border-base-200"
      >
        <button
          class="btn-ghost"
          aria-label="Search"
          htmlFor="searchbar"
          tabIndex={-1}
          type="submit"
        >
          <Icon
            class="text-base-content"
            id="MagnifyingGlass"
            size={20}
            strokeWidth={0.01}
          />
        </button>
        <input
          ref={searchInputRef}
          id="search-input"
          class="flex w-full outline-none placeholder:text-neutral placeholder:font-normal pl-2 text-sm placeholder:text-sm"
          name={name}
          defaultValue={query}
          onInput={(e) => {
            const value = e.currentTarget.value;

            if (value) {
              sendEvent({
                name: "search",
                params: { search_term: value },
              });
            }

            setSearch(value);
          }}
          placeholder={placeholder}
          role="combobox"
          aria-controls="search-suggestion"
          autocomplete="off"
        />
        {hide.cleanButton ? null : (
          <button
            type="button"
            aria-label="Clean search"
            class="focus:outline-none"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              if (searchInputRef.current === null) return;

              searchInputRef.current.value = "";
              setSearch("");
            }}
          >
            <span class="">
              <Icon id="XMarkSearch" width={12} height={12} strokeWidth={2} />
            </span>
          </button>
        )}
      </form>
      {variant === "desktop" && <CloseButton />}
    </div>
  );

  if (noContainer) {
    return Searchbar;
  }

  return (
    <div class="flex flex-col p-4 md:py-6 md:px-20 container">
      <div class="items-center flex justify-between mb-[20px] border-b border-b-[#C5C6CB] lg:hidden">
        <span class="text-primary text-[19px] capitalize">Busca</span>
        <button
          class="btn-square btn-ghost relative flex justify-center items-center rounded-full"
          onClick={() => {
            displaySearchbar.value = false;
          }}
        >
          <Icon id="XMarkSearch" width={24} height={24} strokeWidth={2} />
        </button>
      </div>
      {Searchbar}
      {hide.results
        ? null
        : (
          <div class="flex flex-col gap-6 divide-y divide-base-200 mt-6 empty:mt-0 md:flex-row md:divide-y-0">
            {notFound
              ? (
                <div class="py-16 md:py-6! flex flex-col gap-4 w-full">
                  <span
                    class="font-medium text-xl text-center"
                    role="heading"
                    aria-level={3}
                  >
                    Nenhum resultado encontrado
                  </span>
                  <span class="text-center text-base-300">
                    Vamos tentar de outro jeito? Verifique a ortografia ou use
                    um termo diferente
                  </span>
                </div>
              )
              : (
                <>
                  {suggestions.value!.searches?.length
                    ? (
                      <div class="flex flex-col gap-6 md:w-[15.25rem] md:max-w-[15.25rem]\">
                        <div class="flex gap-2 items-center">
                          <span
                            class="font-normal border-secondary text-secondary"
                            role="heading"
                            aria-level={3}
                          >
                            Termos mais buscados
                          </span>
                        </div>
                        <ul id="search-suggestion" class="flex flex-col gap-3">
                          {suggestions.value!.searches?.map(({ term }) => (
                            <li>
                              <a
                                href={`/busca?q=${term}`}
                                class="flex gap-3 items-center"
                              >
                                <span>
                                  {term}
                                </span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                    : null}
                  <div class="flex flex-col pt-6 md:pt-0 gap-6 overflow-x-hidden w-full">
                    <div class="flex gap-2 items-center">
                      <span
                        class="font-normal border-secondary text-secondary"
                        role="heading"
                        aria-level={3}
                      >
                        Produtos similares
                      </span>
                      {loading.value && <Spinner />}
                    </div>
                    <Slider class="carousel gap-2 lg:justify-between lg:gap-0 flex-col lg:flex-row">
                      {suggestions.value!.products?.map((product, index) => (
                        <Slider.Item
                          index={index}
                          class="carousel-item first:ml-4 last:mr-4 min-w-[200px] w-full max-w-[80%] lg:max-w-[20%]"
                        >
                          <ProductCard
                            product={product}
                            layout={cardLayout}
                            class={"lg:!p-0 lg:!pb-5"}
                            index={index}
                          />
                        </Slider.Item>
                      ))}
                    </Slider>
                    {searchInputRef.current
                      ? (
                        <a
                          class=" hidden lg:flex btn btn-outline border-secondary text-secondary lg:hover:btn-secondary max-lg:btn-secondary max-w-xs self-center text-xs font-bold mt-3 uppercase"
                          href={`/busca?q=${searchInputRef.current.value}`}
                        >
                          ver mais produtos
                        </a>
                      )
                      : <></>}
                  </div>
                </>
              )}
          </div>
        )}
    </div>
  );
}

export default Searchbar;
