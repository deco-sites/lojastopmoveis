// deno-lint-ignore-file no-explicit-any
import type { App, FnContext } from "@deco/deco";
import { fetchSafe } from "apps/utils/fetch.ts";
import { createHttpClient } from "apps/utils/http.ts";
import { PreviewContainer } from "apps/utils/preview.tsx";
import { Secret } from "apps/website/loaders/secret.ts";
import manifest, { Manifest } from "./manifest.gen.ts";
import { OpenAPI as VCS } from "./utils/openapi/vcs.openapi.gen.ts";
import { Flags } from "./utils/types.ts";

export type AppContext = FnContext<State, Manifest>;


export interface Props {
  /**
   * @title Account Name
   * @description ex: lojaN1
   */
  account: string;

  /**
   * @title X-VTEX-API-AppKey
   * @description Unique identifier of the application key.
   * @format string
   */
  appKey: Secret;

  /**
  * @title X-VTEX-API-AppToken
  * @description Secret token of the application key.
  * @format string
  */

  appToken: Secret

  /**@title Flags Personalizada */
  flagCustom?: Flags[];

}

// Here we define the state of the app
// You choose what to put in the state
export interface State extends Omit<Props, "token"> {
  api: ReturnType<typeof createHttpClient<VCS>>;
}

/**
 * @title App Template
 * @description This is an template of an app to be used as a reference.
 * @category Tools
 * @logo https://
 */
export default function App(props: Props): App<Manifest, State> {
  const { appKey, appToken, account: _account } = props;

   // Check if appKey and appToken are strings or have a get method
   const stringAppKey = typeof appKey === "string" ? appKey : (appKey as any)?.get?.() ?? "";
   const stringAppToken = typeof appToken === "string" ? appToken : (appToken as any)?.get?.() ?? "";
 
   const api = createHttpClient<VCS>({
     base: `https://${_account}.vtexcommercestable.com.br`,
     fetcher: fetchSafe,
     headers: new Headers({
       "Accept": "application/json",
       "Content-Type": "application/json",
       "X-VTEX-API-AppKey": stringAppKey,
       "X-VTEX-API-AppToken": stringAppToken,
     }),
   });
   
  const state = { ...props, api };

  return {
    state,
    manifest,
  };
}

// It is important to use the same name as the default export of the app
export const preview = () => {
  return {
    Component: PreviewContainer,
    props: {
      name: "App Tags",
      owner: "Agência N1",
      description: "This is an template of an app to be used as a reference.",
      logo:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1/0ac02239-61e6-4289-8a36-e78c0975bcc8",
      images: [],
      tabs: [],
    },
  };
};
