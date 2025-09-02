import { TransitionTypeKey } from "../const/14715"
import { ToolsList } from "../const/tools.const"
import * as q from "../other/40731"
import { CameraRigConfig } from "../utils/camera.utils"
import { CameraQuaternion, DirectionVector } from "../webgl/vector.const"

import { Box2, Box3, MathUtils, Quaternion, Vector2, Vector3 } from "three"
import { SetMouseCursorCommand } from "../command/cursor.command"
import { MovetoFloorCommand } from "../command/floors.command"
import {
  FocusOnPinInsideCommand,
  FocusOnPointInsideCommand,
  LockNavigationCommand,
  MoveToSweepCommand,
  NavigateToLabelCommand,
  NavigateToPoseCommand,
  NavigateToRoomCommand,
  UnlockNavigationCommand
} from "../command/navigation.command"
import { SetFocusSweepCommand } from "../command/sweep.command"
import { ChangeViewmodeCommand, ViewModeCommand } from "../command/viewmode.command"
import { TargetPhi, TransitionTypeList } from "../const/64918"
import { DollhousePeekabooKey, SweepTransition, TransitionTimeConfig } from "../const/66777"
import * as he from "../const/93642"
import { CursorStyle } from "../const/cursor.const"
import { KeyboardCode, KeyboardStateList } from "../const/keyboard.const"
import { MouseKeyIndex } from "../const/mouse.const"
import { CameraSymbol, InputSymbol, MeshQuerySymbol, ModeSymbol, NavigationSymbol, NavSymbol, RaycasterSymbol, SweepDataSymbol } from "../const/symbol.const"
import { TransitionFactor } from "../const/transition.const"
import { CommandBinder } from "../core/commandBinder"
import { DebugInfo } from "../core/debug"
import { OpenDeferred } from "../core/deferred"
import Engine from "../core/engine"
import EngineContext from "../core/engineContext"
import { NullGeneratorResult, WaitForPromiseGeneratorResult } from "../core/engineGenerators"
import { Module } from "../core/module"
import { AppData, AppMode } from "../data/app.data"
import { CameraData } from "../data/camera.data"
import { FloorsViewData } from "../data/floors.view.data"
import { InteractionData } from "../data/interaction.data"
import { BtnText } from "../data/player.options.data"
import { PolicyData } from "../data/policy.data"
import { SettingsData } from "../data/settings.data"
import { SweepsData } from "../data/sweeps.data"
import { ToolsData } from "../data/tools.data"
import { ViewmodeData } from "../data/viewmode.data"
import { SweepTransitionActiveExceptionError } from "../error/sweepException.error"
import { TransitionExceptionError } from "../error/transitionException.error"
import { DoubleClickerStopEvent, InputClickerEndEvent } from "../events/click.event"
import { HoverMeshEvent, UnhoverMeshEvent } from "../events/hover.event"
import { KeyboardCallbackEvent } from "../events/keyBoard.event"
import { WheelBindEvent } from "../events/wheel.event"
import { clampValueWithThreshold, createRotationMatrixFromQuaternion } from "../math/2569"
import { getPointerScreenPositionVector, isPitchFactorOrtho } from "../math/59370"
import {
  adjustQuaternionByAngle,
  calculateCameraPositionAndRotation,
  calculateVectorFromAngle,
  calculateWorldUnitsFromScreenWidth,
  getRotationQuaternion,
  limitPitchAngle
} from "../math/81729"
import { SweepObject } from "../object/sweep.object"
import { ObservableObject } from "../observable/observable.object"
import { SymbolLoadedMessage } from "../other/2032"
import { hasRoomBound } from "../other/47309"
import { ShowcaseFloorPlanKey } from "../other/65019"
import { isRealNumber } from "../utils/37519"
import { StartTransition } from "../utils/6282"
import { Comparator } from "../utils/comparator"
import { waitRun } from "../utils/func.utils"
import { enabledSweep, isAlignedSweep, isFarSweep, SameOrNearSweep } from "../utils/sweep.utils"
import { sweepScoreByDirection, sweepScoreByPosition } from "../utils/sweepScore.utils"
import { PanoramaOrMesh, ViewModes } from "../utils/viewMode.utils"
import { isVisibleShowcaseMesh } from "../webgl/16769"
import { getSweepByDirection, getSweepByIntersection } from "../webgl/20043"
import { AnimationProgress } from "../webgl/animation.progress"
import { Pose } from "../webgl/pose"
import { ShowcaseMesh } from "../webgl/showcaseMesh"
import { SkySphereMesh } from "../webgl/skySphere.mesh"
import CameraDataModule, * as De from "./cameraData.module"
import InputIniModule from "./inputIni.module"
import MeshQueryModule from "./meshQuery.module"
import { ShowcaseRaycaster } from "./raycaster.module"
import SweepDataModule from "./sweepData.module"
import ViewmodeModule from "./viewmode.module"

declare global {
  interface SymbolModule {
    [NavigationSymbol]: NavigationModule
  }
}

class NavigationException extends TransitionExceptionError {
  constructor(e) {
    super(e)
    this.name = "NavigationException"
  }
}

const m = {
  Locked: "Cannot move while navigation is locked",
  InsideOnly: "Cannot navigate between panos when not in Panorama mode",
  InvalidSweep: "Not at a valid sweep",
  InTransition: "Cannot move while in a transition",
  NoDestinationFound: "Cannot move in that direction",
  InvalidMode: "Cannot move to mode"
}

class P {
  canStartTransition: () => boolean
  commandBinder: Engine["commandBinder"]
  input: InputIniModule
  floorsViewData: FloorsViewData
  navigation: NavigationModule
  sweepData: SweepsData
  cameraModule: CameraDataModule
  toolsData: ToolsData
  meshQuery: MeshQueryModule
  cancelTransition: boolean
  didSetCursor: boolean
  bindings: any[]
  targetFloorId: null | number | string
  targetHitPoint: Vector3
  changeFloorPromise: any
  doubleClickToEnter: any | null
  hasRoomBounds: boolean
  onRoomClick: (e, t, i) => void
  roomNavZoom: (e, t, i) => void
  toggleInput: (e) => void
  onBackgroundClick: () => void
  onBackgroundHover: () => boolean
  onBackgroundUnhover: () => boolean
  onFloorChange: () => void
  clearFloorChange: () => void
  changeFloorIfNeeded: () => void

