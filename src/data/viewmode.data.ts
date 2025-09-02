import { Data } from "../core/data"
import { ObservableValue, createObservableValue } from "../observable/observable.value"
import { PanoramaOrMesh, ViewModes } from "../utils/viewMode.utils"
export class ViewmodeData extends Data {
  name: string
  transitionActiveObservable: ObservableValue<boolean>
  viewmodeChangeEnabled: boolean
  isDollhouseDisabled: () => boolean
  isFloorplanDisabled: () => boolean
  currentModeObservable: ObservableValue<ViewModes | null>
  transition: { active: boolean; progress: number; from: ViewModes | null; to: ViewModes | null; startTime: number; transitionTime: number }
  constructor() {
    super()
    this.name = "viewmode"
    this.transitionActiveObservable = createObservableValue(!1)
    this.viewmodeChangeEnabled = !0
    this.isDollhouseDisabled = () => !1
    this.isFloorplanDisabled = () => !1
    this.currentModeObservable = createObservableValue(null)
    this.transition = {
      active: !1,
      progress: 0,
      from: null,
      to: null,
      startTime: 0,
      transitionTime: 0
    }
    this.isPano = this.isPano.bind(this)
    this.isFloorplan = this.isFloorplan.bind(this)
    this.isInside = this.isInside.bind(this)
    this.isDollhouse = this.isDollhouse.bind(this)
    this.isOrthographic = this.isOrthographic.bind(this)
  }
  get currentMode() {
    return this.currentModeObservable.value
  }
  set currentMode(e) {
    e !== this.currentModeObservable.value && (this.currentModeObservable.value = e)
  }
  get closestMode() {
    return this.currentMode === ViewModes.Transition ? (this.transition.progress < 0.5 ? this.transition.from : this.transition.to) : this.currentMode
  }
  makeModeChangeSubscription(e) {
    return this.currentModeObservable.onChanged(e)
  }
  activateTransition(e, t, n) {
    this.transition.active = !0
    this.transition.progress = 0
    this.transition.startTime = Date.now()
    this.transition.transitionTime = n
    this.transition.to = t
    this.transition.from = e
    this.transitionActiveObservable.value = !0
  }
  deactivateTransition() {
    this.transition.active = !1
    this.transitionActiveObservable.value = !1
  }
  isPano() {
    return this.currentMode === ViewModes.Panorama
  }
  isInside() {
    return PanoramaOrMesh(this.currentMode!)
  }
  isMesh() {
    return this.currentMode === ViewModes.Mesh
  }
  isFloorplan() {
    return this.currentMode === ViewModes.Floorplan
  }
  isDollhouse() {
    return this.currentMode === ViewModes.Dollhouse
  }
  isOrthographic() {
    return this.currentMode === ViewModes.Orthographic
  }
  canStartTransition() {
    const e = this.transition.active,
      t = this.currentMode === ViewModes.Transition
    return !e && !t
  }
  transitionActive() {
    return !this.canStartTransition()
  }
  isTargetMode(e) {
    const t = this.transition.from === this.transition.to,
      n = this.currentMode === e
    return (this.transition.active && t) || n
  }
  canSwitchViewMode(e) {
    return this.canStartTransition() && this.viewmodeChangeEnabled && !this.isTargetMode(e)
  }
}
