import { Message } from "../core/message"
export class NoteResolutionChangeMessage extends Message {
  id: string
  resolved: boolean
  constructor(e: string, t: boolean) {
    super()
    this.id = e
    this.resolved = t
  }
}
export class FocusCommentMessage extends Message {
  commentId: string
  constructor(e: string) {
    super()
    this.commentId = e
  }
}
