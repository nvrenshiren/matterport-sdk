import * as o from "../44055"
import { FileDeserializer } from "../other/65222"
import { Data } from "../core/data"
import { DebugInfo } from "../core/debug"
import { MdsStore } from "../core/mds.store"
import { ObservableArray } from "../observable/observable.array"
import { ObservableMap } from "../observable/observable.map"
import { getValFromURL } from "../utils/urlParams.utils"
const debug = new DebugInfo("mds-plugin-config-deserializer")
class d {
  constructor() {
    this.fileAttachmentDeserializer = new FileDeserializer()
  }
  deserialize(e) {
    if (!e) return debug.debug("Deserialized invalid Plugin data from MDS", e), null
    const t = e.fileAttachments.map(e => this.fileAttachmentDeserializer.deserialize(e)).filter(e => null !== e)
    return {
      name: e.name,
      id: e.id,
      attachments: t
    }
  }
}
class u extends MdsStore {
  constructor(e) {
    super(e), (this.deserializer = new d())
  }
  async read(e) {
    // const t = {
    //   modelId: this.getViewId(),
    //   prefetchKey: this.prefetchKey,
    //   includeLayers: this.readLayerId()
    // }
    // return this.query(o.GetPlugins, t, e).then(e => {
    //   var t, n
    //   const i = null === (n = null === (t = null == e ? void 0 : e.data) || void 0 === t ? void 0 : t.model) || void 0 === n ? void 0 : n.sdkPlugins
    //   if (!i || !Array.isArray(i)) return []
    //   return i.map(e => this.deserializer.deserialize(e)).filter(e => null !== e)
    // })
    return []
  }
  async update(e) {
    // const t = {}
    // void 0 !== e.version && (t.currentVersion = e.version), void 0 !== e.attachments && (t.fileAttachments = e.attachments)
    // const n = {
    //   modelId: this.getViewId(),
    //   name: e.name,
    //   patch: t
    // }
    // await this.mutate(o.UpdatePlugin, n).catch(e => {
    //   e.message.includes("Version for plugin does not exist")
    // })
    return !0
  }
  async delete(e) {
    // if (!e) return
    // const t = {
    //   modelId: this.getViewId(),
    //   name: e
    // }
    // return this.mutate(o.DeletePlugin, t).then(() => {})
    return !0
  }
}
export const ManifestEndpoint = "/api/v1/plugins"
export enum FetchLevel {
  AnonymousFetch = 1,
  None = 0,
  UserFetch = 2
}
export class AvailablePluginData extends Data {
  constructor() {
    super(),
      (this.name = "available-plugin-data"),
      (this.availablePlugins = new ObservableMap()),
      (this.lastSavedConfiguration = new ObservableArray()),
      (this.defaultStrict = getValFromURL("sesStrict", null, "boolean")),
      (this.defaultFetchLevel = FetchLevel.None),
      (this.disabled = getValFromURL("noPlugins", !1)),
      (this.manifestUrl = getValFromURL("manifestUrl")),
      (this.pluginVersion = getValFromURL("pluginVersion")),
      (this.preventLiveEdit = getValFromURL("preventWorkshopPluginPreview", !1)),
      (this.eventTarget = new ObservableMap()),
      (this._isSetup = !1)
  }
  get mdsIsSetup() {
    return this._isSetup
  }
  add(e) {
    this.availablePlugins.set(e.name, e)
  }
  setupConfigStore(e, t, n) {
    ;(this._mdsStore = new u({
      context: e,
      readonly: t,
      includeDisabled: !t,
      baseUrl: n
    })),
      (this._isSetup = !0),
      this.commit()
  }
  getMdsResult() {
    var e, t
    return null !== (t = null === (e = this._mdsStore) || void 0 === e ? void 0 : e.read()) && void 0 !== t ? t : Promise.resolve([])
  }
  updateMds(e) {
    var t
    null === (t = this._mdsStore) || void 0 === t || t.update(e)
  }
  deleteMdsById(e) {
    var t
    null === (t = this._mdsStore) || void 0 === t || t.delete(e)
  }
}
