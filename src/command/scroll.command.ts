import { Command } from "../core/command"
export class GutterTouchScrollDisableCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "GUTTER_TOUCH_SCROLL_DISABLE"
  }
}
export class GutterTouchScrollEnableCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "GUTTER_TOUCH_SCROLL_ENABLE"
  }
}
