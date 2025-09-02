import { Command } from "../core/command"
export class XrPresentCommand extends Command {
  constructor(e: { type: string; features: string[] }) {
    super()
    this.id = "XR_PRESENT"
    this.payload = Object.assign({}, e)
  }
}
export class XrPresentEndCommand extends Command {
  constructor() {
    super()
    this.id = "XR_PRESENT_END"
  }
}
