import { MathUtils, Vector3 } from "three"
import * as Z from "../math/2569"
import * as J from "../webgl/26269"
import { CheckThreshold } from "../utils/49827"
import { isPitchFactorOrtho } from "../math/59370"
import * as R from "../utils/sweepScore.utils"
import * as F from "../math/81729"
import * as I from "../utils/sweep.utils"
import {
  DisableAllFloorsOptionCommand,
  EnableAllFloorsOptionCommand,
  LockFloorNavCommand,
  MovetoFloorCommand,
  MovetoFloorNumberCommand,
  ShowAllFloorsCommand,
  UnlockFloorNavCommand
} from "../command/floors.command"
import { MoveToSweepCommand } from "../command/navigation.command"
import { SetMouseCursorCommand } from "../command/cursor.command"
import { SetFocusSweepCommand } from "../command/sweep.command"
import * as Y from "../utils/comparator"
import * as L from "../const/52498"
import * as T from "../const/53203"
import { TransitionTypeList } from "../const/64918"
import { DollhousePeekabooKey } from "../const/66777"
import { CursorStyle } from "../const/cursor.const"
import { FeaturesFloorselectKey } from "../const/floor.const"
import { KeyboardCode, KeyboardStateList } from "../const/keyboard.const"
import { CameraSymbol, FloorStateSymbol, InputSymbol, LocaleSymbol, MeshQuerySymbol, ModelMeshSymbol } from "../const/symbol.const"
import { DeferredPromise, OpenDeferred } from "../core/deferred"
import EngineContext from "../core/engineContext"
import { NullGeneratorResult } from "../core/engineGenerators"
import { Module } from "../core/module"
import { AppData, AppMode, AppStatus } from "../data/app.data"
import { CameraData } from "../data/camera.data"
import { FloorsData } from "../data/floors.data"
import { FloorsViewData } from "../data/floors.view.data"
import { MeshData } from "../data/mesh.data"
import { BtnText } from "../data/player.options.data"
import { PointerData } from "../data/pointer.data"
import { SettingsData } from "../data/settings.data"
import { SweepsData } from "../data/sweeps.data"
import { TourData } from "../data/tour.data"
import { ViewmodeData } from "../data/viewmode.data"
import { InvalidFloorExceptionError } from "../error/invalidFloorException.error"
import { HoverMeshEvent, UnhoverMeshEvent } from "../events/hover.event"
import { KeyboardCallbackEvent } from "../events/keyBoard.event"
import { AppChangeMessage } from "../message/app.message"
import { EndMoveToSweepMessage } from "../message/sweep.message"
import { EndMoveToFloorMessage } from "../message/floor.message"
import { StartMoveToFloorMessage } from "../message//floor.message"
import { StartViewmodeChange } from "../message/viewmode.message"
import { EndSwitchViewmodeMessage } from "../message/floor.message"
import { AggregateSubscription } from "../subscription/aggregate.subscription"
import { winCanTouch } from "../utils/browser.utils"
import * as Q from "../utils/ease.utils"
import { PanoramaOrMesh, ViewModes } from "../utils/viewMode.utils"
import { Pose } from "../webgl/pose"
import { DirectionVector } from "../webgl/vector.const"
import CameraDataModule from "./cameraData.module"
import InputIniModule from "./inputIni.module"
import MeshQueryModule from "./meshQuery.module"
import ModelMeshModule from "./modelMesh.module"
import { Comparator } from "../utils/comparator"
import { easeInQuad } from "../utils/ease.utils"
import { enabledSweep, isAlignedSweep, sweepByFloor } from "../utils/sweep.utils"
import { sweepScoreByFloorPosition } from "../utils/sweepScore.utils"
import { defaultFloorDuration } from "../const/52498"
import { getRotationQuaternion } from "../math/81729"
import { checkLerpThreshold } from "../math/2569"
import { RoomMeshCheck } from "../webgl/26269"

declare global {
  interface SymbolModule {
    [FloorStateSymbol]: FloorsViewDataModule
  }
}

