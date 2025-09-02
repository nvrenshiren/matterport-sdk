import { ConstraintMode } from "../math/83402"
const n = 0.01,
  o = 0.001,
  a = !0,
  r = { highResThreshold: 1081, desktopSize: 192, desktopSizeHighRes: 320, mobileSize: 128 },
  h = {
    smoothness: 0.4,
    perspective: { fov: 40, thresholdClose: 1, thresholdFar: 8, offsetClose: 0.25, offsetFar: 0.5, scale: 1 },
    ortho: { fov: 5, thresholdClose: 5, thresholdFar: 20, offsetClose: 15, offsetFar: 30, scale: 4 }
  },
  d = {
    desktop: ConstraintMode.Edges,
    floorplan: ConstraintMode.Axes,
    mobile: ConstraintMode.Edges,
    alt: ConstraintMode.Free,
    shift: ConstraintMode.PlanarAxes,
    shiftAlt: ConstraintMode.EdgesAndPlanarAxes,
    disabled: ConstraintMode.Free
  },
  l = { mobile: 0.15, desktop: 0.1 },
  c = { SCALE: 0.1, SCALE_NDC: 0.5, SCALE_ASPECT: 0.035, SCALE_DISTANCE: 0.025 }
export const MeasurementsKey = "measurements",
  p = 24

export const E0 = a
export const Hn = c
export const NZ = o
export const Nz = p
export const Oq = l

export const X7 = h
export const ox = r
export const xh = d
export const yV = n
