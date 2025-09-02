import { BaseExceptionError } from "./baseException.error"
export class TooManyTrimsError extends BaseExceptionError {
  constructor(e) {
    super(e), (this.name = "TooManyTrimsError")
  }
}
