export enum MeasurePhase {
  ALIGNED = "aligned",
  CLOSED = 0,
  CONFIRMING_POINT = 6,
  CREATING = 3,
  CREATING_NEXT_POINT = 5,
  EDITING = 2,
  IDLE = 1,
  POINT_PLACED = 4,
  UNALIGNED = "unaligned"
}

const s = {
  mobile: {
    [MeasurePhase.POINT_PLACED]: !0,
    [MeasurePhase.EDITING]: !0
  },
  desktop: {
    [MeasurePhase.CREATING]: !0,
    [MeasurePhase.CREATING_NEXT_POINT]: !0,
    [MeasurePhase.EDITING]: !0
  }
}
export const LabelVisible = {
  mobile: {
    [MeasurePhase.CREATING_NEXT_POINT]: !0,
    [MeasurePhase.POINT_PLACED]: !0,
    [MeasurePhase.EDITING]: !0
  },
  desktop: {
    [MeasurePhase.CREATING]: !0,
    [MeasurePhase.CREATING_NEXT_POINT]: !0,
    [MeasurePhase.EDITING]: !0
  }
}
const a = {
  [MeasurePhase.IDLE]: !0,
  [MeasurePhase.EDITING]: !0
}
const o = {
  [MeasurePhase.IDLE]: !0,
  [MeasurePhase.EDITING]: !0
}

export const Pj = s
export const WN = o

export const q8 = a
