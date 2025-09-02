import { Color, Vector3 } from "three"
import { Command } from "../core/command"
import { TagsMode } from "../const/12150"
import { AttachmentsObject } from "../object/attachments.object"
export class RegisterTagsToolCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "REGISTER_TAGS_TOOL"
  }
}
export class TagsToggleCommand extends Command {
  constructor(e: boolean) {
    super()
    this.id = "TAGS_TOGGLE"
    this.payload = {
      opened: e
    }
  }
}
export class TagStartAddCommand extends Command {
  constructor(info) {
    super()
    this.id = "TAG_START_ADD"
    this.payload = info
  }
}
export class TagSaveCommand extends Command {
  /**
   *
   * @param e 对象的ID
   * @param t 对象的属性
   * @param n 待处理的附件
   * @param i 已移除的附件
   * @param s 嵌入的内容
   */
  payload: {
    id: string
    properties: {
      position?: Vector3
      normal?: Vector3
      floorId?: string
      roomId?: string
      description?: string
      label?: string
      keywords?: string[]
      color?: Color
      stemHeight?: number
      stemVisible?: boolean
      icon?: string
      enabled?: boolean
      objectAnnotationId?: string
    }
    pendingAttachments: AttachmentsObject[]
    removedAttachments: AttachmentsObject[]
    embed: boolean | null
  }
  constructor(
    e: TagSaveCommand["payload"]["id"],
    t: TagSaveCommand["payload"]["properties"],
    n: AttachmentsObject[],
    i: AttachmentsObject[],
    s: boolean | null
  ) {
    super()
    this.id = "TAG_SAVE"
    this.payload = {
      id: e,
      properties: t,
      pendingAttachments: n,
      removedAttachments: i,
      embed: s
    }
  }
}
export class TagVisibilityToggleCommand extends Command {
  constructor(e: string, t: boolean) {
    super()
    this.id = "TAG_VISIBILITY_TOGGLE"
    this.payload = {
      id: e,
      visible: t
    }
  }
}
export class TagCancelEditsCommand extends Command {
  constructor() {
    super()
    this.id = "TAG_CANCEL_EDITS"
  }
}
export class TagEditCommand extends Command {
  constructor(e: string) {
    super()
    this.id = "TAG_EDIT"
    this.payload = {
      tagId: e
    }
  }
}
export class TagDirtyToggleCommand extends Command {
  constructor(e: any) {
    super()
    this.id = "TAG_DIRTY_TOGGLE"
    this.payload = {
      dirty: e
    }
  }
}
export class TagOpenCommand extends Command {
  /**
   * 打开标签
   *
   * @param e 标签ID
   * @param t 配置对象
   * @param t.transition 过渡动画，默认为null
   * @param t.dock 停靠位置，默认为null
   * @param t.objectTag 是否为对象标签，默认为false
   * @param t.forceOpen 是否强制打开，默认为false
   */
  constructor(e: string, t: { transition?: any; dock?: boolean; objectTag?: boolean; forceOpen?: number }) {
    super()
    this.id = "TAG_OPEN"
    const { transition: n = null, dock: i = null, objectTag: s = !1, forceOpen: r = !1 } = t || {}
    this.payload = {
      tagId: e,
      transition: n,
      dock: i,
      objectTag: s,
      forceOpen: r
    }
  }
}
export class TagUpdateOpenTagviewCommand extends Command {
  constructor(e: string) {
    super()
    this.id = "TAG_UPDATE_OPEN_TAGVIEW"
    this.payload = {
      updates: e
    }
  }
}
export class TagDeleteCommand extends Command {
  constructor(e: string, t: string) {
    super()
    this.id = "TAG_DELETE"
    this.payload = {
      id: e,
      removalMethod: t
    }
  }
}
export class TagCloseCommand extends Command {
  constructor() {
    super()
    this.id = "TAG_CLOSE"
  }
}
export class TagOrderSaveCommand extends Command {
  constructor(e: string[]) {
    super()
    this.id = "TAG_ORDER_SAVE"
    this.payload = {
      ids: e
    }
  }
}
export class TagsVisibilityFilterEnabledCommand extends Command {
  constructor(e: boolean) {
    super()
    this.id = "TAGS_VISIBILITY_FILTER_ENABLED"
    this.payload = {
      enabled: e
    }
  }
}
export class FilterVisibleTagsCommand extends Command {
  constructor(e: string[]) {
    super()
    this.id = "FILTER_VISIBLE_TAGS_COMMAND"
    this.payload = {
      ids: e
    }
  }
}
export class SetReorderingModeCommand extends Command {
  constructor(e: TagsMode) {
    super()
    this.id = "SET_REORDERING_MODE"
    this.payload = {
      mode: e
    }
  }
}
export class TagOrderBySetCommand extends Command {
  constructor(e: string) {
    super()
    this.id = "TAG_ORDER_BY_SET"
    this.payload = {
      order: e
    }
  }
}
export class SetEmbedErrorIdCommand extends Command {
  constructor(e?: string) {
    super()
    this.id = "SET_EMBED_ERROR_ID"
    this.payload = {
      id: e
    }
  }
}
