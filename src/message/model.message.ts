import { Message } from "../core/message"
export class ModelDataMessage extends Message {
  vrSupported: boolean
  sid: string
  /**
   *
   * @param e 模型ID
   * @param t 是否支持VR
   */
  constructor(e: string, t: boolean) {
    super()
    this.sid = e
    this.vrSupported = t
  }
}
export class ModelRatedMessage extends Message {
  rating: any
  constructor(e: any) {
    super()
    this.rating = e
  }
}
