import { Message } from "../core/message"
export class PluginLoadedMessage extends Message {
  name: string
  version: string
  loadTime: number
  /**
   * 插件加载完成消息
   * @param e 名称
   * @param t 版本
   * @param n 加载时间
   */
  constructor(e: string, t: string, n: number) {
    super()
    this.name = e
    this.version = t
    this.loadTime = n
  }
}

export class PluginDetailPanelCloseMessage extends Message {}
