import { Vector3 } from "three"

export enum RelativePosType {
  DOOR = "doorway",
  OPENING = "opening"
}
export class WallOpening {
  id: string
  wallId: string
  type: string
  relativePos: any
  width: number
  constructor(e, t, o, s, n) {
    this.id = e
    this.wallId = t
    this.type = o
    this.relativePos = s
    this.width = n
  }
  getEntityAnalytic() {
    return this.type
  }
  get floorId() {
    return ""
  }
  getViewCenter(e = new Vector3()) {
    return e.set(0, 0, 0)
  }
  getSnapshot() {
    const { type, relativePos, width } = this
    return { lowerElevation: 0, height: 0, type, relativePos, width }
  }
}
