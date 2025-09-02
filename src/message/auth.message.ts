import { Message } from "../core/message"
export class PasswordAuthenticationMessage extends Message {}
export class AuthErrorTypeMessage extends Message {
  errorType: any
  constructor(e: string) {
    super()
    this.errorType = e
  }
}
