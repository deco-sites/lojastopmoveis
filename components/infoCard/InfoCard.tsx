import type { SocialIcons } from "$store/components/ui/Icon.tsx";
import Icon from "$store/components/ui/Icon.tsx";

export type TextAlign = "Left" | "Center" | "Right" | "Justify";

export const TEXT_ALIGMENT: Record<TextAlign, string> = {
  "Left": "text-left",
  "Center": "text-center",
  "Right": "text-right",
  "Justify": "text-justify",
};

export interface Links {
  label: string;
  href: string;
  icon: SocialIcons;
}

export interface Props {
  title: string;
  caption?: string;
  /**
   * @title Description
   * @format rich-text
   */
  html?: string;
  textAlign?: TextAlign;
  links?: Links[];
}

export default function InfoCard(
  { html, caption, title, textAlign, links }: Props,
) {
  const textAlignment = TEXT_ALIGMENT[textAlign ? textAlign : "Center"];

  return (
    <section class={`${textAlignment} pt-8`}>
      <h6 class="text-emphasis font-bold text-xs uppercase">{caption}</h6>
      <h3 class="text-primary font-normal text-2xl mb-5">{title}</h3>
      {links?.length
        ? (
          <ul class="flex gap-4 items-center justify-center">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  class="btn btn-secondary md:gap-2 md:px-8 px-[16px] uppercase"
                  target="_blank"
                >
                  <Icon id={link.icon} size={18} strokeWidth={1} />
                  <span class="block max-[330px]:text-xs font-medium">
                    {link.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )
        : null}
      {html
        ? (
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            class="text-neutral font-normal text-sm max-w-5xl m-auto pb-12"
          />
        )
        : null}
    </section>
  );
}
