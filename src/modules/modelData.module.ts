import * as c from "../const/48945"
import * as T from "../const/59961"
import {
  brandingEnabledKey,
  presentationAboutKey,
  presentationMlsModeKey,
  presentationTitleKey,
  socialSharingKey,
  urlTemplateConfig
} from "../const/settings.const"
import { ModelDataSymbol, ModelMeshSymbol, SettingsSymbol } from "../const/symbol.const"
import { damFileStatus, modelVisibility, requestStateType } from "../const/typeString.const"
import { DebugInfo } from "../core/debug"
import EngineContext from "../core/engineContext"
import { MdsStore } from "../core/mds.store"
import { Module } from "../core/module"
import { LayersData } from "../data/layers.data"
import { ModelData } from "../data/model.data"
import { StorageData } from "../data/storage.data"
import { BaseExceptionError } from "../error/baseException.error"
import { Publication } from "../interface/global.interface"
import { ModelDetails, ModelDetailsData } from "../interface/model.interface"
import { ModelDataMessage } from "../message/model.message"
import GetModelDetails from "../test/GetModelDetails"
import { noNull } from "../utils/29282"
import { toDate } from "../utils/date.utils"
import { BuildOnStale, ExpiringResource } from "../utils/expiringResource"
import { PreFetchedModelData } from "../utils/predata.utils"
import { getValFromURL } from "../utils/urlParams.utils"
import { VersionUtils } from "../utils/version.utils"
declare global {
  interface SymbolModule {
    [ModelDataSymbol]: ModelDataModule
  }
}
interface Details extends Publication {
  sid: string
  name: string
  formattedAddress: string
  externalUrl: string
  demo?: any
}

export class ModelObject {
  sceneId: string
  lastPublished: Date | null
  sid: string
  tileset: {
    maxLOD: number
    rootFilename: string
    urlTemplate: ExpiringResource
    tilesetVersion: string
    s3LocationKey: string
  }
  meshUrls: Array<{
    s3LocationKey: string
    uuid: string
    url: ExpiringResource
  }>
  uuid: string
  organizationId: string | null
  details: Details
  created: Date
  options: {
    urlBranding: boolean
    socialSharing: boolean
    isPublic: boolean
    isVR: boolean
  }
  textures: {
    high?: ExpiringResource
    low?: ExpiringResource
    max?: ExpiringResource
  }
  visibility: string

  constructor() {
    this.lastPublished = null
  }

  key() {
    const s = !!this?.tileset?.s3LocationKey ? this?.tileset?.s3LocationKey : this?.meshUrls[0] ? this?.meshUrls[0].s3LocationKey : undefined
    const r = s ? s : this.uuid
    return r ? r : this.sid
  }

  refresh(e) {
    var t: any[] = this.meshUrls
    this.sid = e.sid
    this.details = e.details
    this.uuid = e.uuid
    for (const t in this.textures) e.textures[t] && this.textures[t].refreshFrom(e.textures[t])
    t?.forEach((t, n) => {
      const i = e?.meshUrls
      const s = i?.[n]
      const r = s?.url
      t.url && r && t.url.refreshFrom(r)
    })
    if (this.tileset && e.tileset) {
      this.tileset.urlTemplate.refreshFrom(e.tileset.urlTemplate)
      this.tileset.s3LocationKey = e.tileset.s3LocationKey
      this.tileset.maxLOD = e.tileset.maxLOD
      this.tileset.rootFilename = e.tileset.rootFilename
      this.tileset.tilesetVersion = e.tileset.tilesetVersion
    }
  }

  assetsEqual(e) {
    return (
      this.sid === e.sid &&
      this.uuid === e.uuid &&
      this?.tileset.s3LocationKey === e?.tileset.s3LocationKey &&
      this?.meshUrls[0].s3LocationKey === this?.meshUrls[0].s3LocationKey
    )
  }
}

class ModelLoadExceptionError extends BaseExceptionError {
  constructor(e, t) {
    super(e)
    this.name = "ModelLoadException"
    this.code = t
  }
}

