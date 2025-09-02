import { Message } from "../core/message"
export class ContainerResizeMessage extends Message {
  width: number
  height: number
  /**
   * 内容窗口变化
   * @param width 宽度
   * @param height 高度
   */
  constructor(e: number, t: number) {
    super()
    this.width = e
    this.height = t
  }
}
export class ContainerOrientationMessage extends Message {
  orientation: number
  /**
   * 内容窗口方向变化
   *
   * @param e 方向值
   */
  constructor(e: number) {
    super()
    this.orientation = e
  }
}
