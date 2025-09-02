import { BaseExceptionError } from "./baseException.error"
export class InvalidFloorExceptionError extends BaseExceptionError {
  constructor(e = "Invalid Floor") {
    super(e), (this.name = "InvalidFloorException")
  }
}