const MdsModelDebug = new DebugInfo("mds-model-serializer")

class ModelDataSerializer {
  deserialize(e: ModelDetails, sceneId: string) {
    var t, n, i, s

    t = e.state
    const r = t ? t : requestStateType.ACTIVE
    if (r !== requestStateType.ACTIVE) {
      MdsModelDebug.error(`model unavailable, status: ${r}`, e)
      throw new ModelLoadExceptionError("model unavailable", r)
    }
    const c = e.options
    const d = new ModelObject()
    d.sid = e.id
    d.details = {
      sid: e.id,
      name: e.name || "",
      summary: "",
      formattedAddress: "",
      contact: {
        email: "",
        name: "",
        phone: "",
        formattedPhone: ""
      },
      externalUrl: ""
    }
    n = !c ? void 0 : c.urlBrandingEnabled
    d.options = {
      urlBranding: n,
      socialSharing: !!(!c ? void 0 : c.socialSharingEnabled),
      isPublic: !0,
      isVR: !!(!c ? void 0 : c.vrEnabled)
    }
    //pw
    //贴图数据
    // const u = P(e.assets.textures.filter(e => "high" === e.quality)[0])
    // const h = P(e.assets.textures.filter(e => "low" === e.quality)[0])
    // d.textures = {}
    // u && (d.textures.high = new ExpiringResource(u, toDate(u.validUntil, null)))
    // h && (d.textures.low = new ExpiringResource(h, toDate(h.validUntil, null)))
    const p = this.getDamFileUrls(e)
    if (p || p.length) {
      d.meshUrls = p
    }
    i = e.assets.tilesets
    const f = !i ? void 0 : i[0]
    if (this.validateTileset(f)) {
      d.tileset = this.getTileset(f, e.lod)
      d.textures.max = this.getTilesetTextures(f)
      if (!d.meshUrls && !d.tileset) {
        throw (MdsModelDebug.error("No DAM or tileset info found for model", d), new ModelLoadExceptionError("No DAM or tileset info found for model", r))
      }
    }
    s = !p ? void 0 : p[0]
    d.uuid = !s ? void 0 : s.uuid || ""
    d.visibility = this.getModelVisibility(e)
    d.sceneId = sceneId
    return d
  }

  validate(e: ModelDetails) {
    return ["id", "assets"].every(t => t in e)
  }

  getDamFileUrls(e) {
    return (e.assets?.meshes || []).reduce((e, t) => {
      if (t.status === damFileStatus.AVAILABLE && t.url) {
        //pw
        //dam数据
        // const i = new RegExp(/[a-f0-9]{8}[a-f0-9]{4}4[a-f0-9]{3}(:?8|9|A|B)[a-f0-9]{3}[a-f0-9]{12}/gi)
        // const s = t.url.matchAll(i)
        // let r = ""
        // for (const e of s) r += "," + e[0]
        const a = t.filename?.replace(".dam", "").replace("_50k", "") || "unknown"

        const o = {
          url: new ExpiringResource(t.url, toDate(t.validUntil, null)),
          s3LocationKey: "",
          uuid: a
        }
        "50k" === t.resolution ? e.unshift(o) : e.push(o)
      }
      return e
    }, [])
  }

  validateTileset(e) {
    var t
    if (!e) return !1
    const n = VersionUtils.lt(null !== (t = e.tilesetVersion) && void 0 !== t ? t : "0", "1.0.0")
    return e && e.status === damFileStatus.AVAILABLE && !n
  }

  getTileset(e, t) {
    var n
    const i = this.getTilesetMaxLOD(e, t)
    const s = this.getRootTilesetFilename(e, t)
    const r = this.getUrlTemplate(e)
    const a = new URLSearchParams(r).get("k") + "/"

    return {
      maxLOD: i,
      rootFilename: s,
      urlTemplate: new ExpiringResource(r, toDate(e.validUntil, null)),
      tilesetVersion: null !== (n = e.tilesetVersion) && void 0 !== n ? n : "0",
      s3LocationKey: a
    }
  }