class x {
  floorsViewData: FloorsViewData
  meshQuery: MeshQueryModule
  viewmodeData: ViewmodeData
  raycasterData: PointerData
  cameraData: CameraData
  applicationData: AppData
  meshModule: ModelMeshModule
  touchDevice: () => void
  getAngleModifier: () => number

  constructor(e, t, i, s, o, r, n, a, h) {
    this.getAngleModifier = e
    this.floorsViewData = t
    this.meshQuery = i
    this.viewmodeData = s
    this.raycasterData = o
    this.cameraData = r
    this.applicationData = n
    this.touchDevice = a
    this.meshModule = h
  }

  activate() {}

  init() {}

  dispose() {}

  deactivate() {
    const { floorOpacity } = this.meshModule.meshGroupVisuals
    for (const t of floorOpacity.keys) floorOpacity.set(t, 0)
  }

  beforeRender() {
    const nearestFloor = this.floorsViewData.nearestFloor,
      active = this.floorsViewData.transition.progress.active,
      { meshGroupVisuals } = this.meshModule,
      isInside = !(!nearestFloor || this.viewmodeData.isInside()),
      opaque = T.xx.FADE_OPAQUE
    let r = opaque,
      n = opaque
    const angleModifier = this.getAngleModifier(),
      h = this.floorsViewData.onlyShowActiveFloor.value ? 0 : 1
    meshGroupVisuals.globalOpacityModifier.value =
      meshGroupVisuals.allFloorsVisibleInOrtho.value || this.floorsViewData.isInAllFloorsMode || this.applicationData.application !== AppMode.SHOWCASE
        ? 1
        : this.cameraData.pose.pitchFactor()
    isInside &&
      (this.viewmodeData.isDollhouse() || this.viewmodeData.isOrthographic()
        ? ((r = opaque * angleModifier * h * T.xx.FADE_IN_VALUE), (n = r * T.xx.FADE_BELOW_MULT + T.xx.FADE_BELOW_START))
        : ((r = T.xx.FADE_ABOVE), (n = T.xx.FADE_BELOW)))
    const { floorOpacity } = meshGroupVisuals
    for (const e of floorOpacity.keys) {
      const i = this.floorsViewData.floors.getFloorByMeshGroup(Number(e))
      let s = opaque
      const a = this.isBelowSelectedFloor(i) ? n : r
      let h = CheckThreshold(a + T.xx.FADE_IN_HOVER_BOOST_VALUE, 0, 1)
      this.floorsViewData.roomSelectModeActive && (h = a),
        (s = this.isHoveredFloor(null == i ? void 0 : i.id) && !active && a > 0 ? h : a),
        (s = this.isFloorTransitioningOut(i) ? a : s)
      const d = this.isSelectedFloor(null == i ? void 0 : i.id) || this.isFloorTransitioningIn(i)
      if (((s = d ? opaque : s), (s = this.clampForViewmodeTransitions(s)), d)) floorOpacity.set(e, s)
      else {
        const t = floorOpacity.get(e)
        if (null == t) floorOpacity.set(e, s)
        else if (t !== s) {
          let i = MathUtils.lerp(t, s, 0.2)
          Math.abs(s - i) < 1e-4 && (i = s), floorOpacity.set(e, i)
        }
      }
    }
  }

  render() {}

  clampForViewmodeTransitions(e) {
    if (this.viewmodeData.currentMode === ViewModes.Transition) {
      const { to: t } = this.viewmodeData.transition
      if (t === ViewModes.Panorama) return Math.max(1 - this.meshModule.meshGroupVisuals.meshTextureOpacity.value, e)
    }
    return e
  }

  isHoveredFloor(e) {
    if (
      void 0 !== e &&
      this.raycasterData.hit &&
      (this.viewmodeData.isDollhouse() || this.viewmodeData.isOrthographic()) &&
      !this.touchDevice &&
      this.floorsViewData.isNavigable(e)
    ) {
      const t = this.raycasterData.hit.object
      return e === this.meshQuery.floorIdFromObject(t)
    }
    return !1
  }

