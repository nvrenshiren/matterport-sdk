import { Message } from "../core/message"
import { ViewModeChangeMessage } from "./viewmode.message"
export class EndMoveToFloorMessage extends Message {
  floorId: string
  floorName: string
  /**
   * 楼层切换
   *
   * @param floorId 楼层ID
   * @param floorName 楼层名称
   */
  constructor(e: string, t: string) {
    super()
    this.floorId = e
    this.floorName = t
  }
}
export class StartMoveToFloorMessage extends Message {
  from: string | null
  to: string
  /**
   * 隐藏当前楼层
   * @param from 起始值
   * @param to 结束值
   */
  constructor(e: string | null, t: string) {
    super()
    this.from = e
    this.to = t
  }
}
export class EndSwitchViewmodeMessage extends ViewModeChangeMessage {}
