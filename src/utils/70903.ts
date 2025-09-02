import { PanoSize } from "../const/76609"
import { SweepObject } from "../object/sweep.object"

export interface ObjectDescriptor<T = any> {
  object: T
  inUse: boolean
  extra?: {
    size?: PanoSize
    sweep?: SweepObject
    sweepindex?: number
  }
}
export class UsePool<T = any> {
  comparer: (e: ObjectDescriptor<T>, t?) => boolean
  poolArray: Array<ObjectDescriptor<T>>
  constructor(e?: (e: ObjectDescriptor<T>, t) => boolean) {
    this.comparer = e || this.defaultComparer
    this.poolArray = []
  }
  add(e: T) {
    const t = this.createObjectDescriptor(e)
    t.object = e
    t.inUse = !0
    this.addObjectDescriptorToPool(t)
    return t
  }
  get(e?) {
    for (const t of this.poolArray) if (!t.inUse && this.comparer(t, e)) return (t.inUse = !0), t
    return null
  }
  free(e: T) {
    for (const t of this.poolArray) if (t.object === e) return (t.inUse = !1), !0
    return !1
  }
  all() {
    return this.poolArray
  }
  remove(e: T) {
    const t = this.poolArray.findIndex(t => t.object === e)
    return -1 !== t && (this.poolArray.splice(t, 1), !0)
  }
  defaultComparer(e, t) {
    return !0
  }
  createObjectDescriptor(e: T) {
    return { object: e, inUse: !1 } as ObjectDescriptor<T>
  }
  addObjectDescriptorToPool(e: ObjectDescriptor<T>) {
    this.poolArray.push(e)
  }
}
