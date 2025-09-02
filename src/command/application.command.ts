import { Command } from "../core/command"
import { AppMode } from "../data/app.data"
export class StartApplicationCommand extends Command {
  static id: string
  constructor(e: boolean, t: boolean) {
    super()
    this.payload = {
      startup: e,
      editMode: t
    }
  }
}
StartApplicationCommand.id = "START_APPLICATION"
export class ExpandAppCommand extends Command {
  static id: string
  constructor(e: boolean) {
    super()
    this.payload = {
      expand: e
    }
  }
}
ExpandAppCommand.id = "EXPAND_APP"
export class AppSwitchCommand extends Command {
  static id: string
  constructor(e: AppMode) {
    super()
    this.payload = { application: e }
  }
}
AppSwitchCommand.id = "APP_SWITCH"
export class EditFromParentCommand extends Command {
  static id: string
  constructor(e: any) {
    super()
    this.payload = { initialTool: e }
  }
}
EditFromParentCommand.id = "EDIT_FROM_PARENT"
export class StopEditFromParentCommand extends Command {
  static id: string
}
StopEditFromParentCommand.id = "STOP_EDIT_FROM_PARENT"