  constructor(e, t, i, s, o, r, n, a, h, l, d) {
    this.canStartTransition = e
    this.commandBinder = t
    this.input = i
    this.floorsViewData = s
    this.navigation = o
    this.sweepData = r
    this.cameraModule = n
    this.toolsData = a
    this.meshQuery = h
    this.doubleClickToEnter = l
    this.hasRoomBounds = d
    this.bindings = []
    this.cancelTransition = !1
    this.didSetCursor = !1
    this.targetFloorId = null
    this.targetHitPoint = new Vector3()
    this.changeFloorPromise = null
    this.toggleInput = e => {
      this.bindings.forEach(t => (e ? t.renew() : t.cancel()))
    }
    this.onRoomClick = (e, t, i) => {
      if (!this.canStartTransition()) return !1
      if (this.changeFloorPromise) return !0
      if (!i || !i.point) return !1
      const s = this.meshQuery.floorIdFromObject(t)
      if (!s) return !1
      if (!this.floorsViewData.isNavigable(s)) return this.onBackgroundClick()
      if (this.cancelTransition) return !0
      const o = this.floorsViewData.currentFloorId
      return 1 !== this.floorsViewData.totalFloors && s !== o
        ? (this.targetFloorId || ((this.targetFloorId = s), this.targetHitPoint.copy(i.point)), !o && (this.changeFloorIfNeeded(), !0))
        : this.floorsViewData.roomSelectModeActive || this.floorsViewData.floorSelectModeActive
          ? !!this.doubleClickToEnter || this.roomNavZoom(e, t, i)
          : this.floorsViewData.floorSelectModeActive
            ? ((this.cancelTransition = !1), !1)
            : (this.navigation.focus(i.point).then(() => {
                this.cancelTransition || this.setFocusSweep(i), (this.cancelTransition = !1)
              }),
              !0)
    }
    this.roomNavZoom = (e, t, i) =>
      !i ||
      ((this.cancelTransition = !0),
      (async () => {
        this.doubleClickToEnter || (this.hasRoomBounds && (await waitRun(100))),
          await this.changeFloorPromise,
          await this.cameraModule.cancelTransition(),
          await this.navigation.navigateToPanoNearIntersection(i),
          (this.cancelTransition = !1)
      })(),
      this.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.DEFAULT)),
      !0)
    this.onBackgroundClick = () =>
      !!this.canStartTransition() &&
      !!this.floorsViewData.showAllFloorsOption &&
      !this.targetFloorId &&
      (!!this.cancelTransition ||
        ((this.cancelTransition = !0),
        void this.cameraModule
          .cancelTransition()
          .then(() => this.commandBinder.issueCommand(new MovetoFloorCommand(null, !1)))
          .then(() => {
            this.cancelTransition = !1
          })))
    this.onBackgroundHover = () => {
      const { activeToolName: e } = this.toolsData
      return (
        null !== this.floorsViewData.currentFloorId &&
          e !== ToolsList.LABELS &&
          e !== ToolsList.ROOM_BOUNDS &&
          ((this.didSetCursor = !0), this.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.FINGER))),
        !1
      )
    }
    this.onBackgroundUnhover = () => (
      this.didSetCursor && (this.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.DEFAULT)), (this.didSetCursor = !1)), !1
    )
    this.onFloorChange = () => {
      null === this.floorsViewData.currentFloorId && this.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.DEFAULT))
    }
    this.clearFloorChange = () => {
      this.targetFloorId = null
    }
    this.changeFloorIfNeeded = async () => {
      if (this.targetFloorId) {
        this.changeFloorPromise = this.commandBinder.issueCommand(new MovetoFloorCommand(this.targetFloorId, !1, void 0, this.targetHitPoint))
        await this.changeFloorPromise
        this.targetFloorId = null
        this.changeFloorPromise = null
      }
    }
    this.bindings.push(
      this.input.registerMeshHandler(InputClickerEndEvent, Comparator.is(isVisibleShowcaseMesh), this.onRoomClick, { default: !0 }),
      this.input.registerUnfilteredHandler(InputClickerEndEvent, this.clearFloorChange),
      this.input.registerHandler(InputClickerEndEvent, this.changeFloorIfNeeded),
      this.input.registerMeshHandler(InputClickerEndEvent, Comparator.isType(SkySphereMesh), this.onBackgroundClick, { default: !0 }),
      this.input.registerMeshHandler(HoverMeshEvent, Comparator.isType(SkySphereMesh), this.onBackgroundHover),
      this.input.registerMeshHandler(UnhoverMeshEvent, Comparator.isType(SkySphereMesh), this.onBackgroundUnhover),
      this.floorsViewData.makeFloorChangeSubscription(this.onFloorChange)
    )
    l && this.bindings.push(this.input.registerMeshHandler(DoubleClickerStopEvent, Comparator.is(isVisibleShowcaseMesh), this.roomNavZoom, { default: !0 }))
  }

  wbu

  async setFocusSweep(e) {
    if (!this.canStartTransition()) return
    if (this.cancelTransition) return
    const t = getSweepByIntersection(this.sweepData, !1, e, this.meshQuery)
    t.length > 0 && t[0].sweep && (await this.commandBinder.issueCommand(new SetFocusSweepCommand(t[0].sweep.id)))
  }
}

const V = new DebugInfo("nav-input")

const hotkeyDirections = {
  [KeyboardCode.W]: DirectionVector.FORWARD,
  [KeyboardCode.A]: DirectionVector.LEFT,
  [KeyboardCode.S]: DirectionVector.BACK,
  [KeyboardCode.D]: DirectionVector.RIGHT,
  [KeyboardCode.UPARROW]: DirectionVector.FORWARD,
  [KeyboardCode.DOWNARROW]: DirectionVector.BACK
}

class InputInside {
  navigation: NavigationModule
  inputIni: InputIniModule
  insideNav: any[]
  insideVrNav: any[]
  continuousMovementHotkey: string
  hotkeys: (e) => Array<any>
  toggleInput: (e) => void
  toggleVrInput: (e) => void
  registerInsideClickHandlers: (e) => Array<any>
  registerVrClickHandlers: (e) => Array<any>
  registerWheelInput: (e) => Array<any>
  tryExecuteAction: (e, t, i, l?) => void

  constructor(e, t, i) {
    this.navigation = e
    this.inputIni = t
    this.insideNav = []
    this.insideVrNav = []

    this.toggleInput = e => {
      this.insideNav.forEach(t => (e ? t.renew() : t.cancel()))
    }
    this.toggleVrInput = e => {
      this.insideVrNav.forEach(t => (e ? t.renew() : t.cancel()))
    }
    this.registerInsideClickHandlers = e => [
      e.registerMeshHandler(
        InputClickerEndEvent,
        Comparator.is(isVisibleShowcaseMesh),
        (e, t, i) =>
          this.tryExecuteAction(
            (e, t) => z(e) && L(t),
            (e, t) => L(t) && this.navigation.navigateTowardsIntersection(t),
            e,
            i
          ),
        { default: !0 }
      ),
      e.registerMeshHandler(
        InputClickerEndEvent,
        Comparator.isType(SkySphereMesh),
        (e, t, i) =>
          this.tryExecuteAction(
            (e, t) => z(e) && L(t),
            (e, t) => L(t) && this.navigation.navigateTowardsIntersection(t),
            e,
            i
          ),
        { default: !0 }
      )
    ]
    this.registerVrClickHandlers = e => [
      e.registerMeshHandler(
        InputClickerEndEvent,
        Comparator.isInstanceOf(ShowcaseMesh),
        (e, t, i) =>
          this.tryExecuteAction(
            (e, t) => z(e) && L(t),
            (e, t) => L(t) && this.navigation.navigateToPanoNearIntersection(t),
            e,
            i
          ),
        { default: !0 }
      )
    ]
    this.registerWheelInput = e => [
      e.registerHandler(WheelBindEvent, e =>
        this.tryExecuteAction(
          e => !0,
          e => {
            if (e instanceof WheelBindEvent) {
              const t = new Vector3(0, 0, Math.sign(e.delta.y))
              return !!this.navigation.navigateInLocalDirection(t)
            }
            return !1
          },
          e
        )
      )
    ]
    this.hotkeys = e => [
      e.registerHandler(KeyboardCallbackEvent, e =>
        this.tryExecuteAction(
          e => (N(e) || U(e)) && e.key in hotkeyDirections,
          e => {
            if (N(e)) {
              this.continuousMovementHotkey = e.key
              const t = hotkeyDirections[e.key]
              this.navigation.setContinuousNavigationLocalDirection(t)
            } else U(e) && e.key === this.continuousMovementHotkey && this.navigation.setContinuousNavigationLocalDirection()
            return !1
          },
          e
        )
      )
    ]
    this.tryExecuteAction = (e, t, i, s) => {
      let o = !1
      try {
        this.navigation.isNavigationInputAllowed() && e(i, s) && (o = t(i, s))
      } catch (e) {
        if (!(e instanceof NavigationException)) throw (V.warn(e), e)
        V.debug(e)
      }
      return o
    }
    this.insideVrNav.push(...this.registerVrClickHandlers(this.inputIni))
    this.insideNav.push(...this.registerInsideClickHandlers(this.inputIni), ...this.hotkeys(this.inputIni))
    i && this.insideNav.push(...this.registerWheelInput(this.inputIni))
  }

