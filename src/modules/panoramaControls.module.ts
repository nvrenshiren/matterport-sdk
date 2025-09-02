import { Matrix4, Vector2, Vector3 } from "three"
import * as r from "../const/93642"
import { KeyboardCode, KeyboardStateList } from "../const/keyboard.const"
import { MouseKeyCode } from "../const/mouse.const"
import { ControlsCommonSymbol, ControlsInsideSymbol, InputSymbol } from "../const/symbol.const"
import { PanoramaControl } from "../controls/panorama.control"
import EngineContext from "../core/engineContext"
import MarketContext from "../core/marketContext"
import { CameraData } from "../data/camera.data"
import { InteractionData } from "../data/interaction.data"
import { SettingsData } from "../data/settings.data"
import { DraggerMoveEvent, DraggerStartEvent, DraggerStopEvent } from "../events/drag.event"
import { KeyboardCallbackEvent } from "../events/keyBoard.event"
import { ViewModes } from "../utils/viewMode.utils"
import { BaseControlsModule } from "./baseControls.module"

declare global {
  interface SymbolModule {
    [ControlsInsideSymbol]: PanoramaControlsModule
  }
}

export const lookAccelerationKey = "Rotation speed"
export default class PanoramaControlsModule extends BaseControlsModule {
  controlsEngaged: boolean
  lookAccelerationSpeed: number
  calcRotationAngle: (e, t) => Vector2
  cameraData: CameraData
  market: MarketContext
  declare controls: PanoramaControl
  constructor() {
    super(...arguments)
    this.name = "panorama-controls"
    this.controlsEngaged = !1
    this.lookAccelerationSpeed = r.WI
    this.calcRotationAngle = (() => {
      const e = new Matrix4(),
        t = new Vector3(),
        i = new Vector3()
      return (o, r) => {
        e.copy(this.cameraData.pose.projection.asThreeMatrix4()),
          e.invert(),
          t.set(o.x - r.x, o.y - r.y, -1).applyMatrix4(e),
          i.set(o.x, o.y, -1).applyMatrix4(e)
        const n = Math.sqrt(t.x * t.x + t.z * t.z),
          a = Math.sqrt(i.x * i.x + i.z * i.z),
          h = Math.atan2(t.y, n),
          l = Math.atan2(i.y, a) - h
        ;(t.y = 0), (i.y = 0), t.normalize(), i.normalize()
        const d = Math.acos(t.dot(i))
        let c = 0
        return isNaN(d) || ((c = d), r.x > 0 && (c *= -1)), new Vector2(-c, -l)
      }
    })()
  }
  async init(e, t: EngineContext) {
    const i = await t.getModuleBySymbol(ControlsCommonSymbol)
    this.controls = new PanoramaControl(i.cameraPoseProxy)
    this.cameraData = await t.market.waitForData(CameraData)
    const s = this.cameraData
    this.controls.beforeStartRotationTransition = () => {
      s.transition && s.transition.activeInternal && s.transition.to.rotation && (s.transition.to.rotation = void 0)
    }
    i.addControls(ViewModes.Panorama, this.controls)
    i.addControls(ViewModes.Mesh, this.controls)
    this.market = t.market
    this.registerActiveStateChangeBinding()
    t.getModuleBySymbol(InputSymbol).then(e => {
      e.registerHandler(DraggerStartEvent, e => {
        this.shouldBeActive() && this.controls.stop()
      })
      e.registerHandler(DraggerMoveEvent, e => {
        this.shouldBeActive() &&
          e.buttons & MouseKeyCode.PRIMARY &&
          ((this.controlsEngaged = !0), this.onDrag(e.position, e.delta), this.controls.update(r.SI), this.controls.stop())
      })
      e.registerHandler(DraggerStopEvent, e => {
        this.shouldBeActive() &&
          this.controlsEngaged &&
          (e.timeSinceLastMove < 100 &&
            !(e.buttons & MouseKeyCode.PRIMARY) &&
            (this.onDrag(e.position, e.delta),
            this.controls.update(r.SI),
            this.controls.setLookAcceleration({
              x: 0,
              y: 0
            })),
          (this.controlsEngaged = !1))
      })
      e.registerHandler(KeyboardCallbackEvent, e => {
        this.shouldBeActive() && this.onKey(e.key, e.state)
      })
      this.updateInputBindings()
    })
  }

  onUpdate(e) {
    this.shouldBeActive() && this.controls.update(e)
  }

  onDrag(e, t) {
    this.controls.setLookAcceleration(this.calcRotationAngle(e, t))
  }

  onKey(e, t) {
    var i, s
    const o =
      null !== (s = null === (i = this.market.tryGetData(SettingsData)) || void 0 === i ? void 0 : i.tryGetProperty(lookAccelerationKey, null)) && void 0 !== s
        ? s
        : null
    this.lookAccelerationSpeed = o ? (o * (Math.PI / 180)) / 60 : this.lookAccelerationSpeed
    const r = t === KeyboardStateList.DOWN
    switch (e) {
      case KeyboardCode.LEFTARROW:
      case KeyboardCode.J:
        this.controls.setLookAcceleration({ x: r ? this.lookAccelerationSpeed : 0 }, !0)
        break
      case KeyboardCode.RIGHTARROW:
      case KeyboardCode.L:
        this.controls.setLookAcceleration({ x: r ? -this.lookAccelerationSpeed : 0 }, !0)
        break
      case KeyboardCode.K:
        this.controls.setLookAcceleration({ y: r ? -this.lookAccelerationSpeed : 0 }, !0)
        break
      case KeyboardCode.I:
        this.controls.setLookAcceleration({ y: r ? this.lookAccelerationSpeed : 0 }, !0)
    }
  }

  shouldBeActive() {
    var e, t
    return null !== (t = !(null === (e = this.market.tryGetData(InteractionData)) || void 0 === e ? void 0 : e.isVR())) && void 0 !== t && t
  }
}
