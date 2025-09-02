import { functionCommon } from "@ruler3d/common"
import { DefaultErrorCommand } from "../command/error.command"
import { CreateMeshTrimDataCommand, DeleteMeshTrimDataCommand, MoveMeshTrimAllFloorsCommand } from "../command/meshTrim.command"
import { AggregationType } from "../const/2541"
import * as a from "../const/73698"
import { PhraseKey } from "../const/phrase.const"
import { MeshTrimDataSymbol, ModelMeshSymbol } from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import { OpenDeferred } from "../core/deferred"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { TooManyTrimsError } from "../error/tooManyTrims.error"
import { VisionParase } from "../math/2569"
import { MeshTrimObject } from "../object/meshTrim.object"
import * as p from "../other/3907"
import { QuaternionToJson, Vector3ToJson } from "../other/59296"
import { DiffState } from "../other/71954"
import { SweepsMonitor } from "../observable/sweepsMonitor"
import { noNull } from "../utils/29282"
import { toDate, toISOString } from "../utils/date.utils"
import ModelMeshModule from "./modelMesh.module"
declare global {
  interface SymbolModule {
    [MeshTrimDataSymbol]: TrimDataModule
  }
}

class m {
  config: any
  constructor(e) {
    this.config = e
  }

  serialize(e) {
    const { serializer: t } = this.config
    if (!e || !t) return null
    const i = {}
    for (const s in e) {
      const o = t.serialize(e[s])
      o && (i[s] = o)
    }
    return i
  }

  deserialize(e) {
    const { deserializer: t } = this.config
    if (!e || !t) return {}
    const i = {}
    for (const s in e) {
      const o = t.deserialize(e[s])
      o && (i[s] = o)
    }
    return i
  }
}

const M = new DebugInfo("JsonStoreMeshTrimDeserializer"),
  b = [
    { path: ["position", "x"], type: "number" },
    { path: ["position", "y"], type: "number" },
    { path: ["position", "z"], type: "number" },
    { path: ["scale", "x"], type: "number" },
    { path: ["scale", "y"], type: "number" },
    { path: ["scale", "z"], type: "number" },
    { path: ["rotation", "x"], type: "number" },
    { path: ["rotation", "y"], type: "number" },
    { path: ["rotation", "z"], type: "number" },
    { path: ["rotation", "w"], type: "number" },
    { path: ["index"], type: "number" },
    { path: ["enabled"], type: "boolean" },
    { path: ["meshGroup"], type: "number" },
    { path: ["id"], type: "string" },
    { path: ["created"], type: "string" },
    { path: ["modified"], type: "string" }
  ]

class D {
  deserialize: (e) => MeshTrimObject | null
  constructor() {
    this.deserialize = e => {
      if (!this.isValid(e)) {
        M.debug("Unable to deserialize invalid mesh trim data", e)
        return null
      }
      const {
        position: t,
        scale: i,
        rotation: s,
        index: o,
        enabled: r,
        meshGroup: n,
        created: a,
        modified: h,
        id: l,
        name: d,
        discardContents: c,
        activeInPanoMode: u
      } = e
      return new MeshTrimObject(
        VisionParase.fromVisionVector(t),
        VisionParase.fromVisionVector(i),
        VisionParase.fromVisionQuaternion(s),
        o,
        r,
        n,
        toDate(a),
        toDate(h),
        l,
        d,
        c,
        u
      )
    }
  }

  isValid(e) {
    if (!e || "object" != typeof e) return !1
    const t = e
    !noNull(t.meshGroup) && (t.meshGroup = t.floorIndex)
    return b.every(t => this.hasRequiredField(e, t))
  }

  hasRequiredField(e, t) {
    try {
      return (
        typeof t.path.reduce((i, s) => {
          if ("object" == typeof i && null !== i) return i[s]
          throw new Error(`data ${JSON.stringify(e)} must be addressable by ${t.path.join(".")} with a value of type ${t.type}`)
        }, e) === t.type
      )
    } catch (e) {
      return M.debug(e), !1
    }
  }
}

class T {
  serialize(e) {
    if (!e) return null
    const {
      position: t,
      scale: i,
      rotation: s,
      index: o,
      enabled: r,
      meshGroup: n,
      created: a,
      modified: h,
      id: l,
      name: d,
      discardContents: c,
      activeInPanoMode: u
    } = e
    return {
      position: Vector3ToJson(VisionParase.toVisionVector(t)),
      scale: Vector3ToJson(VisionParase.toVisionVector(i)),
      rotation: QuaternionToJson(VisionParase.toVisionQuaternion(s)),
      index: o,
      enabled: r,
      meshGroup: n,
      created: toISOString(a),
      modified: toISOString(h),
      id: l,
      name: d,
      discardContents: c,
      activeInPanoMode: u
    }
  }
}

