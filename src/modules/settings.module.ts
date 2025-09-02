import { OpenDeferred } from "../core/deferred"
import Controlkit from "../lib/controlkit/lib/ControlKit"
import { SettingsSymbol } from "../const/symbol.const"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { SettingsData } from "../data/settings.data"
import Group from "../lib/controlkit/lib/group/Group"
import Panel from "../lib/controlkit/lib/group/Panel"
import subGroup from "../lib/controlkit/lib/group/SubGroup"
import { changeUrlWithParams } from "../utils/browser.utils"
import { lsGetItem } from "../utils/localstorage.utils"
import { copyURLSearchParams, getValFromURL } from "../utils/urlParams.utils"
import { SettingsDataProperties } from "../interface/settings.interface"
declare global {
  interface SymbolModule {
    [SettingsSymbol]: SettingsModule
  }
}
export enum SettingPersistence {
  NONE = 0,
  LOCAL_STORAGE = 1
}
enum loadState {
  Init = 0,
  Loaded = 2,
  Loading = 1
}
interface PanelItem {
  index: number
  header: string
  guiPanel: Panel | undefined
  makeGuiPanel: () => Panel | undefined
  subGroups: Map<string, SubGroup>
  allowSubGroups: any
  activationSequence: any
}
class SettingsGUI {
  queryScope: Document
  onChange: Function
  settings: {}
  helperObject: { colors: {}; vectors: {}; quaternions: {} }
  initPromise: OpenDeferred<any>
  loadState: loadState
  uninitError: string
  lastKeys: number[]
  lastKeysBufferLength: number
  controlKit: Controlkit | undefined
  updateRequired: boolean
  panels: PanelItem[]
  onToggleCallbacks: {}
  onKeyDown: (e: KeyboardEvent) => void
  getPanelId: (e: string) => number
  getSubGroup: (e: any, t: any) => SubGroup
  addColor: (e: any, t: any, n: any, i: any) => void
  addVector3: (e: any, t: any, n: any, i: any) => void
  addQuaternion: (e: any, t: any, n: any, i: any) => void
  constructor(e: Document, t: Function) {
    this.queryScope = e
    this.onChange = t
    this.settings = {}
    this.helperObject = {
      colors: {},
      vectors: {},
      quaternions: {}
    }
    this.initPromise = new OpenDeferred()
    this.loadState = loadState.Init
    this.uninitError = "ControlKit not yet initialized"
    this.lastKeys = []
    this.lastKeysBufferLength = 0
    this.controlKit = void 0
    this.updateRequired = !1
    this.panels = []
    this.onToggleCallbacks = {}
    this.onKeyDown = e => {
      this.lastKeys.unshift(e.keyCode)
      this.lastKeys.length > this.lastKeysBufferLength && this.lastKeys.pop()
      for (let e = 0; e < this.panels.length; e++) {
        const t = this.panels[e].activationSequence
        isSame(this.lastKeys, t) && this.toggle(e)
      }
    }
    this.getPanelId = (e: string) => {
      for (const t of this.panels) if (e === t.header) return t.index
      return -1
    }
    this.getSubGroup = (e, t) => {
      const n = this.panels[e]
      n.guiPanel || (n.guiPanel = n.makeGuiPanel())
      n.allowSubGroups || (t = "")
      let i = n.subGroups.get(t || "")
      if (!i) {
        n.guiPanel!.addSubGroup({
          label: t,
          enable: !n.allowSubGroups
        })
        const e = n.guiPanel!._groups[n.guiPanel!._groups.length - 1]
        const s = e._subGroups[e._subGroups.length - 1]
        i = new SubGroup(n.guiPanel, e, s)
        n.subGroups.set(t || "", i)
      }
      return i
    }
    this.addColor = (e, t, n, i) => {
      const s = this.key(t, n)
      this.updateHelperObject(s, i)
      e.addColor(this.helperObject.colors, s, {
        label: n,
        colorMode: "hex",
        onChange: e => {
          this.settings[s].setHex(parseInt(e.substring(1), 16))
          const t = {}
          t[n] = this.settings[s]
          this.onChange(t)
        }
      })
    }
    this.addVector3 = (e, t, n, i) => {
      const s = this.key(e, n)
      this.updateHelperObject(s, i)
      const r = this.getSubGroup(e, `${t}: ${n}`)
      const a = ["x", "y", "z"]
      for (const e in a)
        r.addNumberInput(this.helperObject.vectors[s], a[e], {
          label: a[e],
          onChange: () => {
            this.settings[s].set(this.helperObject.vectors[n].x, this.helperObject.vectors[n].y, this.helperObject.vectors[n].z)
            const e = {}
            e[n] = this.settings[s]
            this.onChange(e)
          }
        })
    }
    this.addQuaternion = (e, t, n, i) => {
      const s = this.key(e, n)
      this.updateHelperObject(s, i)
      const r = this.getSubGroup(e, `${t}: ${n}`),
        a = ["x", "y", "z", "w"]
      for (const e in a)
        r.addNumberInput(this.helperObject.quaternions[s], a[e], {
          label: a[e],
          onChange: () => {
            this.settings[s].set(
              this.helperObject.quaternions[s].x,
              this.helperObject.quaternions[s].y,
              this.helperObject.quaternions[s].z,
              this.helperObject.quaternions[s].w
            )
            const e = {}
            e[n] = this.settings[s]
            this.onChange(e)
          }
        })
    }
  }
  init() {}
  async loadGuiPackage() {
    // if (this.loadState === loadState.Init) {
    //   import("../lib/controlkit/index").then(async ({ default: Controlkit }) => {
    //     const t = this.queryScope.getElementById("control-kit-wrapper") || document.body
    //     const { default: Node } = await import("../lib/controlkit/lib/core/document/Node")
    //     Node.getNodeById = e => new Node().setElement(this.queryScope.getElementById(e))

    //     this.controlKit = new Controlkit({
    //       opacity: 0.9,
    //       enable: !1,
    //       parentDomElementId: "controlKitElement"
    //     })
    //     this.controlKit.setShortcutEnable("")
    //     this.controlKit.enable()
    //     this.initPromise.resolve()
    //     this.loadState = loadState.Loaded
    //   })
    //   this.loadState = loadState.Loading
    // }
    if (this.loadState === loadState.Init) {
      this.initPromise.resolve()
      this.loadState = loadState.Loaded
      // this.loadState = loadState.Loading
    }
    return this.loadPromise
  }
  get loadPromise() {
    return this.initPromise.nativePromise()
  }
  get isLoaded() {
    return void 0 !== this.controlKit
  }
  addPanel(label: string, t, n: any = {}) {
    n.width = n.width || 250
    n.allowSubGroups = n.allowSubGroups || !0
    n.ratio = n.ratio || 60
    for (this.lastKeysBufferLength = Math.max(this.lastKeysBufferLength, t.length); this.lastKeysBufferLength > this.lastKeys.length; ) {
      this.lastKeys.unshift(-1)
    }
    this.panels.push({
      index: this.panels.length,
      header: label,
      guiPanel: undefined,
      makeGuiPanel: () =>
        this.controlKit?.addPanel({
          label,
          align: "right",
          ratio: n.ratio,
          width: n.width
        }),
      subGroups: new Map(),
      allowSubGroups: n.allowSubGroups,
      activationSequence: t.reverse()
    })
    return this.panels.length - 1
  }
  isVisible(e: number) {
    if (!this.controlKit) throw new Error(this.uninitError)
    return this.panels[e].guiPanel?._enabled
  }
  toggle(e: number) {
    this.controlKit
      ? this.toggleVisibility(e)
      : this.loadGuiPackage().then(() => {
          this.toggleVisibility(e)
        })
  }
  onToggle(e, t) {
    this.onToggleCallbacks[e] || (this.onToggleCallbacks[e] = []), this.onToggleCallbacks[e].push(t)
  }
  toggleVisibility(e) {
    if (!this.controlKit) throw new Error(this.uninitError)
    const t = this.panels[e].guiPanel?._enabled
    if ((t ? this.panels[e].guiPanel?.disable() : this.panels[e].guiPanel?.enable(), this.onToggleCallbacks[e]))
      for (const n of this.onToggleCallbacks[e]) n(!t)
  }
  dispose() {
    const e = this.queryScope.getElementById("controlKit")
    e && e.remove(), (this.controlKit = void 0)
  }
  activate(e) {
    this.queryScope.addEventListener("keydown", this.onKeyDown)
  }
  deactivate(e) {
    this.controlKit && this.controlKit.disable(), this.queryScope.removeEventListener("keydown", this.onKeyDown)
  }
  render() {
    this.controlKit && this.updateRequired && ((this.updateRequired = !1), this.controlKit.update())
  }
  updateSetting(e, t, n) {
    if (!this.controlKit) throw new Error(this.uninitError)
    const i = e + t
    const s = this.settings[i]
    n && "function" == typeof n.equals && "function" == typeof n.copy && s && "function" == typeof s.equals && "function" == typeof s.copy
      ? n.equals(this.settings[i]) || (this.settings[i].copy(n), this.updateHelperObject(i, n), (this.updateRequired = !0))
      : n !== this.settings[i] && ((this.settings[i] = n), (this.updateRequired = !0))
  }
  key(e, t) {
    return `${e}${t}`
  }
  getSetting(e, t) {
    const n = this.key(e, t)
    return this.settings[n]
  }
  isRegistered(e, t) {
    return void 0 !== this.getSetting(e, t)
  }
  addControl(e, t, n, i, s, r = 2, a) {
    if (!this.controlKit) throw new Error(this.uninitError)
    const o = this.key(e, n)
    this.settings[o] = i
    let l = typeof i
    ;(("string" === l && "true" === i) || "false" === i) && (l = "boolean")
    const c = "object" === l
    if (c && (null == i ? void 0 : i.isColor)) this.addColor(this.getSubGroup(e, t), e, n, i)
    else if (c && (null == i ? void 0 : i.isVector3)) this.addVector3(e, t, n, i)
    else if (c && (null == i ? void 0 : i.isQuaternion)) this.addQuaternion(e, t, n, i)
    else {
      const c = this.getSubGroup(e, t)
      switch (l) {
        case "string":
          Array.isArray(a)
            ? ((this.settings[o] = {
                options: a,
                selected: i
              }),
              c.addSelect(this.settings[o], "options", {
                target: "selected",
                label: n,
                onChange: e => {
                  const t = {
                    [n]: a[e]
                  }
                  this.onChange(t)
                }
              }))
            : c.addStringInput(this.settings, o, {
                label: n,
                onChange: e => {
                  const t = {}
                  ;(this.settings[o] = e), (t[n] = this.settings[o]), this.onChange(t)
                }
              })
          break
        case "number":
          ;(this.settings[`${o}_range`] = s || [0, 10]),
            c.addSlider(this.settings, o, `${o}_range`, {
              label: n,
              onChange: () => {
                const e = {}
                ;(e[n] = this.settings[o]), this.onChange(e)
              },
              dp: r
            })
          break
        case "boolean":
          c.addCheckbox(this.settings, o, {
            label: n,
            ratio: 10,
            onChange: () => {
              const e = {}
              e[n] = this.settings[o]
              this.onChange(e)
            }
          })
          break
        default:
          c.addStringOutput(this.settings, o, {
            label: n
          })
      }
    }
  }
  addButton(e, t, n, i) {
    if (!this.controlKit) throw new Error(this.uninitError)
    this.getSubGroup(e, t).addButton(n, i, {
      label: "none",
      ratio: 100
    })
  }
  addSlider(e, t, n, i, s, r, a) {
    if (!this.controlKit) throw new Error(this.uninitError)
    const o = this.getSubGroup(e, t)
    const l = this.key(e, n)
    this.settings[l] = i
    this.settings[l + "_range"] = [s, r]
    o.addSlider(this.settings, l, l + "_range", {
      label: n,
      dp: a,
      onChange: () => {
        const e = {}
        e[n] = this.settings[l]
        this.onChange(e)
      }
    })
  }
  updateHelperObject(e, t) {
    const n = "object" == typeof t
    n && (null == t ? void 0 : t.isColor)
      ? (this.helperObject.colors[e] = "#" + t.getHexString())
      : n && (null == t ? void 0 : t.isVector3)
        ? ((this.helperObject.vectors[e] = {}),
          (this.helperObject.vectors[e].x = t.x),
          (this.helperObject.vectors[e].y = t.y),
          (this.helperObject.vectors[e].z = t.z))
        : n &&
          (null == t ? void 0 : t.isQuaternion) &&
          ((this.helperObject.quaternions[e] = {}),
          (this.helperObject.quaternions[e].x = t.x),
          (this.helperObject.quaternions[e].y = t.y),
          (this.helperObject.quaternions[e].z = t.z),
          (this.helperObject.quaternions[e].w = t.w))
  }
}
class SubGroup {
  panel: Panel
  group: Group
  subGroup: subGroup
  constructor(e, t, n) {
    this.panel = e
    this.group = t
    this.subGroup = n
  }
  addButton(...e) {
    this.invoke("addButton", e)
  }
  addSlider(...e) {
    this.invoke("addSlider", e)
  }
  addSelect(...e) {
    this.invoke("addSelect", e)
  }
  addCheckbox(...e) {
    this.invoke("addCheckbox", e)
  }
  addColor(...e) {
    this.invoke("addColor", e)
  }
  addStringInput(...e) {
    this.invoke("addStringInput", e)
  }
  addStringOutput(...e) {
    this.invoke("addStringOutput", e)
  }
  addNumberInput(...e) {
    this.invoke("addNumberInput", e)
  }
  invoke(e, t) {
    const n = this.panel._groups,
      i = this.group._subGroups,
      s = n.indexOf(this.group),
      r = i.indexOf(this.subGroup)
    n.splice(s, 1)
    n.push(this.group)
    i.splice(r, 1)
    i.push(this.subGroup)
    try {
      this.panel[e](...t)
    } finally {
      n.splice(s, 0, n.pop()!)
      i.splice(r, 0, i.pop()!)
    }
  }
}
const isSame = function (e, t) {
  const n = Math.min(e.length, t.length)
  for (let i = 0; i < n; i++) if (e[i] !== t[i]) return !1
  return !0
}

