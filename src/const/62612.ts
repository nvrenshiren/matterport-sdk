export enum PinType {
  MATTERTAG = "mattertag",
  NOTE = "note",
  OBJECT = "object"
}
export enum PinColorVariant {
  DEFAULT = "default",
  HIGHLIGHTED = "highlighted",
  DIMMED = "dimmed"
}
export const PinPreviewDirectionType = {
  UP: "up",
  UP_LEFT: "up-left",
  UP_RIGHT: "up-right",
  DOWN: "down",
  DOWN_LEFT: "down-left",
  DOWN_RIGHT: "down-right",
  LEFT: "left",
  RIGHT: "right"
}
export enum IconType {
  mattertag = "sdk",
  note = "sdk",
  object = "sdk"
}
export enum PinEditorState {
  IDLE = "idle",
  CREATING = "creating",
  PRESSING = "pressing",
  PLACING = "placing",
  PLACED = "placed"
}