  isSelectedFloor(e) {
    const t = this.floorsViewData.nearestFloor
    return !t || !(!e || t.id !== e)
  }

  isBelowSelectedFloor(e) {
    const t = this.floorsViewData.nearestFloor
    return !!(e && t && t.index > e.index)
  }

  isFloorTransitioningIn(e) {
    return !(!e || !this.floorsViewData.transition.progress.active || (this.floorsViewData.transition.to && this.floorsViewData.transition.to !== e.id))
  }

  isFloorTransitioningOut(e) {
    return !(
      !e ||
      !this.floorsViewData.transition.progress.active ||
      (this.floorsViewData.transition.from && this.floorsViewData.transition.from !== e.id && this.floorsViewData.transition.to === e.id)
    )
  }
}

class z {
  sweepData: SweepsData
  engine: EngineContext
  floorsViewData: FloorsViewData
  floorsData: FloorsData
  settingsData: SettingsData
  viewmodeData: ViewmodeData
  cameraData: CameraData
  cameraModule: CameraDataModule
  meshData: MeshData
  MOVE_TO_BLACK_TRANSITION_TIME: number
  updateCurrentFloor: (e?) => void
  moveFloorUp: (e?, t?) => void
  moveFloorDown: (e?, t?) => void
  moveToFloor: (e, t?, s?, i?) => DeferredPromise<any>

  constructor(e, t, i, s, o, r, n, a, h, l) {
    this.engine = e
    this.floorsData = t
    this.floorsViewData = i
    this.sweepData = s
    this.cameraData = o
    this.cameraModule = r
    this.viewmodeData = n
    this.updateCurrentFloor = a
    this.meshData = h
    this.settingsData = l
    this.MOVE_TO_BLACK_TRANSITION_TIME = 2e3
    this.moveFloorUp = (e = !1, t) => {
      const i = this.floorsViewData.currentFloorId,
        s = this.floorsViewData.getNavigableFloorIds(),
        o = i ? s.indexOf(i) : -1
      let r = s[o + 1]
      !r && (r = this.viewmodeData.isInside() ? s[s.length - 1] : s[0])
      return this.moveToFloor(r, e, t)
    }
    this.moveFloorDown = (e = !1, t) => {
      const i = this.floorsViewData.currentFloorId,
        s = this.floorsViewData.getNavigableFloorIds(),
        o = i ? s.indexOf(i) : s.length
      let r = s[o - 1]
      !r && (r = this.viewmodeData.isInside() ? s[0] : s[s.length - 1])
      return this.moveToFloor(r, e, t)
    }
    this.moveToFloor = (e, t = !1, i, s) => {
      const currentFloorId = this.floorsViewData.currentFloorId,
        sameFloor = currentFloorId === e,
        n = this.floorsViewData.totalFloors < 2 && !e,
        a = e ? this.floorsViewData.floors.getFloor(e) : null
      if (sameFloor || n || !this.floorsViewData.floorsEnabled) {
        this.updateCurrentFloor(e)
        return OpenDeferred.resolve()
      }
      if (a && !this.canMoveToFloor(a, t)) {
        return OpenDeferred.reject(new InvalidFloorExceptionError("Invalid floor ID"))
      }
      this.engine.broadcast(new StartMoveToFloorMessage(o, e))
      !i && (i = defaultFloorDuration)
      const h = new OpenDeferred()
      let l
      this.floorsViewData.transitionToFloor(currentFloorId, e, i, h.nativePromise())
      this.floorsViewData.commit()
      let d,
        c = s
      if (this.viewmodeData.isInside()) {
        const t = e => e => this.floorsViewData.isCurrentOrAllFloors(e.floorId),
          i = !!e ? sweepByFloor : t,
          o = [isAlignedSweep(), enabledSweep(), i(e)],
          r = [sweepScoreByFloorPosition(s || this.cameraData.pose.position)],
          n = this.sweepData.sortByScore(o, r).shift()
        n && ((c = n.sweep.position), (l = n.sweep.id))
      } else null !== e && this.engine.commandBinder.issueCommand(new SetFocusSweepCommand())
      d = t ? Promise.resolve() : this.getCameraTransition(e, i, l, c)
      const u = this,
        m = OpenDeferred.all([h, d])
      this.engine.startGenerator(function* () {
        let e = Date.now()
        for (; u.floorsViewData.transition.progress.active; ) {
          yield new NullGeneratorResult()
          const t = Date.now(),
            i = t - e
          u.floorsViewData.transition.progress.tick(i), u.floorsViewData.commit(), (e = t)
        }
        u.updateCurrentFloor(u.floorsViewData.transition.to)
        h.resolve()
      })
      return m
    }
  }

