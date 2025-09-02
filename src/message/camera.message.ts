import { Message } from "../core/message"
export class CameraZoomMessage extends Message {
  zoomLevel: number
  /**
   * 相机缩放消息
   *
   * @param e 缩放级别
   */
  constructor(e: number) {
    super()
    this.zoomLevel = e
  }
}
export class SetCameraDimensionsMessage extends Message {
  /**
   * 用于设置相机尺寸
   *
   * @param width 相机宽度的值
   * @param height 相机高度的值
   */
  width: number
  height: number
  constructor(e: SetCameraDimensionsMessage["width"], t: SetCameraDimensionsMessage["height"]) {
    super()
    this.width = e
    this.height = t
  }
}
