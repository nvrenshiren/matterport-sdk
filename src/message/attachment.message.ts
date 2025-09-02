import { Message } from "../core/message"
export class ViewAttachmentsMessage extends Message {
  attachments: string[]
  attachmentId: string
  /**
   * @param e 附件列表
   * @param t 附件ID
   */
  constructor(e: string[], t: string) {
    super()
    this.attachments = e
    this.attachmentId = t
  }
}
export class CloseAttachmentViewerMessage extends Message {}
export class AttachmentUploadProgressMessage extends Message {
  upload: any
  constructor(e: any) {
    super()
    this.upload = e
  }
}
export class AttachmentUploadDoneMessage extends Message {
  upload: any
  constructor(e: any) {
    super()
    this.upload = e
  }
}
export class EmbeddingDoneMessage extends Message {
  attachment: any
  status: boolean
  parentId: string
  parentType: number
  /**
   *
   * @param e 附件对象
   * @param t 状态值
   * @param i 父级ID
   * @param n 父级类型
   */
  constructor(e: any, t: boolean, i: string, n: number) {
    super()
    this.attachment = e
    this.status = t
    this.parentId = i
    this.parentType = n
  }
}
