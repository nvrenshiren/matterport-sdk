import { TransitionExceptionError } from "./transitionException.error"
class ViewmodeExceptionError extends TransitionExceptionError {
  constructor(e = "Unhandled Viewmode Exception", t?) {
    super(e), (this.originalError = t), (this.name = "ViewmodeException")
  }
}
export class ViewmodeActiveTransitionError extends ViewmodeExceptionError {
  constructor(e = "Tried to start view-mode transition while another transition was active", t?) {
    super(e, t), (this.name = "ViewmodeActiveTransition")
  }
}
export class ViewmodeLockedError extends ViewmodeExceptionError {
  constructor(e = "Cannot change viewmode when locked", t?) {
    super(e, t), (this.name = "ViewmodeLocked")
  }
}
export class ViewmodeInvalidError extends ViewmodeExceptionError {
  constructor(e = "Cannot change to disabled/invalid viewmode", t?) {
    super(e, t), (this.name = "ViewmodeInvalid")
  }
}
export class ViewmodeCommandExceptionError extends ViewmodeExceptionError {
  constructor(e = "Unhandled Error processing viewmode change command", t?) {
    super(e, t), (this.name = "ViewmodeCommandException")
  }
}
