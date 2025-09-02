import * as a from "../userInfo"
import { UserInfo } from "../userInfo"
import { UnkownUser } from "../utils/67622"
import { UserStatus } from "../const/66197"
import { modelAccessType } from "../const/typeString.const"
import { Data } from "../core/data"
import { OrgUser } from "../modules/users.module"
import { ObservableMap, createObservableMap } from "../observable/observable.map"
export class UsersData extends Data {
  orgAdmin: boolean
  name: string
  users: ObservableMap<UserInfo>
  currentUser: UserInfo
  constructor(e: { id?: string; firstName?: string; lastName?: string; email?: string; modelAccess: string }, t: boolean, n: boolean) {
    super()
    this.orgAdmin = n
    this.name = "users-data"
    this.users = createObservableMap()
    const i = e.modelAccess || modelAccessType.PUBLIC
    this.currentUser = new UserInfo(
      Object.assign(Object.assign({}, e), {
        modelAccess: i,
        userStatus: t ? UserStatus.KNOWN : UserStatus.UNKNOWN
      })
    )
    this.addUser(this.currentUser)
  }
  loadSearchResults(e: OrgUser[], t: string[], n) {
    this.atomic(() => {
      e.forEach(e => {
        this.loadUser(
          Object.assign(Object.assign({}, e), {
            userStatus: UserStatus.KNOWN
          })
        )
      })
      t.forEach(e => {
        this.users.get(e) ||
          this.loadUser({
            email: e,
            id: "",
            userStatus: n,
            modelAccess: modelAccessType.PUBLIC,
            firstName: null,
            lastName: null
          })
      })
    })
  }
  loadKnownUsers(e) {
    this.atomic(() => {
      e.forEach(e => {
        this.loadKnownUser(e)
      })
    })
  }
  loadKnownUser(e) {
    return this.loadUser(
      Object.assign(Object.assign({}, e), {
        userStatus: UserStatus.KNOWN
      })
    )
  }
  loadContributor(e) {
    const t = this.users.get(e.email)
    return (
      t ||
      this.loadUser(
        Object.assign(Object.assign({}, e), {
          userStatus: UserStatus.CONTRIBUTOR
        })
      )
    )
  }
  loadFailedUser(e) {
    return this.loadUser(
      Object.assign(Object.assign({}, e), {
        userStatus: UserStatus.FAILED
      })
    )
  }
  loadUser(e) {
    let t = this.users.get(e.email)
    return (
      e.email === this.currentUser.email ||
        (t && t.userStatus === UserStatus.KNOWN && t.modelAccess !== modelAccessType.PUBLIC) ||
        ((t = new UserInfo(e)), t ? this.users.set(e.email, t) : this.addUser(t)),
      t
    )
  }
  getUserInfoByEmail(e) {
    return this.users.has(e) ? this.users.get(e) : null
  }
  getUserInfoById(e) {
    return "" === e ? null : this.users.values.find(t => t.id === e) || null
  }
  getUserDisplay(e) {
    return this.users.has(e) ? this.users.get(e) : UnkownUser(e)
  }
  iterate(e) {
    for (const t of this.users) e(t)
  }
  getUsersWhoMayNeedAccess() {
    const e = {}
    return (
      this.users.values.forEach(t => {
        ;(t.userStatus === UserStatus.KNOWN && t.modelAccess !== modelAccessType.PUBLIC) || (e[t.email] = t)
      }),
      e
    )
  }
  getKnownUsers() {
    return this.users.values.filter(e => e.userStatus === UserStatus.KNOWN)
  }
  addUser(e: UserInfo) {
    this.users.has(e.email) || this.users.set(e.email, e)
  }
  getCurrentUser() {
    return this.currentUser
  }
  isLoggedIn() {
    return !!this.currentUser.id
  }
  isOrgAdmin() {
    return this.orgAdmin
  }
  isInviter() {
    return this.orgAdmin
  }
  isEditor() {
    return this.currentUser.modelAccess === modelAccessType.FULL
  }
  isCommenter() {
    const { modelAccess: e } = this.currentUser
    return e === modelAccessType.VIEWER || e === modelAccessType.FULL
  }
  getCurrentUserId() {
    return this.currentUser.id
  }
  onUsersChanged(e) {
    return this.users.onChanged(e)
  }
}
