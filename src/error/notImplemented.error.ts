import { BaseExceptionError } from "./baseException.error"
export class NotImplementedError extends BaseExceptionError {
  constructor(e = "Not implemented") {
    super(e), (this.name = "NotImplemented")
  }
}