  moveToFloorIndex(e, t = !1, i?, s?) {
    let o: string | null = null
    if (e !== L.qE) {
      const t = this.floorsViewData.floors.getFloorAtIndex(e)
      if (!t) return OpenDeferred.reject(new InvalidFloorExceptionError(`Invalid floor index ${e}`))
      o = t.id
    }
    return this.moveToFloor(o, t, i, s)
  }

  canMoveToFloor(e, t = !1) {
    if (!e) return !1
    const i = this.floorsViewData.transition.progress.active,
      s = this.cameraData.canTransition() || t,
      o = e.index <= this.floorsViewData.totalFloors - 1,
      r = e.index >= -1
    return !i && s && o && r
  }

  getCameraTransition(e, t, i, s) {
    if (
      this.settingsData.tryGetProperty(DollhousePeekabooKey, !1)
        ? this.viewmodeData.currentMode === ViewModes.Dollhouse && !isPitchFactorOrtho(this.cameraData.pose.pitchFactor())
        : this.viewmodeData.currentMode === ViewModes.Dollhouse || this.viewmodeData.currentMode === ViewModes.Floorplan
    ) {
      const i = this.getPoseForFloor(e, s)
      return this.cameraModule
        .moveTo({
          transitionType: TransitionTypeList.Interpolate,
          pose: i.pose,
          focalDistance: i.focalDistance,
          transitionTime: t,
          autoOrtho: this.cameraData.pose.autoOrtho
        })
        .nativePromise()
    }
    return this.viewmodeData.isInside() && i
      ? this.engine.commandBinder.issueCommand(
          new MoveToSweepCommand({
            transition: TransitionTypeList.MoveToBlack,
            sweep: i,
            transitionTime: this.MOVE_TO_BLACK_TRANSITION_TIME
          })
        )
      : Promise.resolve()
  }

  getPoseForFloor(e, t) {
    const i = this.cameraData.pose.fovCorrectedPosition(),
      s = this.cameraData.pose.rotation,
      o = e ? this.floorsData.getFloor(e) : null,
      r = o ? o.medianSweepHeight() : this.meshData.meshCenter.y,
      n = o ? o.center : this.meshData.meshCenter
    n.setY(r)
    const a = DirectionVector.FORWARD.clone().applyQuaternion(s),
      h = i.clone()
    let l, d
    if (t) {
      const e = i.clone().addScaledVector(a, this.cameraData.pose.fovCorrectedFocalDistance()),
        s = new Vector3().set(0, i.y, 0),
        o = new Vector3().set(0, e.y, 0),
        n = s.distanceTo(o)
      h.setY(r + n)
      const c = e.clone().setY(t.y)
      d = c.distanceTo(h)
      this.viewmodeData.isDollhouse() && (l = getRotationQuaternion(h, c))
    } else {
      const e = (o ? o.size.y : G) / 2 + G * -a.y
      h.setY(r + e)
      d = h.distanceTo(n)
    }
    return { focalDistance: d, pose: { position: h, rotation: l } }
  }
}

const G = 8

class K {
  floorsViewData: FloorsViewData
  viewmodeData: ViewmodeData
  pose: Pose
  vectors: {
    lookDir: Vector3
    flattenedLookDir: Vector3
  }

  constructor(e, t, i) {
    this.floorsViewData = e
    this.viewmodeData = t
    this.pose = i
    this.vectors = { lookDir: new Vector3(), flattenedLookDir: new Vector3() }
    this.getAngleModifier = this.getAngleModifier.bind(this)
  }

