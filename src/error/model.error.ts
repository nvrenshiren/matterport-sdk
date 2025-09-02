import { BaseExceptionError } from "./baseException.error"
class ApiExceptionError extends BaseExceptionError {
  constructor(e = "Api Exception") {
    super(e)
    this.name = "ApiException"
  }
}
export class UnauthorizedError extends ApiExceptionError {
  constructor(e = "Unauthorized") {
    super(e)
    this.name = "Unauthorized"
  }
}
export class ForbiddenError extends ApiExceptionError {
  constructor(e = "Forbidden") {
    super(e)
    this.name = "Forbidden"
  }
}
export class NotFoundError extends ApiExceptionError {
  constructor(e = "Not Found") {
    super(e)
    this.name = "NotFound"
  }
}
export class ModelProcessingError extends ApiExceptionError {
  constructor(e = "Model Processing") {
    super(e)
    this.name = "ModelProcessing"
    this.code = "unavailable.processing"
  }
}
export class ModelFailedError extends ApiExceptionError {
  constructor(e = "Model Failed") {
    super(e)
    this.name = "ModelFailed"
    this.code = "model.failed"
  }
}
export class ModelArchivedError extends ApiExceptionError {
  constructor(e = "Model Archived") {
    super(e)
    this.name = "ModelArchived"
    this.code = "unavailable.archived"
  }
}
export class ModelPendingError extends ApiExceptionError {
  constructor(e = "Model Pending") {
    super(e)
    this.name = "ModelPending"
    this.code = "unavailable.pending"
  }
}
export class ModelDeletedError extends ApiExceptionError {
  constructor(e = "Model Deleted") {
    super(e)
    this.name = "ModelDeleted"
    this.code = "unavailable.gone"
  }
}
export class ModelComplianceError extends ApiExceptionError {
  constructor(e = "Model Compliance") {
    super(e)
    this.name = "ModelCompliance"
    this.code = "unavailable.compliance"
  }
}
