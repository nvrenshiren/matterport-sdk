import { Message } from "../core/message"
export class DataSavedMessage extends Message {
  dataTypes: string[]
  constructor(e: string[]) {
    super()
    this.dataTypes = e
  }
}
export class SaveErrorMessage extends Message {
  error: string
  dataTypes: string[]
  constructor(e: string, t = []) {
    super()
    this.error = e
    this.dataTypes = t
  }
}
export class PublishErrorMessage extends Message {
  error: any
  dataTypes: never[]
  constructor(e: any, t = []) {
    super()
    this.error = e
    this.dataTypes = t
  }
}
export class ForbiddenErrorMessage extends Message {
  error: any
  dataTypes: never[]
  constructor(e: any, t = []) {
    super()
    this.error = e
    this.dataTypes = t
  }
}