  getTilesetMaxLOD(e, t) {
    // 瓦片图等级
    var n, i, s
    let r = 2
    n = e.tilesetVersion
    const a = VersionUtils.gte(n ? n : "0", "1.2.0")
    const o = !a && e.tilesetPreset === T.qU.basic1
    const l = e.tilesetPreset === T.qU.custom
    const c = e.tilesetDepth
    if (I(c) && (a || l || !o)) return c
    i = t?.options
    switch (i?.[0]) {
      case T.vz.MAX:
        r = I(c) ? c : 4
        s = e.tilesetVersion
        if (VersionUtils.lt(s ? s : "0", "1.1.0")) {
          r = 3
        }
        break
      case T.vz.LOD3:
        r = 3
        break
      case T.vz.LOD2:
        r = 2
        break
      case T.vz.LOD1:
        r = 1
        break
      case T.vz.LOD0:
        r = 0
    }
    if (1 === getValFromURL("debugTiles", 0) && getValFromURL("maxLOD", r) !== r) {
      r = getValFromURL("maxLOD", r)
    }
    return r
  }

  /*
  getTilesetMaxLOD(e, t) {// 瓦片图等级
    var n, i, s
    let r = 2
    n = e.tilesetVersion
    const a = VersionUtils.gte(n ? n : "0", "1.2.0")
    const o = !a && e.tilesetPreset === T.qU.basic1
    const l = e.tilesetPreset === T.qU.custom
    const c = e.tilesetDepth
    if (I(c) && (a || l || !o)) return c
    i = t?.options
    switch (i?.[0]) {
      case T.vz.MAX:
        r = I(c) ? c : 4
        s = e.tilesetVersion
        if (VersionUtils.lt(s ? s : "0", "1.1.0")) {
          r = 3
        }
        break
      case T.vz.LOD3:
        r = 3
        break
      case T.vz.LOD2:
        r = 2
        break
      case T.vz.LOD1:
        r = 1
        break
      case T.vz.LOD0:
        r = 0
    }
    if (1 === getValFromURL("debugTiles", 0) && getValFromURL("maxLOD", r) !== r) {
      r = getValFromURL("maxLOD", r)
    }
    return r
  }
  */
  getRootTilesetFilename(e, t) {
    if (1 === getValFromURL("debugTiles", 0) && "" !== getValFromURL("tilesetroot", "")) return getValFromURL("tilesetroot", "")
    if (e.tilesetPreset === T.qU.custom) return "tileset.json"
    return `${this.getTilesetMaxLOD(e, t)}.json`
  }

  getTilesetTextures(e) {
    const t = this.getUrlTemplate(e)
    return new ExpiringResource(
      {
        filename: null,
        id: "tiled",
        resolution: "*",
        quality: "max",
        format: "jpg",
        urlTemplate: t.replace(urlTemplateConfig.urlTemplateToken, "<folder>/<texture>.jpg"),
        validUntil: e.validUntil
      },
      toDate(e.validUntil, null)
    )
  }

  getUrlTemplate(e) {
    var t = e.urlTemplate
    return urlTemplateConfig.urlTemplateOverride
      ? urlTemplateConfig.urlTemplateOverride + urlTemplateConfig.urlTemplateToken + "?t=fake"
      : t
        ? t
        : urlTemplateConfig.urlTemplateToken
  }

  getModelVisibility(e) {
    return PreFetchedModelData.hasPassword
      ? T.LU.PASSWORD
      : noNull(e.visibility) && e.visibility !== modelVisibility.PUBLIC
        ? e.visibility === modelVisibility.PRIVATE
          ? T.LU.PRIVATE
          : T.LU.UNKNOWN
        : e.discoverable
          ? T.LU.PUBLIC
          : T.LU.UNLISTED
  }
}

function I(e) {
  return noNull(e) && !isNaN(e)
}

