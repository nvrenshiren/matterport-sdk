import { Command } from "../core/command"
export class DeleteBlursCommand extends Command {
  constructor(...e: string[]) {
    super()
    this.id = "DELETE_BLURS"
    this.payload = { ids: e }
  }
}
export class SaveBlursCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "SAVE_BLURS"
  }
}
export class PublishBlursCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "PUBLISH_BLURS_COMMAND"
  }
}
export class RefreshBlursCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "REFRESH_BLURS_COMMAND"
  }
}
export class ApplyBlursCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "APPLY_BLURS_COMMAND"
  }
}
export class SaveBlurSuggestionsCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "SAVE_BLUR_SUGGESTIONS"
  }
}
export class ShowBlurSuggestionsCommand extends Command {
  constructor(...e: string[]) {
    super()
    this.id = "SHOW_BLUR_SUGGESTIONS"
    this.payload = { ids: e }
  }
}
export class HideBlurSuggestionsCommand extends Command {
  constructor(...e: string[]) {
    super()
    this.id = "HIDE_BLUR_SUGGESTIONS"
    this.payload = { ids: e }
  }
}
export class AcceptBlurSuggestionsCommand extends Command {
  constructor(...e: string[]) {
    super()
    this.id = "ACCEPT_BLUR_SUGGESTIONS"
    this.payload = { ids: e }
  }
}
export class RejectBlurSuggestionsCommand extends Command {
  constructor(...e: string[]) {
    super()
    this.id = "REJECT_BLUR_SUGGESTIONS"
    this.payload = { ids: e }
  }
}
