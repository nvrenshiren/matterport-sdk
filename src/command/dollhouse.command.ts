import { Command } from "../core/command"
export class DollhouseVerticalLimitsCommand extends Command {
  constructor(t: { phiLowerLimitDegrees?: number; noTransition: boolean; phiUpperLimitDegrees?: number }) {
    super()
    this.payload = t
    this.id = "DOLLHOUSE_VERTICAL_LIMITS"
  }
}
export class SwapMouseBtnActionCommand extends Command {
  constructor() {
    super()
    this.id = "SWAP_MOUSE_BTN_ACTION"
  }
}
export class RestoreMouseBtnActionCommand extends Command {
  constructor() {
    super()
    this.id = "RESTORE_MOUSE_BTN_ACTION"
  }
}