  get bindings() {
    return [...this.insideNav, ...this.insideVrNav]
  }
}

function L(e) {
  return void 0 !== e && void 0 !== e.point
}

function N(e) {
  return e instanceof KeyboardCallbackEvent && e.state === KeyboardStateList.DOWN
}

function U(e) {
  return e instanceof KeyboardCallbackEvent && e.state === KeyboardStateList.UP
}

function z(e) {
  return e instanceof InputClickerEndEvent && e.button === MouseKeyIndex.PRIMARY
}

function Y(e) {
  if (e && "object" == typeof e && "min" in e && "max" in e) {
    const t = e
    if (q.u(t.min) && q.u(t.max)) return !0
  }
  return !1
}

function X(e) {
  if (e && "object" == typeof e && "x" in e && "y" in e) {
    const t = e
    return isRealNumber(t.x) && isRealNumber(t.y)
  }
  return !1
}

function ee(e: Box3) {
  if (e && "object" == typeof e && "min" in e && "max" in e) {
    const t = e
    if (X(t.min) && X(t.max)) return !0
  }
  return !1
}

class NavigationOutside {
  canStartTransition: Function
  pose: Pose
  cameraData: CameraData
  cameraModule: CameraDataModule
  viewmodeData: ViewmodeData

  constructor(e, t, i, s, o) {
    this.canStartTransition = e
    this.pose = t
    this.cameraData = i
    this.cameraModule = s
    this.viewmodeData = o
    this.focus = this.focus.bind(this)
    this.focusFloorplan = this.focusFloorplan.bind(this)
  }

  async focus(e, t) {
    if (!this.canStartTransition()) return
    let i, s, o
    Y(e)
      ? ((s = e), (i = s.getCenter(new Vector3())))
      : ee(e)
        ? ((s = new Box3()), s.min.set(e.min.x, 0, e.min.y), s.max.set(e.max.x, 0, e.max.y), (o = new Box2(e.min, e.max)), (i = s.getCenter(new Vector3())))
        : ((i = e), (s = void 0))
    const { from, transition, mode } = null != t ? t : ({} as any)
    let { position: l, rotation: d, focalDistance: c } = this.pose
    const u = this.pose.pitchFactor() < 0.01
    if (
      (mode !== ViewModes.Dollhouse || (!u && !1 !== (null == t ? void 0 : t.forceOrtho)) || (d = adjustQuaternionByAngle(d, -55)),
      (o && ee(o)) || (null == t ? void 0 : t.forceOrtho) || mode === ViewModes.Floorplan)
    ) {
      if (
        (o ||
          (s && (o = new Box2(new Vector2(s.min.x, s.min.z), new Vector2(s.max.x, s.max.z))),
          !s && i && (o = new Box2(new Vector2(i.x - 5, i.z - 5), new Vector2(i.x + 5, i.z + 5)))),
        !o)
      )
        throw new Error("Floorplan mode requires a box or point")
      return this.focusFloorplan(i, o, mode === ViewModes.Dollhouse)
    }
    from
      ? ((l = from), (d = getRotationQuaternion(l, i)))
      : s
        ? ({ focalDistance: c, rotation: d, position: l } = this.getPoseForBox({ box: s, targetRotation: d }))
        : (l = calculateVectorFromAngle(d, i, c))
    const m = {
      pose: { position: l, rotation: d },
      transitionType: null != transition ? transition : TransitionTypeList.Interpolate,
      focalDistance: c,
      transitionTime: TransitionFactor.TRANSITION_TIME_DH,
      autoOrtho: u
    }
    return this.cameraModule.moveTo(m).nativePromise()
  }

  async focusFloorplan(e, t, i) {
    i &&
      (await this.cameraModule.moveTo({
        transitionType: TransitionTypeList.OrbitTo,
        pose: {},
        autoOrtho: !0,
        targetPhi: TargetPhi.Top
      }))
    const s = (function (e, t, i, s) {
      const o = e.pose,
        r = new Vector3().copy(i())
      let n: any = null,
        a = o.focalDistance
      const h =
          s.min.distanceTo(s.max) / calculateWorldUnitsFromScreenWidth(o.position.distanceTo(r), o.projection.asThreeMatrix4(), e.width) / e.screenDiagonalPx,
        l = h < 0.2,
        d = h > 1.2,
        c = (l ? 0.2 + 0.1 : 1.2 - 0.1) / h

      if (t.isFloorplan()) {
        r.y = o.position.y
        a = o.focalDistance
        n = o.projection.clone()
        if (l || d) {
          n.elements[0] *= c
          n.elements[5] *= c
        }
      }
      if (t.isDollhouse() && ((r.y = o.fovCorrectedPosition().y), (a = o.fovCorrectedFocalDistance()), l || d)) {
        const e = o.fovCorrectedFocalDistance() / c,
          t = o.fovCorrectedPosition().y - o.fovCorrectedFocalDistance() + e
        r.y = t
        a = e
      }
      return { position: r, projection: n, focalDistance: a }
    })(this.cameraData, this.viewmodeData, () => e, t)
    return this.cameraModule
      .moveTo({
        pose: { position: s.position },
        projection: s.projection ? s.projection : void 0,
        transitionType: TransitionTypeList.Interpolate,
        transitionTime: TransitionFactor.TRANSITION_TIME_ROOM,
        autoOrtho: this.cameraData.pose.autoOrtho,
        focalDistance: s.focalDistance
      })
      .nativePromise()
  }

