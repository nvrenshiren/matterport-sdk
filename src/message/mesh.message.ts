import { Message } from "../core/message"
export class MeshProgressBindingMessage extends Message {
  loaded: number
  total: number
  /**
   *
   * @param e 加载完成的数量
   * @param t 总数量
   */
  constructor(e: number, t: number) {
    super()
    this.loaded = e
    this.total = t
  }
}
