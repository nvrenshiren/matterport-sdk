import { isMockError } from "../utils/error.utils"

export class BaseExceptionError extends Error {
  code: string
  originalError: Error
  constructor(e?: Error | string, code?: string) {
    super(e instanceof Error ? e.message : e)
    this.name = "BaseException"
    code && (this.code = code)
    if (e instanceof Error) {
      this.originalError = e
      isMockError(e) && (this.isMock = !0)
    }
  }
}
