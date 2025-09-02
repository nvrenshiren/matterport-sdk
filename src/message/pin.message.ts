import { PinType } from "../const/62612"
import { Message } from "../core/message"


export class PinHoverChangeMessage extends Message {
  /**
   * 热点图标滑过消息
   *
   * @param id 热点图标的ID
   * @param hovering 是否正在悬停
   * @param pinType 热点图标的类型
   */
  id: string
  hovering: boolean
  pinType: PinType
  constructor(e: string, t: boolean, n: PinType) {
    super()
    this.id = e
    this.hovering = t
    this.pinType = n
  }
}

export class PinClickedMessage extends Message {
  /**
   * 热点图标点击消息
   *
   * @param id 热点图标的ID
   * @param pinType 热点图标的类型
   */
  id: string
  pinType: PinType
  info:any
  constructor(e: string, t: PinType,info:any) {
    super()
    this.id = e
    this.pinType = t
    this.info = info
  }
}

export class PinPlacedMessage extends Message {
  /**
   * 热点图标放置消息
   *
   * @param id 热点图标的ID
   * @param pinType 热点图标的类型
   * @param pinPos 热点图标放置位置
   */
  id: string
  pinType: PinType
  pinPos: number[]
  constructor(e: string, t: PinType, n: number[]) {
    super()
    this.id = e
    this.pinType = t
    this.pinPos = n
  }
}
export class NewPinReadyMessage extends Message {}
export class PinPlacementCancelledMessage extends Message {}

export class PinMovedMessage extends Message {
  /**
   * 热点图标移动消息
   *
   * @param id 热点图标的ID
   * @param pinType 热点图标的类型
   * @param pinPos 热点图标位置
   * @param previousPos 热点图标前一个位置
   */
  id: string
  pinType: PinType
  pinPos: number
  previousPos: number
  constructor(e: string, t: PinType, n: number, i: number) {
    super()
    this.id = e
    this.pinType = t
    this.pinPos = n
    this.previousPos = i
  }
}

export class PinAddCancelledMessage extends Message {
  /**
   * 热点图标取消添加消息
   *
   * @param id 热点图标的ID
   * @param pinType 热点图标的类型
   */
  id: number
  pinType: PinType
  constructor(e: number, t: PinType) {
    super()
    this.id = e
    this.pinType = t
  }
}
