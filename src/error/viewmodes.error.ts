import { ViewModes } from "../utils/viewMode.utils"
import { BaseExceptionError } from "./baseException.error"
export class ConversionViewsModeError extends BaseExceptionError {
  mode: ViewModes
  constructor(e: string, t: ViewModes) {
    super(e)
    this.mode = t
  }
}
