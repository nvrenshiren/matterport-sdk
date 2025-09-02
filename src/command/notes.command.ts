import { Command } from "../core/command"
import { TransitionTypeList } from "../const/64918"
export class RegisterNotesToolsCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "REGISTER_NOTES_TOOLS"
  }
}
export class NotesModeToggleCommand extends Command {
  constructor(e: boolean) {
    super()
    this.id = "NOTES_MODE_TOGGLE"
    this.payload = {
      opened: e
    }
  }
}
export class NotesOpenNoteCommentCommand extends Command {
  /**
   * @param e 日志ID
   * @param t 是否停靠（dock）
   * @param n 是否编辑（edit）
   * @param i 评论ID
   * @param r 过渡效果，默认为 FadeToBlack
   */
  constructor(e: string, t: boolean, n: boolean, i: string, r = TransitionTypeList.FadeToBlack) {
    super()
    this.id = "NOTES_OPEN_NOTE_COMMENT"
    this.payload = {
      noteId: e,
      dock: t,
      edit: n,
      commentId: i,
      transition: r
    }
  }
}
export class NoteStartAddCommand extends Command {
  constructor() {
    super()
    this.id = "NOTE_START_ADD"
  }
}
export class NoteAddCommand extends Command {
  /**
   *
   * @param e 文本内容
   */
  constructor(e: string) {
    super()
    this.id = "NOTE_ADD"
    this.payload = {
      text: e
    }
  }
}
export class NoteCancelAddCommand extends Command {
  constructor() {
    super()
    this.id = "NOTE_CANCEL_ADD"
  }
}
export class NoteCloseCommand extends Command {
  constructor() {
    super()
    this.id = "NOTE_CLOSE"
  }
}
export class NoteSaveChangesCommand extends Command {
  constructor(e: string, t: string) {
    super()
    this.id = "NOTE_SAVE_CHANGES"
    this.payload = {
      noteId: e,
      text: t
    }
  }
}
export class CommentCancelChangesCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "COMMENT_CANCEL_CHANGES"
  }
}
export class NotePopupEditorToggleCommand extends Command {
  constructor(e: boolean) {
    super()
    this.id = "NOTE_POPUP_EDITOR_TOGGLE"
    this.payload = {
      opened: e
    }
  }
}
export class NoteAppearanceSaveCommand extends Command {
  /**
   *
   * @param e 笔记ID
   * @param t 笔记属性
   */
  constructor(e: string, t: string) {
    super()
    this.id = "NOTE_APPEARANCE_SAVE"
    this.payload = {
      noteId: e,
      properties: t
    }
  }
}
export class NoteResolveCommand extends Command {
  constructor(e: string, t: boolean) {
    super()
    this.id = "NOTE_RESOLVE"
    this.payload = {
      noteId: e,
      resolved: t
    }
  }
}
export class NoteDeleteCommand extends Command {
  constructor(e: string) {
    super()
    this.id = "NOTE_DELETE"
    this.payload = {
      noteId: e
    }
  }
}
export class NotesToggleFilterCommand extends Command {
  constructor(e: string, t: boolean) {
    super()
    this.id = "NOTES_TOGGLE_FILTER"
    this.payload = {
      filter: e,
      enabled: t
    }
  }
}
export class NoteCommentEditCommand extends Command {
  constructor(e: string) {
    super()
    this.id = "NOTE_COMMENT_EDIT"
    this.payload = {
      id: e
    }
  }
}
export class CommentAddCommand extends Command {
  /**
   *
   * @param e 笔记ID
   * @param t 评论文本
   * @param n 回复的评论ID（如果有）
   */
  constructor(e: string, t: string, n: string) {
    super()
    this.id = "COMMENT_ADD"
    this.payload = {
      noteId: e,
      text: t,
      replyId: n
    }
  }
}
export class CommentUpdateCommand extends Command {
  /**
   *
   * @param e 注释对应的笔记ID
   * @param t 注释ID
   * @param n 注释内容
   */
  constructor(e: string, t: string, n: string) {
    super()
    this.id = "COMMENT_UPDATE"
    this.payload = {
      noteId: e,
      commentId: t,
      text: n
    }
  }
}
export class CommentDeleteCommand extends Command {
  constructor(e: string, t: string) {
    super()
    this.id = "COMMENT_DELETE"
    this.payload = {
      noteId: e,
      commentId: t
    }
  }
}
export class FilterVisibleNotesCommand extends Command {
  constructor(e: string[]) {
    super()
    this.id = "FILTER_VISIBLE_NOTES_COMMAND"
    this.payload = {
      ids: e
    }
  }
}
export class NotesVisibilityFilterEnabledCommand extends Command {
  constructor(e: boolean) {
    super()
    this.id = "NOTES_VISIBILITY_FILTER_ENABLED"
    this.payload = {
      enabled: e
    }
  }
}
