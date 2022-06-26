export const formatStringCredits = (
  value: number,
  fallbackValue: string = "n/a",
  suffix: string = " credits"
) => {
  return value
    ? value.toString().replace(/\B(?=(?:\d{3})+\b)/g, ",") + suffix
    : fallbackValue;
};
