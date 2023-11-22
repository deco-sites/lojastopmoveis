import { Head } from "$fresh/runtime.ts";
import { Section } from "$live/blocks/section.ts";
import type { BlockInstance } from "$live/engine/block.ts";
import type { Manifest } from "deco-sites/boilerplaten1v2/live.gen.ts";
import Icon from "$store/components/ui/Icon.tsx";

export interface Props {
  title: string;
  asideMenu: Section;
  content:
    | BlockInstance<
      "deco-sites/boilerplaten1v2/sections/Institutional/TextContent.tsx",
      Manifest
    >
    | BlockInstance<
      "deco-sites/boilerplaten1v2/sections/Institutional/AccordionsContent.tsx",
      Manifest
    >
    | BlockInstance<
      "deco-sites/boilerplaten1v2/sections/Institutional/CardsContent.tsx",
      Manifest
    >
    | BlockInstance<
      "deco-sites/boilerplaten1v2/sections/Institutional/ContactForm.tsx",
      Manifest
    >;
}

function InstitutionalPage({
  asideMenu: { Component: AsideComponent, props: asideProps },
  content: { Component: ContentComponent, props: contentProps },
  title,
}: Props) {
  return (
    <>
      <Head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .markdown-body h2 {
              font-size: 20px;
              font-weight: 700;
              line-height: 1.4;
              margin: 20px 0;
            }
            .markdown-body h3 {
              font-size: 18px;
              font-weight: 700;
              line-height: 1.4;
              margin: 20px 0;
            }
            .markdown-body p:empty {
              display: none;
            }
            .markdown-body p:last-child {
              margin-bottom: 20px;
            }
            .markdown-body p, .markdown-body li {
              color: #8E8E9F;
              font-size: 14px;
              font-weight: 400;
              line-height: 20px;
              list-style: circle inside !important;
            }
            .markdown-body a {
              text-decoration: underline;
            }
            .markdown-body td {
              border: 1px solid #8E8E9F;
            }
          `,
          }}
        />
      </Head>
      <div>
        {/* Banner Institucional | Suporte */}
      </div>
      <div class="flex flex-col md:flex-row justify-between mt-[15px]">
        <AsideComponent {...asideProps} />
        <article class="md:pl-[30px] w-full">
          <h3 class="max-md:flex max-md:justify-between text-primary text-[19px] lg:text-[28px] font-normal lg:font-medium leading-[130%] lg:leading-[36.4px] mb-5 border-b border-neutral-100 pb-[10px]">
            {title}
            <a
              href="/i"
              class="md:hidden w-[50%] text-xs font-bold flex items-center justify-end"
            >
              <Icon id="ChevronLeft" size={20} /> voltar
            </a>
          </h3>
          {/* @ts-ignore opting for a ignore here so we can use a union type for the content section prop, and display it nicely in the admin panel */}
          <ContentComponent {...contentProps} />
        </article>
      </div>
    </>
  );
}

export default InstitutionalPage;
