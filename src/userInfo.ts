import { defaultUserColor } from "./utils/67622"
import { UserStatus } from "./const/66197"
import { modelAccessType } from "./const/typeString.const"
export class UserInfo {
  email: string
  id: string
  firstName: string
  lastName: string
  modelAccess: string
  userStatus: string
  name: string
  initials: string
  color: string
  constructor(e) {
    ;(this.email = ""),
      (this.id = ""),
      (this.firstName = ""),
      (this.lastName = ""),
      (this.modelAccess = modelAccessType.PUBLIC),
      (this.userStatus = UserStatus.UNKNOWN),
      (this.name = ""),
      (this.initials = ""),
      (this.color = ""),
      e && Object.assign(this, e)
    const t = this.id ? this.getFullName(this.firstName, this.lastName) : ""
    ;(this.name = t || this.email || ""), (this.initials = this.getInitials(this.name)), (this.color = defaultUserColor(this.id))
  }
  getFullName(e, t) {
    return e && t ? `${e} ${t}` : e || t
  }
  getInitials(e) {
    const t = e
      ? e
          .split(" ")
          .map(e => e[0])
          .join("")
      : "?"
    return t.length < 3 ? t : `${t[0]}${t[t.length - 1]}`
  }
}
