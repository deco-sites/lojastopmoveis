import Icon from "$store/components/ui/Icon.tsx";

export type TextAlign = "Left" | "Center" | "Right" | "Justify";

export const TEXT_ALIGMENT: Record<TextAlign, string> = {
  "Left": "text-left",
  "Center": "text-center",
  "Right": "text-right",
  "Justify": "text-justify",
};

export interface Props {
  title: string;
  /**
   * @title Description
   * @format html
   */
  html?: string;
  textAlign?: TextAlign;
}

export default function InfoCard(
  { html, title, textAlign }: Props,
) {
  const textAlignment = TEXT_ALIGMENT[textAlign ? textAlign : "Center"];

  return (
    <section
      class={`${textAlignment} p-8 lg:py-10 lg:px-[60px] flex flex-col lg:flex-row lg:gap-12 border rounded-3xl mb-12`}
    >
      <div class="hidden lg:flex items-center justify-center w-[155px]">
        <Icon id="LogoSeo" height={130} width={133} class="w-full" />
      </div>
      <div class="lg:hidden flex gap-5 items-center justify-between w-full mb-4">
        <Icon id="LogoSeo" height={80} width={82} />
        <h3 class="lg:hidden block text-[#4A4B51] flex-1 font-medium text-base">
          {title}
        </h3>
      </div>
      <div class="lg:pl-[60px] lg:border-l border-[#DEE0E8] w-full">
        <h3 class="hidden lg:block text-[#4A4B51] font-medium text-base mb-2">
          {title}
        </h3>
        {html
          ? (
            <div
              dangerouslySetInnerHTML={{ __html: html }}
              class="text-[#4A4B51] font-normal text-xs m-auto max-lg:text-justify"
            />
          )
          : null}
      </div>
    </section>
  );
}
