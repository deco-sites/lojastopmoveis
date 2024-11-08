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

type optionBorderRadius =
  | "completo" // Todas as bordas arredondadas
  | "nenhum" // Nenhuma borda arredondada
  | "superior" // Apenas borda superior arredondada
  | "inferior" // Apenas borda inferior arredondada
  | "lateral esquerda" // Apenas borda lateral esquerda arredondada
  | "lateral direita" // Apenas borda lateral direita arredondada
  | "superior esquerda" // Apenas o canto superior esquerdo arredondado
  | "superior direita" // Apenas o canto superior direito arredondado
  | "inferior esquerda" // Apenas o canto inferior esquerdo arredondado
  | "inferior direita" // Apenas o canto inferior direito arredondado
  | "superiores" // Ambos os cantos superiores arredondados
  | "inferiores" // Ambos os cantos inferiores arredondados
  | "ladosEsquerda" // Ambos os cantos à esquerda arredondados
  | "ladosDireita"; // Ambos os cantos à direita arredondados

export interface FlagCustomProps {
  /** @title Ícone */
  /** @description ícone é opcional */
  icon?: ImageWidget;

  isFull?: boolean;

  optionBorderRadius?: optionBorderRadius;

  idCollection?: string;

  textRight: string;

  textRightColor: Color;

  textRightBackgroundColor: Color;

  textLeft?: string;

  textLeftColor: Color;

  textLeftBackgroundColor?: Color;

  showFlagCustom: boolean;

  flagPosition: flagPosition;

  image?: string;
}

export interface Props {
  formatFlag: FlagCustomProps;
  type?: "ProductDetails" | "ProductShelf";
}

const classesBorderRadius: Record<optionBorderRadius, string> = {
  "completo": "rounded-lg", // Todas as bordas arredondadas
  "nenhum": "rounded-none", // Nenhuma borda arredondada
  "superior": "rounded-t-none rounded-lg", // Apenas borda superior arredondada
  "inferior": "rounded-b-none rounded-lg", // Apenas borda inferior arredondada
  "lateral esquerda": "rounded-l-none rounded-lg", // Apenas borda lateral esquerda arredondada
  "lateral direita": "rounded-r-none rounded-lg", // Apenas borda lateral direita arredondada
  "superior esquerda": "rounded-tl-none rounded-lg", // Apenas o canto superior esquerdo arredondado
  "superior direita": "rounded-tr-none rounded-lg", // Apenas o canto superior direito arredondado
  "inferior esquerda": "rounded-bl-none rounded-lg", // Apenas o canto inferior esquerdo arredondado
  "inferior direita": "rounded-br-none rounded-lg", // Apenas o canto inferior direito arredondado
  "superiores": "rounded-tl-none rounded-tr-none rounded-lg", // Ambos os cantos superiores arredondados
  "inferiores": "rounded-bl-none rounded-br-none rounded-lg", // Ambos os cantos inferiores arredondados
  "ladosEsquerda": "rounded-tl-none rounded-bl-none rounded-lg", // Ambos os cantos à esquerda arredondados
  "ladosDireita": "rounded-tr-none rounded-br-none rounded-lg", // Ambos os cantos à direita arredondados
};

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
  "inferior": "bottom-0 left-1/2 transform -translate-x-1/2",
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
      optionBorderRadius,
      image,
      isFull,
    },
    type,
  }: Props,
) {
  const isVertical = flagPosition === "direita" || flagPosition === "esquerda";
  const isProducttDetails = type === "ProductDetails";
  const containerClasses = ` ${type === "ProductDetails" ?  "justify-start " : "absolute justify-center"} ${ !isProducttDetails &&
    positionClasses[flagPosition]
  } ${
    isVertical
      ? "w-auto h-full"
      : isFull
      ? "w-full h-8"
      : (textLeft ? "w-full h-8" : "w-auto h-8")
  } flex items-center z-20`;

  if (image) {
    return (
      <div className={`${containerClasses}`}>
        <Image
          src={image}
          width={137}
          height={25}
          alt="Flag"
          fetchPriority="auto"
        />
      </div>
    );
  }

  return (
    <div className={`${containerClasses}`}>
      <div
        className={`flex ${icon && "gap-1"} ${
          isVertical ? "flex-col h-full origin-center " : "flex-row h-full"
        } text-[9px] ${
          !textLeft && !isProducttDetails
            ? `${
              optionBorderRadius && classesBorderRadius[optionBorderRadius]
            } px-2`
            : ``
        } ${
          type === "ProductDetails" ? "w-auto rounded-bl-none rounded-lg " : " w-full"
        } items-center justify-center`}
        style={{
          background: textLeftBackgroundColor ?? "#0b354a",
          color: textLeftColor ?? "#fff",
          borderColor: optionBorderRadius && textLeftBackgroundColor,
        }}
      >
        {icon && (
          <Image src={icon} width={13} height={13} alt={`icon ${name}`} />
        )}

        {textLeft && (
          <p
            className={` uppercase ${
              type === "ProductDetails" ? "text-xs p-4" : "text-xs"
            } text-center font-medium font-roboto flex items-center justify-center gap-1 overflow-hidden ${
              textLeft && "w-1/2 h-full"
            }`}
            style={{
              writingMode: isVertical && !isProducttDetails ? "vertical-rl" : "horizontal-tb",
              textOrientation: isVertical && !isProducttDetails? "upright" : "mixed",
            }}
          >
            {textLeft && textLeft}
          </p>
        )}

        <span
          className={`text-xs font-bold  flex items-center justify-center font-roboto ${isProducttDetails && textLeft ? 'p-4' : 'px-2'} ${
            textLeft && "w-1/2 h-full"
          }`}
          style={{
            background: textRightBackgroundColor ?? "#0274bb",
            color: textRightColor ?? "#fff",
            writingMode: isVertical && !isProducttDetails ?"vertical-rl" : "horizontal-tb",
            textOrientation: isVertical && !!isProducttDetails  ? "upright" : "mixed",
          }}
        >
          {textRight}
        </span>
      </div>
    </div>
  );
}
