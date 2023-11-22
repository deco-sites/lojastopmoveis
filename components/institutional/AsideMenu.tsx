import type { SectionProps } from "$live/mod.ts";
import Icon from "$store/components/ui/Icon.tsx";

export interface Props {
  menuItems: {
    label: string;
    href: string;
  }[];
}

export function loader(ctx: Props, req: Request) {
  const url = new URL(req.url);
  const { pathname } = url;

  return {
    ...ctx,
    pathname,
  };
}

function AsideMenu(
  { menuItems, pathname: currentUrl }: SectionProps<typeof loader>,
) {
  const currentRoute = menuItems.find((item) => item.href === currentUrl);

  return (
    <aside class="md:min-w-[20%] font-medium text-secondary-focus flex md:justify-end">
      <ul
        class={`md:join join-vertical gap-[10px] w-full ${
          currentUrl === "/i" ? "" : "hidden"
        }`}
      >
        {menuItems.map(
          (item, index) => (
            <li key={index}>
              <a
                class={`
                  ${
                  currentUrl === item.href ||
                    (!currentRoute && item.label === "Saiba Mais" &&
                      currentUrl.includes("/i/"))
                    ? "bg-primary text-white hover:bg-primary"
                    : "hover:bg-white hover:border hover:border-opacity-100"
                }
                  btn btn-ghost btn-block justify-between text-primary border-opacity-0 border-base-300
                `}
                href={item.href}
              >
                {item.label}
                <Icon id="ChevronRight" size={20} />
              </a>
            </li>
          ),
        )}
      </ul>
    </aside>
  );
}

export default AsideMenu;
