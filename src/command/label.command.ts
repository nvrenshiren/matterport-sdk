import { Command } from "../core/command"
export class LabelEditorCreateCommand extends Command {
  constructor() {
    super(...arguments), (this.id = "LABEL_EDITOR_CREATE")
  }
}
export class LabelEditorDiscardCommand extends Command {
  constructor() {
    super(...arguments), (this.id = "LABEL_EDITOR_DISCARD")
  }
}
export class LabelEditorEnableCommand extends Command {
  constructor() {
    super(...arguments), (this.id = "LABEL_EDITOR_ENABLE")
  }
}
export class LabelEditorDisableCommand extends Command {
  constructor() {
    super(...arguments), (this.id = "LABEL_EDITOR_DISABLE")
  }
}
export class LabelEditorEditCommand extends Command {
  constructor(e: { sid: string }) {
    super(), (this.payload = e), (this.id = "LABEL_EDITOR_EDIT")
  }
}
export class LabelDeleteCommand extends Command {
  constructor(e: { sids: string[] }) {
    super(), (this.payload = e), (this.id = "LABEL_DELETE")
  }
}
export class LabelToggleSelectCommand extends Command {
  constructor(e: { sid: string }) {
    super()
    this.payload = e
    this.id = "LABEL_TOGGLE_SELECT"
  }
}
export class LabelRenameCommand extends Command {
  constructor(e: { sid: string; text: string }) {
    super()
    this.payload = e
    this.id = "LABEL_RENAME"
  }
}
export class LabelVisibleCommand extends Command {
  constructor(e: { sids: string[]; visible: boolean }) {
    super()
    this.payload = e
    this.id = "LABEL_VISIBLE"
  }
}
