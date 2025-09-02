import { BaseExceptionError } from "./baseException.error"
export class OutOfRangeExceptionError extends BaseExceptionError {
  constructor(e = "Out of range") {
    super(e)
    this.name = "OutOfRangeException"
  }
}
