import { BaseExceptionError } from "./baseException.error"
export class TourTransitionError extends BaseExceptionError {
  constructor(e = "Invalid tour transition") {
    super(e), (this.name = "TourTransition")
  }
}
export class TourStartError extends BaseExceptionError {
  constructor(e = "Cannot start tour") {
    super(e), (this.name = "TourStart")
  }
}
