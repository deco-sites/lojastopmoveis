import { AppContext } from "site/app-tags/mod.ts";
import {
  FlagDiscountThirdForProps,
  Flags,
  FlagSpecialProps,
} from "../app-tags/utils/types.ts";


export interface Tags {
  flagDiscountThirdFor?: FlagDiscountThirdForProps[];
  flagCustom?: Flags[];
  flagSpecial?: FlagSpecialProps[];
  discount?: boolean;
}

const loader = async (
  _props: unknown,
  _req: Request,
  ctx: AppContext,
): Promise<Tags | null> => {
  try {
    const tags = await ctx.invoke["app-tags"].loaders.tags(); 

    return tags;
  } catch (_error) {
    return null;
  }
};

export default loader;
