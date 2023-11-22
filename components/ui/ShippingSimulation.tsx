import { Signal, useSignal } from "@preact/signals";
import { useCallback } from "preact/hooks";
import Button from "$store/components/ui/Button.tsx";
import { formatPrice } from "$store/sdk/format.ts";
import { useCart } from "deco-sites/std/packs/vtex/hooks/useCart.ts";
import type {
  SimulationOrderForm,
  SKU,
  Sla,
} from "deco-sites/std/packs/vtex/types.ts";

export interface Props {
  items: Array<SKU>;
}

const formatShippingEstimate = (estimate: string) => {
  const [, time, type] = estimate.split(/(\d+)/);

  if (type === "bd") return `${time} dias úteis`;
  if (type === "d") return `${time} dias`;
  if (type === "h") return `${time} horas`;
};

function ShippingContent({ simulation }: {
  simulation: Signal<SimulationOrderForm | null>;
}) {
  const { cart } = useCart();

  const methods = simulation.value?.logisticsInfo?.reduce(
    (initial, { slas }) => [...initial, ...slas],
    [] as Sla[],
  ) ?? [];

  const locale = cart.value?.clientPreferencesData.locale || "pt-BR";
  const currencyCode = cart.value?.storePreferencesData.currencyCode || "BRL";

  if (simulation.value == null) {
    return null;
  }

  if (methods.length === 0) {
    return (
      <div class="p-2">
        <span>CEP inválido</span>
      </div>
    );
  }

  return (
    <ul class="flex flex-col text-sm rounded-[10px]">
      {methods.map((method) => (
        <li class="flex text-[#4A4B51] px-[10px] sm:px-[20px] py-[10px] odd:bg-[#F3F3F4] justify-between items-center rounded-[10px]">
          <span class="text-left font-medium break-words w-[35%] max-lg:w-[25%]">
            {method.name.includes("Retire")
              ? method.name.split("(")[0]
              : method.name}
          </span>
          <span class="text-button w-[35%] max-lg:w-[45%]">
            Em até {formatShippingEstimate(method.shippingEstimate)}
          </span>
          <span class="font-medium text-right w-[20%]">
            {method.price === 0 ? "Grátis" : (
              formatPrice(method.price / 100, currencyCode, locale)
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ShippingSimulation({ items }: Props) {
  const postalCode = useSignal("");
  const loading = useSignal(false);
  const simulateResult = useSignal<SimulationOrderForm | null>(null);
  const { simulate, cart } = useCart();

  const handleSimulation = useCallback(async () => {
    if (postalCode.value.length !== 8) {
      return;
    }

    try {
      loading.value = true;
      simulateResult.value = await simulate({
        items: items,
        postalCode: postalCode.value,
        country: cart.value?.storePreferencesData.countryCode || "BRA",
      });
    } finally {
      loading.value = false;
    }
  }, []);

  return (
    <div class="flex flex-col mt-[30px] gap-5 p-[20px] sm:p-[30px] rounded-2xl border border-base-200 text-base-300">
      <p class="text-justify text-primary font-medium">
        Calcular o frete
      </p>
      <div class="flex flex-col gap-[10px]">
        <form
          class="flex gap-2 max-lg:flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            handleSimulation();
          }}
        >
          <input
            as="input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            class="input input-bordered input-sm text-xs border focus:outline-none w-full max-w-[300px] !py-4 hover:border-base-300 focus:text-black focus:hover:border-base-200"
            placeholder="00000-000"
            value={postalCode.value}
            maxLength={8}
            onChange={(e: { currentTarget: { value: string } }) => {
              postalCode.value = e.currentTarget.value;
            }}
          />
          <div class="flex gap-[10px] items-center lg:justify-center w-full">
            <Button
              type="submit"
              loading={loading.value}
              class="btn-outline transition-all !border h-[2.25rem] px-[26px] text-xs tracking-[1px] font-bold"
            >
              Calcular
            </Button>
            <a
              href="https://buscacepinter.correios.com.br/app/endereco/index.php"
              class="uppercase text-primary text-xs hover:underline max-lg:underline transition-all duration-500 whitespace-nowrap"
              target="_blank"
            >
              Não sei meu CEP
            </a>
          </div>
        </form>
      </div>
      {simulateResult.value
        ? <ShippingContent simulation={simulateResult} />
        : null}
    </div>
  );
}

export default ShippingSimulation;
