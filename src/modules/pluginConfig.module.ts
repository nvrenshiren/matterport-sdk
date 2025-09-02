import D from "semver"
import * as a from "../3907"
import { AttachmentAssociateWithPluginCommand } from "../command/plugin.command"
import { Apiv2Symbol, PluginConfigDataModuleSymbol } from "../const/symbol.const"
import { Module } from "../core/module"
import { AvailablePluginData, FetchLevel } from "../data/available.plugin.data"
import { LayersData } from "../data/layers.data"
import { PolicyData } from "../data/policy.data"
import { checkAllowHost } from "../utils/url.utils"
import { getValFromURL } from "../utils/urlParams.utils"
import { VersionUtils } from "../utils/version.utils"
declare global {
  interface SymbolModule {
    [PluginConfigDataModuleSymbol]: PluginConfigModule
  }
}
const r = "0.0"
function l(t) {
  if (!t) return []
  const i = { [r]: c }["0.0"]
  if (!i) throw new Error(`[PluginConfigDeserializer] Data with version "${t.version}": not recognized.`)
  return i(t)
}
function c(t) {
  return t["0.0"]
}
const u = "0.0"
function d(t) {
  const i = { [u]: g }
  if (!t) throw new Error("[PluginConfigSerializer] no data to serialize.")
  const e = i["0.0"]
  if (!e) throw new Error('[PluginConfigSerializer] Version "0.0" not recognized.')
  return e(t)
}
function g(t) {
  return { [u]: t }
}
class h extends a.MU {
  constructor(t, i, e) {
    super({ queue: t, path: `${i}/api/v1/jsonstore/model/plugins/${e}`, batchUpdate: !0, deserialize: l, serialize: d })
  }
}
function getPluginUrl(t, i, e) {
  return e + `${t}/${i}/${t}.js`
}
function getPluginMetadataUrl(t, i, e) {
  return e + `${t}/${i}/plugin.json`
}
const m = t => {
  var i, e, n
  return null !==
    (n =
      null === (e = null === (i = null == t ? void 0 : t.src) || void 0 === i ? void 0 : i.match(/(\d+\.\d+\.\d+)\/[^\/]*\.js$/)) || void 0 === e
        ? void 0
        : e[1]) && void 0 !== n
    ? n
    : null
}

