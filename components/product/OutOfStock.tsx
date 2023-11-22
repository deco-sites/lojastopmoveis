import { useSignal } from "@preact/signals";
import { Runtime } from "$store/runtime.ts";
import type { Product } from "deco-sites/std/commerce/types.ts";
import type { JSX } from "preact";
import Button from "$store/components/ui/Button.tsx";

interface Props {
  productID: Product["productID"];
}

const notifyme = Runtime.create("deco-sites/std/actions/vtex/notifyme.ts");

function Notify({ productID }: Props) {
  const loading = useSignal(false);

  const handleSubmit: JSX.GenericEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      loading.value = true;

      const name = (e.currentTarget.elements.namedItem("name") as RadioNodeList)
        ?.value;
      const email =
        (e.currentTarget.elements.namedItem("email") as RadioNodeList)?.value;

      await notifyme({ skuId: productID, name, email });
    } finally {
      loading.value = false;
    }
  };

  return (
    <form
      class="flex flex-col py-5 px-[30px] gap-5 border border-base-200 rounded-[20px]"
      onSubmit={handleSubmit}
    >
      <div class="flex flex-col gap-1">
        <span class="text-xl text-primary uppercase">
          Produto indisponível
        </span>
        <span class="text-[#707279]">
          Para ser avisado da disponibilidade deste produto, basta preencher os
          campos abaixo:
        </span>
      </div>

      <div class="flex flex-row gap-[10px]">
        <input
          placeholder="Nome"
          class="input input-bordered w-full border-2 focus:outline-none text-xs !py-3 !px-5"
          name="name"
        />
        <input
          placeholder="Email"
          class="input input-bordered w-full border-2 focus:outline-none text-xs !py-3 !px-5"
          name="email"
        />
      </div>

      <Button
        type="submit"
        class="btn-secondary font-bold text-xs tracking-[1px] py-3 px-[26px] disabled:loading w-fit"
        disabled={loading}
      >
        Avise-me
      </Button>
    </form>
  );
}

export default Notify;
