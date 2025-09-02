import { Command } from "../core/command"
import { ViewModes } from "../utils/viewMode.utils"
import { TransitionTypeList } from "../const/64918"
import { Quaternion, Vector3 } from "three"

export enum ViewModeCommand {
  INSIDE = "mode.inside",
  OUTSIDE = "mode.outside",
  DOLLHOUSE = "mode.dollhouse",
  FLOORPLAN = "mode.floorplan",
  TRANSITIONING = "mode.transitioning",
  ORTHOGRAPHIC = "mode.orthographic",
  MESH = "mode.mesh"
}

export const ViewModeInsideCommand = ViewModeCommand.INSIDE,
  CameraPoseCommand = {
    [ViewModeCommand.INSIDE]: ViewModes.Panorama,
    [ViewModeCommand.DOLLHOUSE]: ViewModes.Dollhouse,
    [ViewModeCommand.FLOORPLAN]: ViewModes.Floorplan,
    [ViewModeCommand.TRANSITIONING]: ViewModes.Transition,
    [ViewModeCommand.OUTSIDE]: ViewModes.Outdoor,
    [ViewModeCommand.ORTHOGRAPHIC]: ViewModes.Orthographic,
    [ViewModeCommand.MESH]: ViewModes.Mesh
  }
export const NotifyActivityAnalytic = {
    [ViewModes.Panorama]: ViewModeCommand.INSIDE,
    [ViewModes.Dollhouse]: ViewModeCommand.DOLLHOUSE,
    [ViewModes.Floorplan]: ViewModeCommand.FLOORPLAN,
    [ViewModes.Transition]: ViewModeCommand.TRANSITIONING,
    [ViewModes.Outdoor]: ViewModeCommand.OUTSIDE,
    [ViewModes.Orthographic]: ViewModeCommand.ORTHOGRAPHIC,
    [ViewModes.Mesh]: ViewModeCommand.MESH
  },
  GetModeChangCommand = e => {
    const t = NotifyActivityAnalytic[e]
    return void 0 !== t ? t : ViewModeCommand.OUTSIDE
  }
export class ChangeViewmodeCommand extends Command {
  static id: string
  /**
   * 改变试图模式
   *
   * @param e 模式
   * @param t 过渡类型，默认为 TransitionTypeList.Interpolate
   * @param n 姿态，默认为空对象 {}
   * @param i 过渡时间
   */
  payload: {
    mode: ViewModeCommand
    transitionType: TransitionTypeList
    pose: {
      position?: Vector3
      rotation?: Quaternion
      zoom?: number
      sweepID?: string
    }
    transitionTime?: number
  }
  constructor(e: ViewModeCommand, t = TransitionTypeList.Interpolate, n: ChangeViewmodeCommand["payload"]["pose"] = {}, i?: number | undefined) {
    super()
    this.payload = {
      mode: e,
      transitionType: t,
      pose: n,
      transitionTime: i
    }
  }
}
ChangeViewmodeCommand.id = "CHANGE_VIEWMODE"
export class LockViewmodeCommand extends Command {
  static id: string
  constructor() {
    super()
  }
}
LockViewmodeCommand.id = "LOCK_VIEWMODE"
export class UnlockViewmodeCommand extends Command {
  static id: string
  constructor() {
    super()
  }
}
UnlockViewmodeCommand.id = "UNLOCK_VIEWMODE"
