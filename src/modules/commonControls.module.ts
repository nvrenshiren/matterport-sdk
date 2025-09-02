import { CameraSymbol, ControlsCommonSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { ViewmodeData } from "../data/viewmode.data"
import CameraDataModule, { PoseController } from "./cameraData.module"
import EngineContext from "../core/engineContext"
import { Vector2 } from "three"
import { ViewModes } from "../utils/viewMode.utils"
import { PoseControllerObservable } from "../controls/pose.control.observable"

declare global {
  interface SymbolModule {
    [ControlsCommonSymbol]: CommonControlsModule
  }
}
export default class CommonControlsModule<C extends PoseControllerObservable = PoseControllerObservable> extends Module {
  cameraPoseProxy: CameraDataModule["cameraPoseProxy"]
  modeControls: Map<
    ViewModes,
    {
      mode: ViewModes
      controls: C
    }
  >
  poseController: null | PoseController
  viewmodeData: ViewmodeData

  constructor() {
    super(...arguments)
    this.name = "common-controls"
    this.modeControls = new Map()
    this.poseController = null
  }

  async init(e, t: EngineContext) {
    this.modeControls = new Map()
    t.market.waitForData(ViewmodeData).then(e => {
      this.viewmodeData = e
      this.bindings.push(this.viewmodeData.onChanged(() => this.setControllerForCurrViewmode()))
      this.setControllerForCurrViewmode()
    })
    this.cameraPoseProxy = (await t.getModuleBySymbol(CameraSymbol)).cameraPoseProxy
    this.cameraPoseProxy.newSession(this)
  }

  onAccessGranted(e: PoseController) {
    this.poseController = e
    this.setControllerForCurrViewmode()
    this.bindings.forEach(e => e.renew())
  }

  onAccessRevoked(e) {
    this.stop()
    this.bindings.forEach(e => e.cancel())
    this.poseController = null
    for (const e of this.modeControls.values()) e.controls.setController(null)
  }

  startRotateTransition(e: number, t: Vector2, i = !0) {
    return this.checkControlsForAction(s => s.startRotateTransition(e, t, i))
  }

  startZoomTransition(e: number, t: number, i = !0) {
    return this.checkControlsForAction(s => s.startZoomTransition(e, t, i))
  }

  startTranslateTransition(e: number, t: Vector2, i = !0) {
    return this.checkControlsForAction(s => s.startTranslateTransition(e, t, i))
  }

  stop() {
    return this.checkControlsForAction(e => (e.stop(), Promise.resolve()))
  }

  setControllerForCurrViewmode() {
    if (this.viewmodeData && this.viewmodeData.currentMode) {
      const t = this.modeControls.get(this.viewmodeData.currentMode)?.controls
      if (t) {
        t.setController(this.poseController)
        for (const e of this.modeControls.values()) {
          const i = e.controls
          i !== t && i.setController(null)
        }
      }
    }
  }

  checkControlsForAction(e: (...args: any[]) => Promise<any>) {
    if (this.viewmodeData && null !== this.viewmodeData.currentMode) {
      const t = this.modeControls.get(this.viewmodeData.currentMode)
      if (t) {
        return e(t.controls)
      }
    }
    return Promise.reject("checkControlsForAction() -> Current view mode is null")
  }

  addControls(e: ViewModes, t: C, i?: boolean) {
    if (!this.modeControls.get(e) || i) {
      this.modeControls.set(e, {
        mode: e,
        controls: t
      })
      this.setControllerForCurrViewmode()
    }
  }
}
