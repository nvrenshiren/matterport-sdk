import { Command } from "../core/command"
export class ToggleOptionCommand extends Command {
  constructor(e: { key: string; value: boolean }) {
    super()
    this.id = "TOGGLE_OPTION"
    this.payload = Object.assign({}, e)
  }
}
export class SetUnitsCommand extends Command {
  constructor(e: any) {
    super()
    this.id = "SET_UNITS"
    this.payload = Object.assign({}, e)
  }
}
export class PlayerOptionSettingsCommand extends Command {
  constructor(e: { [x: number]: any }) {
    super()
    this.id = "PLAYER_OPTION_SETTINGS"
    this.payload = Object.assign({}, e)
  }
}
export class SetBackgroundColorCommand extends Command {
  constructor(e: { backgroundColor: string }) {
    super()
    this.id = "SET_BACKGROUND_COLOR"
    this.payload = Object.assign({}, e)
  }
}
export class PlayerOptionsSetPanDirectionCommand extends Command {
  constructor(e: { panDirection: any }) {
    super()
    this.id = "PLAYER_OPTIONS_SET_PAN_DIRECTION"
    this.payload = Object.assign({}, e)
  }
}
export class PlayerOptionsResetTourDefaultsCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "PLAYER_OPTIONS_RESET_TOUR_DEFAULTS"
  }
}
