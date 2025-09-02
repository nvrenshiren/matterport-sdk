import { MathUtils, Matrix4, Quaternion, Vector3 } from "three"
import * as b from "../math/2569"
import * as I from "../math/96042"
import * as n from "../const/14439"
import {
  DefaultDollhousePanSpeed,
  DefaultPanSpeed,
  DefaultTransitionSpeed,
  DefaultTransitionTime,
  DefaultZoomDuration,
  ToursMetersPerSecondKey,
  panAngleDefault
} from "../const/14439"
import { PanDirection } from "../const/14715"
import { TransitionTypeList } from "../const/64918"
import { DollhousePeekabooKey } from "../const/66777"
import { CameraSymbol, ControlsCommonSymbol, ModeSymbol, PathSymbol, SweepDataSymbol } from "../const/symbol.const"
import { BurnsTransitionType, PanDirectionList, TransitionType } from "../const/transition.const"
import EngineContext from "../core/engineContext"
import { CameraData } from "../data/camera.data"
import { FloorsViewData } from "../data/floors.view.data"
import { BtnText } from "../data/player.options.data"
import { SettingsData } from "../data/settings.data"
import { TourData } from "../data/tour.data"
import { ViewmodeData } from "../data/viewmode.data"
import { SnapshotObject } from "../object/snapshot.object"
import { SweepObject } from "../object/sweep.object"
import { DelayTransition } from "../transitions/delay.transition"
import { FloorTransition } from "../transitions/floor.transition"
import { NopTransition } from "../transitions/nop.transition"
import { NormalTransition } from "../transitions/normal.transition"
import { MoveTransition, PathTransition } from "../transitions/path.transition"
import { ZoomTransition } from "../transitions/zoom.transition"
import { ViewModes } from "../utils/viewMode.utils"
import { DirectionVector } from "../webgl/vector.const"
import SweepDataModule from "../modules/sweepData.module"
import { SweepsData } from "../data/sweeps.data"
import CameraDataModule from "../modules/cameraData.module"
import SweepPathModule from "../modules/sweepPath.module"
import CommonControlsModule from "../modules/commonControls.module"
import ViewmodeModule from "../modules/viewmode.module"

import { SweepMoveTransition } from "./sweepMove.transition"
import { SnapshotMoveTransition } from "./snapshotMove.transition"
import { PanTransition } from "./pan.transition"
import { PanDollhouseTransition } from "./panDollhouse.transition"
import { checkLerpThreshold, createRotationMatrixFromQuaternion } from "../math/2569"
import { clampValue, convertDegreesToRadians } from "../math/96042"

export class PathOrientHelper {
  settings: {
    sharpTurnDotThreshold: number
    directionWeightFactorStd: number
    directionWeightFactorSharp: number
    positionalWeightFactorStd: number
    positionalWeightFactorSharp: number
    finalWalkingNodeDirectionWeight: number
    lookAheadNodes: number
  }
  constructor(t?) {
    this.settings = t || {
      sharpTurnDotThreshold: 0.65,
      directionWeightFactorStd: 0.75,
      directionWeightFactorSharp: 0.2,
      positionalWeightFactorStd: 0.4,
      positionalWeightFactorSharp: 0.2,
      finalWalkingNodeDirectionWeight: 5,
      lookAheadNodes: 3
    }
  }
  getOrientationsForPath(t: Vector3[], e: Quaternion) {
    const i: Quaternion[] = []
    for (let s = 0; s < t.length; s++) {
      const n = new Vector3()
      this.getLookVectorsForPathNode(t, s, e, n)
      const o = new Matrix4().lookAt(t[s], n, DirectionVector.UP)
      i[s] = new Quaternion().setFromRotationMatrix(o)
    }
    i.push(e)
    return i
  }
  getLookVectorsForPathNode(t, e, i, s) {
    const n = new Vector3(),
      o = new Vector3(),
      a = new Vector3(),
      r = new Vector3(),
      h = t.length
    if (e >= h) return !1
    let d = 1,
      l = 1
    const c = new Vector3()
    let u
    for (let s = e; s < e + this.settings.lookAheadNodes && s < h; s++) {
      if (((u = t[s]), this.getOrientationForPathNode(t, s, i, a), s === e && n.copy(a), s > e)) {
        const t = n.dot(a) < this.settings.sharpTurnDotThreshold
        ;(d *= t ? this.settings.directionWeightFactorSharp : this.settings.directionWeightFactorStd),
          (l *= t ? this.settings.positionalWeightFactorSharp : this.settings.positionalWeightFactorStd)
      }
      s === h - 1 && ((d = this.settings.finalWalkingNodeDirectionWeight), (l = 1)), c.copy(a), a.multiplyScalar(d), o.add(a), r.lerp(u, l)
    }
    return o.normalize(), s.copy(r), s.add(o), !0
  }
  getOrientationForPathNode(t, e, i, s) {
    if (e >= t.length) return !1
    if (e === t.length - 1) s.copy(DirectionVector.FORWARD).applyQuaternion(i)
    else {
      const i = t[e],
        n = t[e + 1]
      s.copy(n).sub(i)
    }
    return s.normalize(), !0
  }
}

