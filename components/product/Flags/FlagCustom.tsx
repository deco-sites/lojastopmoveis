import { Color, ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

export type flagPosition =
  | "topo esquerda"
  | "topo centro"
  | "topo-direita"
  | "inferior esquerda"
  | "inferior centro"
  | "inferior direita"
  | "centro"
  | "direita"
  | "esquerda"
  | "topo"
  | "inferior";

export interface FlagCustomProps {
  /** @title Ícone */
  /** @description ícone é opcional */
  icon?: ImageWidget;

  isFull?: boolean;

  idCollection?: string;

  textRight: string;

  textRightColor: Color;

  textRightBackgroundColor: Color;

  textLeft?: string;

  textLeftColor: Color;

  textLeftBackgroundColor?: Color;

  showFlagCustom: boolean;

  type?: "ProductDetails" | "ProductShelf";

  flagPosition: flagPosition;

  image?: string;
}

export interface Props {
  formatFlag: FlagCustomProps;
  type?: "ProductDetails" | "ProductShelf";
}


const positionClasses: Record<flagPosition, string> = {
  "topo esquerda": "top-0 left-0",
  "topo centro": "top-0 left-1/2 transform -translate-x-1/2",
  "topo-direita": "top-0 right-0",
  "inferior esquerda": "bottom-0 left-0",
  "inferior centro": "bottom-0 left-1/2 transform -translate-x-1/2",
  "inferior direita": "bottom-0 right-0",
  "centro": "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
  "direita": "top-0 right-0 h-full flex items-center justify-center",
  "esquerda": "top-0 left-0 h-full flex items-center justify-center",
  "topo": "top-0 left-1/2 transform -translate-x-1/2",
  "inferior": "bottom-0 left-1/2 transform -translate-x-1/2"
};



export default function FlagCustom(
  {
    formatFlag: {
      icon,
      textLeftBackgroundColor = "#720303",
      textLeftColor = "#FFF",
      textRightBackgroundColor = "#720303",
      textRightColor = "#FFF",
      textRight = "SUPER OFERTA",
      textLeft,
      flagPosition,
      image,
      type,
      isFull,
    },
  }: Props,
) {
  console.log("preenchido", isFull)

  const isVertical = flagPosition === "direita" || flagPosition === "esquerda";
  const containerClasses = `absolute ${positionClasses[flagPosition]} ${isVertical
      ? "w-auto h-full"
      : isFull ? "w-full h-8" : (textLeft ? "w-full h-8" : "w-auto h-8")} flex items-center justify-center z-20`;


  return (
    <div className={`${containerClasses}`}>
      <div
        className={`flex ${icon && 'gap-1'} ${isVertical ? "flex-col h-full origin-center" : "flex-row h-full"
          } text-[9px] ${!textLeft ? "px-2" : ""} w-full items-center justify-center`}
        style={{
          background: textLeftBackgroundColor ?? "#0b354a",
          color: textLeftColor ?? "#fff",
        }}
      >
        {icon && <Image src={icon} width={13} height={13} alt={`icon ${name}`} />}

        {textLeft && (
          <p
            className={` uppercase ${type === "ProductDetails"
              ? "text-xs"
              : "text-xs"
              } text-center font-medium font-roboto flex items-center justify-center gap-1 overflow-hidden ${textLeft && 'w-1/2 h-full'}`}
            style={{
              writingMode: isVertical ? "vertical-rl" : "horizontal-tb",
              textOrientation: isVertical ? "upright" : "mixed",
            }}
          >
            {textLeft && textLeft}
          </p>
        )}

        <span
          className={`text-xs font-bold  mt-1 flex items-center justify-center font-roboto ${textLeft && 'w-1/2 h-full'}`}
          style={{
            background: textRightBackgroundColor ?? "#0274bb",
            color: textRightColor ?? "#fff",
            writingMode: isVertical ? "vertical-rl" : "horizontal-tb",
            textOrientation: isVertical ? "upright" : "mixed",
          }}
        >
          {textRight}
        </span>
      </div>
    </div>
  );
}
