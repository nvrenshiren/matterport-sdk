import { Message } from "../core/message"
export class MeasureSegmentAddMessage extends Message {
  data: any
  constructor(e: any) {
    super()
    this.data = e
  }
}
export class MeasureAddMessage extends Message {
  data: any
  constructor(e: any) {
    super()
    this.data = e
  }
}
export class MeasureCancelledMessage extends Message {}
export class MeasureAddTitleMessage extends Message {
  sid: string
  text: string
  constructor(e: string, t: string) {
    super()
    this.sid = e
    this.text = t
  }
}
export class MeasureUpdateTitleMessage extends Message {
  sid: string
  oldText: string
  newText: string
  constructor(e: string, t: string, n: string) {
    super()
    this.sid = e
    this.oldText = t
    this.newText = n
  }
}
export class MeasureRemoveMessage extends Message {
  data: any
  constructor(e: any) {
    super()
    this.data = e
  }
}
export class MeasureUpdateMessage extends Message {
  data: any
  constructor(e: any) {
    super()
    this.data = e
  }
}
export class MeasureModeChangeMessage extends Message {
  opened: boolean
  viewmode: number
  count: number
  /**
   * 测量模式
   * @param opened 是否已打开
   * @param viewmode 视图模式
   * @param count 计数
   */
  constructor(e: boolean, t: number, n: number) {
    super()
    this.opened = e
    this.viewmode = t
    this.count = n
  }
}