  update() {
    const e = this.getAngleModifier(),
      t = 1 === this.floorsViewData.totalFloors,
      i = !!this.floorsViewData.nearestFloor,
      s = !this.viewmodeData.isInside() && !this.viewmodeData.transitionActive()
    this.floorsViewData.roomSelectModeActive = s && (t || (i && e < 1) || this.viewmodeData.isFloorplan())
    this.floorsViewData.floorSelectModeActive = s && 1 === e && !t
    this.floorsViewData.showFloorSelection =
      !this.viewmodeData.transitionActive() && (this.viewmodeData.isDollhouse() || this.viewmodeData.isFloorplan()) && i && !t
    this.floorsViewData.floorSelectable = this.viewmodeData.isDollhouse() || this.viewmodeData.isOrthographic()
  }

  getAngleModifier() {
    const e = this.vectors.lookDir.copy(DirectionVector.FORWARD).applyQuaternion(this.pose.rotation),
      t = this.vectors.flattenedLookDir.copy(e).setY(0),
      i = e.angleTo(t) * MathUtils.RAD2DEG,
      s = T.xx.FADE_IN_START_ANGLE,
      o = T.xx.FADE_IN_END_ANGLE,
      r = 1 - checkLerpThreshold(i, s, o, 0, 1)
    return easeInQuad(r, 0, 1, 1)
  }
}

export default class FloorsViewDataModule extends Module {
  sweepData: SweepsData
  floorNavigation: z
  engine: EngineContext
  floorsViewData: FloorsViewData
  floorsSelectModeHelper: K
  floorsData: FloorsData
  settingsData: SettingsData
  applicationData: AppData
  viewmodeData: ViewmodeData
  cameraData: CameraData
  raycasterData: PointerData
  input: InputIniModule
  config: {
    startingFloorsVisibility: string
    allowFloorChanges: boolean
  }
  onEndMoveToSweepMessage: (e) => void
  updateCurrentFloor: (e) => void
  applicationChanged: (e) => void
  updateFloorSelectMode: (e?) => void
  floorSelectFeatureEnabledCheck: () => void
  onMoveToFloorIndexCommand: (e) => Promise<void>
  onShowAllFloorsCommand: (e) => Promise<void>
  onEnableAllFloorsOptionCommand: () => Promise<void>
  onDisableAllFloorsOptionCommand: () => Promise<void>

  constructor() {
    super()
    this.name = "floors-viewdata"
    this.onEndMoveToSweepMessage = e => {
      const t = this.sweepData.getSweep(e.toSweep)
      t && this.updateCurrentFloor(t.floorId)
    }
    this.onMoveToFloorIndexCommand = async e => {
      this.floorNavigation.moveToFloorIndex(e.floorIndex, e.suppressCameraMovement, e.transitionTime, e.focusPoint)
    }

    this.onShowAllFloorsCommand = async e => {
      const t = "boolean" == typeof e.moveCamera && !e.moveCamera
      await this.engine.commandBinder.issueCommand(new MovetoFloorCommand(null, t))
    }
    this.onEnableAllFloorsOptionCommand = async () => {
      ;(this.floorsViewData.showAllFloorsOption = !0), this.floorsViewData.commit()
    }
    this.onDisableAllFloorsOptionCommand = async () => {
      this.floorsViewData.currentFloorIndex === L.qE && (await this.floorNavigation.moveToFloorIndex(0, !0))
      this.floorsViewData.showAllFloorsOption = !1
      this.floorsViewData.commit()
    }
    this.applicationChanged = () => {
      this.floorsViewData.updateViewData()
    }
    this.updateCurrentFloor = e => {
      this.config.allowFloorChanges &&
        this.floorsViewData.currentFloorId !== e &&
        (this.floorsViewData.transitionToFloorInstant(e), this.engine.broadcast(new EndMoveToFloorMessage(e, this.floorsViewData.getFloorName(e))))
    }
    this.updateFloorSelectMode = () => {
      this?.floorsSelectModeHelper?.update()
    }
    this.floorSelectFeatureEnabledCheck = () => {
      //zsy修改
      const e = this.settingsData.tryGetProperty(FeaturesFloorselectKey, FeaturesFloorselectKey),
        t = this.settingsData.tryGetProperty(BtnText.FloorSelect, !0),
        i = this.applicationData.application === AppMode.WORKSHOP
      this.toggleFloors(i || (e && t))
    }
    this.onMoveToFloorCommand = this.onMoveToFloorCommand.bind(this)
  }

