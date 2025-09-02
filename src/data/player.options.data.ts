import { DollhousePanSpeed, FastTransitions, PanAngle, PanDirection, PanSpeed, TransitionSpeed, TransitionTime, ZoomDuration } from "../const/14715"
import { BackgroundColorDefault } from "../const/28361"
import { PanDirectionList } from "../const/transition.const"
import { Data } from "../core/data"
import { ObservableObject } from "../observable/observable.object"
import { UnitTypeKey } from "../utils/unit.utils"

export enum BtnText {
  PresentedBy = "presented_by",
  HighlightReel = "highlight_reel",
  FloorPlan = "floor_plan",
  RoomBounds = "room_bounds",
  TourButtons = "tour_buttons",
  Labels = "labels",
  LabelsDollhouse = "labels_dh",
  Measurements = "measurements",
  FloorSelect = "floor_select",
  SavedMeasurements = "measurements_saved",
  Dollhouse = "dollhouse",
  InstantTransitions = "fast_transitions",
  TransitionSpeed = "transition_speed",
  TransitionTime = "transition_time",
  PanSpeed = "pan_speed",
  DollhousePanSpeed = "dollhouse_pan_speed",
  ZoomDuration = "zoom_duration",
  PanAngle = "pan_angle",
  PanDirection = "pan_direction",
  Units = "unit_type",
  DetailsEmail = "contact_email",
  DetailsAddress = "address",
  DetailsName = "contact_name",
  DetailsSummary = "model_summary",
  DetailsPhone = "contact_phone",
  DetailsModelName = "model_name",
  DetailsExternalUrl = "external_url",
  BackgroundColor = "background_color",
  SpaceSearch = "space_search"
}
export class PlayerOptionsData extends Data {
  options: PlayerOption
  constructor(e = {}) {
    super()
    this.name = "player-options"
    this.options = new PlayerOption(e)
  }
  resetDefaultTourOptions() {
    this.options.fast_transitions = FastTransitions
    this.options.transition_speed = TransitionSpeed
    this.options.transition_time = TransitionTime
    this.options.pan_speed = PanSpeed
    this.options.dollhouse_pan_speed = DollhousePanSpeed
    this.options.zoom_duration = ZoomDuration
    this.options.pan_angle = PanAngle
    this.options.pan_direction = PanDirection
    this.options.commit()
  }
}
class PlayerOption extends ObservableObject {
  presented_by: boolean
  highlight_reel: boolean
  floor_plan: boolean
  tour_buttons: boolean
  room_bounds: boolean
  labels: boolean
  labels_dh: boolean
  floor_select: boolean
  space_search: boolean
  measurements: boolean
  measurements_saved: boolean
  dollhouse: boolean
  contact_email: boolean
  address: boolean
  contact_name: boolean
  model_summary: boolean
  contact_phone: boolean
  model_name: boolean
  external_url: boolean
  unit_type: string
  background_color: string
  fast_transitions: boolean
  transition_speed: number
  transition_time: number
  pan_speed: number
  dollhouse_pan_speed: number
  zoom_duration: number
  pan_angle: number
  pan_direction: PanDirectionList
  constructor(e) {
    super()
    this.presented_by = !1
    this.highlight_reel = !0
    this.floor_plan = !0
    this.tour_buttons = !0
    this.room_bounds = !1
    this.labels = !0
    this.labels_dh = !0
    this.floor_select = !0
    this.space_search = !0
    this.measurements = !0
    this.measurements_saved = !0
    this.dollhouse = !0
    this.contact_email = !1
    this.address = !1
    this.contact_name = !1
    this.model_summary = !1
    this.contact_phone = !1
    this.model_name = !1
    this.external_url = !1
    this.unit_type = UnitTypeKey.IMPERIAL
    this.background_color = BackgroundColorDefault.default
    this.fast_transitions = FastTransitions
    this.transition_speed = TransitionSpeed
    this.transition_time = TransitionTime
    this.pan_speed = PanSpeed
    this.dollhouse_pan_speed = DollhousePanSpeed
    this.zoom_duration = ZoomDuration
    this.pan_angle = PanAngle
    this.pan_direction = PanDirection
    e && this.copy(e)
  }
  copy(e: PlayerOption) {
    this.presented_by = !!e.presented_by
    this.highlight_reel = !!e.highlight_reel
    this.floor_plan = !!e.floor_plan
    this.room_bounds = !!e.room_bounds
    this.tour_buttons = !!e.tour_buttons
    this.labels = !!e.labels
    this.space_search = !!e.space_search
    this.dollhouse = !!e.dollhouse
    this.fast_transitions = !!e.fast_transitions
    this.contact_email = !!e.contact_email
    this.address = !!e.address
    this.contact_name = !!e.contact_name
    this.model_summary = !!e.model_summary
    this.contact_phone = !!e.contact_phone
    this.model_name = !!e.model_name
    this.external_url = !!e.external_url
    void 0 !== e.measurements && (this.measurements = e.measurements)
    void 0 !== e.labels_dh && (this.labels_dh = e.labels_dh)
    void 0 !== e.floor_select && (this.floor_select = e.floor_select)
    void 0 !== e.measurements_saved && (this.measurements_saved = e.measurements_saved)
    void 0 !== e.unit_type && (this.unit_type = e.unit_type)
    void 0 !== e.background_color && void 0 !== BackgroundColorDefault[e.background_color] && (this.background_color = e.background_color)
    void 0 !== e.transition_speed && (this.transition_speed = e.transition_speed)
    void 0 !== e.transition_time && (this.transition_time = e.transition_time)
    void 0 !== e.pan_speed && (this.pan_speed = e.pan_speed)
    void 0 !== e.dollhouse_pan_speed && (this.dollhouse_pan_speed = e.dollhouse_pan_speed)
    void 0 !== e.zoom_duration && (this.zoom_duration = e.zoom_duration)
    void 0 !== e.pan_angle && (this.pan_angle = e.pan_angle)
    void 0 !== e.pan_direction && (this.pan_direction = e.pan_direction)
  }
}