class x extends p.MU {
  constructor(e, t, i) {
    const s = new D(),
      o = new T(),
      r = new m({ deserializer: s, serializer: o })
    super({
      queue: e,
      path: `${t}/api/v1/jsonstore/model/trims/${i}`,
      batchUpdate: !0,
      deserialize: e => r.deserialize(e),
      serialize: e => r.serialize(e)
    })
  }
}

const { TRIM: O } = PhraseKey.WORKSHOP
export default class TrimDataModule extends Module {
  dataLoadedPromise: OpenDeferred
  modelMeshModule: ModelMeshModule
  monitor: SweepsMonitor
  engine: EngineContext
  store: x
  load: () => Promise<void>
  createMeshTrim: (e) => Promise<void>
  save: (e) => Promise<void>
  onMeshTrimsChanged: () => void
  deleteMeshTrim: (e) => void
  moveMeshTrimToAllFloors: (e) => void

  constructor() {
    super(...arguments)
    this.name = "trim-data"
    this.dataLoadedPromise = new OpenDeferred()
    this.load = async () => {
      let e = {}
      //pw
      // try {
      //   e = (await this.store.read()) || {}
      // } catch (e) {
      //   this.log.debug("error when reading from json storage"), this.log.debug(e)
      // }
      try {
        const t: MeshTrimObject[] = Object.values(e)
        this.modelMeshModule.meshTrimData.addMeshGroups(t.map(e => e.meshGroup))
        this.modelMeshModule.meshTrimData.add(...t)
      } catch (e) {
        this.log.debug("error when adding trims from json storage")
        this.log.debug(e)
      }
      this.monitor && this.monitor.removeOnChanged(this.onMeshTrimsChanged)
      this.monitor = new SweepsMonitor(this.modelMeshModule.meshTrimData.meshTrimsById, { aggregationType: AggregationType.Immediate })
      this.monitor.onChanged(this.onMeshTrimsChanged)
      this.dataLoadedPromise.resolve()
    }
    this.createMeshTrim = async e => {
      try {
        this.modelMeshModule.meshTrimData.add(e)
      } catch (e) {
        if (e instanceof TooManyTrimsError) {
          const e = O.MAX_TRIMS_ERROR_MESSAGE
          this.engine.commandBinder.issueCommand(new DefaultErrorCommand(e, { throttle: 0, type: a.N.ERROR }))
        }
      }
    }
    this.deleteMeshTrim = async e => {
      this.modelMeshModule.meshTrimData.delete(e)
    }
    this.save = async () => {
      const e = this.monitor.getDiffRecord()
      this.monitor.clearDiffRecord()
      if (!e.length) return
      const t = {}
      for (const i of e)
        switch (i.action) {
          case DiffState.added:
          case DiffState.updated:
            t[i.index] = this.modelMeshModule.meshTrimData.getTrimById(i.index)
            break
          case DiffState.removed:
            t[i.index] = null
        }
      try {
        await this.store.update(t)
      } catch (e) {
        this.log.debug("error when writing to json storage")
        this.log.debug(e)
        const t = O.UNABLE_TO_SAVE_CHANGES_ERROR_MESSAGE
        this.engine.commandBinder.issueCommand(new DefaultErrorCommand(t, { throttle: 30, type: a.N.ERROR }))
      }
    }
    this.moveMeshTrimToAllFloors = async e => {
      const t = e.enabled
      this.deleteMeshTrim(e)
      e.meshGroup = -1
      e.enabled = t
      this.createMeshTrim(e)
    }
    this.onMeshTrimsChanged = functionCommon.debounce(this.save, 1e3)
  }

  get waitForData() {
    return this.dataLoadedPromise.nativePromise()
  }

  async init(e, t: EngineContext) {
    this.engine = t
    this.store = new x(e.queue, e.baseUrl, e.baseModelId)
    this.modelMeshModule = await t.getModuleBySymbol(ModelMeshSymbol)
    this.load()
    this.bindings.push(
      t.commandBinder.addBinding(CreateMeshTrimDataCommand, this.createMeshTrim),
      t.commandBinder.addBinding(DeleteMeshTrimDataCommand, this.deleteMeshTrim),
      t.commandBinder.addBinding(MoveMeshTrimAllFloorsCommand, this.moveMeshTrimToAllFloors)
    )
  }
}