  getPoseForBox({ box: e, targetRotation: t }) {
    let i = this.pose
    i.pitchFactor() < 0.01 && ((i = i.clone()), i.unapplyPhiBasedFovSquish(), i.resetProjMatrix())
    const s = t || i.rotation,
      o = 35 * MathUtils.DEG2RAD
    limitPitchAngle(s, o)
    const r = i.aspect(),
      n = e.getCenter(new Vector3()),
      a = {
        targetPosition: n,
        targetRotation: s.clone(),
        angleDown: undefined,
        box: e,
        fovY: i.fovY(),
        aspectRatio: r
      },
      h = calculateCameraPositionAndRotation(a),
      l = n.distanceTo(h.position)
    return { position: h.position, rotation: h.rotation, focalDistance: l }
  }
}

const le = !0,
  de = 8,
  ce = 0.1,
  ue = -25,
  me = 500,
  pe = -2,
  ge = 32,
  ye = 32

class NavigationPoint {
  cameraData: CameraData
  sweepData: SweepsData
  viewmodeModule: ViewmodeModule
  picking: ShowcaseRaycaster
  issueCommand: CommandBinder["issueCommand"]
  tryNavigateToPoint: (e, t, i, s, o, r, n) => Promise<boolean>
  scoreByLatitude: (e, t) => void
  sweepCanSeeNote: (e, t) => boolean
  getSweepToPointRotation: (e: Vector3, t: Vector3, i?: Quaternion) => Quaternion
  withinLatitudeFilter: (e) => void
  notTooCloseFilter: (e) => void
  notTooFarFilter: (e) => void
  scoreByDirection: (e?, t?, l?) => void
  scoreByFloor: (e?, t?) => void

  constructor(e, t, i, s, o) {
    this.cameraData = e
    this.sweepData = t
    this.viewmodeModule = i
    this.picking = s
    this.issueCommand = o
    this.tryNavigateToPoint = async (e, t, i, s, o, r, n) => {
      const h = n ? n.slice() : []
      const l = r ? r.slice() : []
      h.push(isAlignedSweep())
      h.push(enabledSweep())
      l.push(this.scoreByLatitude(e, ge))
      if (t === TransitionTypeList.Interpolate && PanoramaOrMesh(this.viewmodeModule.currentMode) && this.sweepData.currentSweep) {
        const t = this.sweepData.currentSweep
        const i = this.sweepData.getSweep(t)
        const s = i.position.clone().sub(e).normalize()
        h.push(SameOrNearSweep(i))
        l.push(sweepScoreByDirection(e, s))
      }
      h.push(this.withinLatitudeFilter(e))
      h.push(this.notTooCloseFilter(e))
      le || h.push(this.notTooFarFilter(e))
      l.push(sweepScoreByPosition(e, pe))
      const c = this.sweepData.sortByScore(h, l)
      const u = this.sweepData.currentSweepObject
      const m = new Vector3()
      let p: Promise<any> | null = null
      let g = !1
      let y: SweepObject | null = null
      const f = PanoramaOrMesh(this.viewmodeModule.currentMode)
      const w = null != o ? o : 15
      const M = f && u ? new Set(u.neighbours.filter(e => this.sweepData.getSweep(e).position.distanceTo(u.position) < w).concat([u.id])) : new Set()
      for (const o of c) {
        if (this.sweepCanSeeNote(e, o.sweep)) {
          if (((y = o.sweep), t === TransitionTypeList.Interpolate || M.has(y.id))) {
            m.copy(e).sub(y.position).normalize(), (g = !0)
            const o = this.getSweepToPointRotation(y.position, e, s)
            const r = this.cameraData.pose.projection.asThreeMatrix4()
            const { width: n, height: h } = this.cameraData
            const l = getPointerScreenPositionVector(e, y.position, o, n, h, r)
            i && i(l)
            p = f
              ? this.issueCommand(
                  new MoveToSweepCommand({
                    transition: TransitionTypeList.Interpolate,
                    sweep: y.id,
                    rotation: o
                  })
                )
              : this.viewmodeModule.switchToMode(ViewModes.Panorama, t, { rotation: o, sweepID: y.id })
          }
          break
        }
      }

      return (
        !(!y || (!g && t === TransitionTypeList.Interpolate)) &&
        (p ||
          (p = this.issueCommand(
            new MoveToSweepCommand({
              transition: t,
              transitionTime: me,
              sweep: y.id,
              rotation: this.getSweepToPointRotation(y.position, e, s)
            })
          )),
        p && (await p),
        !0)
      )
    }
    this.getSweepToPointRotation = (e, t, i) => {
      const s = getRotationQuaternion(e, t)
      i && s.multiply(i)
      return createRotationMatrixFromQuaternion(s)
    }
    this.sweepCanSeeNote = (() => {
      const e = new Vector3()
      return (t, i) => {
        e.copy(t).sub(i.position)
        const s = e.length()
        e.normalize()
        let o = this.picking.pick(i.position, e, isVisibleShowcaseMesh)
        return (!o || o.distance > s) && (o = this.picking.pick(t, e.negate(), isVisibleShowcaseMesh)), !o || s <= o.distance
      }
    })()
    this.notTooCloseFilter = e => t => Math.abs(t.position.x - e.x) > ce || Math.abs(t.position.z - e.z) > ce
    this.notTooFarFilter = e => t => t.position.distanceTo(e) > de
    this.withinLatitudeFilter = e => t => {
      const i = new Vector3().copy(e).sub(t.position),
        s = -Math.atan(i.y / Math.sqrt(i.x * i.x + i.z * i.z)),
        o = MathUtils.degToRad(ue)
      return he.zf - o < s && s < he.uQ + o
    }
    this.scoreByLatitude = (() => {
      const e = new Vector3()
      return (t, i) => s => {
        e.copy(t).sub(s.position)
        const o = Math.abs(Math.atan(e.y / Math.sqrt(e.x * e.x + e.z * e.z))) / (Math.PI / 2),
          r = Math.floor(20 * o) / 20
        return i * (1 - r)
      }
    })()
    this.scoreByDirection = (() => {
      const e = new Vector3(),
        t = new Vector3()
      return (i, s, o) => r => {
        if (Math.abs(s.dot(DirectionVector.UP)) > 0.75) return 0
        t.copy(s).normalize(), e.copy(i).sub(r.position).normalize()
        return -1 * e.dot(t) * o
      }
    })()
    this.scoreByFloor = (e, t) => i => (i.floorId === e ? t : 0)
  }

  async focusPin(e, t, i, s, o) {
    const { anchorPosition: r, stemNormal: n, stemLength: a } = e,
      h = r.clone().add(n.clone().setLength(a)),
      l = [this.scoreByDirection(h, n, ye), this.scoreByFloor(e.floorId, 32)]
    return this.focusPoint(h, t, i, s, o, l)
  }

  focus(e, t) {
    var i
    let s
    if (Y(e)) {
      s = e.getCenter(new Vector3())
    } else if (ee(e)) {
      const t = e.getCenter(new Vector2())
      s = new Vector3(t.x, 0, t.y)
    } else {
      s = e
    }
    return this.focusPoint(
      s,
      null !== (i = null == t ? void 0 : t.transition) && void 0 !== i ? i : TransitionTypeList.Interpolate,
      void 0,
      void 0,
      void 0,
      (null == t ? void 0 : t.from) ? [sweepScoreByPosition(null == t ? void 0 : t.from, 100)] : [],
      [isFarSweep(s, 0.25)]
    )
  }

