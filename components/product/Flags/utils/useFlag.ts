// deno-lint-ignore no-explicit-any
export const isFlag = (flag: any, additionalProperty?: any[]) => {
  const { dateFrom, dateTo, showFlag } = flag;

  if (!showFlag || !dateFrom || !dateTo) return false;

  const currentDate = new Date();
  const startDate = new Date(dateFrom);
  const endDate = new Date(dateTo);

  const isWithinDateRange = currentDate >= startDate && currentDate <= endDate;

  if (!isWithinDateRange) return false;

  return additionalProperty?.some((property) => {
    const option = flag.options.options;

    return (
      ("idCollection" in option &&
        property.propertyID === option.idCollection) ||
      ("categories" in option && property.propertyID === option.categories)
    );
  }) ?? false;
};
