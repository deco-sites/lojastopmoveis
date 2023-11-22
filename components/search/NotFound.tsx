import type { SectionProps } from "$live/mod.ts";
import Icon from "$store/components/ui/Icon.tsx";
import Searchbar from "$store/components/search/Searchbar.tsx";

export interface Props {
  /**
   * @description Title to be displayed in the not found section
   */
  title?: string;
  /**
   * @description Description to be displayed before the search term that caused the not found state
   * @title Search term description
   */
  termDescription?: string;
  /**
   * @description Hints for helping the user searching in a more effective way
   */
  hints?: {
    title: string;
    hints: string[];
  };
}

export const loader = (ctx: Props, req: Request) => {
  const params = new URLSearchParams(req.url.split("?")[1]);

  const term = params.get("q");

  return {
    ...ctx,
    searchTerm: term,
  };
};

export default function NotFound({
  termDescription = "Resultados de busca encontrados para:",
  title = "Ops!",
  hints,
  searchTerm,
}: SectionProps<typeof loader>) {
  return (
    <div class="w-full">
      <div class="flex flex-col gap-[10px] lg:flex-row lg:justify-around lg:mt-[30px] lg:mb-[60px] items-center">
        <div class="flex flex-col px-5 py-[30px] gap-5 lg:w-[668px]">
          <h2 class="text-secondary font-bold text-[70px] lg:text-[154px]">
            {title}
          </h2>
          <p class="text-primary tracking-[1px] lg:text-[19px]">
            {termDescription} "{searchTerm}"
          </p>
          <div class="lg:w-[608px]">
            <Searchbar
              placeholder="Digite sua busca novamente"
              noContainer
              hide={{
                results: true,
                cleanButton: true,
              }}
              cardLayout={{
                discount: {
                  label: "OFF",
                  variant: "emphasis",
                },
                hide: {},
              }}
            />
          </div>
        </div>
        {hints && (
          <div class="bg-[#DEE0E8] p-5 flex flex-col gap-[20px] text-primary rounded-[20px] lg:justify-center lg:p-[60px] h-fit max-lg:mb-[30px]">
            <h6 class="font-bold lg:text-xl">{hints.title}</h6>
            <ul class="flex flex-col gap-3 list-disc list-inside">
              {hints.hints.map((hint) => (
                <li class="text-xs lg:text-sm font-medium items-center gap-2 list-item">
                  <span>{hint}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
