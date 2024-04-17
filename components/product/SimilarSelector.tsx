import type { Product } from "apps/commerce/types.ts";
import { useVariantPossibilities } from "$store/sdk/useVariantPossiblities.ts";

interface Props {
  product: Product;
}

function SimilarSelector({ product, product: { isSimilarTo } }: Props) {
const possibilities = useVariantPossibilities(product);
  console.log(["product", product])
  const productImage = product.image || []
  return (
    <ul class="flex flex-col gap-5">
        {Object.keys(possibilities).map((name) => (
        <li class="flex flex-col gap-[10px]">
          <div class="flex gap-[5px]">
            <span class="text-xs text-[#4A4B51] font-normal">Cor:</span>
            {Object.entries(possibilities[name]).map((
              [value],
            ) => (
              <span class="text-xs text-[#4A4B51] font-bold">{value}</span>
            ))}
          </div>
          <ul class="flex flex-row flex-wrap gap-[10px]">
            <li>
                <div class="border-2 rounded-[5px] border-[#ED2A24]">
                    <img class="w-[60px] h-[60px]" src={productImage[0].url}/>
                </div>
            </li>
            {isSimilarTo?.map((similarProduct) => {
                const image = similarProduct.image || []
                return (
                <li class="border-2 rounded-[5px] border-[#4A4B51]">
                    <a href={similarProduct.url}>
                        <img class="w-[60px] h-[60px]" src={image[0].url || ""}/>
                    </a>
                </li>
                )
            })}  
          </ul>
        </li>
        ))}
    </ul>
  );
}

export default SimilarSelector;