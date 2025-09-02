import { Command } from "../core/command"
export class ToggleRotationInteractionsCommand extends Command {
  constructor(e: boolean) {
    super()
    this.id = "TOGGLE_ROTATION_INTERACTIONS"
    this.payload = {
      enabled: e
    }
  }
}
