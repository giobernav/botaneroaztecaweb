export const formatNumber = (
  amount: number,
  numberStyle:
    | keyof Intl.NumberFormatOptionsStyleRegistry
    | undefined = "currency"
) => {
  return new Intl.NumberFormat("es-ES", {
    style: numberStyle,
    currency: "EUR",
  }).format(amount);
};
