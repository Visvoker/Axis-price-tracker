export function formatPriceToUnit(value: string | number) {
  const num = Number(value);
  if (!num) return "";

  const yi = Math.floor(num / 100000000);
  const wan = Math.floor((num % 100000000) / 10000);
  const rest = num % 10000;

  let result = "";

  if (yi > 0) result += `${yi}億 `;
  if (wan > 0) result += `${wan}萬 `;
  if (rest > 0) result += `${rest} `;

  return result || "0";
}
