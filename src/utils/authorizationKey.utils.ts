import { getValFromURL } from "./urlParams.utils"
export class AuthorizationKey {
  static token: string
  constructor() {
    const auth = getValFromURL("auth", "")
    this.authenticate(auth)
  }
  isAuthenticated() {
    return !!AuthorizationKey.token
  }
  authenticate(e?: string) {
    return !(!e || "string" != typeof e) && ((AuthorizationKey.token = e.replace(",", " ")), !0)
  }
  getAuthorizationHeader() {
    return AuthorizationKey.token || ""
  }
}
