import { Command } from "../core/command"
export class ShowcaseStartCommand extends Command {
  static id: string
}
ShowcaseStartCommand.id = "JMYDCase_START"
export class ShowcaseStopCommand extends Command {
  static id: string
}
ShowcaseStopCommand.id = "JMYDCase_STOP"
export class ShowcaseReadyCommand extends Command {
  static id: string
}
ShowcaseReadyCommand.id = "JMYDCase_READY"
