import { UserInviteCommand, UserMentionsFetchCommand, UserSearchCommand } from "../command/users.command"
import { UserStatus } from "../const/66197"
import { UsersSymbol } from "../const/symbol.const"
import { modelAccessType } from "../const/typeString.const"
import { DebugInfo } from "../core/debug"
import EngineContext from "../core/engineContext"
import { MdsStore } from "../core/mds.store"
import { Module } from "../core/module"
import { LayersData } from "../data/layers.data"
import { UsersData } from "../data/users.data"
import { UserApiClient } from "./userInfo.module"

declare global {
  interface SymbolModule {
    [UsersSymbol]: UsersModule
  }
}

export class OrgUser {
  id: string
  email: string
  firstName: string
  lastName: string
  modelAccess: string

  constructor(e) {
    this.id = ""
    this.email = ""
    this.firstName = ""
    this.lastName = ""
    this.modelAccess = modelAccessType.PUBLIC
    Object.assign(this, e)
  }
}

const l = new DebugInfo("mds-user-deserializer")

class UserDeserializer {
  validate: (e) => boolean

  constructor() {
    this.validate = e => {
      if (!e) return !1
      const t = ["id", "email"].filter(t => !(t in e)),
        n = 0 === t.length
      !n &&
        l.debug("OrgUserMetadata invalid:", {
          missingFields: t
        })
      return n
    }
  }

  deserialize(e) {
    return e && this.validate(e) ? new OrgUser(e) : (l.debug("Deserialized invalid OrgUserMetadata from MDS", e), null)
  }
}

const u = new DebugInfo("users-store")

class UserStore extends MdsStore {
  deserializer: UserDeserializer

  constructor(e) {
    super(e)
    this.deserializer = new UserDeserializer()
  }

  async fetchAccessForUser(e, t) {
    //pw
    // return this.query(d.GetCurrentUserModelAccess, {
    //   modelId: t,
    //   userId: e
    // }).then(t => {
    //   const results = t?.data?.model?.users?.results
    //   let c = modelAccessType.PUBLIC
    //   results && Array.isArray(results)
    //     ? (results.find(e => e.modelAccess === modelAccessType.FULL)
    //         ? (c = modelAccessType.FULL)
    //         : results.find(e => e.modelAccess === modelAccessType.VIEWER) && (c = modelAccessType.VIEWER),
    //       u.debug(`modelAccess: ${results.length} response(s), set to "${c}"`))
    //     : u.debug(`fetchModelAccess failed for ${e}`)
    //   return {
    //     modelAccess: c,
    //     organization: t?.data?.model?.organization
    //   }
    // })
    return {
      modelAccess: modelAccessType.PUBLIC,
      organization: null
    }
  }

  async search(e, t?, n?) {
    const i = this.getViewId()
    // return this.query(d.GetUsers, {
    //   modelId: i,
    //   search: e || null,
    //   ids: n || null,
    //   emails: t || null
    // }).then(res => {
    //   const results = res?.data?.model?.users?.results
    //   if (!results || !Array.isArray(results)) return []
    //   const r: OrgUser[] = []
    //   for (const index of results) {
    //     const t = this.deserializer.deserialize(index)
    //     t && r.push(t)
    //   }
    //   return r
    // })
    return [] as OrgUser[]
  }
}

export default class UsersModule extends Module {
  onUserMentionSearch: (e) => Promise<void>
  resolveUserMentions: (e) => Promise<void>
  inviteUsers: (e) => Promise<void>
  store: UserStore
  userData: UsersData
  config: any

  constructor() {
    super(...arguments)
    this.name = "users-module"
    this.onUserMentionSearch = async e => {
      const t = await this.store.search(e.search)
      this.userData.loadKnownUsers(t)
    }
    this.resolveUserMentions = async res => {
      if (!res.userMentions.length) return void this.log.debug("No user mentions to resolve")
      const t: any[] = []
      res.userMentions.forEach(e => {
        ;(this.userData.getUserInfoByEmail(e.email) && e.userStatus !== UserStatus.MENTIONED) || t.push(e)
      })
      if (t.length > 0) {
        const e: string[] = t.map(e => e.email)
        return this.searchUsers(new Set(e), UserStatus.MENTIONED)
      }
    }
    this.inviteUsers = async e => {
      const { emails, modelAccess, message, noteId } = e
      if (!emails.length) return
      const { baseUrl, viewId, queue } = this.config,
        questUrl = `${baseUrl}/api/v2/shares/`,
        c = {
          object_type: "model",
          object_id: viewId,
          role: modelAccess,
          inviter_message: message,
          note: noteId
        },
        d = new Set<string>()
      await Promise.all(
        emails.map(email =>
          queue
            .post(questUrl, {
              responseType: "json",
              body: Object.assign(Object.assign({}, c), {
                email
              })
            })
            .then(res => {
              const user = res.user
              this.userData.loadKnownUser({
                id: user.sid,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                modelAccess: res.role
              })
            })
            .catch(() => {
              this.log.debug(`User Invite failed: ${email}`)
              d.add(email)
            })
        )
      )
      return d.size > 0 ? this.searchUsers(d, UserStatus.FAILED) : void 0
    }
  }

  async init(e, t: EngineContext) {
    this.config = e
    this.store = new UserStore({
      context: e.mdsContext,
      readonly: !0,
      baseUrl: e.baseUrl,
      viewId: e.viewId
    })
    t.market.waitForData(LayersData).then(async n => {
      const user = await (e.api as UserApiClient).user
      let s = modelAccessType.PUBLIC,
        r = !1
      if (user.loggedIn && user.id) {
        const e = await this.store.fetchAccessForUser(user.id, n.getBaseModelId())
        s = e.modelAccess
        e.organization && (r = user.isOrganizationAdmin(e.organization))
      }
      this.userData = new UsersData(
        {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          modelAccess: s
        },
        user.loggedIn,
        r
      )
      this.bindings.push(
        t.commandBinder.addBinding(UserSearchCommand, this.onUserMentionSearch),
        t.commandBinder.addBinding(UserMentionsFetchCommand, this.resolveUserMentions),
        t.commandBinder.addBinding(UserInviteCommand, this.inviteUsers)
      )
      t.market.register(this, UsersData, this.userData)
    })
  }

  dispose(e) {
    super.dispose(e)
    e.market.unregister(this, UsersData)
  }

  async searchUsers(e: Set<string>, t) {
    const n = Array.from(e),
      i = await this.store.search(void 0, n)
    this.userData.loadSearchResults(i, n, t)
  }
}
