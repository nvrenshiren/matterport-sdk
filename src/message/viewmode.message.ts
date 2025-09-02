import { Message } from "../core/message"
import { ViewModes } from "../utils/viewMode.utils"

export class ViewModeChangeMessage extends Message {
  fromMode?: ViewModes
  toMode: ViewModes
  timestamp: number
  /**
   * 视图切换消息
   * @param toMode 目标模式
   * @param fromMode 原始模式
   */
  constructor(e: ViewModes, t?: ViewModes) {
    super()
    this.fromMode = t
    this.toMode = e
    this.timestamp = Date.now()
  }
}
export class StartViewmodeChange extends ViewModeChangeMessage {}
export class ViewModeChangeAnalyticsMessage extends ViewModeChangeMessage {
  /**
   * 监控视图模式变化消息
   * **/
}
