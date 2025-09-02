import { ObservableObject } from "../observable/observable.object"
import { Vector3 } from "three"
const o = 30,
  a = 1
export class LabelObject extends ObservableObject {
  position: Vector3
  floorId: string
  sid: string
  layerId: string
  text: string
  visible: boolean
  roomId?: string
  created: Date
  modified: Date
  version: string
  constructor() {
    super()
    this.position = new Vector3()
    this.floorId = ""
    this.sid = ""
    this.layerId = ""
    this.text = ""
    this.visible = !1
    this.roomId = void 0
    this.created = new Date()
    this.modified = new Date()
    this.version = "3.1"
  }
  copy(t: LabelObject) {
    this.floorId = t.floorId
    this.roomId = t.roomId
    this.sid = t.sid
    this.text = t.text
    this.visible = t.visible
    this.roomId = t.roomId
    this.created = t.created
    this.modified = t.modified
    this.position.copy(t.position)
    this.version = t.version
    this.commit()
    return this
  }
}

export const ZF = o

export const yx = a