export class TransitionFactory {
  engine: EngineContext
  tourData: TourData
  cameraData: CameraData
  settingsData: SettingsData
  viewmodeData: ViewmodeData
  init: () => Promise<void>
  sweepModule: SweepDataModule
  sweepData: SweepsData
  cameraModule: CameraDataModule
  pathModule: SweepPathModule
  floorsViewData: FloorsViewData
  commonControlsModule: CommonControlsModule
  viewmodeModule: ViewmodeModule
  pathOrientHelper: PathOrientHelper
  setRestrictedSweeps: SweepPathModule["setRestrictedSweeps"]
  getCurveForPath: SweepPathModule["getCurveForPath"]
  moveToSweep: SweepDataModule["moveToSweep"]
  updateTransitionSpeed: CameraDataModule["updateTransitionSpeed"]
  switchToMode: ViewmodeModule["switchToMode"]
  startRotateTransition: CommonControlsModule["startRotateTransition"]
  stopCamera: CommonControlsModule["stop"]
  startZoomTransition: CommonControlsModule["startZoomTransition"]
  issueCommand: EngineContext["commandBinder"]["issueCommand"]
  getValidWalkingPath: (t: SnapshotObject) => SweepObject[] | null
  constructor(t, e, i, s, o) {
    this.engine = t
    this.tourData = e
    this.cameraData = i
    this.settingsData = s
    this.viewmodeData = o
    this.init = async () => {
      this.sweepModule = await this.engine.getModuleBySymbol(SweepDataSymbol)
      this.sweepData = await this.engine.market.waitForData(SweepsData)
      this.cameraModule = await this.engine.getModuleBySymbol(CameraSymbol)
      this.pathModule = await this.engine.getModuleBySymbol(PathSymbol)
      this.floorsViewData = await this.engine.market.waitForData(FloorsViewData)
      this.commonControlsModule = await this.engine.getModuleBySymbol(ControlsCommonSymbol)
      this.viewmodeModule = await this.engine.getModuleBySymbol(ModeSymbol)
      this.pathOrientHelper = new PathOrientHelper()
      this.setRestrictedSweeps = this.pathModule.setRestrictedSweeps.bind(this.pathModule)
      this.getCurveForPath = this.pathModule.getCurveForPath.bind(this.pathModule)
      this.moveToSweep = this.sweepModule.moveToSweep.bind(this.sweepModule)
      this.updateTransitionSpeed = this.cameraModule.updateTransitionSpeed.bind(this.cameraModule)
      this.switchToMode = this.viewmodeModule.switchToMode.bind(this.viewmodeModule)
      this.startRotateTransition = this.commonControlsModule.startRotateTransition.bind(this.commonControlsModule)
      this.stopCamera = this.commonControlsModule.stop.bind(this.commonControlsModule)
      this.startZoomTransition = this.commonControlsModule.startZoomTransition.bind(this.commonControlsModule)
      this.issueCommand = this.engine.commandBinder.issueCommand.bind(this.engine.commandBinder)
    }
    this.getValidWalkingPath = t => {
      const e = t.metadata.scanId
      const i = this.sweepData.currentSweep
      const s = this.tourData.getTourCurrentSnapshotIndex()
      let o: SnapshotObject | null = null
      if (s >= 0) {
        const t = this.tourData.getTourSnapshotSid(s)
        o = this.tourData.getSnapshot(t)
      }
      if (this.viewmodeData.currentMode !== ViewModes.Panorama || !i || !e || e === i || t.is360 || !o || o.is360) return null
      const r =
        this.pathModule.findShortestPath(
          i,
          e,
          n.Xd.walkingTourIncludeExtraPanosDistance,
          n.Xd.walkingStageMinimumDistance,
          n.Xd.maxWalkingSweepsBetweenSnapshots
        ) || []
      return 0 === r.length ? null : r
    }
  }