  async init(e, t: EngineContext) {
    this.engine = t
    this.config = e
    ;[this.floorsData, this.settingsData, this.applicationData, this.sweepData, this.viewmodeData] = await Promise.all([
      t.market.waitForData(FloorsData),
      t.market.waitForData(SettingsData),
      t.market.waitForData(AppData),
      t.market.waitForData(SweepsData),
      t.market.waitForData(ViewmodeData)
    ])
    const n = await t.getModuleBySymbol(LocaleSymbol),
      a = { floorChangesEnabled: () => this.config.allowFloorChanges }
    this.floorsViewData = new FloorsViewData(this.floorsData, this.viewmodeData, this.sweepData, this.applicationData, n.t.bind(n), a)
    this.floorSelectFeatureEnabledCheck()
    t.market.register(this, FloorsViewData, this.floorsViewData)
    ;[this.cameraData, this.input, this.raycasterData] = await Promise.all([
      t.market.waitForData(CameraData),
      t.getModuleBySymbol(InputSymbol),
      t.market.waitForData(PointerData)
    ])
    if (this.config.allowFloorChanges) {
      const e = this.config?.startingFloorsVisibility?.lastIndexOf("1"),
        t = this.floorsData?.getFloorAtIndex(e)?.id,
        o = this.sweepData?.currentSweepObject?.floorId,
        n = o || t || null
      ;(o || t) && (this.log.debug(`Set initial floor to ${n} from current pose`), this.updateCurrentFloor(n))
    }
    const [h, m, D] = await Promise.all([t.getModuleBySymbol(CameraSymbol), t.market.waitForData(MeshData), t.getModuleBySymbol(ModelMeshSymbol)])
    this.floorNavigation = new z(
      t,
      this.floorsData,
      this.floorsViewData,
      this.sweepData,
      this.cameraData,
      h,
      this.viewmodeData,
      this.updateCurrentFloor,
      m,
      this.settingsData
    )
    this.floorsSelectModeHelper = new K(this.floorsViewData, this.viewmodeData, this.cameraData.pose)
    const S = await t.getModuleBySymbol(MeshQuerySymbol),
      T = new x(
        this.floorsSelectModeHelper.getAngleModifier,
        this.floorsViewData,
        S,
        this.viewmodeData,
        this.raycasterData,
        this.cameraData,
        this.applicationData,
        winCanTouch(),
        D
      )
    t.addComponent(this, T)
    this.config.allowFloorChanges && this.registerFloorHoverCursorEffect()
    this.bindings.push(
      this.registerKeys(),
      t.subscribe(AppChangeMessage, this.applicationChanged),
      this.floorsData.onChanged(this.floorsViewData.updateViewData),
      t.subscribe(EndMoveToSweepMessage, this.onEndMoveToSweepMessage),
      t.subscribe(
        StartViewmodeChange,
        (function (e, t, i, s, o) {
          const r = s.tryGetProperty(DollhousePeekabooKey, !1)
          let n = r
          return s => {
            const a = e.tryGetData(TourData)
            if (!a || (a && a.isTourActive())) return
            !PanoramaOrMesh(s.toMode) || (r && o.phase !== AppStatus.PLAYING) || (n = null !== i.currentFloorId)
            const h = PanoramaOrMesh(s.fromMode),
              l = s.toMode === ViewModes.Floorplan,
              d = s.toMode === ViewModes.Dollhouse
            if (!h || (!d && !l)) return
            const c = n || l ? i.currentFloorId : null
            t(new MovetoFloorCommand(c, !0, 0))
          }
        })(t.market, t.commandBinder.issueCommand, this.floorsViewData, this.settingsData, this.applicationData)
      ),
      t.commandBinder.addBinding(MovetoFloorCommand, this.onMoveToFloorCommand),
      t.commandBinder.addBinding(MovetoFloorNumberCommand, this.onMoveToFloorIndexCommand),
      t.commandBinder.addBinding(ShowAllFloorsCommand, this.onShowAllFloorsCommand),
      t.commandBinder.addBinding(EnableAllFloorsOptionCommand, this.onEnableAllFloorsOptionCommand),
      t.commandBinder.addBinding(DisableAllFloorsOptionCommand, this.onDisableAllFloorsOptionCommand),
      t.subscribe(EndSwitchViewmodeMessage, this.updateFloorSelectMode),
      this.cameraData.pose.onChanged(this.updateFloorSelectMode),
      this.floorsViewData.onChanged(this.updateFloorSelectMode),
      this.settingsData.onPropertyChanged(FeaturesFloorselectKey, this.floorSelectFeatureEnabledCheck),
      this.settingsData.onPropertyChanged(BtnText.FloorSelect, this.floorSelectFeatureEnabledCheck),
      this.applicationData.onPropertyChanged("application", this.floorSelectFeatureEnabledCheck)
    )
    this.updateFloorSelectMode()
    this.sweepData.currentSweepObject && this.updateCurrentFloor(this.sweepData.currentSweepObject.floorId)
  }

