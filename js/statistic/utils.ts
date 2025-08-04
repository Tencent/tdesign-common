export function getFormatValue(value:number | undefined | string, decimalPlaces:number, separator:string) {
  const options = {
    minimumFractionDigits: decimalPlaces ?? 0,
    maximumFractionDigits: decimalPlaces ?? 20,
    useGrouping: !!separator,
  };
  // replace的替换的方案仅能应对大部分地区
  return value.toLocaleString(undefined, options).replace(/,|，/g, separator);
}
