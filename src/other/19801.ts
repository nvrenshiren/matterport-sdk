import { UnkownUser } from "../utils/67622"
import { ToolPanelLayout, ToolsList } from "../const/tools.const"
import { CommandBinder } from "../core/commandBinder"
import EngineContext from "../core/engineContext"
import Market from "../core/market"
import { MessageBus } from "../core/messageBus"
import { RequestManager } from "../core/request"
import { SettingsData } from "../data/settings.data"
import { ToolsData } from "../data/tools.data"
import { UsersData } from "../data/users.data"
import LocaleModule from "../modules/locale.module"
import { ToolObject } from "../object/tool.object"
import { ObservableMap } from "../observable/observable.map"
const s = () => {}
const r = () => null
const a = () => !1
const o = () => Promise.reject()
const l = () => Promise.resolve()
const c = () => ({})
const d = () => []
const u = () => ({
  renew: s,
  cancel: s
})
const h = {
  register: s as unknown as Market["register"],
  unregister: s as unknown as Market["unregister"],
  waitForData: o as unknown as Market["waitForData"],
  tryGetData: r as unknown as Market["tryGetData"],
  getModuleNameFromData: () => "" as unknown as Market["getModuleNameFromData"]
}
const p = {
  subscribe: u as unknown as MessageBus["subscribe"],
  unsubscribe: s as unknown as MessageBus["unsubscribe"],
  broadcast: s as unknown as MessageBus["broadcast"]
}
class f extends CommandBinder {
  constructor() {
    super(...arguments)
    this.addBinding = u as unknown as CommandBinder["addBinding"]
    this.removeBinding = s as unknown as CommandBinder["removeBinding"]
    this.issueCommand = o
    this.issueCommandWhenBound = o
    this.hookCommand = s
    this.resetHooks = s
  }
}
const g = new f()
const v = {
  mask: 0,
  addLayers: s,
  removeLayers: s,
  clone: () => v
}
const y = () => v
const b = {
  market: h,
  msgBus: p,
  commandBinder: g,
  getModuleBySymbol: o as unknown as EngineContext["getModuleBySymbol"],
  tryGetModuleBySymbolSync: r as unknown as EngineContext["tryGetModuleBySymbolSync"],
  addComponent: l as unknown as EngineContext["addComponent"],
  removeComponent: l as unknown as EngineContext["removeComponent"],
  getComponentByType: r as unknown as EngineContext["getComponentByType"],
  getComponents: function* () {} as unknown as EngineContext["getComponents"],
  claimRenderLayer: y as unknown as EngineContext["claimRenderLayer"],
  getRenderLayer: y as unknown as EngineContext["getRenderLayer"],
  subscribe: u as unknown as EngineContext["subscribe"],
  unsubscribe: s as unknown as EngineContext["unsubscribe"],
  broadcast: s as unknown as EngineContext["broadcast"],
  disposeRenderLayer: s as unknown as EngineContext["disposeRenderLayer"],
  startGenerator: s as unknown as EngineContext["startGenerator"],
  stopGenerator: s as unknown as EngineContext["stopGenerator"],
  after: l as unknown as EngineContext["after"],
  toggleRendering: s as unknown as EngineContext["toggleRendering"]
}
const E = new (class {
  constructor() {
    this.track = s
    this.trackGuiEvent = s
    this.trackToolGuiEvent = s
  }
})()
class Oo extends LocaleModule {
  constructor() {
    super(...arguments)
    this.t = e => e
  }
  get languageCode() {
    return "en"
  }
}
const T = new Oo()
const w = UnkownUser("")
const A = () => w
class N extends UsersData {
  constructor(e, t, n) {
    super(e, t, n)
    this.getUserInfoByEmail = r
    this.getUserInfoById = r
    this.getUserDisplay = A
    this.iterate = s
    this.getUsersWhoMayNeedAccess = c
    this.getKnownUsers = d
    this.getCurrentUser = A
    this.isLoggedIn = a
    this.isOrgAdmin = a
    this.isInviter = a
    this.isEditor = a
    this.isCommenter = a
    this.getCurrentUserId = () => w.id
    this.onUsersChanged = u
  }
}
const I = new N(w, !1, !1)
const C = {
  activate: l,
  deactivate: l
}
const D = new ToolObject({
  id: ToolsList.LABELS,
  namePhraseKey: "",
  panel: !1,
  panelLeft: !1,
  hidesAppBar: !1,
  icon: "",
  analytic: "labels",
  dimmed: !1,
  enabled: !1,
  manager: C,
  ui: {}
})
const R = new ObservableMap()
class M extends ToolsData {
  constructor() {
    super(...arguments), (this.addTools = s)
    this.iterate = s
    this.getTool = () => D
    this.removeTool = s
    this.removeAllTools = s
    this.setOpenAsset = s
    this.onOpenAssetChanged = u
    this.getActiveTool = r
    this.activeToolName = null
    this.previousToolName = null
    this.openModal = null
    this.toolChangeInProgress = !1
    this.isPanelOpen = a
    this.isToolCollapsedToBottom = a
    this.toolPanelLayout = ToolPanelLayout.NORMAL
    this.softOpening = !1
    this.toolCollapsed = !1
  }
  get toolsMap() {
    return R
  }
  get openAsset() {
    return null
  }
}
const j = new M()
class F extends SettingsData {
  constructor() {
    super(...arguments)
    this.setProperty = s
    this.setLocalStorageProperty = s
    this.hasProperty = a
    this.tryGetProperty = s as unknown as SettingsData["tryGetProperty"]
    this.getProperty = s as unknown as SettingsData["getProperty"]
    this.getOverrideParam = s
    this.iterate = s
  }
}
const H = new F()
export const defaultContext = {
  editMode: !1,
  mainDiv: document.createElement("div"),
  queue: new RequestManager(),
  messageBus: p,
  userData: I,
  toolsData: j,
  settings: H,
  analytics: E,
  engine: b,
  market: h,
  commandBinder: g,
  locale: T
}