class ModelDataStore extends MdsStore {
  serializer: ModelDataSerializer
  prefetchKey: string
  constructor(e) {
    super(...arguments)
    this.serializer = new ModelDataSerializer()
    this.prefetchKey = "data.model.name"
  }

  async read(e) {
    var t = e?.modelId

    var n: ModelDetailsData
    const i = {
      modelId: t ? t : this.getViewId()
    }
    // const s = await this.query(h.GetModelDetails, i, e)
    const s = await GetModelDetails(i.modelId)
    n = s?.data

    return this.serializer.deserialize(n?.model, e.sceneId)
  }

  async refresh(e) {
    return super.refresh(
      Object.assign(Object.assign({}, e), {
        fetchPolicy: "no-cache"
      })
    )
  }
}

export default class ModelDataModule extends Module {
  data: ModelData
  engine: EngineContext
  store: ModelDataStore

  constructor() {
    super(...arguments)
    this.name = "model-data"
    this.data = new ModelData()
  }

  async init(e, t: EngineContext) {
    this.engine = t
    const { baseUrl, readonly, sceneId } = e
    const layersData = await t.market.waitForData(LayersData)
    this.store = new ModelDataStore({
      context: layersData.mdsContext,
      readonly,
      baseUrl
    })
    layersData.onPropertyChanged("currentViewId", e => {
      const t = this.data.getModel(e)
      this.log.debugInfo("view change", e, t)
      t && this.setActiveModel(t)
    })
    this.store.onNewData(async e => {
      if (e) {
        const t = this.data.getModel(e.sid)
        this.log.debugInfo("data change", e.sid, void 0 !== t ? "refresh" : "add")
        if (t) {
          t.refresh(e)
        } else {
          this.addModel(e)
          this.setActiveModel(e)
        }
      }
    })
    t.getModuleBySymbol(ModelMeshSymbol).then(e => {
      e.isolateMesh(this.data.getModel())
      this.data.onPropertyChanged("activeModelId", async t => {
        e.isolateMesh(this.data.getModel(t))
      })
    })
    await this.store.refresh({
      modelId: layersData.currentViewId,
      sceneId
    })
    t.market.register(this, ModelData, this.data)
    this.registerSettings(this.data.getModel())

    t.market.waitForData(StorageData).then(e => {
      var t = this.data.getModel()
      const n = t?.lastPublished
      if (n) {
        e.lastPublished = n.getTime()
        e.commit()
      }
    })
  }

  setActiveModel(e) {
    this.data.activeModelId = e.sid
    this.data.commit()
  }

  addModel(e) {
    this.data.hasModel(e.sid) ||
      (this.data.addModel(e.sid, e),
      BuildOnStale(e, async () => {
        await this.store.refresh({
          modelId: e.sid
        })
      }),
      this.engine.broadcast(new ModelDataMessage(e.sid, e.vrSupported)))
  }

  async registerSettings(e) {
    var t
    const n = await this.engine.getModuleBySymbol(SettingsSymbol),
      i = "Model Options",
      { urlBranding: r = !0, socialSharing: a, isPublic: o, isVR: l } = e.options || {}
    n.registerSetting(i, socialSharingKey, a)
    n.registerSetting(i, "is_public", o)
    n.registerSetting(i, "is_vr", l)
    const d = !r || !!n.settingsData.getOverrideParam("brand", !0)
    const u = r ? n.settingsData.getOverrideParam("mls", "0") : "0"
    const h = r ? n.settingsData.getOverrideParam("title", "1") : "1"
    const p = null !== (t = n.settingsData.getOverrideParam("tagNav", "1")) && void 0 !== t ? t : "1"
    n.registerSetting(i, presentationAboutKey, "0" !== h && "2" !== u)
    n.registerSetting(i, presentationTitleKey, "0" !== h && "2" !== h)
    n.registerSetting(i, brandingEnabledKey, d)
    n.registerSetting(i, presentationMlsModeKey, "1" === u || "2" === u)
    n.registerSetting(i, c.ek, "0" !== p)
  }
}