  static isDelayTransition(
    t: SettingsData,
    e: BurnsTransitionType,
    i: {
      panAngle?: number
      panDirection?: PanDirectionList
    }
  ) {
    return !(0, n.dF)(t) || (e !== BurnsTransitionType.Zoom && 0 === TransitionFactory.getPanDegrees(t, i.panAngle))
  }
  static getTourBurnsStyle(
    t: SettingsData,
    e: BurnsTransitionType,
    i: {
      panAngle?: number
      panDirection?: PanDirectionList
    }
  ) {
    return TransitionFactory.isDelayTransition(t, e, i) ? BurnsTransitionType.Delay : e
  }
  static getPanDegrees(t: SettingsData, e?: number) {
    return Math.max(
      (0, n.dF)(t) ? (-1 !== t.getOverrideParam(n.xs, -1) ? (0, n.y)(t) : void 0 !== e ? e : t.tryGetProperty(BtnText.PanAngle, panAngleDefault))! : 0,
      0
    )
  }
  static getPanDirection(t: SettingsData, e?: PanDirectionList) {
    return void 0 !== e ? e : t.tryGetProperty(BtnText.PanDirection, PanDirection)
  }
  static getDelayDuration(t: SettingsData) {
    return -1 !== t.getOverrideParam(n.lY, -1) || 0 === t.getOverrideParam(n._c, -1) ? (0, n.g_)(t) : n.mS
  }
  static getZoomDuration(t: SettingsData) {
    return -1 !== t.getOverrideParam(n.lY, -1) ? (0, n.g_)(t) : t.tryGetProperty(BtnText.ZoomDuration, DefaultZoomDuration)
  }
  static getPanRadiansPerMs(t: SettingsData, e: boolean, i: number) {
    if (-1 !== t.getOverrideParam(n.lY, -1)) {
      const e = (0, n.g_)(t)
      return e > 0 ? i / e : 0
    }
    const s = e ? t.tryGetProperty(BtnText.DollhousePanSpeed, DefaultDollhousePanSpeed) : t.tryGetProperty(BtnText.PanSpeed, DefaultPanSpeed)
    return convertDegreesToRadians(s!)
  }
  static getPanValues(t: SettingsData, e: boolean, i?: PanDirectionList, s?: number) {
    const o = TransitionFactory.getPanDirection(t, i),
      a = TransitionFactory.getPanDegrees(t, s),
      r = MathUtils.degToRad(a),
      h = TransitionFactory.getPanRadiansPerMs(t, e, r)
    let d = h > 0 ? r / h : 0
    return e && void 0 === s && (d = (0, n.g_)(t)), { degrees: a, radiansPerMs: h, ms: d, direction: o }
  }
  static getTransitionSpeed(t: SettingsData) {
    if (-1 !== t.getOverrideParam("wts", -1)) return t.tryGetProperty(ToursMetersPerSecondKey, n.Im)
    const e = t.tryGetProperty(BtnText.TransitionSpeed, DefaultTransitionSpeed)!
    return clampValue(e / 1000)
  }
  static getTransitionTime(t: SettingsData) {
    const e = t.tryGetProperty(BtnText.TransitionTime, DefaultTransitionTime)
    return Math.min(Math.max(n.eu, e), n.NY)
  }
  static getOtherModeTransitionTime(t: SettingsData, e: number, i: TransitionTypeList) {
    if (i === TransitionTypeList.FadeToBlack) {
      return TransitionFactory.getTransitionTime(t) + n.HJ
    }
    let s = n.Cp
    let o = n.f7
    if (-1 === t.getOverrideParam("wts", -1)) {
      const e = 1000 * TransitionFactory.getTransitionSpeed(t)!
      s = Math.sqrt(2 * (e - n.Pv)) + 45
      e !== DefaultTransitionSpeed && (o = n._D)
    }
    const a = (1000 * e) / (MathUtils.DEG2RAD * s)
    return Math.max(a, o)
  }
  static getSamePanoTransitionTime(t: SettingsData, e: number) {
    const i = t.tryGetProperty(BtnText.PanSpeed, DefaultPanSpeed)
    if (i === DefaultPanSpeed) {
      return Math.max((1000 * e) / (MathUtils.DEG2RAD * n.O2), n.gS)
    }
    {
      const t = checkLerpThreshold(i, n.z$, n.b_, n.rM, n.z8)
      const s = convertDegreesToRadians(t)
      return s > 0 ? e / s : 0
    }
  }
  getFloorTransition(t: number) {
    const e = this.tourData.getTourSnapshotSid(t),
      i = this.tourData.getSnapshot(e)
    if (!i) {
      return new NormalTransition(t)
    }
    return new FloorTransition(this.issueCommand, () => this.floorsViewData.currentFloorId).start({ targetSnapshot: i }, t)
  }
  getMainTransition(t: number, e: number) {
    const i = this.tourData.getTourSnapshotSid(t)
    const s = this.tourData.getSnapshot(i)
    if (!s) {
      return new NormalTransition(t)
    }
    let n: PathTransition | MoveTransition | SweepMoveTransition | SnapshotMoveTransition | null = null
    if (e === TransitionTypeList.Interpolate) {
      const e = s.metadata.cameraQuaternion
      const i = this.getValidWalkingPath(s)
      if (i) {
        const s = i.map(t => t.position)
        const o = this.pathOrientHelper.getOrientationsForPath(s, createRotationMatrixFromQuaternion(e))
        n =
          i.length > 2
            ? new PathTransition(
                this.settingsData,
                this.cameraData.pose,
                this.cameraData.transition,
                this.sweepData.transition,
                this.sweepModule,
                this.cameraModule,
                this.engine,
                this.setRestrictedSweeps,
                this.getCurveForPath
              ).start({ path: i, orientations: o }, t)
            : new MoveTransition(
                this.settingsData,
                this.cameraData.pose,
                this.moveToSweep,
                this.updateTransitionSpeed,
                this.setRestrictedSweeps,
                this.engine
              ).start({ path: i, orientations: o }, t)
      }
    } else if (e === TransitionTypeList.Instant) {
      const e = this.sweepData.currentSweep
      n = new SweepMoveTransition(this.moveToSweep, this.viewmodeData, this.cameraModule, this.switchToMode).start({ snapshot: s, currentSweep: e }, t)
    }
    if (!n) {
      const i = this.sweepData.currentSweep
      n = new SnapshotMoveTransition(
        this.settingsData,
        this.cameraData.pose,
        this.viewmodeData,
        this.cameraModule,
        this.sweepModule,
        this.switchToMode,
        this.setRestrictedSweeps,
        this.engine
      ).start({ snapshot: s, currentSweep: i, transitionType: e }, t)
    }
    return n
  }
  getBurnsTransition(t: number, e: BurnsTransitionType, i?: number) {
    const s = this.tourData.getTourSnapshotSid(t)
    const n = (t + 1) % this.tourData.getSnapshotCount()
    const o = this.tourData.getTourSnapshotSid(n)
    const a = this.tourData.getTourStop(s)
    const r: {
      panDirection?: PanDirectionList
      panAngle?: number
    } = {}
    a.reelEntry && a.reelEntry.overrides && ((r.panDirection = a.reelEntry.overrides.panDirection), (r.panAngle = a.reelEntry.overrides.panAngle))
    const h = this.tourData.getSnapshot(o)
    let d: NormalTransition | PanTransition | NopTransition | PanDollhouseTransition | ZoomTransition | DelayTransition = new NormalTransition(t)
    switch (e) {
      case BurnsTransitionType.Pan:
        if (h) {
          const e = this.getValidWalkingPath(h)
          d = new PanTransition(this.settingsData, this.cameraData.pose, this.startRotateTransition, this.stopCamera, this.getCurveForPath).start(
            { path: e, snapshot: a.snapshot, nextSnapshot: h, panOverrides: r },
            t,
            i
          )
        }
        d.type === TransitionType.Nop &&
          (d = new NopTransition(this.settingsData, this.startRotateTransition, this.stopCamera).start(
            { snapshot: a.snapshot, nextSnapshot: h, panOverrides: r },
            t,
            i
          ))
        break
      case BurnsTransitionType.PanDollhouse:
        d = new PanDollhouseTransition(this.settingsData, this.startRotateTransition, this.stopCamera).start(
          { snapshot: a.snapshot, nextSnapshot: h, panOverrides: r },
          t,
          i
        )
        break
      case BurnsTransitionType.Zoom:
        d = new ZoomTransition(
          this.startZoomTransition,
          this.stopCamera,
          TransitionFactory.getZoomDuration(this.settingsData),
          this.settingsData.tryGetProperty(DollhousePeekabooKey, !1)
        ).start({ duration: i }, t)
        break
      case BurnsTransitionType.Delay:
        const e = TransitionFactory.getDelayDuration(this.settingsData)
        d = new DelayTransition(e).start({ duration: i }, t)
        break
      case BurnsTransitionType.None:
        d = new NormalTransition(t)
        break
      default:
        throw Error("unhandled TourBurnsStyle")
    }
    return d
  }
}
