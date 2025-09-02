import { NavigateToPoseCommand } from "../command/navigation.command"
import { DeepLinksSymbol } from "../const/symbol.const"
import { CommandBinder } from "../core/commandBinder"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { CameraData } from "../data/camera.data"
import { FloorsViewData } from "../data/floors.view.data"
import { SettingsData } from "../data/settings.data"
import { SweepsData } from "../data/sweeps.data"
import { ViewmodeData } from "../data/viewmode.data"
import { NavURLParam } from "../utils/nav.urlParam"
import { NoNull } from "../utils/object.utils"
import { workToShow } from "../utils/url.utils"

declare global {
  interface SymbolModule {
    [DeepLinksSymbol]: DeepLinkerModule
  }
}
class DeeplinksCreator {
  cameraData: CameraData
  viewmodeData: ViewmodeData
  floorsViewData: FloorsViewData
  sweepData: SweepsData
  settingsData: SettingsData
  name: string
  defaultBaseUrl: URL
  requiredParams: string[]
  static requiredUrlParams = ["m", "model"]
  constructor(e, t, n, i, s) {
    this.cameraData = e
    this.viewmodeData = t
    this.floorsViewData = n
    this.sweepData = i
    this.settingsData = s
    this.name = "deeplinks"
    this.defaultBaseUrl = workToShow()
    this.requiredParams = [...DeeplinksCreator.requiredUrlParams]
  }
  createLink(e) {
    const { baseHref: t, additionalParams: n, paramFilter: i, thisArg: s } = e || {},
      r = new URLSearchParams(window.location.search),
      a = new URL(t || this.defaultBaseUrl.href)
    return (
      this.appendParams(a.searchParams, r),
      i && this.filterParamsFromURL(a, i, s),
      n && this.appendParamsFromDictionary(a.searchParams, n),
      this.removeStartParams(a),
      this.dedupeModelParam(a),
      a
    )
  }
  createModelLink(e, t) {
    const { baseHref: n, additionalParams: i, paramFilter: s, thisArg: r } = t || {},
      a = new URLSearchParams(window.location.search),
      o = new URL(n || this.defaultBaseUrl.href)
    return (
      this.appendParams(o.searchParams, a),
      s && this.filterParamsFromURL(o, s, r),
      i && this.appendParamsFromDictionary(o.searchParams, i),
      this.removeStartParams(o),
      this.dedupeModelParam(o),
      o
    )
  }
  createDeepLink(e) {
    const { baseHref: t, additionalParams: n, paramFilter: i, thisArg: s } = e || {},
      r = new URLSearchParams(
        NavURLParam.getQueryString({
          cameraData: this.cameraData,
          floorsViewData: this.floorsViewData,
          sweepData: this.sweepData,
          viewmodeData: this.viewmodeData,
          settingsData: this.settingsData
        })
      ),
      a = new URLSearchParams(window.location.search),
      o = new URL(t || this.defaultBaseUrl.href)
    this.appendParams(o.searchParams, a), this.removeStartParams(o), i && this.filterParamsFromURL(o, i, s)
    for (const [e, t] of r) NavURLParam.navigationKeys.has(e) && o.searchParams.set(e, t)
    if (n) {
      const e = Object.assign({}, n)
      for (const t of NavURLParam.navigationKeys) delete e[t]
      this.appendParamsFromDictionary(o.searchParams, e)
    }
    return this.dedupeModelParam(o), o
  }
  setDefaultBaseHref(e, t) {
    this.defaultBaseUrl = new URL(e)
    this.requiredParams = [...DeeplinksCreator.requiredUrlParams, ...t]
  }
  filterParamsFromURL(e, t, n) {
    const i = new Set()
    for (const [s, r] of e.searchParams) this.requiredParams.includes(s) || t.call(n, s, r) || i.add(s)
    for (const t of i) e.searchParams.delete(t)
  }
  dedupeModelParam(e) {
    const t = e.searchParams.get("m") || e.searchParams.get("model") || ""
    e.searchParams.delete("model"), e.searchParams.set("m", t)
  }
  removeStartParams(e) {
    ;["start", "sm", "sp", "sq", "sr", "ss", "sf", "sz"].forEach(e.searchParams.delete, e.searchParams)
  }
  appendParams(e, t) {
    for (const [n, i] of t) e.set(n, i)
  }
  appendParamsFromDictionary(e, t) {
    for (const [n, i] of Object.entries(t)) e.set(n, i)
  }
}

