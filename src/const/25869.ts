import { PickingPriorityType } from "./12529"

export const o = {
  BASE: PickingPriorityType.roomBounds,
  OPENING_STENCIL: PickingPriorityType.roomBounds + 1,
  EDGE_STENCIL: PickingPriorityType.roomBounds + 2,
  ROOM: PickingPriorityType.roomBounds + 3,
  EDGE: PickingPriorityType.roomBounds + 4,
  HIGHLIGHTED_EDGE: PickingPriorityType.roomBounds + 5,
  OPENING_LINES: PickingPriorityType.roomBounds + 6,
  NODE: PickingPriorityType.roomBounds + 7
}
export const $ = {
  OPENINGS: 0,
  EDGE: 1
}