  onUpdate() {}

  async onMoveToFloorCommand(e) {
    return this.floorNavigation.moveToFloor(e.floorId, e.suppressCameraMovement, e.transitionTime, e.focusPoint).nativePromise()
  }

  toggleFloors(e) {
    e || null === this.floorsViewData.currentFloorId || this.updateCurrentFloor(null), (this.config.allowFloorChanges = e), this.updateFloorSelectMode()
  }

  registerKeys() {
    return this.input.registerHandler(KeyboardCallbackEvent, async e => {
      if (!this.cameraData.canTransition()) return
      const t = e.modifiers.shiftKey
      if (e.state === KeyboardStateList.PRESSED)
        switch (e.key) {
          case KeyboardCode.UPARROW:
            t && this.floorNavigation.moveFloorUp()
            break
          case KeyboardCode.DOWNARROW:
            t && this.floorNavigation.moveFloorDown()
            break
          case KeyboardCode.R:
            this.floorNavigation.moveFloorUp()
            break
          case KeyboardCode.F:
            this.floorNavigation.moveFloorDown()
            break
          case KeyboardCode.Y:
            this.floorNavigation.moveToFloor(null)
        }
    })
  }

  registerFloorHoverCursorEffect() {
    const e = Comparator.is(e => RoomMeshCheck.isRoomMesh(e) && e.raycastEnabled && this.floorsViewData.floorSelectable),
      t = new AggregateSubscription(
        this.input.registerMeshHandler(HoverMeshEvent, e, e => {
          this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.FINGER))
        }),
        this.input.registerMeshHandler(UnhoverMeshEvent, e, e => {
          this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.DEFAULT))
        })
      )
    t.cancel()
    const i = (() => {
      let e = !1
      const i = this.floorsViewData.floorSelectHoverEnabled
      return () => {
        i !== e && ((e = i), e ? t.renew() : (t.cancel(), this.engine.commandBinder.issueCommand(new SetMouseCursorCommand(CursorStyle.DEFAULT))))
      }
    })()
    i()
    const s = () => {
        this.floorsViewData.floorSelectHoverEnabled = !1
        i()
      },
      o = () => {
        this.floorsViewData.floorSelectHoverEnabled = !0
        i()
      }
    this.bindings.push(
      this.viewmodeData.onChanged(i),
      this.floorsViewData.onFloorSelectModeChange(i),
      this.floorsViewData.makeFloorChangeSubscription(i),
      this.engine.commandBinder.addBinding(LockFloorNavCommand, async () => s()),
      this.engine.commandBinder.addBinding(UnlockFloorNavCommand, async () => o()),
      t
    )
  }
}
