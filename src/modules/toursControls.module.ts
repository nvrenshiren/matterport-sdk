import * as st from "../other/97478"
import { TourNextStepCommand, TourPreviousStepCommand, TourRelativeCommand, TourStartCommand, TourStepCommand, TourStopCommand } from "../command/tour.command"
import * as n from "../const/14439"
import { getTimeoutURL } from "../const/14439"
import { TransitionTypeKey } from "../const/14715"
import { TransitionTypeList } from "../const/64918"
import { tilingPreloadQualityKey } from "../const/quality.const"
import { InputSymbol, ToursControlsSymbol } from "../const/symbol.const"
import { TourState } from "../const/tour.const"
import { BurnsTransitionType, PanDirectionList, TourTransitionTypes } from "../const/transition.const"
import EngineContext from "../core/engineContext"
import { WaitForPromiseGeneratorResult } from "../core/engineGenerators"
import { Module } from "../core/module"
import { AppData, AppStatus } from "../data/app.data"
import { CameraData } from "../data/camera.data"
import { LayersData } from "../data/layers.data"
import { SettingsData } from "../data/settings.data"
import { TourData } from "../data/tour.data"
import { ToursViewData } from "../data/tours.view.data"
import { ViewmodeData } from "../data/viewmode.data"
import { TourStartError, TourTransitionError } from "../error/tour.error"
import { OnMouseDownEvent } from "../events/mouse.event"
import { WheelBindEvent } from "../events/wheel.event"
import { AppPhaseChangeMessage } from "../message/app.message"
import {
  CurrentTourTransitionMessage,
  ReelIndexMessage,
  TourStartedMessage,
  TourEndedMessage,
  TourSteppedMessage,
  TourStoppedMessage
} from "../message/tour.message"
import { TransitionFactory } from "../transitions/transition.factory"
import { PanoramaOrMesh, ViewModes } from "../utils/viewMode.utils"
declare global {
  interface SymbolModule {
    [ToursControlsSymbol]: ToursControlsModule
  }
}

export default class ToursControlsModule extends Module {
  getBurnsStyleForSnapshot: (
    t: number,
    e: {
      panAngle?: number
      panDirection?: PanDirectionList
    }
  ) => BurnsTransitionType
  data: TourData
  toursViewData: ToursViewData
  canChangeTourLocation: () => any
  cameraData: CameraData
  viewmodeData: ViewmodeData
  engine: EngineContext
  transitionFactory: TransitionFactory
  tourGenerator: () => Generator<WaitForPromiseGeneratorResult, void, unknown>
  settingsData: SettingsData
  constructor() {
    super(...arguments)
    this.name = "tours-controls"
    this.getBurnsStyleForSnapshot = (t, e) => {
      const i = this.data
      const s = i.getTourSnapshotSid(t)
      const n = i.getTourStop(s)
      const o = i.getSnapshotCount()
      if (!n || !n.snapshot) return BurnsTransitionType.None
      if (t === o - 1 && this.isLastStopStatic(e)) return this.toursViewData.getTourStoryMode() ? BurnsTransitionType.Delay : BurnsTransitionType.None
      const r = n.snapshot.metadata.cameraMode
      const h = r === ViewModes.Dollhouse ? BurnsTransitionType.PanDollhouse : r === ViewModes.Floorplan ? BurnsTransitionType.Zoom : BurnsTransitionType.Pan
      return TransitionFactory.getTourBurnsStyle(this.settingsData, h, e)
    }
    this.canChangeTourLocation = () => {
      const t = this.data.getTourState()
      const e = this.data.isTourTransitionActive()
      const i = this.cameraData.canTransition()
      return t === TourState.Inactive && !e && !(this.viewmodeData.transition && this.viewmodeData.transition.active) && i
    }
  }

