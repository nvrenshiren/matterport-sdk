import { BaseExceptionError } from "./baseException.error"
export class MdsReadError extends BaseExceptionError {
  constructor(e = "MdsMeasurementModeStore.read failed", t = "62001") {
    super(e), (this.name = "MdsReadError"), (this.code = t)
  }
}
export class MdsWriteError extends BaseExceptionError {
  constructor(e, t = "63001") {
    super(e), (this.name = "MdsWriteError"), (this.code = t)
  }
}
export class MdsUploadError extends BaseExceptionError {
  constructor(e, t = "63002") {
    super(e), (this.name = "MdsUploadError"), (this.code = t)
  }
}
export class InvalidViewError extends BaseExceptionError {
  constructor(e, t = "52404") {
    super(e), (this.name = "InvalidView"), (this.code = t)
  }
}
export class ReadOnlyError extends BaseExceptionError {
  constructor(e, t = "53001") {
    super(e), (this.name = "ReadOnly"), (this.code = t)
  }
}
