import { EventCommon } from "@ruler3d/common"
import { CreateTourStopCommand, MoveTourStopCommand } from "../command/tour.command"
import { TransitionTypeList } from "../const/64918"
import { ToursControlsSymbol } from "../const/symbol.const"
import { PanDirectionList } from "../const/transition.const"
import { directionType, transitionType } from "../const/typeString.const"
import Engine from "../core/engine"
import { TourData } from "../data/tour.data"
import { VisionParase } from "../math/2569"
import { ReelIndexMessage, TourEndedMessage, TourStartedMessage, TourSteppedMessage, TourStoppedMessage } from "../message/tour.message"
import { QuaternionToJson, Vector3ToJson } from "../other/59296"
declare global {
  namespace eventList {
    interface data {
      "tour.started": () => void
      "tour.stoped": () => void
      "tour.ended": () => void
      "tour.stepped": (index: number) => void
      "tour.step": (index: number) => void
    }
  }
}
export class TourInterface {
  engine: Engine | null = null
  constructor() {}
  init(engine: Engine) {
    this.engine = engine
    this.addEvent()
  }
  addEvent() {
    this.engine?.subscribe(TourStartedMessage, () => {
      EventCommon.EventBus.emit("tour.started")
    })
    this.engine?.subscribe(TourStoppedMessage, () => {
      EventCommon.EventBus.emit("tour.stoped")
    })
    this.engine?.subscribe(TourEndedMessage, () => {
      EventCommon.EventBus.emit("tour.ended")
    })
    this.engine?.subscribe(TourSteppedMessage, e => {
      EventCommon.EventBus.emit("tour.stepped", e.index)
    })
    this.engine?.subscribe(ReelIndexMessage, e => {
      EventCommon.EventBus.emit("tour.step", e.index)
    })
  }
  get currentStep() {
    const tourData = this.engine?.market.tryGetData(TourData)!
    return tourData.isTourActive() && tourData.getTourCurrentSnapshotSid()
  }
  get state() {
    const tourData = this.engine?.market.tryGetData(TourData)!
    return tourData.getTourState()
  }
  async getData() {
    const tourData = await this.engine?.market.waitForData(TourData)!
    const TransitionTypeListMap = {
      [TransitionTypeList.FadeToBlack]: transitionType.FADE_TO_BLACK,
      [TransitionTypeList.Instant]: transitionType.INSTANT,
      [TransitionTypeList.Interpolate]: transitionType.INTERPOLATE,
      [TransitionTypeList.MoveToBlack]: transitionType.FADE_TO_BLACK,
      [TransitionTypeList.OrbitTo]: transitionType.INTERPOLATE
    }
    const PanDirectionListMap = {
      [PanDirectionList.Left]: directionType.LEFT,
      [PanDirectionList.Right]: directionType.RIGHT,
      [PanDirectionList.Auto]: directionType.AUTO
    }
    return tourData.getReelHighlights().map(n => {
      return {
        ...n,
        panDirection: typeof n.panDirection == "number" ? PanDirectionListMap[n.panDirection] : undefined,
        transitionType: typeof n.transitionType == "number" ? TransitionTypeListMap[n.transitionType] : undefined
      }
    })
  }
  start(index: number, loop?: boolean, steps?: number) {
    const tourData = this.engine?.market.tryGetData(TourData)!
    const toursControls = this.engine?.getModuleBySymbolSync(ToursControlsSymbol)!
    if (0 === tourData.getSnapshotCount()) throw Error("No tour data found")
    if (!toursControls.canChangeTourLocation()) throw Error("TourStart ignored, cannot change location at this time, another transition is active")
    try {
      toursControls.startTour(index, steps, loop)
    } catch (e) {
      throw Error(`Error occurred while starting tour - ${e}`)
    }
  }
  async stop() {
    try {
      const toursControls = this.engine?.getModuleBySymbolSync(ToursControlsSymbol)!
      await toursControls.stopTour()
    } catch (e) {
      throw Error(`Error occurred while stopping tour - ${e}`)
    }
  }
  step(index: number) {
    const tourData = this.engine?.market.tryGetData(TourData)!
    const toursControls = this.engine?.getModuleBySymbolSync(ToursControlsSymbol)!
    if (0 === tourData.getSnapshotCount()) throw Error("No tour data found")
    if (!toursControls.canChangeTourLocation()) throw Error("TourStep ignored, cannot change location at this time, another transition is active")
    try {
      toursControls.tourGoTo(index)
    } catch (e) {
      throw Error(`Error occurred while jumping to new tour location - ${e}`)
    }
  }
  play(forward = !0) {
    const tourData = this.engine?.market.tryGetData(TourData)!
    const toursControls = this.engine?.getModuleBySymbolSync(ToursControlsSymbol)!
    if (0 === tourData.getSnapshotCount()) throw Error("No tour data found")
    if (!toursControls.canChangeTourLocation()) throw Error("TourStep ignored, cannot change location at this time, another transition is active")
    try {
      forward ? toursControls.tourGoNext(!1) : toursControls.tourGoPrevious(!1)
    } catch (e) {
      throw Error(`Error while trying to travel to the next tour snapshot - ${e}`)
    }
  }
  async create() {
    const item = await this.engine?.commandBinder.issueCommand(new CreateTourStopCommand())
    return item
  }
  async move(fromSid: string, toSid: string) {
    const item = await this.engine?.commandBinder.issueCommand(new MoveTourStopCommand(fromSid, toSid, ""))
    return item
  }
  TransitionType = transitionType
  DirectionType = directionType
  Vector3ToJson = Vector3ToJson
  QuaternionToJson = QuaternionToJson
  VisionParase = VisionParase
}