enum PolicyType {
  SAME_ORIGIN = 0,
  EXTERNAL = 1,
  MODEL = 2,
  NAVIGATION = 3
}
enum PolicyValue {
  IN_FRAME = 0,
  NEW_WINDOW = 1,
  CUSTOM = 2
}
class f {
  commandBinder: CommandBinder
  defaultPolicy: { [x: number]: any }
  activePolicy: any
  linkHandlers: { [x: number]: { [x: number]: (e: any) => void } }
  customHandlers: any
  constructor(e: CommandBinder) {
    ;(this.commandBinder = e),
      (this.defaultPolicy = {
        [PolicyType.NAVIGATION]: PolicyValue.IN_FRAME,
        [PolicyType.MODEL]: PolicyValue.IN_FRAME,
        [PolicyType.SAME_ORIGIN]: PolicyValue.NEW_WINDOW,
        [PolicyType.EXTERNAL]: PolicyValue.NEW_WINDOW
      }),
      (this.activePolicy = Object.assign({}, this.defaultPolicy)),
      (this.linkHandlers = {
        [PolicyType.NAVIGATION]: {
          [PolicyValue.IN_FRAME]: e => {
            const t = NavURLParam.deserialize(e)
            t && this.navigateToPose(t)
          },
          [PolicyValue.NEW_WINDOW]: e => this.openNewWindow(e),
          [PolicyValue.CUSTOM]: e => this.customHandlers[PolicyType.NAVIGATION](e)
        },
        [PolicyType.MODEL]: {
          [PolicyValue.IN_FRAME]: e => this.replaceFrameLocation(e),
          [PolicyValue.NEW_WINDOW]: e => this.openNewWindow(e),
          [PolicyValue.CUSTOM]: e => this.customHandlers[PolicyType.MODEL](e)
        },
        [PolicyType.SAME_ORIGIN]: {
          [PolicyValue.IN_FRAME]: e => this.replaceFrameLocation(e),
          [PolicyValue.NEW_WINDOW]: e => this.openNewWindow(e),
          [PolicyValue.CUSTOM]: e => this.customHandlers[PolicyType.SAME_ORIGIN](e)
        },
        [PolicyType.EXTERNAL]: {
          [PolicyValue.IN_FRAME]: () => {
            throw Error("Navigating JMYDCase's frame to an external domain is not supported.")
          },
          [PolicyValue.NEW_WINDOW]: e => this.openNewWindow(e),
          [PolicyValue.CUSTOM]: e => this.customHandlers[PolicyType.EXTERNAL](e)
        }
      }),
      (this.customHandlers = {
        [PolicyType.NAVIGATION]: e => {},
        [PolicyType.MODEL]: e => {},
        [PolicyType.SAME_ORIGIN]: e => {},
        [PolicyType.EXTERNAL]: e => {}
      })
  }
  get HandlingPolicy() {
    return PolicyValue
  }
  setPolicy(e, t, n) {
    t === PolicyValue.CUSTOM && n && (this.customHandlers[e] = n), (this.activePolicy[e] = t)
  }
  resetPolicy(e) {
    this.activePolicy[e] = this.defaultPolicy[e]
  }
  openLink(e) {
    if (
      (function (e) {
        return NoNull(e) && "pose" in e
      })(e)
    ) {
      const t = this.activePolicy[PolicyType.NAVIGATION]
      this.linkHandlers[PolicyType.NAVIGATION][t](e.fullLink)
    } else if (
      (function (e) {
        return NoNull(e) && "modelId" in e
      })(e)
    ) {
      const t = this.activePolicy[PolicyType.MODEL],
        n = new URL(window.location.href),
        i = new URL(e.fullLink),
        s = n.searchParams.get("applicationKey")
      ;(n.search = i.search),
        n.searchParams.delete("m"),
        n.searchParams.delete("model"),
        n.searchParams.set("m", e.modelId),
        n.searchParams.set("play", "1"),
        s && n.searchParams.set("applicationKey", s),
        this.linkHandlers[PolicyType.MODEL][t](n.href)
    } else
      try {
        const t = new URL(e)
        if (t.origin === document.referrer || t.origin === window.location.origin) {
          const t = this.activePolicy[PolicyType.SAME_ORIGIN]
          this.linkHandlers[PolicyType.SAME_ORIGIN][t](e)
        } else {
          const t = this.activePolicy[PolicyType.EXTERNAL]
          this.linkHandlers[PolicyType.EXTERNAL][t](e)
        }
      } catch (t) {
        const n = this.activePolicy[PolicyType.EXTERNAL]
        this.linkHandlers[PolicyType.EXTERNAL][n](e)
      }
  }
  replaceFrameLocation(e) {
    window.location.replace(e)
  }
  openNewWindow(e) {
    window.open(e)
  }
  navigateToPose(e) {
    this.commandBinder.issueCommand(new NavigateToPoseCommand(e))
  }
}

export default class DeepLinkerModule extends Module {
  creator: DeeplinksCreator
  handler: f
  constructor() {
    super(...arguments)
    this.name = "deep linker"
  }
  async init(e, t: EngineContext) {
    const [n, i, l, c, u] = await Promise.all([
      t.market.waitForData(CameraData),
      t.market.waitForData(ViewmodeData),
      t.market.waitForData(FloorsViewData),
      t.market.waitForData(SweepsData),
      t.market.waitForData(SettingsData)
    ])
    this.creator = new DeeplinksCreator(n, i, l, c, u)
    this.handler = new f(t.commandBinder)
  }
  get LinkType() {
    return PolicyType
  }
}
