import { DoubleSide, MathUtils, Mesh, MeshBasicMaterial, Plane, PlaneHelper, Ray, SphereGeometry, Vector2, Vector3 } from "three"
import { DollhouseVerticalLimitsCommand, RestoreMouseBtnActionCommand, SwapMouseBtnActionCommand } from "../command/dollhouse.command"
import { InputPointerType } from "../const/41927"
import * as b from "../const/61282"
import { DollhousePeekabooKey } from "../const/66777"
import { KeyboardCode, KeyboardStateList } from "../const/keyboard.const"
import { MouseKeyCode } from "../const/mouse.const"
import {
  ControlsCommonSymbol,
  ControlsDHSymbol,
  InputSymbol,
  RaycasterSymbol,
  SettingsSymbol,
  VisibleMeshBoundsSymbol,
  WebglRendererSymbol
} from "../const/symbol.const"
import { ActiveDevice, ControlState, DollhouseControl, PoseConstrainer } from "../controls/dollhouse.control"
import { DollhouseControlData } from "../data/dollhouse.control.data"
import { SettingsData } from "../data/settings.data"
import { DraggerMoveEvent, DraggerStartEvent, DraggerStopEvent } from "../events/drag.event"
import { KeyboardCallbackEvent } from "../events/keyBoard.event"
import { MovePointerEvent } from "../events/pointer.event"
import { WheelBindEvent } from "../events/wheel.event"
import { ViewModes } from "../utils/viewMode.utils"
import { DirectionVector } from "../webgl/vector.const"
import { BaseControlsModule } from "./baseControls.module"
import CameraDataModule from "./cameraData.module"
import CommonControlsModule from "./commonControls.module"
import InputIniModule from "./inputIni.module"
import RaycasterModule from "./raycaster.module"
import SettingsModule from "./settings.module"
import VisibleMeshBoundsModule from "./visibleMeshBounds.module"
import WebglRendererModule from "./webglrender.module"

declare global {
  interface SymbolModule {
    [ControlsDHSymbol]: DollhouseControlsModule
  }
}

const T = {
  [MouseKeyCode.NONE]: ControlState.NONE,
  [MouseKeyCode.PRIMARY]: ControlState.ROTATE,
  [MouseKeyCode.SECONDARY]: ControlState.PAN,
  [MouseKeyCode.MIDDLE]: ControlState.ZOOM,
  [MouseKeyCode.BACK]: ControlState.NONE,
  [MouseKeyCode.FORWARD]: ControlState.NONE,
  [MouseKeyCode.ALL]: ControlState.NONE
}
const x = {
  [MouseKeyCode.NONE]: ControlState.NONE,
  [MouseKeyCode.PRIMARY]: ControlState.PAN,
  [MouseKeyCode.SECONDARY]: ControlState.ROTATE,
  [MouseKeyCode.MIDDLE]: ControlState.ZOOM,
  [MouseKeyCode.BACK]: ControlState.NONE,
  [MouseKeyCode.FORWARD]: ControlState.NONE,
  [MouseKeyCode.ALL]: ControlState.NONE
}

export default class DollhouseControlsModule extends BaseControlsModule {
  cameraPoseProxy: CameraDataModule["cameraPoseProxy"]
  poseConstrainer: PoseConstrainer
  controlState: ControlState
  movementKeys: Vector2
  didDrag: boolean
  peekabooActive: boolean
  swapMouseBoutton: boolean
  displayDollhouseMetadata: boolean
  visibleMeshBounds: VisibleMeshBoundsModule
  commonControlsModule: CommonControlsModule
  inputIni: InputIniModule
  raycaster: RaycasterModule
  renderer: WebglRendererModule
  settings: SettingsModule
  controlsData: DollhouseControlData
  debugPlane: PlaneHelper | null
  debugOrbit: Mesh | null
  debugZoom: Mesh | null
  resetControlState: () => void
  convertDeltaToLocal: (e?) => Vector3
  declare controls: DollhouseControl

