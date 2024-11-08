import { Color, ImageWidget } from "apps/admin/widgets.ts";

/**
 * @format dynamic-options
 * @options vtex/loaders/options/productIdByTerm.ts
 * @description Equivalente ao ID do SKU na plataforma VTEX
 */
export type ProductID = string;

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
  | "inferior"
  | "topo"; 


  type optionBorderRadius =
  | "completo"        // Todas as bordas arredondadas
  | "nenhum"          // Nenhuma borda arredondada
  | "superior"        // Apenas borda superior arredondada
  | "inferior"        // Apenas borda inferior arredondada
  | "lateral esquerda" // Apenas borda lateral esquerda arredondada
  | "lateral direita"  // Apenas borda lateral direita arredondada
  | "superior esquerda" // Apenas o canto superior esquerdo arredondado
  | "superior direita"  // Apenas o canto superior direito arredondado
  | "inferior esquerda" // Apenas o canto inferior esquerdo arredondado
  | "inferior direita"  // Apenas o canto inferior direito arredondado
  | "superiores"       // Ambos os cantos superiores arredondados
  | "inferiores"       // Ambos os cantos inferiores arredondados
  | "ladosEsquerda"    // Ambos os cantos à esquerda arredondados
  | "ladosDireita";    // Ambos os cantos à direita arredondados

export interface Category {
  id: number;
  name: string;
  hasChildren: boolean;
  url: string;
  children: Category[];
}

export interface OrganizedCategory {
  value: string;
  label: string;
}

export interface PropsCategory {
  accountName: string;
}

/** @title Categoria */
export interface OptionCategory {
  /**
   * @pattern \d*
   * @format dynamic-options
   * @options app-tags/loaders/getCategoryTree.ts
   * @title Categoria
   */
  categories?: string;
}

/** @title Coleção */
export interface OptionCollectionId {
  /**
   * @pattern \d*
   * @format dynamic-options
   * @options app-tags/loaders/collections/list.ts
   * @title Coleção
   */
  idCollection?: string;
}

/** @title Edição de Flag */
export interface FormatFlagCustom {
  /** @title Nome da flag personalizada */
  name: string;

  /** @title Cor do texto da flag personalizada */
  textColor?: Color;

  /** @title Cor de fundo da flag personalizada */
  backgroundColor?: Color;

  /** @title Ícone */
  icon?: ImageWidget;

  /** @title Posição do ícone */
  /** @description Direita ou Esquerda */
  iconPosition?: "Direita" | "Esquerda";
}

/** @title Imagem */
export interface FormatFlagImage {
  /** @title Imagem da flag */
  image?: ImageWidget;

  /** @title Posição da flag */
  flagPosition?: flagPosition;
}

export interface OptionsFlagCustom {
  /** @title Formato da flag: personalizada ou com imagem */
  optionsFormat: FormatFlagCustom | FormatFlagImage;
}

export interface Options {
  /** @title Opções */
  options: OptionCategory | OptionCollectionId;
}

/** @title {{{name}}} */
export interface FlagSpecialProps {
  /** @title Opções de Categoria ou Coleção */
  options: Options;

  /** @title Nome da flag especial */
  name: string;

  /** @title Formato da Flag */
  formatFlag: OptionsFlagCustom;

  /** @title Data de Início */
  /** @format date */
  dateFrom?: string;

  /** @title Data de Fim */
  /** @format date */
  dateTo?: string;

  /** @title Ativar a Flag Personalizada */
  showFlag: boolean;
}

/**@title Edição de Flag */
export interface FlagEdit {
  /** @title Ícone */
  /** @description ícone é opcional */
  icon?: ImageWidget;
  
  /** @title Flag Preenchida */
  /** @description Marque essa opção se a flag for preenchida ou deixa desmarcada caso for tamanho automático */
  isFull?: boolean; 

  /** @title Curvatura da borda  */
  optionBorderRadius?: optionBorderRadius;

  /** @title Texto Lado Direito */
  /** @description ex: de graça */
  textRight: string;

  /** @title Cor do Texto Lado Direito */
  /** @description ex: #FFF */
  textRightColor: Color;

