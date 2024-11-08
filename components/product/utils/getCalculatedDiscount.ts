export default function getCalculatedDiscount(
  price: number,
  discountPercentage: number,
): string {
  const calculatedDiscount = price - (price * discountPercentage) / 100;
  return calculatedDiscount.toFixed(2).replace(".", ",");
}
