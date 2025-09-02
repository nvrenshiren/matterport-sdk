import { Vector3 } from "three"
import { AlignmentType, SweepObject } from "../object/sweep.object"
import { Data } from "../core/data"
import { ChangeObserver } from "../observable/observable"
import { ObservableArray } from "../observable/observable.array"
import { ObservableMap } from "../observable/observable.map"
import { AnimationProgress } from "../webgl/animation.progress"
export class SweepsData extends Data {
  transition: {
    progress: AnimationProgress
    active: boolean
    from?: string
    to?: string
  }
  transitionActive: boolean
  sweepList: ObservableArray<SweepObject>
  sweepMap: ObservableMap<SweepObject>
  currentSweep?: string
  constructor(e?: Record<string, SweepObject>) {
    super()
    this.name = "sweeps"
    this.transitionActive = !1
    this.sweepList = new ObservableArray()
    this.sweepMap = new ObservableMap()
    e && this.addSweeps(e)
    this.transition = {
      progress: new AnimationProgress(0),
      active: !1,
      from: void 0,
      to: void 0
    }
  }
  removeSweeps(e) {
    for (const t in e) this.sweepMap.delete(t), this.sweepList.remove(this.sweepList.findIndex(e => e.id === t))
    return this
  }
  addSweeps(e: Record<string, SweepObject>) {
    const t = Object.values(e).sort((e, t) => e.index - t.index)
    for (const e of t) this.sweepMap.set(e.id, e), this.sweepList.push(e)
    return this
  }
  refresh(e: SweepObject[]) {
    this.sweepMap.forEach((t, n) => {
      e[n] && t.refresh(e[n])
    })
  }
  canTransition() {
    return !this.transition.active
  }
  get currentSweepIndex() {
    if (this.currentSweep && this.sweepMap.has(this.currentSweep)) return this.getSweep(this.currentSweep).index
  }
  get currentSweepObject() {
    if (this.currentSweep && this.sweepMap.has(this.currentSweep)) return this.getSweep(this.currentSweep)
  }
  get currentAlignedSweepObject() {
    if (this.currentSweep && !this.isSweepUnaligned(this.currentSweep)) return this.getSweep(this.currentSweep)
  }
  makeSweepChangeSubscription(e: ChangeObserver<string>) {
    return this.onPropertyChanged("currentSweep", e)
  }
  getSweep(e: string) {
    return this.sweepMap.get(e)
  }
  getSweepByIndex(e: number) {
    return this.sweepList.find(t => t.index === e)
  }
  getSweepByUuid(e: string) {
    return this.sweepList.find(t => t.uuid === e)
  }
  containsSweep(e: string) {
    return this.sweepMap.has(e)
  }
  getFirstSweep() {
    let e = -1
    for (; ++e < this.sweepList.length; ) {
      const t = this.sweepList.get(e)
      if (t.enabled) return t
    }
  }
  getStartSweep(e) {
    const t = e && e.pano && e.pano.uuid ? this.getSweep(e.pano.uuid) : null
    return t && t.enabled ? t : this.getFirstSweep()
  }
  getClosestSweep(e: Vector3, t: boolean) {
    let n = Number.MAX_VALUE
    let s: SweepObject | null = null
    this.iterate(r => {
      if (r.enabled && (!t || r.alignmentType === AlignmentType.ALIGNED)) {
        const t = e.distanceTo(r.position)
        t < n && ((n = t), (s = r))
      }
    })
    return s as SweepObject | null
  }
  getFirstAlignedSweep() {
    let e = -1
    for (; ++e < this.sweepList.length; ) {
      const t = this.sweepList.get(e)
      if (t.enabled && t.alignmentType === AlignmentType.ALIGNED) return t
    }
    return null
  }
  getSweepIdMap(e: boolean) {
    const t: Record<string, string> = {}
    for (const n of this.sweepMap) e ? (t[n.uuid] = n.id) : (t[n.id] = n.uuid)
    return t
  }
  activateTransition(e, t) {
    this.transition.active = !0
    this.transition.from = t
    this.transition.to = e
    this.transitionActive = !0
  }
  deactivateTransition() {
    this.transition.active = !1
    this.transition.from = void 0
    this.transition.to = void 0
    this.transitionActive = !1
  }
  isSweepUnaligned(e?: string) {
    if (!e) return !1
    const t = this.getSweep(e)
    return t && !t.isAligned()
  }
  isSweepAligned(e?: string) {
    if (!e) return !1
    const t = this.getSweep(e)
    return t && t.isAligned()
  }
  isSweepDisabled(e = this.currentSweep) {
    if (!e) return !1
    const t = this.getSweep(e)
    return t && !t.enabled
  }
  *sweeps() {
    for (const e of this.sweepList) yield e
  }
  iterate(e: (e: SweepObject, i: number) => void) {
    this.sweepList.forEach((t, n) => {
      e(t, n)
    })
  }
  filter(e: (value: SweepObject, index: number, array: SweepObject[]) => boolean) {
    return this.sweepList.filter(e)
  }
  sortByScore(e: Array<(e: SweepObject) => boolean>, t: Array<(e: SweepObject) => number>, n?: SweepObject[]) {
    return (n || this.sweepList)
      .filter(t => e.every(e => e(t)))
      .map(e => ({
        sweep: e,
        score: t.reduce((t, n) => t + n(e), 0)
      }))
      .sort((e, t) => t.score - e.score)
  }
  getSweepList() {
    return this.sweepList.values()
  }
  getAlignedSweeps() {
    return this.getSweepList().filter(e => e.alignmentType === AlignmentType.ALIGNED)
  }
  onSweepsChanged(e: ChangeObserver<SweepObject>) {
    return this.sweepList.onChanged(e)
  }
  getSweepNeighbours(e: SweepObject) {
    const t: SweepObject[] = []
    for (const n of e.neighbours) {
      t.push(this.getSweep(n))
    }
    return t
  }
  getCollection() {
    return this.sweepMap
  }
  getConnectedSweeps(e: string, t) {
    const n: string[] = [e]
    const i = new Set<string>()
    for (t = t || (e => !0); n.length; ) {
      const e = n.pop()!
      const s = this.getSweep(e)
      i.add(e)
      for (const e of s.neighbours) {
        t(this.getSweep(e)) && !i.has(e) && n.push(e)
      }
    }
    return i
  }
}
