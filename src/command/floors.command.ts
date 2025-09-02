import { Vector3 } from "three"
import { Command } from "../core/command"
import FloorsViewDataModule from "../modules/floorsViewData.module"
export class RenameFloorCommand extends Command {
  /**
   * 重命名楼层
   *
   * @param e 楼层ID
   * @param t 重命名后的文本
   */
  constructor(e: any, t: any) {
    super()
    this.id = "RENAME_FLOOR"
    this.payload = {
      floorId: e,
      text: t
    }
  }
}
export class GetFloorIntersectCommand extends Command {
  constructor(e: { screenPosition: number; height: number; includeHiddenFloors?: boolean }) {
    super()
    this.payload = Object.assign({}, e)
  }
}
export class MovetoFloorCommand extends Command {
  /**
   *
   * @param e 楼层ID
   * @param t 是否禁止摄像头移动，默认为false
   * @param n 过渡时间
   * @param i 焦点位置
   */
  constructor(e?: string | null | number, t?: boolean, n?: number, i?: Vector3) {
    super()
    this.id = "MOVETO_FLOOR"
    this.payload = {
      floorId: e,
      suppressCameraMovement: t,
      transitionTime: n,
      focusPoint: i
    }
  }
}
export class MovetoFloorNumberCommand extends Command {
  /**
   *
   * @param e 楼层索引
   * @param t 是否抑制相机移动，默认为false
   * @param n 过渡时间
   * @param i 焦点位置
   */
  payload: {
    floorIndex: number
    suppressCameraMovement: boolean
    transitionTime?: number
    focusPoint?: number
  }
  constructor(e: number, t = !1, n?: number, i?: number) {
    super()
    this.id = "MOVETO_FLOOR_NUMBER"
    this.payload = {
      floorIndex: e,
      suppressCameraMovement: t,
      transitionTime: n,
      focusPoint: i
    }
  }
}
export class ShowAllFloorsCommand extends Command {
  /**
   * 显示所有楼层
   *
   * @param e 负载数据
   */
  payload: {
    moveCamera: boolean
  }
  constructor(e: ShowAllFloorsCommand["payload"]) {
    super()
    this.id = "SHOW_ALL_FLOORS"
    this.payload = e
  }
}
export class DisableAllFloorsOptionCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "DISABLE_ALL_FLOORS_OPTION"
  }
}
export class EnableAllFloorsOptionCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "ENABLE_ALL_FLOORS_OPTION"
  }
}
export class LockFloorNavCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "LOCK_FLOOR_NAV"
  }
}
export class UnlockFloorNavCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "UNLOCK_FLOOR_NAV"
  }
}
