import { DebugInfo } from "../core/debug"
export class Organization {
  blurEnabled: boolean
  constructor(e) {
    this.blurEnabled = !1
    e && Object.assign(this, e)
  }
}

import { Apiv2Symbol } from "../const/symbol.const"
import MdsContext from "../core/mdsContext"
import { Module } from "../core/module"
import { HttpPriority, RequestManager } from "../core/request"
import { getGeoIpLocation } from "../getGeoIpLocation"
import usersCurrent from "../test/usersCurrent"
import { setAuthHeader } from "../utils/authHeader.utils"
import { FirefoxVersion, isFirefox } from "../utils/browser.utils"
import { deepDiffers } from "../utils/object.utils"
import { getValFromURL } from "../utils/urlParams.utils"
import { VersionUtils } from "../utils/version.utils"

const UserRoles = {
  USER: "user",
  ADMIN: "admin"
}
export class UserInfoClass {
  loggedIn: boolean
  flags: Set<string>
  memberships: MemberShip[]
  id: string
  firstName: string
  lastName: string
  email: string
  constructor(e?) {
    this.loggedIn = !1
    this.flags = new Set()
    this.memberships = []
    e && Object.assign(this, e)
  }
  getFlags(e = "") {
    if (this.memberships) {
      const e = getValFromURL("organization", "")
      for (const t of this.memberships) if ("" === e || t.organizationId === e) for (const e of t.flags) this.flags.add(e)
    }
    const t = new Set<string>()
    this.flags.forEach(n => {
      if (0 === n.indexOf(e)) {
        const i = n.replace(e, "")
        t.add(i)
      }
    })
    return t
  }
  hasFlag(e, t = "JMYDCase") {
    return this.getFlags().has(`${t}/${e}`)
  }
  isOrganizationAdmin(e) {
    const t = this.getMembership(e)
    return !!(null == t ? void 0 : t.roles.includes(UserRoles.ADMIN))
  }
  getMembershipFlags(e) {
    const t = this.getMembership(e)
    return t ? t.flags : []
  }
  getMembership(e) {
    return this.memberships.find(t => t.organizationId === e)
  }
  hasMembershipFlag(e, t) {
    return this.getMembershipFlags(e).includes(t)
  }
  getMembershipFeature(e, t) {
    const n = this.getMembership(e)
    return (null == n ? void 0 : n.features[t]) || !1
  }
  hasMembership(e) {
    return this.memberships.some(t => t.organizationId === e)
  }
}
class MemberShip {
  features: {}
  organizationId: string
  constructor(e) {
    this.features = {}
    e && Object.assign(this, e)
  }
}
const m = new DebugInfo("user.serializers")
function f(e, t = "20240906") {
  const n: string[] = []
  for (let i of e) {
    const e = i.match(/^.*\-(\d+(?:\.\d+)*)$/)
    if (e && e[1]) {
      if (((i = i.replace(/-(\d+(?:\.\d+)*)$/, "")), VersionUtils.lt(t, e[1]))) {
        m.debug(`Dropping feature flag ${i}, version >= ${e[1]} required`)
        continue
      }
      m.debug(`Enabled versioned feature flag ${i}`)
    }
    n.push(i)
  }
  return n
}
const y = new DebugInfo("ImageBitmapSupport")
const b = getValFromURL("imageBitmap", null)
let FirefoxOLD: boolean | null = null
function S() {
  return (
    "1" === b ||
    (null === FirefoxOLD &&
      (function () {
        if (((FirefoxOLD = !1), isFirefox())) {
          const e = FirefoxVersion()
          e.major <= 95 && (y.error(`Firefox/${e.major} issue, Disabling ImageBitmap support, upgrade to 96 for better performance.`), (FirefoxOLD = !0))
        }
      })(),
    !FirefoxOLD && ("createImageBitmap" in window ? "0" !== b : "1" === b))
  )
}
class A {
  query: any
  variables: any
  response: any
  constructor(e, t, n) {
    this.query = e
    this.variables = t
    this.response = n
  }
  read(e, t, n) {
    return e !== this.query || deepDiffers(t, this.variables) ? Promise.resolve(void 0) : Promise.resolve(this.response)
  }
}
const P = new DebugInfo("api")
const x = Object.freeze({
  cacheClearTimeout: 6e4
})
export class UserApiClient {
  apiQueue: RequestManager
  storeQueue: RequestManager
  prefetchedData: Record<string, Window["MP_PREFETCHED_MODELDATA"]>
  baseUrl: string
  mdsContext: MdsContext
  _configCache: {}
  _userCache: Record<string, UserInfoClass>
  _organizationCache: Record<string, Organization | null>
  cacheClearTimer: number
  user: Promise<UserInfoClass>
  modelDetailCache: any
  constructor(e = new RequestManager(), t = new RequestManager(), n = {}, i = window.location.origin, r) {
    this.apiQueue = e
    this.storeQueue = t
    this.prefetchedData = n
    this.baseUrl = i
    this.mdsContext = r
    this._configCache = {}
    this._userCache = {}
    this._organizationCache = {}
    this.cacheClearTimer = self.setTimeout(() => {
      this.prefetchedData = {}
    }, x.cacheClearTimeout)
  }
  async init(e) {
    this.user = this.getUser()
    e && (await this.getConfigs(e))
  }
  dispose() {
    clearTimeout(this.cacheClearTimer), (this.prefetchedData = {})
  }
  getOnStoreQueue(e, t = {}) {
    return this.get(e, t, this.storeQueue)
  }
  get<T = any>(e: string, t: any = {}, n = this.apiQueue): Promise<T> {
    const { headers = {}, prefetchFrom } = t
    if (prefetchFrom && this.prefetchedData[prefetchFrom]) {
      return Promise.resolve(this.prefetchedData[prefetchFrom] as T)
    } else {
      t.headers = setAuthHeader(e, headers)
      return n.get(e, t).then(e => {
        if (null === e) throw Error("Data from get was null, possibly unparsable JSON")
        return e
      })
    }
  }
  getImage(e: string, t) {
    return this.get<ArrayBuffer>(
      e,
      Object.assign(Object.assign({}, t), {
        responseType: "image"
      })
    )
  }
  async getImageBitmap(e: string, t: number, n: number, i: { maxRetries?: number; priority?: HttpPriority; flipY?: any } = {}) {
    if (S()) {
      const s = -1 !== e.indexOf("?")
      const r = e + (s ? "&" : "?") + "imgopt=1"
      const a = await this.get(
        r,
        Object.assign(Object.assign({}, i), {
          responseType: "blob"
        })
      )
      return createImageBitmap(a, 0, 0, t, n, {
        imageOrientation: i.flipY ? "flipY" : "none"
      })
    }
    return this.getImage(e, i)
  }
  async getConfigs(e, t?) {
    e = e.toLowerCase()
    if (!t && this._configCache[e]) return this._configCache[e]
    const n = t
      ? {
          responseType: "json"
        }
      : {
          responseType: "json",
          prefetchFrom: "config"
        }
    let i = {}
    const s = this.baseUrl + `/api/v1/config/${e}`
    try {
      i = await this.get(s, n)
    } catch (e) {
      P.warn(`Failed to load config from ${s}, ignoring`)
    }
    return t || (this._configCache[e] = i), i || {}
  }
  async getAppKey(e, t, n) {
    if ("" === e || "" === t) return null
    const i = await this.getConfigs(e, n)
    return i.hasOwnProperty(t) ? i[t] : null
  }
  async getGeoIpLocation() {
    return getGeoIpLocation(this.apiQueue)
  }

