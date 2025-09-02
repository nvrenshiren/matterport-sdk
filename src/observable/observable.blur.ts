import { BlurStatus } from "../const/66310"
import { ObservableObject } from "./observable.object"
import { randomString } from "../utils/func.utils"
export class Blur extends ObservableObject {
  dots: any[]
  status: BlurStatus
  floorId: null
  roomId: null
  visible: boolean
  created: Date
  modified: Date
  id: string
  index: number
  static editableStatus = [BlurStatus.FAILED, BlurStatus.PENDING]
  constructor(e) {
    super()
    this.dots = []
    this.status = BlurStatus.PENDING
    this.floorId = null
    this.roomId = null
    this.visible = !0
    this.created = new Date()
    this.modified = new Date()
    this.id = randomString(11)
    this.index = -1
    e && Object.assign(this, e)
  }
  get editable() {
    return Blur.editableStatus.includes(this.status)
  }
  add(e, t, s, i) {
    let n = this.dots.find(e => e.radius === t && e.feather === s && e.strength === i)
    n ||= { radius: t, feather: s, strength: i, directions: [] }
    this.dots.push(n)
    n.directions.push(e)
    this.modified.setTime(Date.now())
    this.commit()
  }
  static from(e) {
    return new Blur({ status: BlurStatus.PENDING, dots: e.dots, sweepId: e.sweepId, floorId: e.floorId || null })
  }
  get dotCount() {
    return this.dots.reduce((e, t) => e + t.directions.length, 0)
  }
  get sid() {
    return this.id
  }
}
