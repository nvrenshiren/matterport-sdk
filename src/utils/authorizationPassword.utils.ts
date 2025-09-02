import * as a from "./authHeader.utils"
import { setAuthHeader } from "./authHeader.utils"
import * as r from "../const/48575"
import { ErrorType } from "../const/auth.const"
import { DebugInfo } from "../core/debug"
const o = new DebugInfo("mp-password-authentication")
export class AuthenticationPassword {
  baseUrl: string
  errorType: string
  static token?: string
  constructor(e = window.location.origin) {
    this.baseUrl = e
    this.errorType = ErrorType.UNKNOWN
  }
  async authenticate(e: string, t: string) {
    if (!e.match(/[a-zA-Z0-9]+/)) return o.error(`Invalid Model ID ${e}`), !1
    const n = `${this.baseUrl}/api/v2/models/${e}/public-access/`
    return this.fetchToken(n, t).then(async e => {
      let t = {}
      return e && ((t = await e.json()), e.ok && t["token"])
        ? (this.login(t["token"]), !0)
        : ((this.errorType = AuthenticationPassword.getErrorType(t["code"])), this.logout(), !1)
    })
  }
  isAuthenticated() {
    return void 0 !== AuthenticationPassword.token
  }
  login(e: string) {
    AuthenticationPassword.token = e
  }
  logout() {
    AuthenticationPassword.token = void 0
  }
  getAuthorizationHeader() {
    return AuthenticationPassword.token ? `Matterport-Object-Access ${AuthenticationPassword.token}` : ""
  }
  async fetchToken(e: string, password: string) {
    const body = JSON.stringify({
      password
    })
    const headers = {
      "Content-Type": "application/json"
    }
    setAuthHeader(e, headers)
    return fetch(e, {
      method: "POST",
      cache: "no-cache",
      headers,
      body
    })
  }
  static getErrorType(e) {
    switch (e) {
      case r.X.TOO_MANY_ATTEMPTS:
        return ErrorType.TOO_MANY_ATTEMPTS
      case r.X.INVALID_PASSWORD:
        return ErrorType.INVALID_CREDENTIALS
    }
    return ErrorType.UNKNOWN
  }
}
