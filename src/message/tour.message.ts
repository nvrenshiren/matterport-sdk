import { TransitionType } from "../const/transition.const"
import { Message } from "../core/message"
export class TourStartedMessage extends Message {
  /**
   * 导览路径开始
   */
}
export class TourSteppedMessage extends Message {
  index: number
  /**
   * 当前导览路径快照
   * @param index 索引值
   */
  constructor(e: number) {
    super()
    this.index = e
  }
}
export class ReelIndexMessage extends Message {
  index: number
  /**
   * 导览路径列表当前索引
   * @param index 索引值
   */
  constructor(e: number) {
    super()
    this.index = e
  }
}
export class CurrentTourTransitionMessage extends Message {
  index: number
  transitionType: TransitionType
  duration: number
  /**
   * 当前导览路径过渡动画
   * @param index 索引值
   * @param transitionType 动画类型
   * @param duration 动画时长
   */
  constructor(e: number, t: number, n: number) {
    super()
    this.index = e
    this.transitionType = t
    this.duration = n
  }
}
export class TourStoppedMessage extends Message {
  willResume: any
  constructor(e: boolean) {
    super()
    this.willResume = e
  }
}
export class TourEndedMessage extends Message {
  /**
   * 导览路径停止
   */
}
export class AddViewMessage extends Message {
  /**
   * 添加导览路径视图
   */
}
export class TourStoryMessage extends Message {
  constructor() {
    super()
  }
}
