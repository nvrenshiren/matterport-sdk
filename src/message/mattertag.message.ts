import { LinkType } from "../const/49947"
import { Message } from "../core/message"

export interface TagDescriptionChunks {
  type: string
  text?: string
  link?: LinkData
}
export interface LinkData {
  label: string
  url: string
  type: LinkType
  navigationData?: any
}
export class MattertagAddMessage extends Message {
  sid: string
  position: number[]
  distanceFromCamera: number
  /**
   * 添加标签
   * @param e sid 标识符
   * @param t position 位置信息
   * @param s distanceFromCamera 距离摄像机的距离
   */
  constructor(e: string, t: number[], s: number) {
    super()
    this.sid = e
    this.position = t
    this.distanceFromCamera = s
  }
}
export class MattertagRemoveMessage extends Message {
  sid: string
  removeMethod: string
  /**
   * 标签删除消息
   *
   * @param e 标签ID
   * @param t 移除方法
   */
  constructor(e: string, t: string) {
    super()
    this.sid = e
    this.removeMethod = t
  }
}
export class MattertagAddTitleMessage extends Message {
  sid: string
  characterCount: number
  /**
   * 标签添加或修改标题
   *
   * @param e 标签ID
   * @param t 字符数
   */
  constructor(e: string, t: number) {
    super()
    this.sid = e
    this.characterCount = t
  }
}
export class MattertagAddDescriptionMessage extends Message {
  sid: string
  characterCount: number
  tagDescriptionChunks: TagDescriptionChunks[]
  /**
   * 标签添加描述消息
   *
   * @param e sid 字段，标签ID
   * @param t characterCount 字段，表示字符计数
   * @param s tagDescriptionChunks 字段，表示标签描述块
   */
  constructor(e: string, t: number, s: TagDescriptionChunks[]) {
    super()
    this.sid = e
    this.characterCount = t
    this.tagDescriptionChunks = s
  }
}
export class MattertagAddMediaMessage extends Message {
  sid: string
  mediaType: string
  mediaSrc: string
  /**
   * 标签添加媒体附件
   *
   * @param e sid 标签ID
   * @param t mediaType 媒体类型
   * @param s mediaSrc 媒体源
   */
  constructor(e: string, t: string, s: string) {
    super()
    this.sid = e
    this.mediaType = t
    this.mediaSrc = s
  }
}
export class MattertagEditMessage extends Message {
  sid: string
  property: string
  value: number | boolean | string
  /**
   * 编辑标签
   *
   * @param e sid 标签ID
   * @param t property 属性
   * @param s value 值
   */
  constructor(e: string, t: string, s: number | boolean | string) {
    super()
    this.sid = e
    this.property = t
    this.value = s
  }
}
export class MattertagMovedMessage extends Message {
  sid: string
  position: number[]
  distanceFromCamera: number
  distanceMoved: number
  /**
   * 标签移动消息
   *
   * @param e sid，标签ID
   * @param t position，表示位置信息
   * @param s distanceFromCamera，表示与相机的距离
   * @param a distanceMoved，表示移动的距离
   */
  constructor(e: string, t: number[], s: number, a: number) {
    super()
    this.sid = e
    this.position = t
    this.distanceFromCamera = s
    this.distanceMoved = a
  }
}
