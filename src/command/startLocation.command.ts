import { Command } from "../core/command"
import { DeepLinkPose } from "../data/camstart.data"
export class StartLocationFlyInCommand extends Command {
  static id: string
  /**
   * 初始位置
   *
   */
  constructor(e: DeepLinkPose) {
    super()
    this.payload = {
      pose: e
    }
  }
}
StartLocationFlyInCommand.id = "START_LOCATION_FLY_IN_COMMAND"
export class StartLocationGotoCommand extends Command {
  static id: string
}
StartLocationGotoCommand.id = "START_LOCATION_GOTO_COMMAND"
