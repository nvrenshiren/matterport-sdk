import { Message } from "../core/message"
class RoomToolModuleMessage extends Message {
  target: any
  constructor(e: any) {
    super()
    this.target = e
  }
}
export class RoomToolModuleUndoMessage extends RoomToolModuleMessage {}
export class RoomToolModuleAddedMessage extends RoomToolModuleMessage {}
export class RoomToolModuleDeletedMessage extends RoomToolModuleMessage {}
export class RoomToolModuleMovedMessage extends RoomToolModuleMessage {}
export class RoomToolModuleClickedMessage extends RoomToolModuleMessage {}
export class RoomVisitedMessage extends Message {
  roomId: string
  meshSubgroup: number
  viewmode: number
  visitCount: number
  roomCount: number
  roomType: string
  /**
   * 参观房间
   * @param roomId 房间ID
   * @param meshSubgroup 网格子组
   * @param viewmode 视图模式
   * @param visitCount 访问次数
   * @param roomCount 房间数量
   * @param roomType 房间类型
   */
  constructor(e: string, t: number, n: number, i: number, s: number, r: string) {
    super()
    this.roomId = e
    this.meshSubgroup = t
    this.viewmode = n
    this.visitCount = i
    this.roomCount = s
    this.roomType = r
  }
}
export class RoomBoundErrorMessage extends Message {
  error: string
  constructor(e: string) {
    super()
    this.error = e
  }
}
export class ErrorTextDisplayedMessage extends Message {
  message: string
  stack: string | undefined
  constructor(e: string, t = new Error().stack) {
    super()
    this.message = e
    this.stack = t
  }
}