  async focusPoint(e, t, i, s, o?, r?, n?) {
    if (this.cameraData.canTransition() && this.sweepData.canTransition() && !(await this.tryNavigateToPoint(e, t, i, s, o, r, n))) {
      if (t !== TransitionTypeList.Interpolate) return this.goToNearestSweep(e, t, i, s)
      try {
        await this.issueCommand(new ChangeViewmodeCommand(ViewModeCommand.DOLLHOUSE, TransitionTypeList.Interpolate))
      } catch (o) {
        await this.goToNearestSweep(e, t, i, s)
      }
      ;(await this.tryNavigateToPoint(e, t, i, s, o, r, n)) || (await this.goToNearestSweep(e, t, i, s))
    }
  }

  async goToNearestSweep(e: Vector3, t?: number, i?: Function, s?: Quaternion) {
    const o = e
    const r = this.sweepData.getClosestSweep(o, !0)
    if (!r) throw new Error("Cannot find sweep closest to Mattertag disc")
    const n = this.getSweepToPointRotation(r?.position, o, s)
    const h = this.cameraData.pose.projection.asThreeMatrix4()
    const { width: l, height: c } = this.cameraData
    const u = getPointerScreenPositionVector(o, r?.position, n, l, c, h)
    i && i(u)
    await this.issueCommand(
      new MoveToSweepCommand({
        sweep: r?.id,
        rotation: n,
        transition: t || TransitionTypeList.Interpolate
      })
    )
  }
}

export class PositionTracker extends ObservableObject {
  _active: boolean
  _slowdown: boolean
  _isSlowingDown: boolean
  _initialSpeed: number
  _speed: number
  _acceleration: number
  _desiredAcceleration: number
  _jerk: number
  _maxSpeed: number
  _minSpeed: number
  _startValue: number
  _value: number
  _endValue: number
  _delay: number
  _onComplete: Function

  constructor(e = 1, t = 0) {
    super()
    this._slowdown = !0
    this._initialSpeed = 0
    this._speed = 0
    this._acceleration = 1
    this._desiredAcceleration = 1
    this._jerk = 1
    this._maxSpeed = 1
    this._minSpeed = 0.05
    this._startValue = 0
    this._value = 0
    this._endValue = e
    this._delay = t
  }

  get active() {
    return this._active
  }

  get currentValue() {
    return this._value
  }

  get endValue() {
    return this._endValue
  }

  get speed() {
    return this._speed
  }

  get isSlowingDown() {
    return this._isSlowingDown
  }

  get maxSpeed() {
    return this._maxSpeed
  }

  get acceleration() {
    return this._acceleration
  }

  getProgressPercent() {
    return (this._value - this._startValue) / (this._endValue - this._startValue)
  }

  onComplete(e) {
    this._onComplete = e
    return this
  }

  setStartValue(e) {
    this._startValue = e
    return this
  }

  setCurrentValue(e) {
    this._value = e
    return this
  }

  setEndValue(e) {
    this._endValue = e
    return this
  }

  setInitialSpeed(e) {
    this._initialSpeed = e
    return this
  }

  setMaxSpeed(e: number) {
    this._maxSpeed = e
    return this
  }

  setDesiredAcceleration(e: number) {
    this._desiredAcceleration = e
    this._jerk = 3 * Math.abs(this._desiredAcceleration - this._acceleration)
    return this
  }

  activate(e) {
    this._active = e
    return this
  }

  setAccel(e: number) {
    this._acceleration = Math.abs(e)
    return this
  }

  start() {
    this._active = !0
    this._value = this._startValue
    this._speed = this._initialSpeed
  }

  setSlowdown(e) {
    this._slowdown = e
    return this
  }

  tick(e) {
    if (!this._active || e <= 0) return
    if (this._delay > 0) return void (this._delay -= e)
    e > 33 && (e = 33)
    const t = 0.001 * e,
      i = this._value,
      s = this._speed * t,
      o = clampValueWithThreshold(i, this.endValue, s),
      r = this._endValue - i <= this.getSlowdownDistance(),
      n = this._slowdown && r,
      a = n ? this._minSpeed : this._maxSpeed,
      h = this.acceleration * t
    this._speed = clampValueWithThreshold(this._speed, a, h)
    this._isSlowingDown = n
    const l = this._desiredAcceleration,
      d = this._jerk * t
    this._acceleration = clampValueWithThreshold(this._acceleration, l, d)
    this._value = o
    return o === this.endValue ? (this.activate(!1), this.commit(), void (this._onComplete && this._onComplete())) : void 0
  }

  getSlowdownDistance() {
    const e = this.speed,
      t = this._acceleration,
      i = e / (0 === t ? 1e-5 : t)
    return this.speed * i + 0.5 * t * i * i
  }

  stop(e) {
    this._active = !1
    this._endValue = e
    this.commit()
  }
}

const Te = new DebugInfo("walk")

export class NavigationWalk {
  cameraPose: Pose
  sweepTransition: {
    progress: AnimationProgress
    active: boolean
    from?: string
    to?: string
  }
  sweepControl: any
  generators: Engine
  generator: null | (() => Generator)
  navigation: NavigationModule
  cameraControl: CameraDataModule
  active: boolean
  path: any[]
  lastQueueTime: number
  repeatedQueueDelayMS: number
  baseTransitionTime: number
  baseTransitionSpeed: number
  positionTracker: PositionTracker
  continuousMovementDirection: Vector3
  nextSweep: SweepObject | undefined
  activePromise: null | Promise<any>

  constructor(e, t, i, s, o, r, n) {
    this.cameraPose = e
    this.sweepTransition = t
    this.sweepControl = i
    this.cameraControl = s
    this.generators = o
    this.navigation = r
    this.active = !1
    this.path = []
    this.lastQueueTime = 0
    this.repeatedQueueDelayMS = 150
    this.positionTracker = new PositionTracker().setAccel(15).setMaxSpeed(5)
    this.baseTransitionTime = TransitionTimeConfig.camera.baseTransitionTime
    this.baseTransitionSpeed = TransitionTimeConfig.camera.transitionSpeed
    n.onPropertyChanged(De.baseTransitionSpeedKey, e => {
      this.baseTransitionTime = e
    })
  }

  get isActive() {
    return this.active
  }

  get targetSweep() {
    return this.nextSweep
  }

  setContinuousMovementDirection(e: Vector3) {
    this.continuousMovementDirection = e
    !this.active && e && this.navigation.navigateInLocalDirection(e)
  }

  stop() {
    this.path.length = 0
    this.cameraControl.endExternalTransition()
    this.nextSweep = void 0
    this.active = !1
    this.generator && (this.generators.stopGenerator(this.generator), (this.generator = null))
  }

