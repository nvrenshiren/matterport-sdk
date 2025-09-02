import { BaseExceptionError } from "./baseException.error"
export class TransitionExceptionError extends BaseExceptionError {
  constructor(e = "Unhandled Transition Exception") {
    super(e), (this.name = "TransitionException")
  }
}