  constructor() {
    super(...arguments)
    this.name = "dollhouse-controls"
    this.controlState = ControlState.NONE
    this.movementKeys = new Vector2()
    this.didDrag = !1
    this.peekabooActive = !1
    this.swapMouseBoutton = !1
    this.displayDollhouseMetadata = !1
    this.resetControlState = () => {
      this.controlState = ControlState.NONE
    }
    this.convertDeltaToLocal = (() => {
      const e = new Vector3(),
        t = new Vector3()
      return i => {
        const s = i.x || 0,
          o = i.y || 0,
          n = this.cameraPoseProxy.pose.phi() > MathUtils.degToRad(85) ? DirectionVector.UP : DirectionVector.FORWARD,
          a = 2 * s * this.cameraPoseProxy.pose.fovCorrectedFocalDistance(),
          h = (2 * o * this.cameraPoseProxy.pose.fovCorrectedFocalDistance()) / this.cameraPoseProxy.pose.aspect()
        e.copy(DirectionVector.RIGHT).applyQuaternion(this.cameraPoseProxy.pose.rotation).setY(0).setLength(a)
        t.copy(n).applyQuaternion(this.cameraPoseProxy.pose.rotation)
        e.add(t.setY(0).setLength(h))
        return e
      }
    })()
  }

  async init(e, t) {
    ;[this.visibleMeshBounds, this.commonControlsModule, this.inputIni, this.raycaster, this.renderer, this.settings] = await Promise.all([
      t.getModuleBySymbol(VisibleMeshBoundsSymbol),
      t.getModuleBySymbol(ControlsCommonSymbol),
      t.getModuleBySymbol(InputSymbol),
      t.getModuleBySymbol(RaycasterSymbol),
      t.getModuleBySymbol(WebglRendererSymbol),
      t.getModuleBySymbol(SettingsSymbol)
    ])
    const i = await t.market.waitForData(SettingsData)
    this.peekabooActive = i.tryGetProperty(DollhousePeekabooKey, !1)
    this.bindings.push(
      i.onPropertyChanged(DollhousePeekabooKey, e => {
        this.peekabooActive = e
      })
    )
    this.settings.registerMenuButton({
      header: "Dollhouse",
      buttonName: "Toggle Orbit point display",
      callback: () => {
        ;(this.displayDollhouseMetadata = !this.displayDollhouseMetadata), this.displayDollhouseMetadata ? this.createDebugObjects() : this.removeDebugObjects()
      }
    })
    this.cameraPoseProxy = this.commonControlsModule.cameraPoseProxy
    this.poseConstrainer = new PoseConstrainer(this.visibleMeshBounds.getFullBounds())
    this.controlsData = new DollhouseControlData()
    t.market.register(this, DollhouseControlData, this.controlsData)
    this.controls = new DollhouseControl(
      this.cameraPoseProxy,
      this.poseConstrainer,
      () => this.computeOrbitPoint(),
      () => this.computeGrabPoint(),
      e => this.focusPointHelper(e),
      this.controlsData,
      t.msgBus
    )
    this.bindings.push(
      this.visibleMeshBounds.onFullBoundsChanged(e => {
        this.poseConstrainer.updateConstraints(e)
        this.controls.invalidateOrbitMetadata()
      }),
      this.visibleMeshBounds.onVisibleBoundsChanged(e => {
        this.controls.invalidateOrbitMetadata()
      }),
      t.commandBinder.addBinding(DollhouseVerticalLimitsCommand, async e => {
        const t = this.cameraPoseProxy.pose.autoOrtho ? b.pj : b.uQ
        return this.controls.setPhiLimits(
          void 0 !== e.phiLowerLimitDegrees ? e.phiLowerLimitDegrees * MathUtils.DEG2RAD : b.zf,
          void 0 !== e.phiUpperLimitDegrees ? e.phiUpperLimitDegrees * MathUtils.DEG2RAD : t,
          void 0 !== e.noTransition ? !e.noTransition : this.controls.isActive
        )
      }),
      t.commandBinder.addBinding(SwapMouseBtnActionCommand, async () => {
        this.peekabooActive || (this.swapMouseBoutton = !0)
      }),
      t.commandBinder.addBinding(RestoreMouseBtnActionCommand, async () => {
        this.peekabooActive || (this.swapMouseBoutton = !1)
      })
    )
    this.registerActiveStateChangeBinding()
    const s = this.inputIni
    this.commonControlsModule.addControls(ViewModes.Dollhouse, this.controls)
    const r = e => {
        ;(this.didDrag = !1), this.onDragBegin(e.buttons, e.position, e.device, e.ctrlKey)
      },
      l = e => {
        e.timeSinceLastMove < 100 && this.didDrag && (this.onDrag(e.delta, e.position), this.controls.update(b.SI), this.controls.stopAcceleration()),
          this.onDragEnd(e.delta, e.buttons, e.position)
      },
      m = e => {
        ;(this.didDrag = !0), this.onDrag(e.delta, e.position), this.controls.update(b.SI), this.controls.stop()
      }
    this.inputBindings.push(
      s.registerHandler(WheelBindEvent, e => {
        this.onScrollWheel(e)
      })
    )
    this.inputBindings.push(
      s.registerHandler(DraggerStartEvent, e => {
        this.isTouchDrag(e.pointerId) || r(e)
      })
    )
    this.inputBindings.push(
      s.registerHandler(DraggerStopEvent, e => {
        this.isTouchDrag(e.pointerId) || l(e)
      })
    )
    this.inputBindings.push(
      s.registerHandler(DraggerMoveEvent, e => {
        this.isTouchDrag(e.pointerId) || m(e)
      })
    )
    this.inputBindings.push(
      s.registerHandler(MovePointerEvent, e => {
        this.controls.rawPointerUpdate(e)
      })
    )
    this.inputBindings.push(
      s.registerHandler(KeyboardCallbackEvent, e => {
        e.state !== KeyboardStateList.PRESSED && this.onKey(e.key, e.state)
      })
    )
    this.updateInputBindings()
    this.peekabooActive && (this.controls.setPhiLimits(b.zf, b.pj, !1), (this.swapMouseBoutton = !0))
  }

