import { TourAddPosition, TourState } from "../const/tour.const"
import { TransitionType } from "../const/transition.const"
import { tourModeType } from "../const/typeString.const"
import { Data } from "../core/data"
import { DebugInfo } from "../core/debug"
import { SweepObject } from "../object/sweep.object"

import { HighlightReel } from "../modules/toursData.module"
import { SnapshotObject } from "../object/snapshot.object"
import { ObservableArray, createObservableArray } from "../observable/observable.array"
import { ObservableValue, createObservableValue } from "../observable/observable.value"
import { ViewModes } from "../utils/viewMode.utils"
export const TransitionObservable = {
  active: !1,
  type: TransitionType.Move,
  promise: Promise.resolve(),
  stop: () => Promise.resolve(),
  toIndex: -1,
  duration: 0,
  started: -1,
  stopped: -1
}
export class TourData extends Data {
  snapshots: Record<string, SnapshotObject>
  activeReel: HighlightReel
  allowedModes: ViewModes[]
  modelSweeps: SweepObject[]
  looping: boolean
  log: DebugInfo
  name: string
  tourState: TourState
  transitionObservable: ObservableValue<typeof TransitionObservable>
  tourCurrentSnapshot: number
  enabledTourStops: ObservableArray<string>
  tourPlaying: boolean
  tourWillResume: boolean
  tourEnded: boolean
  updateEnabledStops: (e: ViewModes[]) => void
  tourCurrentSnapshotSid?: string
  constructor(e = {}, t: HighlightReel, n: ViewModes[], i: SweepObject[], s: boolean, l: DebugInfo) {
    super()
    this.snapshots = e
    this.activeReel = t
    this.allowedModes = n
    this.modelSweeps = i
    this.looping = s
    this.log = l
    this.name = "tour"
    this.tourState = TourState.Inactive
    this.transitionObservable = createObservableValue(TransitionObservable)
    this.tourCurrentSnapshot = -1
    this.enabledTourStops = createObservableArray([])
    this.tourPlaying = !1
    this.tourWillResume = !1
    this.tourEnded = !1
    this.updateEnabledStops = e => {
      this.enabledTourStops.replace([])
      if (this.activeReel && this.activeReel.reel) {
        for (const t of this.activeReel.reel) {
          if (t && t.sid in this.snapshots) {
            const n = this.snapshots[t.sid]
            const i = n.metadata.cameraMode
            const s = n.metadata.scanId
            const r = -1 !== e.indexOf(i)
            const a = this.modelSweeps.findIndex(e => e.id === s)
            const o = void 0 !== s && -1 !== a && this.modelSweeps[a].enabled
            const l = !s
            r && (l || o) && this.enabledTourStops.push(t.sid)
          }
        }
      }
    }
    this.updateEnabledStops(n)
    this.looping = s
    this.commit()
  }
  setHighlightReel(e: HighlightReel) {
    this.atomic(() => {
      this.activeReel.replace(e)
      this.updateEnabledStops(this.allowedModes)
      this.resetEmptyReel()
    })
    const t = Object.keys(this.getReel()).length
    const n = this.getSnapshotCount()
    t !== n && this.log.info(t - n + " items in snapshots, but not in reel")
  }
  addSnapshotToTour(e: SnapshotObject, t = TourAddPosition.Current) {
    this.snapshots[e.sid] = e
    this.allowedModes.includes(e.metadata.cameraMode) && this.enabledTourStops.push(e.sid)
    const n = this.tourCurrentSnapshotSid
    this.tourCurrentSnapshotSid = e.sid
    switch (t) {
      case TourAddPosition.Beginning:
        this.tourCurrentSnapshot = 0
        this.activeReel.reel.insert(0, {
          sid: e.sid
        })
        break
      case TourAddPosition.End:
        this.tourCurrentSnapshot = this.enabledTourStops.length - 1
        this.activeReel.reel.push({
          sid: e.sid
        })
        break
      case TourAddPosition.Current:
        if (void 0 === n) {
          this.tourCurrentSnapshot = this.enabledTourStops.length - 1
          this.activeReel.reel.push({
            sid: e.sid
          })
        } else {
          let t = this.activeReel.reel.findIndex(e => !!e && e.sid === n) + 1
          ;(t <= 0 || t > this.activeReel.reel.length) && (t = this.activeReel.reel.length - 1)
          this.tourCurrentSnapshot = this.tourCurrentSnapshot + 1
          this.activeReel.reel.insert(t, {
            sid: e.sid
          })
        }
        break
      default:
        throw new Error(`Tours.addSnapshotToTour not implemented: ${t}`)
    }
    this.useTransition(TransitionObservable)
    this.commit()
  }
  clearHighlightOverrides(e: string, t: boolean, n: boolean) {
    if (!t && !n) return
    const i: { transitionType?: any; panDirection?: any; panAngle?: any } = {}
    t && (i.transitionType = void 0)
    n && ((i.panDirection = void 0), (i.panAngle = void 0))
    this.applyHighlightOverrides(e, i)
  }
  clearAllHighlightOverrides() {
    this.getReel().reel.forEach(e => {
      e && this.clearHighlightOverrides(e.sid, !0, !0)
    })
  }
  resetAllTransitionTypeOverrides() {
    if (this.activeReel && this.activeReel.reel) {
      let e = !1
      this.activeReel.reel.forEach((t, n) => {
        t && t.overrides && t.overrides.transitionType && (delete t.overrides.transitionType, this.activeReel.reel.update(n, t), (e = !0))
      }),
        e && this.activeReel.setDirty()
    }
  }
  resetAllPanSettingOverrides() {
    if (this.activeReel && this.activeReel.reel) {
      let e = !1
      this.activeReel.reel.forEach((t, n) => {
        t &&
          t.overrides &&
          ((void 0 === t.overrides.panAngle && void 0 === t.overrides.panDirection) ||
            (delete t.overrides.panAngle, delete t.overrides.panDirection, (e = !0), this.activeReel.reel.update(n, t)))
      }),
        e && this.activeReel.setDirty()
    }
  }
  applyHighlightOverrides(e: string, t) {
    const n = this.activeReel.reel.findIndex(t => !!t && t.sid === e)
    this.setHighlightOverrides(n, t)
  }
  setHighlightOverrides(e: number, t) {
    const n = this.activeReel.reel.get(e)
    if (!n) throw Error(`Highlight not found for ${e}`)
    const i: any = {
      sid: n.sid,
      title: n.title,
      description: n.description
    }
    n.overrides
      ? ((i.overrides = Object.assign({}, n.overrides)),
        t.hasOwnProperty("panDirection") && (i.overrides.panDirection = t.panDirection),
        t.hasOwnProperty("transitionType") && (i.overrides.transitionType = t.transitionType),
        t.hasOwnProperty("panAngle") && (i.overrides.panAngle = t.panAngle))
      : (i.overrides = {
          transitionType: t.transitionType,
          panDirection: t.panDirection,
          panAngle: t.panAngle
        }),
      this.activeReel.reel.update(e, i)
  }
  updateReelEntry(e) {
    const { sid: t } = e,
      n = this.activeReel.reel.findIndex(e => !!e && e.sid === t)
    if (-1 === n) throw Error(`Reel entry not found for ${t}`)
    const i = this.activeReel.reel.get(n)
    if (!e) throw Error(`Reel entry not found for ${n}`)
    const s = Object.assign({}, i, e)
    this.activeReel.reel.update(n, s)
  }
  moveTourStop(e, t) {
    const n = this.activeReel.reel.findIndex(t => !!t && t.sid === e),
      i = this.activeReel.reel.findIndex(e => !!e && e.sid === t)
    this.activeReel.reel.move(n, i)
  }
  clear() {
    this.resetEmptyReel()
    this.enabledTourStops.replace([])
    this.activeReel.reel.length = 0
    this.commit()
  }
  removeTourStop(e) {
    const t = this.enabledTourStops.indexOf(e),
      n = this.activeReel.reel.findIndex(t => !!t && t.sid === e),
      i = this.getTourIndexBySid(e)
    if ((-1 !== t && this.enabledTourStops.splice(t, 1), this.enabledTourStops.length > 0)) {
      const e = i <= this.tourCurrentSnapshot ? this.tourCurrentSnapshot - 1 : this.tourCurrentSnapshot
      this.setTourCurrentSnapshotByIndex(Math.max(e, 0))
    } else this.resetEmptyReel()
    this.activeReel.reel.remove(n)
  }
  getReel() {
    return this.activeReel
  }
  isLooping() {
    return this.looping
  }
  setLooping(e: boolean) {
    this.looping = e
  }
  getActiveReelTourMode() {
    return this.activeReel.mode || tourModeType.REEL
  }
  setActiveReelTourMode(e) {
    this.activeReel.mode = e
    this.activeReel.commit()
  }
  isTourActive() {
    return this.tourState !== TourState.Inactive
  }
  getCurrentTourState() {
    return {
      currentStep: this.getTourCurrentSnapshotIndex(),
      tourPlaying: this.tourPlaying || this.tourWillResume,
      totalSteps: this.getSnapshotCount(),
      tourEnded: this.tourEnded,
      activeStep: this.transition && -1 !== this.transition.toIndex ? this.transition.toIndex : this.getTourCurrentSnapshotIndex(),
      highlights: this.getReelHighlights(),
      transition: this.transition
    }
  }
  get transition() {
    return this.transitionObservable.value
  }
  isTourTransitionActive() {
    return this.transition.active
  }
  getTourTransitionType() {
    return this.transition.type
  }
  useTransition(e: typeof TransitionObservable) {
    this.transitionObservable.value = e
  }
  async stopTourTransition() {
    await this.transition.stop()
  }
  iterateSnapshots(e) {
    let t = 0
    this.activeReel.reel.forEach(n => {
      if (n && this.isEnabled(n.sid)) {
        const i = this.snapshots[n.sid]
        e(i, t++)
      }
    })
  }
  isSnapshotInTour(e) {
    return -1 !== this.activeReel.reel.findIndex(t => !!t && t.sid === e)
  }
  getEnabledSnapshots() {
    const e: SnapshotObject[] = []
    this.iterateSnapshots((t: SnapshotObject, n: number) => {
      e.push(t)
    })
    return e
  }
  updateSnapshots(e: Record<string, SnapshotObject>) {
    this.snapshots = e
  }
  async getPhotosForTour() {
    const e: Array<{ name: string; sid: string; thumbnailUrl: string; inReel: boolean; created: Date }> = []
    for (const t in this.snapshots) {
      const n = this.snapshots[t]
      "tour" !== n.category &&
        "panorama" !== n.category &&
        e.push({
          name: n.name,
          sid: n.sid,
          thumbnailUrl: await n.thumbnailUrl.get(),
          inReel: this.isSnapshotInTour(t),
          created: n.created
        })
    }
    e.sort((e, t) => t.created.getTime() - e.created.getTime())
    return e
  }
  getSnapshot(e: string) {
    return this.snapshots[e]
  }
  getTourStop(e: string) {
    const t = this.activeReel.reel.findIndex(t => !!t && t.sid === e),
      n = this.activeReel.reel.get(t)
    return {
      snapshot: this.getSnapshot(e),
      reelEntry: n
    }
  }
  getReelHighlights() {
    const e: Array<{
      id: string
      snapshot: SnapshotObject
      panDirection?: number
      panAngle?: number
      transitionType?: TransitionType
      title?: string
      description?: string
      snapshotPanDuration?: number
      playName?: any
      pathAudio?: any
      backOpen?: any
      closePrev?: any
    }> = []
    this.activeReel.reel.forEach(t => {
      if (t && this.isEnabled(t.sid)) {
        const n = this.snapshots[t.sid]
        if (n) {
          const { playName, pathAudio, backOpen, closePrev } = t
          const i = t.overrides && t.overrides.panDirection
          const panAngle = t.overrides && t.overrides.panAngle
          const snapshotPanDuration = t.overrides && t.overrides.snapshotPanDuration
          e.push({
            id: n.sid,
            snapshot: n,
            panDirection: i,
            panAngle,
            snapshotPanDuration,
            transitionType: t.overrides && t.overrides.transitionType,
            title: t.title,
            description: t.description,
            playName,
            pathAudio,
            backOpen,
            closePrev
          })
        }
      }
    })
    return e
  }
  getSnapshotCount() {
    return this.enabledTourStops.length
  }
  getTourState() {
    return this.tourState
  }
  setTourState(e: TourState) {
    this.tourState = e
    this.commit()
  }
  getTourCurrentSnapshotIndex() {
    return this.tourCurrentSnapshot
  }
  getTourCurrentSnapshotSid() {
    return this.tourCurrentSnapshotSid
  }
  getTourSnapshotSid(e: number) {
    let t = 0
    for (const n of this.activeReel.reel)
      if (n && this.isEnabled(n.sid)) {
        if (t === e) return n.sid
        t++
      }
    throw new Error("getTourSnapshotSid() -> Invalid snapshot index.")
  }
  getTourSnapshotsWithSweepId(e) {
    const t: string[] = []
    for (const n of this.activeReel.reel) n && n.sid in this.snapshots && this.snapshots[n.sid].metadata.scanId === e && t.push(n.sid)
    return t
  }
  setTourCurrentSnapshotByIndex(e: number) {
    if (e < 0 || e > this.getSnapshotCount()) throw new Error("setTourCurrentSnapshotByIndex() -> Invalid tour index.")
    let t = -1
    for (const n of this.activeReel.reel)
      if (n && this.isEnabled(n.sid) && (t++, t === e)) {
        this.tourCurrentSnapshot = e
        this.tourCurrentSnapshotSid = n.sid
        break
      }
    ;-1 === t && this.resetEmptyReel(), this.commit()
  }
  getTourIndexBySid(e) {
    let t = -1
    for (const n of this.activeReel.reel) if (n && this.isEnabled(n.sid) && (t++, n.sid === e)) return t
    return -1
  }
  isEnabled(e) {
    return -1 !== this.enabledTourStops.indexOf(e)
  }
  resetEmptyReel() {
    this.tourCurrentSnapshot = -1
    this.tourCurrentSnapshotSid = void 0
    this.useTransition(TransitionObservable)
    this.commit()
  }
}
