import Icon, { AvailableIcons } from "$store/components/ui/Icon.tsx";
import Slider from "$store/components/ui/Slider.tsx";
import SliderJS from "$store/islands/SliderJS.tsx";
import Image from "deco-sites/std/components/Image.tsx";
import type { Image as LiveImage } from "deco-sites/std/components/types.ts";
import { useUI } from "deco-sites/boilerplaten1v2/sdk/useUI.ts";
import CloseButton from "$store/islands/CloseButton.tsx";

import { useId } from "preact/hooks";

export interface Props {
  /**
   * @description Alerts available in the top nav bar
   */
  alerts: Alerts[];

  /**
   * @title Autoplay interval
   * @description time (in seconds) to start the carousel autoplay
   */
  interval?: number;
}

type IconId = "" | AvailableIcons;

export interface Alerts {
  textAlert: string;
  /** @format color */
  textColor: string;
  href?: string;
  image?: LiveImage;
  alt?: string;
  /** @default */
  idIcon?: IconId;
}

function TipItem(alert: Alerts) {
  return (
    <span>
      {alert.image
        ? (
          <Image
            src={alert.image}
            alt={alert.alt}
            width={18}
            height={18}
          />
        )
        : (
          alert.idIcon && (
            <Icon
              id={alert.idIcon}
              width={18}
              height={18}
              strokeWidth={2}
              stroke="#fff"
            />
          )
        )}
    </span>
  );
}

function TopNavBar({ alerts = [], interval = 5 }: Props) {
  const id = useId();
  const { displayTopBar } = useUI();

  return (
    <div class={displayTopBar.value ? "flex" : "hidden"}>
      <div id={id} class="overflow-hidden">
        <Slider class="carousel carousel-center gap-6 h-full scrollbar-none lg:hidden">
          {alerts.map((alert, index) => (
            <Slider.Item index={index} class="carousel-item">
              <div class="flex justify-center items-center w-screen">
                <TipItem {...alert} />
                {alert.href
                  ? (
                    <a href={alert.href} class="text-underline">
                      <span
                        class="text-[10px] h-[25px] flex items-center ml-3 lg:text-xs"
                        style={{ color: alert.textColor }}
                      >
                        {alert.textAlert}
                      </span>
                    </a>
                  )
                  : (
                    <span
                      class="text-[10px] h-[25px] flex items-center ml-3 lg:text-xs"
                      style={{ color: alert.textColor }}
                    >
                      {alert.textAlert}
                    </span>
                  )}
              </div>
            </Slider.Item>
          ))}
        </Slider>

        <SliderJS rootId={id} interval={interval && interval * 1e3} />
      </div>

      <div class="h-[34px] max-lg:hidden w-full">
        <div class="flex justify-center items-center gap-28">
          {alerts.map((alert, index) => (
            <>
              <div class="flex items-center">
                <TipItem {...alert} />
                {alert.href
                  ? (
                    <a href={alert.href} class="text-underline">
                      <span
                        class="text-sm h-[34px] flex items-center ml-3"
                        style={{ color: alert.textColor }}
                      >
                        {alert.textAlert}
                      </span>
                    </a>
                  )
                  : (
                    <span
                      class="text-sm h-[34px] flex items-center ml-3"
                      style={{ color: alert.textColor }}
                    >
                      {alert.textAlert}
                    </span>
                  )}
              </div>
              {index < alerts.length - 1 && (
                <div class="border border-r-[#2D386E] h-3">
                </div>
              )}
            </>
          ))}
        </div>
      </div>

      <CloseButton
        classes={"absolute max-lg:w-4 max-lg:h-4 right-5 top-[7px]"}
        size={20}
        onClickBtn={() => displayTopBar.value = false}
      />
    </div>
  );
}

export default TopNavBar;
