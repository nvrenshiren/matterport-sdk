import { functionCommon } from "@ruler3d/common"
import { QuaternionToJson, Vector3ToJson } from "../other/59296"
import { AnalyticsSymbol, DwellAnalyticsSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { AppData, AppStatus } from "../data/app.data"
import { CameraData } from "../data/camera.data"
import { ViewmodeData } from "../data/viewmode.data"
import { VisionParase } from "../math/2569"
import * as l from "../utils/80361"
import { toISOString } from "../utils/date.utils"
import { ViewModes, getViewModesString } from "../utils/viewMode.utils"
declare global {
  interface SymbolModule {
    [DwellAnalyticsSymbol]: DwellAnalyticsModule
  }
}
function m(t) {
  const e = QuaternionToJson(VisionParase.toVisionQuaternion(t.rotation))
  return {
    position: Vector3ToJson(VisionParase.toVisionVector(t.position)),
    rotation: e,
    aspect: t.aspect(),
    isOrtho: t.isOrtho(),
    fovX: t.fovX(),
    fovY: t.fovY()
  }
}
function g(t) {
  return toISOString(new Date(t))
}
export default class DwellAnalyticsModule extends Module {
  constructor() {
    super(...arguments),
      (this.name = "dwell-analytics"),
      (this.pendingDwellEvents = []),
      (this.onCameraChange = functionCommon.debounce(t => {
        this.checkForDwellEvent(), t.clone(this.currentEvent.pose), (this.currentEvent.startTimeMs = Date.now()), this.scheduleDwellTimeOutEvent()
      }, 1e3)),
      (this.checkForDwellEvent = (t = !1) => {
        const { startTimeMs: e, viewmode: i } = this.currentEvent
        if (!e || this.appData.phase !== AppStatus.PLAYING) return
        const s = Date.now(),
          n = s - e,
          o = { pose: m(this.currentEvent.pose), durationMs: n, startTime: g(e), endTime: g(s), timedOut: t, viewmode: i }
        this.trackDwellEvent(o)
      }),
      (this.onViewmodeUpdate = t => {
        t.value !== ViewModes.Transition && (this.currentEvent.viewmode = getViewModesString(t.value))
      }),
      (this.trackDwellEvent = t => {
        this.pendingDwellEvents.push(t), this.trackPendingDwellEvents()
      }),
      (this.trackPendingDwellEvents = functionCommon.debounce(() => {
        const t = { events: JSON.stringify(this.pendingDwellEvents) }
        this.pendingDwellEvents = []
        // this.analytics.track("dwell_events", t)
      }, 5e3)),
      (this.onBlur = () => this.stopTrackingDwellTime(!1)),
      (this.stopTrackingDwellTime = (t = !1) => {
        this.checkForDwellEvent(t), delete this.currentEvent.startTimeMs
      }),
      (this.resumeTrackingDwellTime = () => {
        this.currentEvent.startTimeMs || (this.currentEvent.startTimeMs = Date.now()), this.scheduleDwellTimeOutEvent()
      }),
      (this.throttledResumeTrackingDwellTime = functionCommon.debounce(this.resumeTrackingDwellTime, 100)),
      (this.scheduleDwellTimeOutEvent = (0, l.D)(() => this.stopTrackingDwellTime(!0), 15e3))
  }
  async init(t, e) {
    ;([this.cameraData, this.appData, this.viewmodeData] = await Promise.all([
      // e.getModuleBySymbol(AnalyticsSymbol),
      e.market.waitForData(CameraData),
      e.market.waitForData(AppData),
      e.market.waitForData(ViewmodeData)
    ])),
      (this.currentEvent = { pose: this.cameraData.pose.clone(), viewmode: getViewModesString(null) }),
      this.bindings.push(this.cameraData.pose.onChanged(this.onCameraChange)),
      this.bindings.push(this.viewmodeData.onPropertyChanged("currentModeObservable", this.onViewmodeUpdate)),
      window.addEventListener("blur", this.onBlur),
      window.addEventListener("focus", this.resumeTrackingDwellTime),
      window.addEventListener("keydown", this.resumeTrackingDwellTime, { capture: !0 }),
      window.addEventListener("touchcancel", this.resumeTrackingDwellTime),
      window.addEventListener("touchstart", this.resumeTrackingDwellTime),
      window.addEventListener("touchend", this.resumeTrackingDwellTime),
      window.addEventListener("touchmove", this.throttledResumeTrackingDwellTime),
      window.addEventListener("mousemove", this.throttledResumeTrackingDwellTime)
  }
  dispose(t) {
    super.dispose(t),
      window.removeEventListener("blur", this.onBlur),
      window.removeEventListener("focus", this.resumeTrackingDwellTime),
      window.removeEventListener("keydown", this.resumeTrackingDwellTime, { capture: !0 }),
      window.removeEventListener("touchcancel", this.resumeTrackingDwellTime),
      window.removeEventListener("touchstart", this.resumeTrackingDwellTime),
      window.removeEventListener("touchend", this.resumeTrackingDwellTime),
      window.removeEventListener("touchmove", this.throttledResumeTrackingDwellTime),
      window.removeEventListener("mousemove", this.throttledResumeTrackingDwellTime)
  }
}
