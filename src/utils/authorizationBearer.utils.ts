export class AuthorizationBearer {
  static token: string
  static setToken(e: string) {
    AuthorizationBearer.token = "Bearer " + e
  }
  isAuthenticated() {
    return !!AuthorizationBearer.token
  }
  authenticate(e?: string) {
    return !(!e || "string" != typeof e)
  }
  getAuthorizationHeader() {
    return AuthorizationBearer.token ? AuthorizationBearer.token : ""
  }
}
