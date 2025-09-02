import { Command } from "../core/command"
export class SetCameraStartCommand extends Command {
  static id: string
  /**
   * 设置初始相机位
   *
   * @param e 相机的SID
   */
  constructor(e: string) {
    super()
    this.payload = {
      snapshotSid: e
    }
  }
}
SetCameraStartCommand.id = "SET_CAMERA_START"
export class SetMoveCameraOnViewChangeCommand extends Command {
  static id: string
  constructor(e: boolean) {
    super()
    this.payload = {
      moveCamera: e
    }
  }
}
SetMoveCameraOnViewChangeCommand.id = "SET_MOVE_CAMERA_ON_VIEW_CHANGE"
export class ResetCameraPitchCommand extends Command {}
export class TransitionViewmodeCommand extends Command {}
export class NoTransitionViewmodeCommand extends Command {}