  appendNode(e, t) {
    if (!this.canQueueSweeps(e)) return Promise.resolve()
    if (!e) return Promise.resolve()
    this.path.push(e)
    this.lastQueueTime = Date.now()
    if (!this.active) {
      this.active = !0
      const { generator: t, deferred: i } = this.createTransition()
      this.generators.startGenerator(t)
      this.generator = t
      this.activePromise = i.nativePromise().then(() => {
        this.activePromise = null
      })
      this.positionTracker.setEndValue(this.getDistanceToSweep(e))
      this.checkForSpeedIncrease(e)
    }
    return this.activePromise ? this.activePromise : Promise.resolve()
  }

  canQueueSweeps(e?) {
    if (e && this.path.indexOf(e) >= 0) return !1
    return !(this.path.length >= 2) && !(this.active && Date.now() - this.lastQueueTime < this.repeatedQueueDelayMS)
  }

  attemptContinuousNavigation() {
    try {
      this.continuousMovementDirection && this.navigation.navigateInLocalDirection(this.continuousMovementDirection)
    } catch (e) {
      if (!(e instanceof NavigationException || e instanceof SweepTransitionActiveExceptionError)) throw (Te.warn(e), e)
      Te.debug(e)
    }
  }

  createTransition() {
    const e = this
    const t = new OpenDeferred()
    return {
      generator: function* () {
        let i = Date.now()
        e.cameraControl.beginExternalTransition()
        const s = new Vector3().copy(e.cameraPose.position),
          o = new Vector3(),
          r = new Vector3(),
          n = e.positionTracker
        for (n.setMaxSpeed(5).setAccel(15); e.path.length > 0; ) {
          const t = e.path.shift()
          if (!t) {
            e.nextSweep = void 0
            break
          }
          e.nextSweep = t
          s.copy(e.cameraPose.position)
          const a = s.distanceTo(t.position)
          for (
            n.setStartValue(0).setEndValue(a).setInitialSpeed(n.speed).activate(!0),
              r.subVectors(t.position, s),
              r.normalize(),
              yield new WaitForPromiseGeneratorResult(
                e.sweepControl.activateSweepUnsafe({ sweepId: t.id }).then(() => {
                  e.sweepControl.beginSweepTransition({ sweepId: t.id, internalProgress: !1 })
                })
              ),
              n.start(),
              e.checkForSpeedIncrease(t);
            n.active;

          ) {
            const a = Date.now() - i,
              h = 0 === e.path.length
            let l = !1,
              d = !1
            if (!h) {
              const i = e.path[0]
              l = n.endValue - n.currentValue + t.position.distanceTo(i.position) < n.getSlowdownDistance()
              const s = o.subVectors(i.position, t.position)
              s.normalize()
              r.dot(s) < 0.3 && (d = !0)
            }
            n.setSlowdown(h || l || d)
            n.tick(a)
            const c = n.getProgressPercent()
            e.cameraControl.updateCameraPosition(o.lerpVectors(s, t.position, c)),
              e.sweepTransition.progress.modifyAnimation(c, 1, 0),
              (i = Date.now()),
              e.continuousMovementDirection && e.canQueueSweeps() && n.isSlowingDown && e.attemptContinuousNavigation(),
              n.active && (yield new NullGeneratorResult())
          }
          e.sweepControl.endSweepTransition({ sweepId: t.id })
        }
        t.resolve()
        e.stop()
      },
      deferred: t
    }
  }

  getDistanceToSweep(e) {
    return (this.nextSweep ? this.nextSweep.position : this.cameraPose.position).distanceTo(e.position)
  }

  checkForSpeedIncrease(e) {
    const t = this.positionTracker,
      i = this.getDistanceToSweep(e),
      s = t.endValue - t.currentValue,
      o = s + i - t.getSlowdownDistance()
    if (s + i > 12) {
      const e = this.baseTransitionTime,
        i = this.baseTransitionSpeed,
        s = 0.001 * (e + Math.log2(1 + o) * De.TRANSITION_DISTANCE_MULTIPLIER * i) - t.maxSpeed / t.acceleration,
        r = o / s
      s > 0 && t.setMaxSpeed(r).setDesiredAcceleration(3 * r)
    } else {
      t.setMaxSpeed(5).setDesiredAcceleration(15)
    }
  }
}

class NavigationLabel {
  engine: EngineContext
  navigation: NavigationModule
  settingsData: SettingsData
  cameraData: CameraData
  cameraModule: CameraDataModule
  viewmodeData: ViewmodeData
  toolsData: ToolsData
  defaultSize: Vector3

  constructor(e, t, i, s, o, r, n) {
    this.engine = e
    this.navigation = t
    this.settingsData = i
    this.cameraData = s
    this.cameraModule = o
    this.viewmodeData = r
    this.toolsData = n
    this.defaultSize = new Vector3().fromArray([3, 3, 3])
  }

  async enforceLabelEditorFriendlyViewmode() {
    let t = !0
    await this.cameraData.transition.promise?.nativePromise()
    const i = this.determineViewmode()
    if (this.viewmodeData.currentMode !== i)
      try {
        await this.engine.commandBinder.issueCommand(
          new ChangeViewmodeCommand(i === ViewModes.Dollhouse ? ViewModeCommand.DOLLHOUSE : ViewModeCommand.FLOORPLAN, TransitionTypeList.Interpolate)
        )
      } catch (e) {
        t = !1
      }
    return t
  }

  async navigateToLabel(e) {
    try {
      const t = this.determineViewmode()
      await this.navigation.focus(new Box3().setFromCenterAndSize(new Vector3(0, 1, 0).add(e.position), this.defaultSize), {
        floorId: e.floorId,
        mode: t
      })
      return this.viewmodeData.currentMode === ViewModes.Dollhouse || this.viewmodeData.currentMode === ViewModes.Floorplan
    } catch (e) {
      return !1
    }
  }

  determineViewmode() {
    const e = this.settingsData.tryGetProperty(DollhousePeekabooKey, !1),
      t = this.toolsData.activeToolName === ToolsList.LABELS || this.settingsData.tryGetProperty(BtnText.LabelsDollhouse, !0),
      i = !this.viewmodeData.isDollhouseDisabled() && t ? ViewModes.Dollhouse : ViewModes.Floorplan,
      s = this.viewmodeData.currentMode
    return e && isPitchFactorOrtho(this.cameraData.pose.pitchFactor()) ? ViewModes.Floorplan : s === ViewModes.Floorplan || s === ViewModes.Dollhouse ? s : i
  }
}

export default class NavigationModule extends Module {
  isNavigationInputAllowed: () => boolean
  addNavigationRule: (e) => void
  removeNavigationRule: (e) => void
  navigationRules: any[]
  inputOutside: P[]
  navigationEnabled: boolean
  navigationPoint: NavigationPoint
  commandBinder: Engine["commandBinder"]
  inputInside: InputInside
  floorsViewData: FloorsViewData
  settingsData: SettingsData
  cameraData: CameraData
  cameraModule: CameraDataModule
  viewmodeData: ViewmodeData
  sweepData: SweepsData
  sweepModule: SweepDataModule
  viewmodeModule: ViewmodeModule
  interactionmodeData: InteractionData
  meshQuery: MeshQueryModule
  navigationLabel: NavigationLabel
  navigationOutside: NavigationOutside
  navigationWalk: NavigationWalk

