import { AlignmentType, PlacementType, SweepObject } from "../object/sweep.object"
import * as a from "../utils/sweep.utils"
import * as u from "../const/71161"
import { Data } from "../core/data"
import { ISubscription } from "../core/subscription"
import { ObservableMap } from "../observable/observable.map"
import { ObservableObject } from "../observable/observable.object"
import { ObservableValue } from "../observable/observable.value"
import { AnimationProgress } from "../webgl/animation.progress"
import { SweepsData } from "./sweeps.data"
import { isAlignedSweep, noAlignedSweep } from "../utils/sweep.utils"
interface derivedDataItem {
  id: SweepObject["id"]
  floorId: SweepObject["floorId"]
  position: SweepObject["position"]
  index: number
  alignmentType: AlignmentType
  dataIndex: number
  placed: boolean
  enabled: SweepObject["enabled"]
  name: SweepObject["name"]
}
export class SweepsViewState extends ObservableObject {
  selected: boolean
  visible: boolean
  animation: AnimationProgress
  constructor() {
    super()
    this.selected = !1
    this.visible = !0
    this.animation = new AnimationProgress(0)
  }
}
export class SweepsViewData extends Data {
  selectCurrentSweep: () => void
  data: SweepsData
  bindings: ISubscription[]
  states: ObservableMap<SweepsViewState>
  defaultSweepVisibilityRule: (e: SweepObject) => boolean
  sweepVisibilityRule: SweepsViewData["defaultSweepVisibilityRule"]
  derivedData: Record<string, derivedDataItem>
  toolStateObservable: ObservableValue<string>
  selectedSweepObservable: ObservableValue<null | string>
  constructor(e: SweepsData) {
    super()
    this.data = e
    this.name = "sweeps-view"
    this.states = new ObservableMap()
    this.defaultSweepVisibilityRule = e => e && e.enabled
    this.sweepVisibilityRule = this.defaultSweepVisibilityRule
    this.bindings = []
    this.selectCurrentSweep = () => {
      this.setSelectedSweep(this.data.currentSweep || null)
    }
    this.derivedData = {}
    this.toolStateObservable = new ObservableValue(u._.CLOSED)
    this.selectedSweepObservable = new ObservableValue(null)
    const t = [u._.MOVING, u._.PLACING, u._.PRESSING, u._.ROTATING]
    const n = (e, t) => {
      if (!this.states.has(t)) {
        const e = new SweepsViewState()
        e.commit()
        this.states.set(t, e)
      }
    }
    const i = e.getCollection()
    i.forEach((e, t) => n(0, t))
    this.bindings.push(
      i.onElementChanged({
        onAdded: n,
        onRemoved: (e, t) => {
          if (this.states.has(t!)) {
            const e = this.states.get(t!)
            e.selected = !1
            e.animation.stop(0)
            this.states.delete(t)
          }
        }
      }),
      e.onChanged(() => this.updateViewData()),
      e.makeSweepChangeSubscription(() => {
        t.includes(this.toolState) || this.selectCurrentSweep()
      })
    )
    this.updateViewData()
  }
  updateViewData() {
    this.data.iterate((e, t) => {
      this.derivedData[e.id] = this.makeViewDataForSweep(e, t)
    })
    this.commit()
  }
  updateSweepVisibilityRule(e?: SweepsViewData["defaultSweepVisibilityRule"]) {
    this.sweepVisibilityRule = e || this.defaultSweepVisibilityRule
  }
  getSweepVisibility(e: SweepObject) {
    return this.sweepVisibilityRule(e)
  }
  get selectedSweep() {
    return this.selectedSweepObservable.value
  }
  setSelectedSweep(e) {
    if (e === this.selectedSweep) return
    const t = this.selectedSweep
    if (((this.selectedSweepObservable.value = e), null !== e)) {
      const t = this.getState(e)
      t.selected = !0
      t.commit()
    }
    if (null !== t) {
      const e = this.getState(t)
      e && ((e.selected = !1), e.commit())
    }
  }
  onSelectedSweepChanged(e) {
    return this.selectedSweepObservable.onChanged(e)
  }
  setToolState(e) {
    e === u._.PLACING && this.selectedSweep && this.setSelectedSweep(null), (this.toolStateObservable.value = e)
  }
  get toolState() {
    return this.toolStateObservable.value
  }
  onToolStateChanged(e) {
    return this.toolStateObservable.onChanged(e)
  }
  getSweep(e: string) {
    return this.data.getSweep(e)
  }
  makeViewDataForSweep(e: SweepObject, t: number) {
    const n = this.derivedData[e.id]
    return n
      ? ((n.floorId = e.floorId),
        (n.position = e.position),
        (n.alignmentType = e.alignmentType),
        (n.placed = e.placementType === PlacementType.MANUAL),
        (n.enabled = e.enabled),
        (n.name = e.name),
        n)
      : {
          id: e.id,
          floorId: e.floorId,
          position: e.position,
          index: e.index,
          alignmentType: e.alignmentType,
          dataIndex: t,
          placed: e.placementType === PlacementType.MANUAL,
          enabled: e.enabled,
          name: e.name
        }
  }
  getViewData(e: string) {
    const t = this.data.getSweep(e),
      n = this.derivedData[e]
    return t && !n && (this.derivedData[e] = this.makeViewDataForSweep(t, t.index)), this.derivedData[e]
  }
  isSweepAligned(e: string) {
    return this.data.isSweepAligned(e)
  }
  getCollection() {
    return this.states
  }
  iterate(e: (e: SweepObject, n: SweepsViewState, v: derivedDataItem) => void) {
    this.states.entries().forEach(([t, n]) => {
      const i = this.data.getSweep(t)
      e(i, n, this.derivedData[t])
    })
  }
  getState(e: string) {
    return this.states.get(e)
  }
  isVisible(e: string) {
    const t = this.states.get(e)
    return (null == t ? void 0 : t.visible) || !1
  }
  setVisible(e: string, t: boolean) {
    const n = this.getState(e)
    n && n.visible !== t && ((n.visible = t), n.commit())
  }
  updateAnimations(e: number) {
    for (const t of this.states) t.animation.tick(e)
  }
  modifySelectAnimation(e, t, n) {
    const i = this.getState(e)
    if (!i) return
    const s = i.animation,
      r = 1 === s.endValue
    t !== r && (r ? s.modifyAnimation(s.value, 0, n) : s.modifyAnimation(0, 1, n))
  }
  getIndexByAlignment(e, t) {
    return this.getAlignedSweeps(e).findIndex(e => e.id === t)
  }
  getAlignedSweeps(e) {
    const t = Object.values(this.derivedData)
    return e ? t.filter(isAlignedSweep()) : t.filter(noAlignedSweep())
  }
}
