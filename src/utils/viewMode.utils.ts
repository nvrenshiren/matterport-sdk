import { ConversionViewsModeError } from "../error/viewmodes.error"
export enum ViewModes {
  Panorama = 1,
  Dollhouse = 2,
  Floorplan = 3,
  Outdoor = 4,
  Orthographic = 5,
  Mesh = 6,
  Transition = -1
}
export const getViewModesString = (e: ViewModes) => {
  switch (e) {
    case ViewModes.Panorama:
      return "Panorama"
    case ViewModes.Floorplan:
      return "Floorplan"
    case ViewModes.Dollhouse:
      return "Dollhouse"
    case ViewModes.Transition:
      return "Transition"
    case ViewModes.Orthographic:
      return "Orthographic"
    case ViewModes.Mesh:
      return "Mesh"
  }
  return "Unknown"
}
export function ConversionViewsMode(e: ViewModes) {
  switch (e) {
    case ViewModes.Panorama:
      return 0
    case ViewModes.Floorplan:
      return 1
    case ViewModes.Dollhouse:
      return 2
    case ViewModes.Transition:
      return 3
  }
  throw new ConversionViewsModeError("No known conversion for Viewmode to Workshop int", e)
}
export function PanoramaOrMesh(e?: ViewModes | null) {
  return e === ViewModes.Panorama || e === ViewModes.Mesh
}
export function isPanorama(e: ViewModes) {
  return e === ViewModes.Panorama
}