  constructor() {
    super(...arguments)
    this.name = "navigation"
    this.navigationRules = [() => !0]
    this.navigationEnabled = !0
    this.inputOutside = []
    this.addNavigationRule = e => {
      ;-1 === this.navigationRules.indexOf(e) && this.navigationRules.push(e)
    }
    this.removeNavigationRule = e => {
      const t = this.navigationRules.indexOf(e)
      ;-1 !== t && this.navigationRules.splice(t, 1)
    }
    this.isNavigationInputAllowed = () => {
      const e = this.navigationRules.reduce((e, t) => e && t(), !0)
      return (
        !(!this.navigationEnabled || !e) ||
        (this.log.debug("Cannot move while navigation is locked", {
          blockedByRules: !e,
          blockedByCommand: !this.navigationEnabled
        }),
        !1)
      )
    }
  }

  async init(e, t: EngineContext) {
    const { market: i } = t
    this.commandBinder = t.commandBinder
    this.bindings.push(
      this.commandBinder.addBinding(LockNavigationCommand, async () => this.lockNavigation()),
      this.commandBinder.addBinding(UnlockNavigationCommand, async () => this.unlockNavigation()),
      this.commandBinder.addBinding(FocusOnPointInsideCommand, async e => {
        const { focusPosition: t, transition: i, orientationAdjust: s, onSweepChosen: o, neighborDistanceThreshold: r } = e
        return this.navigationPoint.focusPoint(t, i, o, s, r)
      }),
      this.commandBinder.addBinding(FocusOnPinInsideCommand, async e => {
        const { pinPosition: t, transition: i, orientationAdjust: s, onSweepChosen: o, neighborDistanceThreshold: r } = e
        return this.navigationPoint.focusPin(t, i, o, s, r)
      }),
      this.commandBinder.addBinding(MoveToSweepCommand, e =>
        this.navigateToSweep(e.sweep, e.rotation, e.transition, e.transitionTime, e.transitionSpeedMultiplier)
      ),
      this.commandBinder.addBinding(NavigateToLabelCommand, async ({ position: e, floorId: t, viewmodeOnly: i }) =>
        i
          ? this.navigationLabel.enforceLabelEditorFriendlyViewmode()
          : !(!e || !t) &&
            this.navigationLabel.navigateToLabel({
              position: e,
              floorId: t
            })
      ),
      this.commandBinder.addBinding(NavigateToRoomCommand, async ({ room: e }) => {
        const s = this.floorsViewData.getFloor(e.floorId || this.floorsViewData.topFloorId).medianSweepHeight(),
          o = new Box3(new Vector3(e.bbox.min.x, s, e.bbox.min.y), new Vector3(e.bbox.max.x, s, e.bbox.max.y)),
          r = this.settingsData.tryGetProperty(ShowcaseFloorPlanKey, !1) ? ViewModes.Floorplan : ViewModes.Dollhouse,
          n = isPitchFactorOrtho(this.cameraData.pose.pitchFactor()) || this.viewmodeData.isInside() ? r : this.viewmodeData.currentMode
        return this.focus(o, { mode: n, floorId: e.floorId })
      }),
      this.commandBinder.addBinding(NavigateToPoseCommand, async e => this.navigateToPose(e.pose))
    )
    ;[
      this.settingsData,
      this.sweepData,
      this.sweepModule,
      this.viewmodeData,
      this.viewmodeModule,
      this.cameraData,
      this.cameraModule,
      this.interactionmodeData,
      this.meshQuery
    ] = await Promise.all([
      i.waitForData(SettingsData),
      i.waitForData(SweepsData),
      t.getModuleBySymbol(SweepDataSymbol),
      i.waitForData(ViewmodeData),
      t.getModuleBySymbol(ModeSymbol),
      i.waitForData(CameraData),
      t.getModuleBySymbol(CameraSymbol),
      i.waitForData(InteractionData),
      t.getModuleBySymbol(MeshQuerySymbol)
    ])

    const [s, a, c, u, m] = await Promise.all([
      t.getModuleBySymbol(RaycasterSymbol),
      i.waitForData(ToolsData),
      i.waitForData(FloorsViewData),
      i.waitForData(PolicyData),
      i.waitForData(AppData)
    ])

    this.floorsViewData = c
    this.navigationPoint = new NavigationPoint(
      this.cameraData,
      this.sweepData,
      this.viewmodeModule,
      null == s ? void 0 : s.picking,
      t.commandBinder.issueCommand
    )
    this.navigationLabel = new NavigationLabel(t, this, this.settingsData, this.cameraData, this.cameraModule, this.viewmodeData, a)
    const p = await t.getModuleBySymbol(InputSymbol)
    const g = () => this.isNavigationInputAllowed() && this.viewmodeData.canStartTransition() && this.sweepData.canTransition()
    const y = () => g() && (this.viewmodeData.isDollhouse() || this.viewmodeData.isFloorplan() || this.viewmodeData.isOrthographic())
    this.navigationOutside = new NavigationOutside(y, this.cameraData.pose, this.cameraData, this.cameraModule, this.viewmodeData)
    this.inputOutside.push(
      new P(
        y,
        t.commandBinder,
        p,
        c,
        this,
        this.sweepData,
        this.cameraModule,
        a,
        this.meshQuery,
        this.settingsData.tryGetProperty(DollhousePeekabooKey, !1),
        hasRoomBound(u, this.settingsData, m.application === AppMode.WORKSHOP)
      )
    )
    this.inputInside = new InputInside(this, p, !!e.enableWheel)
    this.inputOutside.forEach(e => this.bindings.push(...e.bindings))
    this.bindings.push(...this.inputInside.bindings)
    this.updateInputBindings()
    this.bindings.push(
      this.viewmodeData.makeModeChangeSubscription(() => {
        this.viewmodeData.currentMode !== ViewModes.Transition && this.updateInputBindings()
      })
    )
    this.navigationWalk = new NavigationWalk(this.cameraData.pose, this.sweepData.transition, this.sweepModule, this.cameraModule, t, this, this.settingsData)
    t.broadcast(new SymbolLoadedMessage(NavSymbol))
  }

  updateInputBindings() {
    const e = this.interactionmodeData.isVR(),
      t = this.viewmodeData.isInside()
    this.inputInside.toggleInput(t && !e)
    this.inputInside.toggleVrInput(t && e)
    this.inputOutside.forEach(e => e.toggleInput(!t))
  }

  navigateInLocalDirection(e: Vector3) {
    const t = this.cameraData.pose.rotation
    return this.navigateInDirection(e.clone().applyQuaternion(t))
  }

  setContinuousNavigationLocalDirection(e?) {
    this.navigationWalk.setContinuousMovementDirection(e)
  }

  navigateTowardsIntersection(e) {
    try {
      this.navigateInDirection(e.point.clone().sub(this.cameraData.pose.position))
    } catch (e) {
      return !1
    }
    return !0
  }