interface ControlsGUI {
  panelId: number
  group: string
  settingName: string
  value: any
  range: number[]
  rangePrecision: number
  options: any
}
interface ButtonGUI {
  panelId: number
  group: string
  buttonName: string
  callback: Function
}
export default class SettingsModule extends Module {
  queuedControls: ControlsGUI[]
  queuedButtons: ButtonGUI[]
  secretWord: number[]
  panelID: number
  addPanel: (e: any, t: any, n: any) => any
  settingsGUI: SettingsGUI
  engine: EngineContext
  settings: SettingsData
  constructor() {
    super(...arguments)
    this.name = "settings"
    this.queuedControls = []
    this.queuedButtons = []
    this.secretWord = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 72]
    this.panelID = -1
    this.addPanel = (e, t, n) => {
      const i = this.getPanelId(e)
      return -1 === i ? this.settingsGUI.addPanel(e, t, n) : i
    }
    this.getPanelId = e => this.settingsGUI.getPanelId(e)
  }
  getPanelId: (e: any) => number
  async init(e, t: EngineContext) {
    this.engine = t
    this.settings = new SettingsData(e.overrideParams)
    this.engine.market.register(this, SettingsData, this.settings)
    if (e.useGUI) {
      this.settingsGUI = new SettingsGUI(e.queryScope || document, e => {
        this.updateSettings(e)
      })
      t.addComponent(this, this.settingsGUI)
      this.panelID = this.settingsGUI.addPanel("20240906", this.secretWord)
    }
    e.initialSettings && this.updateSettings(e.initialSettings)
    // e.useGUI &&
    //   this.settingsGUI.loadPromise.then(() => {
    //     for (const e of this.queuedControls) this.settingsGUI.addControl(e.panelId, e.group, e.settingName, e.value, e.range, e.rangePrecision, e.options)
    //     for (const e of this.queuedButtons) this.settingsGUI.addButton(e.panelId, e.group, e.buttonName, e.callback)
    //     this.settingsGUI.toggle(this.panelID)
    //   })
    this.settingsGUI.loadGuiPackage()
  }
  get settingsData() {
    return this.settings
  }
  get loadPromise() {
    return this.settingsGUI.loadPromise
  }
  getSettingsGui() {
    return this.settingsGUI
  }
  getMainPanelId() {
    return this.panelID
  }
  updateSetting(e, t, n = this.panelID) {
    t && t.clone && "function" == typeof t.clone ? this.settings.setProperty(e, t.clone()) : this.settings.setProperty(e, t)
    this.settingsGUI && this.settingsGUI.isLoaded && this.settingsGUI.updateSetting(n, e, t)
  }
  updateSettings(e) {
    for (const t in e) this.updateSetting(t, e[t])
  }
  registerSetting(
    group: string,
    settingName: string,
    value: any,
    i = !0,
    persistence = SettingPersistence.NONE,
    range?: any,
    panelId = this.panelID,
    rangePrecision = 2,
    options?: any
  ) {
    if (this.settingsGUI && this.settingsGUI.isRegistered(panelId, settingName)) {
      return void this.log.warn(`Duplicate setting ${settingName} registered. Is a module being used twice?`)
    }
    let d = value && value.clone && "function" == typeof value.clone ? value.clone() : value
    if (this.settingsGUI && i) {
      this.settingsGUI.isLoaded
        ? this.settingsGUI.addControl(panelId, group, settingName, d, range, rangePrecision, options)
        : this.queuedControls.push({
            panelId,
            group,
            settingName,
            value,
            range,
            rangePrecision,
            options
          })
    }
    const h = persistence === SettingPersistence.LOCAL_STORAGE ? lsGetItem(settingName, value) : value
    this.updateSetting(settingName, h)
  }
  registerMenuEntry(e) {
    const {
      header: t,
      setting: n,
      initialValue: i,
      persist: s,
      displayInUi: r,
      range: a,
      panel: o,
      onChange: l,
      rangePrecision: c,
      options: d,
      urlParam: u
    } = e
    let m = i()
    const f = encodeURIComponent(n)
    if (u) {
      const e = getValFromURL(f, null)
      null !== e &&
        (m =
          "true" === e ||
          ("false" !== e &&
            (function (e) {
              if ("" === e) return e
              const t = +e
              return isNaN(t) ? e : t
            })(e)))
    }
    if ((this.registerSetting(t, n, m, r, s, a, o, c, d), !l && !u)) return null
    if ((l && l(m), u)) {
      const e = i()
      const t = t => {
        const n = copyURLSearchParams()
        n.has(f) && t === e ? n.delete(f) : n.set(f, t), changeUrlWithParams(n.toString(), !0), l && l(t)
      }
      return this.settings.onPropertyChanged(n, t)
    }
    return l ? this.settings.onPropertyChanged(n, l) : null
  }
  registerMenuButton(e) {
    const { header: t, buttonName: n, panel: i, callback: s } = e
    this.registerButton(t, n, s, i)
  }
  registerButton(group: string, buttonName: string, callback: Function, panelId = this.panelID) {
    if (this.settingsGUI) {
      if (this.settingsGUI.isLoaded) {
        this.settingsGUI.addButton(panelId, group, buttonName, callback)
      } else {
        this.queuedButtons.push({
          panelId,
          group,
          buttonName,
          callback
        })
      }
    }
  }
  hasProperty(e: keyof SettingsDataProperties) {
    return this.settings.hasProperty(e)
  }
  getProperty(e: keyof SettingsDataProperties) {
    return this.settings.getProperty(e)
  }
  tryGetProperty<T extends keyof SettingsDataProperties = keyof SettingsDataProperties>(e: T, t: SettingsDataProperties[T]) {
    return this.settings.tryGetProperty(e, t)
  }
  toggleMenu() {
    this.settingsGUI && this.settingsGUI.toggle(0)
  }
  disposeGui() {
    this.settingsGUI.dispose()
  }
}
