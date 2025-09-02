export enum PanoSize {
  BASE = 512,
  HIGH = 2048,
  STANDARD = 1024,
  ULTRAHIGH = 4096
}

export enum PanoSizeKey {
  BASE = "base",
  STANDARD = "standard",
  HIGH = "high",
  ULTRAHIGH = "ultrahigh"
}
export const PanoSizeWithKey = {
  [PanoSizeKey.BASE]: PanoSize.BASE,
  [PanoSizeKey.HIGH]: PanoSize.HIGH,
  [PanoSizeKey.STANDARD]: PanoSize.STANDARD,
  [PanoSizeKey.ULTRAHIGH]: PanoSize.ULTRAHIGH
}
export const PanoSizeClass = {
  [PanoSize.BASE]: PanoSizeKey.BASE,
  [PanoSize.HIGH]: PanoSizeKey.HIGH,
  [PanoSize.STANDARD]: PanoSizeKey.STANDARD,
  [PanoSize.ULTRAHIGH]: PanoSizeKey.ULTRAHIGH
}
export const PanoSizeAspect = 16 / 9
