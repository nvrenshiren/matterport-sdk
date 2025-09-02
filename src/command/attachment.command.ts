import { Command } from "../core/command"
import { MeshTrimView } from "../modules/meshTrim.module"
export class EmbedMediaCommand extends Command {
  constructor(e: string, t: string, n: string) {
    super()
    this.id = "EMBED_MEDIA"
    this.payload = {
      parentId: e,
      parentType: t,
      src: n
    }
  }
}
export class LoadAttachmentEmbedCommand extends Command {
  constructor(e: any) {
    super()
    this.id = "LOAD_ATTACHMENT_EMBED"
    this.payload = {
      attachment: e
    }
  }
}
export class UploadAttachmentsCommand extends Command {
  constructor(e: string, t: string, n: string[]) {
    super()
    this.id = "UPLOAD_ATTACHMENTS"
    this.payload = {
      parentId: e,
      parentType: t,
      files: n
    }
  }
}
export class ConfirmAttachmentChangesCommand extends Command {
  constructor(e: string, t: string, n: string) {
    super()
    this.id = "CONFIRM_ATTACHMENT_CHANGES"
    this.payload = {
      parentId: e,
      parentType: t,
      prevParentId: n
    }
  }
}
export class CancelAttachmentUploadCommand extends Command {
  constructor(e: string) {
    super()
    this.id = "CANCEL_ATTACHMENT_UPLOAD"
    this.payload = {
      uploadId: e
    }
  }
}
export class CancelAttachmentChangesCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "CANCEL_ATTACHMENT_CHANGES"
  }
}
export class AttachmentsResetDataCommand extends Command {
  constructor() {
    super()
    this.id = "ATTACHMENTS_RESET_DATA"
  }
}
export class ToggleViewAttachmentsCommand extends Command {
  constructor(e: boolean, t?: string[], n?: string) {
    super()
    this.id = "TOGGLE_VIEW_ATTACHMENTS"
    this.payload = {
      open: e,
      attachments: t,
      attachmentId: n
    }
  }
}
export class AttachmentRemoveCommand extends Command {
  constructor(e) {
    super()
    this.id = "ATTACHMENT_REMOVE"
    this.payload = {
      attachment: e
    }
  }
}
export class AttachmentRemoveFailedUploadCommand extends Command {
  constructor(e: string) {
    super()
    this.id = "ATTACHMENT_REMOVE_FAILED_UPLOAD"
    this.payload = {
      id: e
    }
  }
}
export class AttachmentDeleteCommand extends Command {
  constructor(e: string) {
    super()
    this.id = "ATTACHMENT_DELETE"
    this.payload = {
      id: e
    }
  }
}
export class AttachGizmoCommand extends Command {
  payload: {
    target: MeshTrimView
  }
  constructor(e: MeshTrimView) {
    super()
    this.id = "ATTACH_GIZMO"
    this.payload = {
      target: e
    }
  }
}
export class DetachGizmoCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "DETACH_GIZMO"
  }
}
export class SetGizmoControlModeCommand extends Command {
  mode: any
  constructor(e) {
    super()
    this.mode = e
    this.id = "SET_GIZMO_CONTROL_MODE"
    this.payload = {
      mode: e
    }
  }
}
