import { Command } from "../core/command"
export class SaveCommand extends Command {
  constructor(e: { dataTypes: string[]; onCallback?: any; skipDirtyUpdate?: boolean }) {
    super()
    this.id = "SAVE_COMMAND"
    this.payload = e
  }
}