  /** @title Cor de Fundo Lado Direito */
  /** @description ex: #D50202 */
  textRightBackgroundColor: Color;

  /** @title Texto Lado Esquerdo */
  /** @description Este lado é opcional ex: 3ª peça por */
  textLeft?: string;

  /** @title Cor do Texto Lado Esquerdo */
  /** @description ex: #FFF */
  textLeftColor: Color;

  /** @title Cor de Fundo Lado Esquerdo */
  /** @description ex: #720303 */
  textLeftBackgroundColor: Color;

  /** @title Posição da flag */
  flagPosition?: flagPosition;
}

export interface FlagFormatCustom {
  /** @title Formato da flag: personalizada ou com imagem */
  optionsFormat: FlagEdit | FormatFlagImage;
}

/** @title {{{name}}} */
export interface Flags {
  /** @title Opções de Categoria ou Coleção */
  options: Options;

  /** @title Nome da Flag */
  /** @description ex: Flag aniversário */
  name: string;

  /** @title Formato da Flag */
  formatFlag: FlagFormatCustom;

  /** @title Data de Início */
  /** @format date */
  dateFrom?: string;

  /** @title Data de Fim */
  /** @format date */
  dateTo?: string;

  /** @title Ativar a Flag Personalizada */
  showFlag: boolean;
}

/** @title {{{name}}} */
export interface FlagCollectionCustomProps {
  /**
   * @pattern \d*
   * @format dynamic-options
   * @options app-tags/loaders/collections/list.ts
   */
  idCollection: string;

  /** @title Nome da Flag */
  /** @description ex: Flag aniversário */
  name: string;

  /** @title Texto Lado Direito */
  /** @description ex: de graça */
  textRight: string;

  /** @title Cor do Texto Lado Direito */
  /** @description ex: #FFF */
  textRightColor: Color;

  /** @title Cor de Fundo Lado Direito */
  /** @description ex: #D50202 */
  textRightBackgroundColor: Color;

  /** @title Texto Lado Esquerdo */
  /** @description Este lado é opcional ex: 3ª peça por */
  textLeft?: string;

  /** @title Cor do Texto Lado Esquerdo */
  /** @description ex: #FFF */
  textLeftColor: Color;

  /** @title Cor de Fundo Lado Esquerdo */
  /** @description ex: #720303 */
  textLeftBackgroundColor: Color;

  /** @title Posição da flag */
  flagPosition?: flagPosition;

  /** @hide true */
  type?: "ProductDetails" | "ProductShelf";
}

/** @title {{{name}}} */
export interface FlagDiscountThirdForProps {
  /** @title Opções de Categoria ou Coleção */
  options: Options;

  /** @title Nome da Flag */
  /** @description ex: Flag aniversário */
  name: string;

  /** @title Data de Início */
  /** @format date */
  dateFrom?: string;

  /** @title Data de Fim */
  /** @format date */
  dateTo?: string;

  /** @title Valor da Porcentagem */
  /** @description ex: 70 */
  discountPercentage: number;

  /** @title Cor de Fundo do Preço */
  /** @description ex: #585857 */
  priceBackgroundColor: Color;

  /** @title Cor do Preço */
  /** @description ex: #FFF */
  priceColor: Color;

  /** @title Texto */
  /** @description ex: 3ª peça por */
  text: string;

  /** @title Cor de Fundo do Texto */
  /** @description ex: #8D8D8D */
  textBackgroundColor: Color;

  /** @title Cor do Texto */
  /** @description ex: #FFF */
  textColor: Color;

  /** @title Posição da flag */
  flagPosition?: flagPosition;

  /** @title Ativar a Flag Desconto na Terceira Compra */
  showFlag: boolean;
}

export interface Collection {
  id: number;
  name: "Live influencers";
  searchable: boolean;
  highlight: boolean;
  dateFrom: string;
  dateTo: string;
  totalSku: number;
  totalProducts: number;
  type: "Manual" | "Automatic" | "Hybrid";
  lastModifiedBy?: string;
}

export interface CollectionList {
  paging: {
    page: number;
    perPage: number;
    total: number;
    pages: number;
    limit: number;
  };
  items?: Collection[];
}
