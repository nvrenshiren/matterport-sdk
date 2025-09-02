export const UnitTypeKey = {
  IMPERIAL: "imperial",
  METRIC: "metric"
}
export function getUnitType(lang: string) {
  return lang.match(/us|mm|lr$/i) ? UnitTypeKey.IMPERIAL : UnitTypeKey.METRIC
}
