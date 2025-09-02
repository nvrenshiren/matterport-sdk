import * as r from "../utils/func.utils"

import * as l from "../const/66310"
import { Data } from "../core/data"
import { ObservableMap } from "../observable/observable.map"
import { ObservableValue } from "../observable/observable.value"
import { randomString } from "../utils/func.utils"
import { BlurStatus } from "../const/66310"

export class BlurData extends Data {
  blurs: ObservableMap
  _hasProcessing: ObservableValue<boolean>
  _hasUnapplied: ObservableValue<boolean>
  constructor(e) {
    super(),
      (this.name = "blur-data"),
      (this.blurs = new ObservableMap()),
      (this._hasProcessing = new ObservableValue(!1)),
      (this._hasUnapplied = new ObservableValue(!1)),
      e && this.add(...Object.values(e))
  }
  add(...e) {
    this.atomic(() => {
      this.blurs.atomic(() => {
        for (const t of e)
          t.atomic(() => {
            for (; !t.id || this.blurs.has(t.id); ) (t.id = randomString(11)), t.commit()
            if (-1 === t.index || this.hasIndex(t.index)) {
              const e = this.blurs.values.map(e => e.index).filter(e => "number" == typeof e),
                s = e.length ? Math.max(...e) : 0
              ;(t.index = s + 1), t.commit()
            }
          }),
            this.blurs.set(t.id, t)
      }),
        this.update(),
        this.commit()
    })
  }
  delete(...e) {
    return (
      this.atomic(() => {
        this.blurs.atomic(() => {
          e.filter(e => this.isEditable(e) && this.blurs.delete(e))
        }),
          this.update(),
          this.commit()
      }),
      e.length
    )
  }
  get(e) {
    return this.blurs.get(e)
  }
  getEditable() {
    return this.blurs.values.filter(e => e.editable)
  }
  getBySweepId(e, t = null) {
    return this.blurs.values.filter(s => s.sweepId === e && (null === t || s.visible === t))
  }
  getByStatus(...e) {
    return e.length ? this.blurs.values.filter(t => e.includes(t.status)) : this.blurs.values
  }
  batchToggleVisibility(e) {
    const t = e.some(e => {
      const t = this.blurs.get(e)
      return !!t && !t.visible
    })
    for (const s of e) {
      const e = this.blurs.get(s)
      e && ((e.visible = t), e.commit())
    }
  }
  has(e) {
    return this.blurs.has(e)
  }
  hasIndex(e) {
    return !!this.blurs.values.find(t => t.index === e)
  }
  hasStatus(e) {
    return this.blurs.values.some(t => t.status === e)
  }
  hasUnappliedBlurs() {
    return this.blurs.values.some(e => e.status === BlurStatus.PENDING || e.status === BlurStatus.FAILED)
  }
  hasAppliedBlurs() {
    return this.blurs.values.some(e => e.status === BlurStatus.PROCESSING || e.status === BlurStatus.APPLIED || e.status === BlurStatus.FAILED)
  }
  hasProcessingBlurs() {
    return this.hasStatus(BlurStatus.PROCESSING)
  }
  setVisibility(e, ...t) {
    this.atomic(() => {
      this.blurs.atomic(() => {
        for (const s of t)
          if (this.has(s)) {
            const t = this.blurs.get(s)
            ;(t.visible = e), t.modified.setTime(Date.now()), t.commit()
          }
      }),
        this.commit()
    })
  }
  setStatus(e, ...t) {
    this.atomic(() => {
      this.blurs.atomic(() => {
        for (const s of t)
          if (this.has(s)) {
            const t = this.blurs.get(s)
            ;(t.status = e), t.modified.setTime(Date.now()), t.commit()
          }
      }),
        this.update(),
        this.commit()
    })
  }
  isEditable(e) {
    if (!this.has(e)) return !1
    return this.get(e).editable
  }
  makeProcessingSubscription(e) {
    return this._hasProcessing.onChanged(e)
  }
  makeUnappliedSubscription(e) {
    return this._hasUnapplied.onChanged(e)
  }
  update() {
    let e = !1
    const t = this.hasProcessingBlurs()
    t !== this._hasProcessing.value && ((this._hasProcessing.value = t), (e = !0))
    const s = this.hasUnappliedBlurs()
    s !== this._hasUnapplied.value && ((this._hasUnapplied.value = s), (e = !0)), e && this.commit()
  }
  onChanged(e) {
    return super.onChanged(e)
  }
}
