import { Command } from "../core/command"
import { AttachmentsObject } from "../object/attachments.object"
export class MattertagDiscPositionsCommand extends Command {
  constructor(e: string[]) {
    super()
    this.id = "MATTERTAG_DISC_POSITIONS"
    this.payload = {
      tags: e
    }
  }
}
export class AddMattertagCommand extends Command {
  /**
   * 添加标签事件
   *
   * @param e
   */
  constructor(e: any) {
    super()
    this.id = "ADD_MATTERTAG"
    this.payload = e
  }
}
export class DeleteMattertagCommand extends Command {
  /**
   * 删除标签事件
   *
   * @param e 标签ID
   */
  constructor(e: string[]) {
    super()
    this.id = "DELETE_MATTERTAG"
    this.payload = {
      sid: e
    }
  }
}
export class EditMattertagCommand extends Command {
  /**
   * 编辑标签方法
   *
   * @param e sid 标签ID
   * @param t standardOptions 标准选项对象
   * @param n mediaOptions 媒体选项对象
   * @param i positionOptions 位置选项对象
   */
  constructor(e: string, t: number, n: number, i: number) {
    super()
    this.payload = {
      sid: e,
      standardOptions: t,
      mediaOptions: n,
      positionOptions: i
    }
  }
}
export class MattertagNewSaveCommand extends Command {
  /**
   * 添加标签保存事件
   *
   * @param e 标签ID
   * @param t 属性对象
   * @param n 文件附件数组，默认为空数组
   * @param i 嵌入对象
   */
  constructor(e: string, t: any, n: AttachmentsObject[] = [], i: boolean | null) {
    super()
    this.id = "MATTERTAG_NEW_SAVE"
    this.payload = {
      id: e,
      properties: t,
      fileAttachments: n,
      embed: i
    }
  }
}
export class MattertagSaveCommand extends Command {
  /**
   * 标签保存时事件
   *
   * @param e 事件ID
   * @param t 属性集合
   * @param n 待处理附件列表，默认为空数组
   * @param i 已移除附件列表，默认为空数组
   * @param s 嵌入内容
   */
  constructor(e: string, t: { enabled?: boolean; position?: number; normal?: boolean; floorId?: string; roomId?: string }, n = [], i = [], s?: boolean) {
    super()
    this.id = "MATTERTAG_SAVE"
    this.payload = {
      id: e,
      properties: t,
      pendingAttachments: n,
      removedAttachments: i,
      embed: s
    }
  }
}
