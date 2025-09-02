import { Quaternion, Vector3 } from "three"
import { TransitionTypeList } from "../const/64918"
import { Command } from "../core/command"
export class LockNavigationCommand extends Command {
  constructor() {
    super()
    this.id = "LOCK_NAVIGATION"
  }
}
export class UnlockNavigationCommand extends Command {
  constructor() {
    super()
    this.id = "UNLOCK_NAVIGATION"
  }
}

export class FocusOnPointInsideCommand extends Command {
  constructor(e: { focusPosition: Vector3; transition: TransitionTypeList }) {
    super()
    this.payload = e
    this.id = "FOCUS_ON_POINT_INSIDE"
  }
}
export class FocusOnPinInsideCommand extends Command {
  constructor(e: any) {
    super()
    this.payload = e
    this.id = "FOCUS_ON_PIN_INSIDE"
  }
}

export class MoveToSweepCommand extends Command {
  /**
   * 点位移动事件
   *
   * @param sweep 点位ID
   * @param transition 动画类型
   */
  payload: {
    sweep?: string
    transition?: TransitionTypeList
    transitionTime?: number
    rotation?: Quaternion
    transitionSpeedMultiplier?: any
  }
  constructor(e: Partial<MoveToSweepCommand["payload"]>) {
    super()
    this.id = "MOVE_TO_SWEEP"
    this.payload = Object.assign({}, e)
  }
}
export class NavigateToLabelCommand extends Command {
  constructor(e: { viewmodeOnly: boolean }) {
    super()
    this.payload = e
    this.id = "NAVIGATE_TO_LABEL"
  }
}
export class NavigateToRoomCommand extends Command {
  constructor(e: any) {
    super()
    this.id = "NAVIGATE_TO_ROOM"
    this.payload = {
      room: e
    }
  }
}
export class NavigateToPoseCommand extends Command {
  payload: {
    pose: {
      mode: string
      panoId: string
      position: Vector3
      quaternion: Quaternion
      floorVisibility: boolean
      sweepIndex: number
      zoom: number
    }
  }
  constructor(e: { mode: string; panoId: string; position: Vector3; quaternion: Quaternion; floorVisibility: boolean; sweepIndex: number; zoom: number }) {
    super()
    this.id = "NAVIGATE_TO_POSE"
    this.payload = {
      pose: e
    }
  }
}
