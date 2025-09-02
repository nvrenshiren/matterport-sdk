import * as i from "./transitionException.error"
import { TransitionExceptionError } from "./transitionException.error"
export class SweepExceptionError extends TransitionExceptionError {
  constructor(e = "SweepException") {
    super(e), (this.name = "SweepException")
  }
}
export class SweepTransitionActiveExceptionError extends SweepExceptionError {
  constructor(e = "Tried to start transition while another transition was active") {
    super(e), (this.name = "SweepTransitionActiveException")
  }
}