  async getOrganization(e) {
    if (e in this._organizationCache) return this._organizationCache[e]
    const t = `${this.baseUrl}/api/v2/organizations/${e}`
    const n = await this.get(t, {
      responseType: "json"
    }).catch(e => {
      P.error(e)
    })
    let i: Organization | null = null
    if (n) {
      i = new Organization({
        id: n.sid,
        name: n.company_name || "",
        blurEnabled: !!n.manual_blur
      })
    }

    this._organizationCache[e] = i
    return i
  }
  async getUser(e?: string) {
    if (e && e in this._userCache) return this._userCache[e]
    //pw
    // const t = `${this.baseUrl}/api/v2/users/${e || "current"}`,
    const t = `${location.origin}/users/${e || "current"}`
    const n = (function (e) {
      if (!e) return new UserInfoClass()
      const t = (e.memberships || []).map(t => {
        return new MemberShip({
          userId: e.user_sid,
          organizationId: t.organization_sid,
          name: t.name,
          flags: f(t.flags || []),
          roles: t.roles || [],
          features: t.features || {}
        })
      })
      return new UserInfoClass({
        id: e.user_sid,
        firstName: e.first_name,
        lastName: e.last_name,
        email: e.email,
        loggedIn: e.is_authenticated,
        flags: new Set(f(e.flags)),
        memberships: t
      })
    })(
      //pw
      // await this.get<UserInfo>(t, {
      //   responseType: "json"
      // }).catch(e => {
      //   P.error(e)
      // })
      usersCurrent
    )
    n.id && (this._userCache[n.id] = n)
    return n
  }
}
declare global {
  interface SymbolModule {
    [Apiv2Symbol]: UserInfoModule
  }
}
export default class UserInfoModule extends Module {
  api: UserApiClient
  constructor() {
    super(...arguments)
    this.name = "api-client"
  }
  async init(e, t) {
    this.api = await this.initApi(e)
  }
  async initApi(e) {
    const t = new UserApiClient(e.apiQueue, e.storeQueue, e.prefetchedData, e.baseUrl, e.mdsContext)
    await t.init(e.preloadConfig)
    return t
  }
  dispose(e) {
    super.dispose(e)
    this.api.dispose()
  }
  getApi() {
    return this.api
  }
}
