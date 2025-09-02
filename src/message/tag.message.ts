import { Message } from "../core/message"

export class TagOpenedMessage extends Message {
  /**
   * 热点图标视图打开
   *
   * @param sid 热点图标ID
   */
  sid: string
  info: any
  constructor(e: string, info: any) {
    super()
    this.sid = e
    this.info = info
  }
}
export class TagClosedMessage extends Message {
  /**
   * 热点图标视图关闭
   *
   * @param sid 热点图标ID
   */
  sid: string

  constructor(e: string) {
    super()
    this.sid = e
  }
}
export class AnchorClickOpenMessage extends Message {
  url: string
  constructor(e: string) {
    super()
    this.url = e
  }
}

export class MattertagViewMessage extends Message {
  /**
   * 热点图标显示消息
   *
   * @param sid 热点图标ID
   * @param view 与热点图标ID关联的视图对象
   */
  sid: string
  view: string
  constructor(e: string, t: string) {
    super()
    this.sid = e
    this.view = t
  }
}