  async init(t, e: EngineContext) {
    this.engine = e
    ;[this.cameraData, this.viewmodeData, this.settingsData, this.data, this.toursViewData] = await Promise.all([
      e.market.waitForData(CameraData),
      e.market.waitForData(ViewmodeData),
      e.market.waitForData(SettingsData),
      e.market.waitForData(TourData),
      e.market.waitForData(ToursViewData)
    ])
    const i = await e.market.waitForData(LayersData)
    e.getModuleBySymbol(InputSymbol).then(t => {
      t.registerHandler(OnMouseDownEvent, () => {
        this.handleTourInputInterrupt()
      }),
        t.registerHandler(WheelBindEvent, () => {
          this.handleTourInputInterrupt()
        })
    })
    this.transitionFactory = new TransitionFactory(e, this.data, this.cameraData, this.settingsData, this.viewmodeData)
    await this.transitionFactory.init()
    this.setupAutoPlay(e)
    this.bindings.push(e.commandBinder.addBinding(TourStartCommand, async t => this.startTour(t.index, t.steps, t.loop)))
    this.bindings.push(e.commandBinder.addBinding(TourStopCommand, async t => this.stopTour(t.willResume)))
    this.bindings.push(e.commandBinder.addBinding(TourStepCommand, async t => this.tourGoTo(t.index, t.instant ? TransitionTypeList.Instant : void 0)))
    this.bindings.push(e.commandBinder.addBinding(TourRelativeCommand, async t => (t.forward ? this.tourGoNext(t.instant) : this.tourGoPrevious(t.instant))))
    this.bindings.push(
      e.commandBinder.addBinding(TourNextStepCommand, async t => {
        const e = this.data.tourPlaying
        try {
          e && (await this.stopTour(!0)), await this.tourGoNext(!1), e && (await this.startTour())
        } catch (t) {
          this.log.debug(t)
        }
      })
    )
    this.bindings.push(
      e.commandBinder.addBinding(TourPreviousStepCommand, async t => {
        const e = this.data.tourPlaying
        try {
          e && (await this.stopTour(!0)), await this.tourGoPrevious(!1), e && (await this.startTour())
        } catch (t) {
          this.log.debug(t)
        }
      })
    )
    this.bindings.push(i.onPropertyChanged("currentViewId", () => this.stopTour(!1)))
  }
  handleTourInputInterrupt() {
    this.data.getTourState() !== TourState.Inactive && this.stopTour()
  }
  canTourProceed(t: boolean, e?: number, i?: number) {
    const s = this.data.getSnapshotCount()
    if (0 === s || 0 === i || this.data.getTourState() !== TourState.Inactive) return !1
    if (void 0 !== e) {
      if (e < -1) return !1
      if (!0 !== t && e > s - 1) return !1
    }
    return !0
  }
  shouldTourContinue(t: number, e: number, i: number, s?: number) {
    return void 0 !== s ? i < s : e < t - 1
  }
  startTour(t?: number, e?: number, i?: boolean) {
    if (!this.canChangeTourLocation()) throw new TourStartError("Cannot start tour at this time, another transition is active")
    const n = void 0 !== i ? i : this.data.isLooping()
    if (!this.canTourProceed(n, t, e)) return
    this.data.setLooping(n)
    const o = this.data.getActiveReelTourMode()
    const a = (0, st.Cf)(this.settingsData, o)
    const h = this.data.getTourCurrentSnapshotIndex()
    const d = this.data.getSnapshotCount()
    const l = this.data.transition
    const c = h === d - 1 && (TourTransitionTypes.includes(l.type) || !a) && l.toIndex === d - 1 && l.stopped - l.started >= l.duration
    let p: number
    let m = 0
    p = void 0 !== t ? t - 1 : c ? -1 : Math.max(h - 1, -1)
    const g = this.settingsData.tryGetProperty(tilingPreloadQualityKey, null)
    this.settingsData.setProperty(tilingPreloadQualityKey, null)
    const f = this
    this.tourGenerator = function* () {
      for (; f.shouldTourContinue(d, p, m, e); ) {
        const t = p + 1
        const e = f.composeTourTransition(t)
        yield new WaitForPromiseGeneratorResult(e), (p = t), p === d - 1 && n && (p = -1), m++
      }
      f.stopTour()
      f.settingsData.setProperty(tilingPreloadQualityKey, g)
    }
    this.engine.startGenerator(this.tourGenerator)
    this.data.setTourState(TourState.Active)
    this.data.tourEnded = !1
    this.data.tourWillResume = !1
    this.data.tourPlaying = !0
    this.data.commit()
    this.engine.broadcast(new TourStartedMessage())
  }
  async composeTourTransition(t: number, e?: BurnsTransitionType, i?: TransitionTypeList) {
    const d = this.data.getTourSnapshotSid(t)
    const l = this.data.getTourStop(d)
    if (!l.snapshot) throw Error(`Highlight not found for reel index ${t}`)
    const p = this.data.getTourCurrentSnapshotSid() === d
    const m = this.cameraData.transition.startTime > this.data.transition.stopped
    let g = 0
    const f = this.data.transition.duration
    if (p) {
      const { started: t, stopped: e } = this.data.transition
      g = Math.min(1, (e - t) / f || 0)
    }
    if (m || !p) {
      let e = this.settingsData.tryGetProperty(TransitionTypeKey, TransitionTypeList.Interpolate)
      const n = l.snapshot.metadata.cameraMode
      const h = n === ViewModes.Dollhouse || n === ViewModes.Floorplan
      const d = PanoramaOrMesh(n)
      const p = !this.viewmodeData.isInside() && d
      const m = this.viewmodeData.isInside() && h
      const g = !this.viewmodeData.isInside() && h
      const f = this.viewmodeData.isInside() && d
      if (p || m || g) {
        e = TransitionTypeList.Interpolate
      }
      if (void 0 !== l.reelEntry?.overrides?.transitionType) {
        e = l.reelEntry.overrides.transitionType
      }
      f && 0 === t && (e = TransitionTypeList.FadeToBlack)
      void 0 !== i && (e = i)
      this.engine.broadcast(new ReelIndexMessage(t))
      const v = this.transitionFactory.getFloorTransition(t)
      this.data.useTransition(v)
      await v.promise
      if (this.data.getTourState() === TourState.StopScheduled) return
      const w = this.transitionFactory.getMainTransition(t, e)!
      this.data.useTransition(w)
      await w.promise
      this.data.setTourCurrentSnapshotByIndex(t)
      this.engine.broadcast(new TourSteppedMessage(t))
    }
    if (this.data.getTourState() === TourState.StopScheduled) return
    const v: {
      panAngle?: number
      panDirection?: PanDirectionList
    } = {}
    l.reelEntry?.overrides && ((v.panAngle = l.reelEntry.overrides.panAngle), (v.panDirection = l.reelEntry.overrides.panDirection))
    const w = e || this.getBurnsStyleForSnapshot(t, v)
    let y: number | undefined
    if (this.toursViewData.getTourStoryMode()) {
      t === this.data.getSnapshotCount() - 1 && this.isLastStopStatic(v) && (y = n.GS)
    }
    g > 0 && (y = (1 - g) * f)
    const b = this.transitionFactory.getBurnsTransition(t, w, y)
    this.engine.broadcast(new CurrentTourTransitionMessage(t, b.type, b.duration))
    this.data.useTransition(b)
    await b.promise
  }
  isLastStopStatic(t: { panAngle?: number; panDirection?: PanDirectionList }) {
    const e = TransitionFactory.getPanDirection(this.settingsData, t.panDirection)
    const i = TransitionFactory.getPanDegrees(this.settingsData, t.panAngle)
    const s = this.data.getActiveReelTourMode()
    const n = (0, st.Cf)(this.settingsData, s)
    return 0 === i || (!n && e === PanDirectionList.Auto)
  }
  async stopTour(t = !1) {
    this.data.getTourState() === TourState.Active &&
      (this.data.setTourState(TourState.StopScheduled),
      (this.data.tourWillResume = t),
      (this.data.tourPlaying = !1),
      await this.data.stopTourTransition(),
      this.tourGenerator && this.engine.stopGenerator(this.tourGenerator),
      this.engine.broadcast(new TourStoppedMessage(t)),
      this.data.getTourCurrentSnapshotIndex() !== this.data.getSnapshotCount() - 1 ||
        this.data.isLooping() ||
        ((this.data.tourEnded = !0), this.engine.broadcast(new TourEndedMessage())),
      this.data.setTourState(TourState.Inactive),
      this.data.commit())
  }
  async tourGoNext(t: boolean) {
    let e = this.data.getTourCurrentSnapshotIndex() + 1
    e >= this.data.getSnapshotCount() && (e = 0)
    const i = t ? TransitionTypeList.Instant : void 0
    return this.tourGoTo(e, i)
  }
  async tourGoPrevious(t: boolean) {
    let e = this.data.getTourCurrentSnapshotIndex()
    e < 0 && (e = 0)
    let i = e - 1
    i < 0 && (i = this.data.getSnapshotCount() - 1)
    const s = t ? TransitionTypeList.Instant : void 0
    return this.tourGoTo(i, s)
  }
  async tourGoTo(t: number, e = TransitionTypeList.FadeToBlack) {
    if (!this.canChangeTourLocation()) throw new TourTransitionError("Cannot change tour location at this time, another transition is active")
    if (this.viewmodeData.transition && this.viewmodeData.transition.active)
      throw new TourTransitionError("Cannot go to tour location during viewmode transition")
    if (this.data.getTourState() !== TourState.Inactive) throw new TourTransitionError("Cannot jump to tour location while tour is active")
    try {
      this.data.setTourState(TourState.Active), await this.composeTourTransition(t, BurnsTransitionType.None, e)
    } catch (t) {
      this.log.error(t)
    } finally {
      this.data.setTourState(TourState.Inactive)
    }
  }
  setupAutoPlay(t: EngineContext) {
    const e = 1000 * getTimeoutURL(this.settingsData)
    const i = () => {
      let t = !0
      const i = this.cameraData.pose.onChanged(() => {
        t = !1
        i.cancel()
      })
      setTimeout(() => {
        t && this.startTour()
        i.cancel()
      }, e)
    }
    if (e >= 0) {
      const e = t.market.tryGetData(AppData)
      if (e && e.phase === AppStatus.PLAYING) i()
      else {
        const e = (s: AppPhaseChangeMessage) => {
          s.phase === AppStatus.PLAYING && (i(), t.unsubscribe(AppPhaseChangeMessage, e))
        }
        t.subscribe(AppPhaseChangeMessage, e)
      }
    }
  }
}