  onUpdate(e) {
    this.controls.isActive && (this.controls.update(e), this.updateDebugObjects())
  }

  isTouchDrag(e) {
    const t = this.controls.touchGestureIds()
    return t[0] === e || t[1] === e
  }

  onActiveStateChanged() {
    super.onActiveStateChanged()
    this.resetControlState()
  }

  onScrollWheel(e) {
    this.zoom(e.delta.y)
  }

  zoom(e) {
    0 !== e && (this.controls.setZoomAcceleration(e), this.controls.update(b.SI), this.controls.setZoomAcceleration(0))
  }

  onDragBegin(e, t, i, o = !1) {
    if (this.controlState === ControlState.NONE) {
      const t = this.swapMouseBoutton ? x : T
      if (i === InputPointerType.MOUSE) {
        const i = this.applyKeyboardModifier(e, o)
        this.controlState = t[i]
      } else this.controlState = this.peekabooActive ? ControlState.PAN : ControlState.ROTATE
    }
    const r = i === InputPointerType.TOUCH ? ActiveDevice.TOUCH : ActiveDevice.MOUSE
    this.controls.initMove(this.controlState, r, t)
  }

  onDrag(e, t) {
    switch ((this.controls.setNdcPos(t), this.controlState)) {
      case ControlState.ROTATE:
        this.controls.setOrbitalAcceleration({ x: -Math.PI * e.x, y: -Math.PI * e.y })
        break
      case ControlState.ZOOM:
        0 !== e.y && this.controls.setZoomAcceleration(-e.y)
    }
  }

  onDragEnd(e, t, i) {
    t & this.controlState || ((this.controlState = ControlState.NONE), this.controls.endMove(i))
  }

  onKey(e, t) {
    const i = t === KeyboardStateList.DOWN
    let o = !1
    switch (e) {
      case KeyboardCode.LEFTARROW:
      case KeyboardCode.J:
        this.controls.setOrbitalAcceleration({ x: i ? b.v0 : 0 }, !0)
        this.controls.initMove(ControlState.ROTATE, ActiveDevice.KEYBOARD)
        break
      case KeyboardCode.RIGHTARROW:
      case KeyboardCode.L:
        this.controls.setOrbitalAcceleration({ x: i ? -b.v0 : 0 }, !0)
        this.controls.initMove(ControlState.ROTATE, ActiveDevice.KEYBOARD)
        break
      case KeyboardCode.UPARROW:
      case KeyboardCode.I:
        this.controls.setOrbitalAcceleration({ y: i ? -b.v0 : 0 }, !0)
        this.controls.initMove(ControlState.ROTATE, ActiveDevice.KEYBOARD)
        break
      case KeyboardCode.DOWNARROW:
      case KeyboardCode.K:
        this.controls.setOrbitalAcceleration({ y: i ? b.v0 : 0 }, !0)
        this.controls.initMove(ControlState.ROTATE, ActiveDevice.KEYBOARD)
        break
      case KeyboardCode.W:
        this.movementKeys.y = i ? 1 : 0
        o = !0
        break
      case KeyboardCode.S:
        this.movementKeys.y = i ? -1 : 0
        o = !0
        break
      case KeyboardCode.D:
        this.movementKeys.x = i ? 1 : 0
        o = !0
        break
      case KeyboardCode.A:
        this.movementKeys.x = i ? -1 : 0
        o = !0
        break
      case KeyboardCode.PLUSEQUALS:
        this.zoom(-b.Gu)
        break
      case KeyboardCode.DASHUNDERSCORE:
        this.zoom(b.Gu)
    }
    if (o) {
      const e = this.convertDeltaToLocal(this.movementKeys).setLength(b.bC)
      this.controls.setPanAcceleration({ x: e.x, y: e.z })
      this.controls.initMove(ControlState.PAN, ActiveDevice.KEYBOARD)
    }
  }

