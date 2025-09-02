import { Command } from "../core/command"
export class ZoomInCommand extends Command {
  static id: string
  constructor(e: number) {
    super()
    this.payload = {
      step: e
    }
  }
}
ZoomInCommand.id = "ZOOM_IN"
export class ZoomOutCommand extends Command {
  static id: string
  constructor(e: number) {
    super()
    this.payload = {
      step: e
    }
  }
}
ZoomOutCommand.id = "ZOOM_OUT"
export class ZoomResetCommand extends Command {
  static id: string
}
ZoomResetCommand.id = "ZOOM_RESET"
export class ZoomMaxValueCommand extends Command {
  static id: string
}
ZoomMaxValueCommand.id = "ZOOM_MAX_VALUE"
export class ZoomSetCommand extends Command {
  static id: string
  constructor(e: number) {
    super()
    this.payload = {
      value: e
    }
  }
}
ZoomSetCommand.id = "ZOOM_SET"
