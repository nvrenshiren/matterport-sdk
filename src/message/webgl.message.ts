import { Message } from "../core/message"
export class RenderTargetMessage extends Message {
  size: number
  sweepId: string
  renderTarget: any
  /**
   * 构造函数
   *
   * @param e 大小
   * @param t 点位ID
   * @param i 渲染目标
   */
  constructor(e: number, t: string, i: any) {
    super()
    this.size = e
    this.sweepId = t
    this.renderTarget = i
  }
}
export class PixelRatioChangedMessage extends Message {
  pixelRatio: any
  constructor(e: number) {
    super()
    this.pixelRatio = e
  }
}
export class WebglRendererContextLostMessage extends Message {
  event: any
  constructor(e: any) {
    super()
    this.event = e
  }
}
export class WebglRendererContextRestoredMessage extends Message {
  event: any
  constructor(e: any) {
    super()
    this.event = e
  }
}