  computeGrabPoint() {
    const e = this.inputIni.getCurrentPointerRay()
    return this.focusPointHelper(e, !0)
  }

  computeOrbitPoint() {
    const e = this.cameraPoseProxy.pose,
      t = new Ray(e.position.clone(), e.forward().clone())
    return this.focusPointHelper(t)
  }

  focusPointHelper(e, t = !1) {
    const i = () => {
      const t = this.visibleMeshBounds.getVisibleBounds(),
        i = this.visibleMeshBounds.getCenterOfMass(),
        s = Math.ceil(Math.abs(i.y - t.min.y) / 3)
      let o = Number.MAX_VALUE
      const n = new Vector3(),
        a = new Vector3()
      let h = !1
      if (Number.isFinite(s))
        for (let l = 0; l < s; l++) {
          const s = t.min.y + 3 * l,
            d = new Plane().setFromNormalAndCoplanarPoint(DirectionVector.UP, new Vector3(t.min.x, s, t.min.z))
          h = !!e.intersectPlane(d, n)
          const c = i.distanceTo(n)
          h && c < o && ((o = c), a.copy(n))
        }
      const l = !this.poseConstrainer.containsPoint(a)
      return (h && !l) || (e.closestPointToPoint(i, a), e.origin.distanceTo(a) < b.qj && e.at(b.qj, a)), a
    }
    if (this.cameraPoseProxy.pose.autoOrtho && !t) return i()
    {
      const t = this.raycaster.picking.pick(e.origin, e.direction)
      return t ? t.point.clone() : i()
    }
  }

  applyKeyboardModifier(e, t) {
    let i = e
    t && e === MouseKeyCode.PRIMARY && (i = MouseKeyCode.SECONDARY)
    return i
  }

  createDebugObjects() {
    if (null == this.debugPlane) {
      const e = new PlaneHelper(new Plane(), 100, 16711680)
      //@ts-ignore
      e.material.depthTest = !1
      this.debugPlane = e
    }
    if (null == this.debugOrbit) {
      const e = new SphereGeometry(0.1, 2, 2),
        t = new MeshBasicMaterial({ color: 16711680, side: DoubleSide, depthTest: !1 }),
        i = new Mesh(e, t)
      this.debugOrbit = i
    }
    if (null == this.debugZoom) {
      const e = new SphereGeometry(0.2, 2, 2),
        t = new MeshBasicMaterial({ color: 65280, side: DoubleSide, depthTest: !1 }),
        i = new Mesh(e, t)
      this.debugZoom = i
    }
    this.renderer.getScene().add(this.debugPlane, this.debugOrbit, this.debugZoom)
  }

  removeDebugObjects() {
    null != this.debugPlane && (this.renderer.getScene().remove(this.debugPlane), (this.debugPlane = null))
    null != this.debugOrbit && (this.renderer.getScene().remove(this.debugOrbit), (this.debugOrbit = null))
    null != this.debugZoom && (this.renderer.getScene().remove(this.debugZoom), (this.debugZoom = null))
  }

  updateDebugObjects() {
    if (this.displayDollhouseMetadata) {
      const { plane: e, orbitPt: t, zoomDir: i } = this.controls.getDebugState()
      null != this.debugPlane && ((this.debugPlane.plane = e), this.debugPlane.updateMatrixWorld(!0))
      null != this.debugOrbit && this.debugOrbit.position.copy(t)
      if (null != this.debugZoom) {
        const e = this.cameraPoseProxy.pose.fovCorrectedPosition().clone().addScaledVector(i, this.cameraPoseProxy.pose.fovCorrectedFocalDistance())
        this.debugZoom.position.copy(e)
      }
    }
  }
}