const U = "unknown-app-key"
export default class PluginConfigModule extends Module {
  constructor() {
    super(...arguments), (this.name = "plugin-config"), (this._registryLoaded = !1)
  }
  get serviceSdkKey() {
    if (!this._applicationKey) throw new Error("[PluginConfigData] service key has not yet been set.")
    return this._applicationKey
  }
  get canOverrideStrict() {
    var t, i
    return null === (i = null === (t = this._config) || void 0 === t ? void 0 : t.pluginPolicies) || void 0 === i ? void 0 : i.canDebug
  }
  get registryLoaded() {
    return this._registryLoaded
  }
  async init(t, i) {
    ;(this.queue = t.queue), (this.pluginConfigData = new AvailablePluginData()), (this._config = t)
    if (
      (([this._policyData, this._layersData] = await Promise.all([i.market.waitForData(PolicyData), i.market.waitForData(LayersData)])),
      t.pluginPolicies.enabled)
    ) {
      const e = (await i.getModuleBySymbol(Apiv2Symbol)).getApi(),
        n = await e.getAppKey("JMYDCase", "plugin")
      if (n instanceof Object) {
        const i = n
        await this.initializePluginRegistry(i, t), await this.setupConfigStore(t.apiHostBaseUrl, t.modelId, false), (this._registryLoaded = !0)
      }
    }
    i.commandBinder.addBinding(AttachmentAssociateWithPluginCommand, async t => {
      var i, e
      const n = (await this.pluginConfigData.getMdsResult()).find(i => i.name === t.pluginId),
        s = null !== (e = null === (i = null == n ? void 0 : n.attachments) || void 0 === i ? void 0 : i.map(t => t.id)) && void 0 !== e ? e : []
      this.pluginConfigData.updateMds({ name: t.pluginId, attachments: [...s, t.attachmentId] })
    }),
      i.market.register(this, AvailablePluginData, this.pluginConfigData)
  }
  async saveToMds(t) {
    var i
    if (!this.pluginConfigData.mdsIsSetup) return void this.log.warn("Plugin changes will NOT be saved")
    const e = null !== (i = m(t)) && void 0 !== i ? i : "0.0.0"
    if (!this._manifest.find(i => i.name === t.id && i.versions[e]))
      return void this.log.warn(`Version ${e} does not exist in registry. Changes not saved to MDS.`)
    const n = []
    t.config.photoUrl && n.push(t.config.photoUrl), t.config.logoUrl && n.push(t.config.logoUrl)
    const s = { name: t.id, version: e }
    n.length > 0 && (s.attachments = n), this.pluginConfigData.updateMds(s)
  }
  deleteFromMds(t) {
    this.pluginConfigData.mdsIsSetup ? this.pluginConfigData.deleteMdsById(t.id) : this.log.warn("Plugin changes will NOT be saved")
  }
  saveConfig(t, i) {
    const e = this.pluginConfigData.lastSavedConfiguration.values()
    this.log.debugInfo(`configuration for ${t.id} updated. ${JSON.stringify(e, void 0, 2)}`),
      t.enabled ? this.saveToMds(t) : this.deleteFromMds(t),
      this.currentStore.update(e)
  }
  setupConfigStore(t, i, e) {
    ;(this.currentStore = new h(this.queue, t, i)), this.pluginConfigData.setupConfigStore(this._layersData.mdsContext, e, t)
    return this.currentStore
      .read()
      .then(t => {
        t || (t = []),
          this.log.debugInfo(`Saved configuration data loaded for ${t.length} plugin(s). ${JSON.stringify(t, void 0, 2)}`),
          this.pluginConfigData.lastSavedConfiguration.replace(t),
          this.pluginConfigData.lastSavedConfiguration.onElementChanged({
            onAdded: this.saveConfig.bind(this),
            onUpdated: this.saveConfig.bind(this),
            onRemoved: this.deleteFromMds.bind(this)
          })
      })
      .catch(t => this.log.error("Failed to load configured plugins: ", t))
  }
  getAutoUpgradedVersion(t, i) {
    var e
    const n = Object.keys(i.versions)
        .sort((t, i) => VersionUtils.compare(i, t))
        .filter(t => this.hasRequiredPolicies(i.versions[t].requiredPolicies)),
      s = null !== (e = D.maxSatisfying(n, `~${t}`)) && void 0 !== e ? e : t,
      o = i.currentVersion
    let a = s
    return D.gt(s, o) && (a = o), a
  }
  dispose(t) {
    super.dispose(t), t.market.unregister(this, AvailablePluginData), (this.pluginConfigData = void 0)
  }
  async initializePluginRegistry(t, i) {
    const { manifestUrl: e, applicationKey: n } = this.getManifestUrl(t, i)
    this._applicationKey = n
    const s = await this.queue.get(e, { responseType: "json" }).catch(t => (this.log.error(t), null))
    null !== s
      ? ((this._manifest = s), await this.populateFromManifest(s, t, n))
      : this.log.error("Plugin manifest could not be found, please contact support.")
  }
  getManifestUrl(t, i, e = !0) {
    let s = this._config.apiHostBaseUrl + manifestEndpoint,
      o = t.applicationKey
    return (
      this.pluginConfigData.pluginVersion
        ? this.pluginConfigData.pluginVersion.match(/^(https?:\/\/)?(localhost|127.0.0.1)(:\d*)?(\/.*manifest.json)?$/)
          ? ((s = this.pluginConfigData.pluginVersion),
            s.match(/:\d/) || (s += ":8800"),
            s.match(/manifest.json$/) || (s += "/edge-manifest.json"),
            s.match(/https?:\/\//) || (s = "http://" + s),
            this.log.devInfo(`Using local manifest override: ${s}`))
          : (s += `?v=${this.pluginConfigData.pluginVersion}&manifest=true`)
        : this.pluginConfigData.manifestUrl && (checkAllowHost(this.pluginConfigData.manifestUrl) || i.pluginPolicies.canDebug)
          ? (s = this.pluginConfigData.manifestUrl)
          : (s += "?manifest=true"),
      (s.match(/localhost/) || s.match(/127.0.0.1/)) && e && !i.pluginPolicies.canDebug && (o = U),
      { manifestUrl: s, applicationKey: o }
    )
  }
  async populateFromManifest(t, i, e) {
    const n = []
    for (const s of t) n.push(this.registerManifestEntry(s, i, e))
    await Promise.all(n)
  }
  async registerManifestEntry(t, i, e) {
    var n, s, o
    const a = this.findLatestPermittedVersion(t.versions, t.currentVersion)
    if (!a) return
    t.currentVersion = a
    const r = Object.assign(Object.assign({}, t), {
      src: t.src || getPluginUrl(t.name, t.currentVersion, i.baseUrl),
      meta: t.meta || getPluginMetadataUrl(t.name, t.currentVersion, i.baseUrl),
      icon: t.icon || "",
      applicationKey: t.applicationKey || e || U,
      fetchLevel: null !== (n = t.fetchLevel) && void 0 !== n ? n : this.pluginConfigData.defaultFetchLevel
    })
    if (!checkAllowHost(r.src) || !checkAllowHost(r.meta)) return
    const l = await this.queue.get(r.meta, { responseType: "json" }).catch(t => {
      this.log.error(t)
    })
    var c, u, d
    l &&
      this.pluginConfigData.add({
        name: r.name,
        description: l.description,
        version: r.currentVersion,
        config: l.config || {},
        outputs: l.outputs || {},
        applicationKey: r.applicationKey,
        src: r.src,
        meta: r.meta,
        icon: (null === (s = l.options) || void 0 === s ? void 0 : s.icon)
          ? r.icon || ((c = t.name), (u = t.currentVersion), (d = i.baseUrl), d + `${c}/${u}/${c}.svg`)
          : void 0,
        enabled: !1,
        strict: this.canOverrideStrict && null !== this.pluginConfigData.defaultStrict ? this.pluginConfigData.defaultStrict : r.sesStrict,
        fetchLevel: null !== (o = r.fetchLevel) && void 0 !== o ? o : this.pluginConfigData.defaultFetchLevel,
        options: l.options
      })
  }
  findLatestPermittedVersion(t, i) {
    const e = Object.keys(t).sort((t, i) => VersionUtils.compare(i, t))
    for (const n of e) {
      const e = t[n].requiredPolicies
      if (!VersionUtils.gt(n, i) && this.hasRequiredPolicies(e)) return n
    }
    return null
  }
  hasRequiredPolicies(t) {
    if (!t || 0 === t.length) return !0
    const i = this._config.pluginPolicies.groups || [],
      e = t => (-1 === t.indexOf(".") ? -1 !== i.indexOf(t) : this._policyData.hasPolicy(t))
    return t.reduce((t, i) => {
      if (!t) return t
      if (i instanceof Object) {
        if ("or" === i.operator) return i.policies.some(t => e(t))
        if ("xor" === i.operator) {
          let t = 0
          return (
            i.policies.forEach(i => {
              t += e(i) ? 1 : 0
            }),
            1 === t
          )
        }
        return this.log.warn(`unrecognized required policy entry, operator: <${i.operator}> - plugin disabled`), !1
      }
      return e(i)
    }, !0)
  }
  async getConfiguredPlugins() {
    const t = (await this.currentStore.read()) || [],
      i = [],
      e = getValFromURL("mls", 0)
    return (
      t.forEach(t => {
        var s, o, a
        if (t.enabled) {
          const r = this.pluginConfigData.availablePlugins.get(t.id)
          let l = !(r && (!r || void 0 !== r.strict)) || r.strict
          if (!r)
            return (
              this.log.warn(`"${t.id}" plugin not found in current plugin manifest -- was it configured with a different one?`),
              void this.log.warn(`Unrecognized plugin disallowed "${null == t ? void 0 : t.id}" cannot load from ${null == t ? void 0 : t.src}`)
            )
          const c = {
            config: t.config || {},
            src: t.src || r.src,
            meta: t.meta || r.meta,
            id: t.id || r.name,
            strict: l,
            applicationKey: (null == r ? void 0 : r.applicationKey) || "FAKE_APP_KEY",
            fetchLevel: null !== (s = null == r ? void 0 : r.fetchLevel) && void 0 !== s ? s : FetchLevel.None
          }
          if (e) {
            if (!c.meta) return void this.log.warn(`MLS mode requires plugin meta. Plugin meta URL missing from plugin "${null == t ? void 0 : t.id}"`)
            if (!(null === (o = r.options) || void 0 === o ? void 0 : o.mlsEnabled))
              return void this.log.info(`Plugin "${null == t ? void 0 : t.id}" not allowed in MLS mode.`)
          }
          {
            const t = m(c),
              i = this._manifest.find(t => t.name === c.id)
            if (t && i) {
              const e = this.getAutoUpgradedVersion(t, i)
              null !== e &&
                e !== t &&
                (this.log.debugInfo(`Replacing ${i.name} version ${t} with version ${e}`),
                (c.src = c.src.replace(t, e)),
                (c.meta = null === (a = c.meta) || void 0 === a ? void 0 : a.replace(t, e)))
            } else this.log.debugInfo(`Missing config version or manifest entry for ${c.id}. Not auto-updating patch for this plugin.`)
          }
          i.push(c)
        }
      }),
      i
    )
  }
}
// export const PluginConfigData = AvailablePluginData
// export const getPluginMetadataUrl = f
// export const getPluginUrl = p