  navigateToPanoNearIntersection(e) {
    const t = getSweepByIntersection(this.sweepData, this.viewmodeData.isInside(), e, this.meshQuery),
      i = t.length > 0 ? t[0].sweep : this.sweepData.getClosestSweep(e.point, !0),
      s = SweepTransition[this.interactionmodeData.mode]
    if (this.viewmodeData.isInside() && i) {
      this.navigateToSweep(i.id, void 0, s)
      return !0
    }
    if (this.viewmodeData.canSwitchViewMode(ViewModes.Panorama)) {
      const e = i ? i.id : void 0
      return this.commandBinder.issueCommand(new ChangeViewmodeCommand(ViewModeCommand.INSIDE, s, { sweepID: e })), !0
    }
    return !1
  }

  navigateInDirection(e: Vector3) {
    if (!this.viewmodeData.isInside()) throw new NavigationException(m.InsideOnly)
    if (!this.sweepData.currentSweep) throw new NavigationException(m.InvalidSweep)
    const t = SweepTransition[this.interactionmodeData.mode]
    const i = getSweepByDirection(
      this.sweepData,
      e,
      this.navigationWalk.isActive ? 0.65 : void 0,
      this.navigationWalk.isActive ? this.navigationWalk.targetSweep : void 0
    )
    if (i.length > 0 && i[0].sweep) return this.navigateToSweep(i[0].sweep.id, void 0, t)
    throw new NavigationException(m.NoDestinationFound)
  }

  async focus(e: Box3, t?) {
    var i
    if (
      !(t = Object.assign(
        {
          mode: this.viewmodeData.currentMode,
          transition: TransitionTypeList.Interpolate
        },
        t
      )).mode ||
      !this.isNavigationInputAllowed()
    ) {
      throw new NavigationException(m.Locked)
    }
    let s
    await StartTransition(this.cameraData, this.viewmodeData)
    if (this.cameraData.pose.autoOrtho && t.mode === ViewModes.Floorplan) {
      t.forceOrtho = !0
    }
    if ((t.floorId && t.floorId !== this.floorsViewData.currentFloorId) || null === this.floorsViewData.currentFloorId || this.viewmodeData.isInside()) {
      this.viewmodeData.isInside() && this.floorsViewData.transitionToFloorInstant(null)
      this.commandBinder.issueCommand(
        new MovetoFloorCommand(t.floorId || this.floorsViewData.getHighestVisibleFloorId(), !0, TransitionFactor.TRANSITION_TIME_DH / 2)
      )
    }

    if (this.viewmodeData.isInside()) {
      let o: Box3 | undefined
      if (Y(e)) o = e
      else if (ee(e)) {
        const s = this.floorsViewData.floors
          .getFloor(null !== (i = t.floorId) && void 0 !== i ? i : this.floorsViewData.getHighestVisibleFloorId())
          .medianSweepFloorHeight()
        o = new Box3(new Vector3(e.min.x, s, e.min.y), new Vector3(e.max.x, s, e.max.y))
      }
      s = (function (e, t) {
        t || (t = (e.currentFloor || e.getFloor(e.bottomFloorId)).boundingBox)
        const i = t.min.y
        const s = t.getCenter(new Vector3())
        const o = t.max.clone()
        o.y = i
        const r = s.distanceTo(o) / Math.tan((CameraRigConfig.fov / 2) * MathUtils.DEG2RAD)
        const n = CameraQuaternion.DOWNWARD.clone().multiply(new Quaternion().setFromAxisAngle(DirectionVector.RIGHT, 45 * MathUtils.DEG2RAD))
        const a = DirectionVector.FORWARD.clone()
          .applyQuaternion(n)
          .multiplyScalar(-1 * r)
        return { position: s.clone().add(a), rotation: n }
      })(this.floorsViewData, o)
    }
    try {
      switch (t.mode) {
        case ViewModes.Panorama:
          await this.navigationPoint.focus(e, t)
          break
        case ViewModes.Dollhouse:
          await this.viewmodeModule.switchToMode(t.mode, t.transition, s)
          await this.navigationOutside.focus(e, t)
          break
        case ViewModes.Floorplan:
          await this.viewmodeModule.switchToMode(t.mode, t.transition)
          await this.navigationOutside.focus(e, t)
          break
        default:
          throw (this.log.warn(`navigation.focus: ${t.mode} not implemented yet`), new NavigationException(m.InvalidMode))
      }
    } catch (i) {
      throw (this.log.debug("Unable to set focus", e, t, i), i)
    }
  }

  lockNavigation() {
    this.navigationEnabled = !1
    this.log.debug("Navigation input locked")
  }

  unlockNavigation() {
    this.navigationEnabled = !0
    this.log.debug("Navigation input unlocked")
  }

  async navigateToSweep(e, t, i, s?, o?) {
    const r = this.settingsData.tryGetProperty(TransitionTypeKey, TransitionTypeList.Interpolate)
    let n
    void 0 === i && (i = r)
    const h = this.sweepData.currentSweep
    if (i === TransitionTypeList.Interpolate) {
      const t = !h || this.sweepData.isSweepAligned(h),
        s = this.sweepData.isSweepAligned(e),
        o = h !== e,
        r = !t || !s,
        n = this.viewmodeData.isInside()
      o && r && n && (i = TransitionTypeList.FadeToBlack)
    }
    if (this.viewmodeData.isInside()) {
      const r = void 0 === t && void 0 === s && void 0 === o,
        h = this.cameraData.canTransition() && this.sweepData.canTransition()
      if (i === TransitionTypeList.Interpolate && this.sweepData.currentSweep !== e && r && (h || this.navigationWalk.isActive)) {
        const t = this.sweepData.getSweep(e)
        n = this.navigationWalk.appendNode(t, this.sweepData.currentSweep)
      } else {
        if (!h) return this.sweepData.currentSweep
        n = this.sweepModule.moveToSweep({
          transitionType: i,
          sweepId: e,
          rotation: t,
          transitionTime: s,
          transitionSpeedMultiplier: o
        })
      }
    } else {
      n = this.viewmodeModule.switchToMode(ViewModes.Panorama, i, { sweepID: e, rotation: t })
    }
    await n
    return this.sweepData.currentSweep
  }

  navigateToPose(e) {
    const t = { 2: ViewModeCommand.DOLLHOUSE, 3: ViewModeCommand.FLOORPLAN },
      { sweepIndex: i, quaternion: s, mode: o } = e
    let { panoId: r, position: n } = e
    if (!r && void 0 !== i) {
      const e = this.sweepData.getSweepByIndex(i)
      e && (r = e.id)
    }
    if (r) {
      this.commandBinder.issueCommand(
        new MoveToSweepCommand({
          sweep: r,
          rotation: s,
          transition: TransitionTypeList.FadeToBlack
        })
      )
    } else {
      if (!(o in t)) throw new Error("Unknown navigation link pose: " + JSON.stringify(e))
      this.commandBinder.issueCommand(
        new ChangeViewmodeCommand(t[o], TransitionTypeList.Interpolate, {
          rotation: s,
          position: n
        })
      )
    }
  }
}
