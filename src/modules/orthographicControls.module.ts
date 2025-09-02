import { Vector2 } from "three"
import * as f from "../math/2569"
import * as n from "../const/41602"
import { KeyboardCode, KeyboardStateList } from "../const/keyboard.const"
import { MouseKeyCode } from "../const/mouse.const"
import { CameraSymbol, ControlsCommonSymbol, InputSymbol, OrthographicControlsSymbol } from "../const/symbol.const"
import { OrthographicControl } from "../controls/orthographic.control"
import { CameraData } from "../data/camera.data"
import { MeshData } from "../data/mesh.data"
import { SettingsData } from "../data/settings.data"
import { DraggerMoveEvent, DraggerStartEvent, DraggerStopEvent } from "../events/drag.event"
import { KeyboardCallbackEvent } from "../events/keyBoard.event"
import { PincherMoveEvent, PincherStopEvent } from "../events/pinch.ecvent"
import { WheelBindEvent } from "../events/wheel.event"
import { EndSwitchViewmodeMessage } from "../message/floor.message"
import { ViewModes } from "../utils/viewMode.utils"
import { BaseControlsModule } from "./baseControls.module"
import CommonControlsModule from "./commonControls.module"
import { FrameRate } from "../const/41602"
import { lerp } from "../math/2569"

declare global {
  interface SymbolModule {
    [OrthographicControlsSymbol]: OrthographicControlsModule
  }
}

enum s {
  NONE = MouseKeyCode.NONE,
  ROTATE = MouseKeyCode.SECONDARY,
  PAN = MouseKeyCode.PRIMARY,
  ZOOM = MouseKeyCode.MIDDLE
}

export default class OrthographicControlsModule extends BaseControlsModule {
  controlState: number
  controlsEngaged: boolean
  movementKeys: Vector2
  resetControlState: () => void
  meshData: MeshData
  cameraModule: CameraData
  modelSize: number
  commonControlsModule: CommonControlsModule

  constructor(e?) {
    super(...arguments)
    this.name = "orthographic-controls"
    this.controlState = s.NONE
    this.controlsEngaged = !1
    this.movementKeys = new Vector2()
    this.resetControlState = () => {
      this.controlState = s.NONE
    }
  }

  async init(e, t) {
    const [i, s, o, r, a] = await Promise.all([
      t.market.waitForData(MeshData),
      t.getModuleBySymbol(CameraSymbol),
      t.getModuleBySymbol(ControlsCommonSymbol),
      t.market.waitForData(CameraData),
      t.market.waitForData(SettingsData)
    ])
    this.meshData = i
    this.cameraModule = s
    this.modelSize = Math.max(i.extendedSize.length(), 1)
    this.commonControlsModule = o
    this.createCameraControls(i, r, a)
    this.registerActiveStateChangeBinding()
    t.getModuleBySymbol(InputSymbol).then(e => {
      this.inputBindings.push(
        e.registerHandler(WheelBindEvent, e => {
          this.onScrollWheel(e)
        })
      )
      this.inputBindings.push(
        e.registerHandler(DraggerStartEvent, e => {
          this.onDragBegin(e.buttons)
        })
      )
      this.inputBindings.push(
        e.registerHandler(DraggerMoveEvent, e => {
          this.controlsEngaged = !0
          this.onDrag(e.delta)
          this.controls.update(FrameRate)
          this.controls.stop()
        })
      )
      this.inputBindings.push(
        e.registerHandler(DraggerStopEvent, e => {
          if (this.controlsEngaged) {
            if (e.timeSinceLastMove < 100) {
              this.onDrag(e.delta)
              this.controls.update(FrameRate)
              this.controls.stopAcceleration()
            }
            this.onDragEnd(e.delta, e.buttons)
            this.controlsEngaged = !1
          }
        })
      )
      this.inputBindings.push(
        e.registerHandler(PincherMoveEvent, e => {
          this.controls.setZoomAcceleration(-e.pinchDelta * n.N4)
          this.controls.update(FrameRate)
          this.controls.stop()
        })
      )
      this.inputBindings.push(e.registerHandler(PincherStopEvent, this.resetControlState))
      this.inputBindings.push(
        e.registerHandler(KeyboardCallbackEvent, e => {
          e.state !== KeyboardStateList.PRESSED && this.onKey(e)
        })
      )
      this.updateInputBindings()
    })
    this.bindings.push(
      t.subscribe(EndSwitchViewmodeMessage, e => {
        this.controls.isActive && this.controls.start()
      })
    )
  }

  onUpdate(e) {
    this.controls.isActive && this.controls.update(e)
  }

  createCameraControls(e, t, i) {
    const s = this.commonControlsModule.cameraPoseProxy,
      o = t.defaultZoom.bind(t)
    this.controls = new OrthographicControl(s, o, e.extendedBounds, e.meshCenter, !0)
    this.commonControlsModule.addControls(ViewModes.Orthographic, this.controls)
  }

  onActiveStateChanged() {
    super.onActiveStateChanged()
    this.resetControlState()
  }

  onScrollWheel(e) {
    if (0 !== e.delta.y) {
      const t = lerp(this.modelSize, 1, 1500, 2, 0.125)
      this.controls.setZoomAcceleration((e.delta.y * n.jX) / (t * n.mP))
      this.controls.update(FrameRate)
      this.controls.setZoomAcceleration(0)
    }
  }

  onDragBegin(e) {
    if (this.controlState === s.NONE) {
      this.controlState = e
    }
    this.controls.stop()
  }

  onDrag(e) {
    switch (this.controlState) {
      case s.PAN:
        const t = e
        this.controls.setPanAcceleration({ x: -t.x, y: -t.y })
        break
      case s.ZOOM:
        0 !== e.y && this.controls.setZoomAcceleration(-e.y)
    }
  }

  onDragEnd(e, t) {
    t & this.controlState || (this.controlState = s.NONE)
  }

  onKey(e) {
    const { key, state } = e,
      s = state === KeyboardStateList.DOWN
    let o = !1
    switch (key) {
      case KeyboardCode.A:
        this.movementKeys.x = s ? -1 : 0
        o = !0
        break
      case KeyboardCode.D:
        this.movementKeys.x = s ? 1 : 0
        o = !0
        break
      case KeyboardCode.W:
        this.movementKeys.y = s ? 1 : 0
        o = !0
        break
      case KeyboardCode.S:
        this.movementKeys.y = s ? -1 : 0
        o = !0
        break
      case KeyboardCode.K:
        this.controls.setZoomAcceleration(s ? n.Gu : 0)
        break
      case KeyboardCode.I:
        this.controls.setZoomAcceleration(s ? -n.Gu : 0)
    }
    if (o) {
      const e = this.movementKeys
      this.controls.setPanAcceleration({ x: e.x, y: e.y }, !1, n.bC)
    }
  }
}
