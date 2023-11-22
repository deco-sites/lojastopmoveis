import { lazy, Suspense } from "preact/compat";

import { useUI } from "$store/sdk/useUI.ts";
import { headerHeight } from "$store/components/header/constants.ts";
import type { Props as SearchbarProps } from "$store/components/search/Searchbar.tsx";

const LazySearchbar = lazy(() =>
  import("$store/components/search/Searchbar.tsx")
);

interface Props {
  searchbar: SearchbarProps;
}

function Searchbar({ searchbar }: Props) {
  const { displaySearchbar } = useUI();
  const open = displaySearchbar.value;

  return (
    <div
      class={`${
        open ? "block border-y border-base-200 shadow" : "hidden"
      } absolute left-0 top-0 z-50 bg-base-100 text-primary w-full`}
      style="margin-top: 111px;box-shadow: 0 10000px 0 10000px rgba(0, 0, 0, 0.5);"
    >
      {open && (
        <Suspense fallback={<span class="loading loading-ring" />}>
          <LazySearchbar {...searchbar} variant="desktop" />
        </Suspense>
      )}
    </div>
  );
}

export default Searchbar;
