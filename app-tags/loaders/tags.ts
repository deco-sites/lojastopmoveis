import { AppContext } from "../mod.ts";

/**
 * @title This name will appear on the admin
 */
const loader = async (
  _props: unknown,
  _req: Request,
  ctx: AppContext,
) => {
   
  const flagCustom = await ctx.flagCustom;

  const result = {
   flagCustom: flagCustom
  };

  return result;
};
export default loader;
