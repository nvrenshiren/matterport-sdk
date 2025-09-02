import { Vector2 } from "three"
import * as n from "../const/21646"
import * as r from "../const/41602"
import { DollhousePeekabooKey } from "../const/66777"
import { KeyboardCode, KeyboardStateList } from "../const/keyboard.const"
import { MouseKeyCode } from "../const/mouse.const"
import { ControlsFPSymbol, InputSymbol } from "../const/symbol.const"
import { OrthographicControl } from "../controls/orthographic.control"
import { RotaterMoveEvent, RotaterStopEvent } from "../events/rotate.const"
import { ViewModes } from "../utils/viewMode.utils"
import { DirectionVector } from "../webgl/vector.const"
import CameraDataModule from "./cameraData.module"
import OrthographicControlsModule from "./orthographicControls.module"
import { FrameRate } from "../const/41602"

declare global {
  interface SymbolModule {
    [ControlsFPSymbol]: FloorplanControlsModule
  }
}

class h extends OrthographicControl {
  cameraPoseProxy: CameraDataModule["cameraPoseProxy"]
  angularAccel: number
  angularVelocity: number
  // transition:{
  //   angularVelocity?: number
  //   active?: boolean
  // }
  constructor(e, t, i, s, o = !1) {
    super(e, t, i, s, o)
    this.cameraPoseProxy = e
    this.angularAccel = 0
    this.angularVelocity = 0
    this.transition.angularVelocity = 0
  }

  setRollAcceleration(e, t = !1) {
    !this.transition.active &&
      (t && e && this.angularVelocity && Math.sign(e) !== Math.sign(this.angularVelocity) && (this.angularVelocity = 0), (this.angularAccel = e))
  }

  startRotateTransition(e: number, t: Vector2, i: boolean) {
    return this.startTransition(e, t.x * FrameRate, new Vector2(), 0, i).nativePromise()
  }

  startTransition(e, t, i, s, o) {
    this.transition.angularVelocity = t
    this.angularVelocity = t
    this.angularAccel = 0
    return super.startTransition(e, t, i, s, o)
  }

  update(e) {
    super.update(e)
    ;(Math.abs(this.angularAccel) > n.Z.epsilon || Math.abs(this.angularVelocity) > n.Z.epsilon) &&
      (this.transition.active ? this.updateAngularTransition(e) : this.updateAngularDefault(e))
  }

  stopMomentum() {
    super.stopMomentum()
    !this.transition.active && (this.angularVelocity = 0)
  }

  stopAcceleration() {
    super.stopAcceleration()
    !this.transition.active && this.setRollAcceleration(0)
  }

  updateAngularTransition(e) {
    const t = this.getTransitionScale(e)
    this.angularVelocity = this.transition.angularVelocity * t
    this.roll(this.angularVelocity)
  }

  updateAngularDefault(e) {
    const t = e / FrameRate
    this.angularVelocity = this.angularVelocity + this.angularAccel * t
    this.roll(this.angularVelocity)
    this.angularVelocity *= Math.pow(1 - r.O8, t)
  }

  roll(e) {
    var t
    const i = this.cameraPoseProxy.pose
    this.currentOrientation.setFromAxisAngle(DirectionVector.FORWARD, e),
      this.currentOrientation.multiplyQuaternions(i.rotation, this.currentOrientation),
      this.currentOrientation.normalize(),
      (this.checkBounds && !this.insideBounds(i.position, this.currentOrientation, i.projection)) ||
        i.rotation.equals(this.currentOrientation) ||
        null === (t = this.poseController) ||
        void 0 === t ||
        t.updateCameraRotation(this.currentOrientation)
  }
}

const y = Math.PI / 2 / 1e3

enum f {
  NONE = MouseKeyCode.NONE,
  PAN = MouseKeyCode.PRIMARY,
  ZOOM = MouseKeyCode.MIDDLE,
  ROTATE = MouseKeyCode.SECONDARY
}

export default class FloorplanControlsModule extends OrthographicControlsModule {
  constructor() {
    super(...arguments)
    this.name = "floorplan-controls"
  }

  async init(e, t) {
    await super.init(e, t)
    t.getModuleBySymbol(InputSymbol).then(e => {
      this.inputBindings.push(
        e.registerHandler(RotaterMoveEvent, e => {
          this.controls.isActive && (this.controls.setRollAcceleration(e.rotateDelta), this.controls.update(FrameRate), this.controls.stop())
        }),
        e.registerHandler(RotaterStopEvent, this.resetControlState)
      )
      this.updateInputBindings()
    })
  }

  createCameraControls(e, t, i) {
    const s = this.commonControlsModule.cameraPoseProxy,
      o = t.defaultZoom.bind(t)
    this.controls = new h(s, o, e.extendedBounds, e.meshCenter, !0)
    !i.tryGetProperty(DollhousePeekabooKey, !1) && this.commonControlsModule.addControls(ViewModes.Floorplan, this.controls)
  }

  onDrag(e) {
    super.onDrag(e)
    switch (this.controlState) {
      case f.ROTATE:
        this.controls.setRollAcceleration(e.x * Math.PI)
    }
  }

  onKey(e) {
    super.onKey(e)
    const { key: t, state: i, modifiers: s } = e,
      o = i === KeyboardStateList.DOWN
    switch (t) {
      case KeyboardCode.J:
      case KeyboardCode.LEFTARROW:
        this.controls.setRollAcceleration(o ? y : 0, !0)
        break
      case KeyboardCode.L:
      case KeyboardCode.RIGHTARROW:
        this.controls.setRollAcceleration(o ? -y : 0, !0)
        break
      case KeyboardCode.DOWNARROW:
        !s.shiftKey && this.controls.setZoomAcceleration(o ? r.Gu : 0)
        break
      case KeyboardCode.UPARROW:
        !s.shiftKey && this.controls.setZoomAcceleration(o ? -r.Gu : 0)
    }
  }
}
