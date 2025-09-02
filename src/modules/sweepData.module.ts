import { gql } from "@apollo/client"
import { SaveCommand } from "../command/save.command"
import { ModifySweepNeighborsCommand, NoneSweepCommand, SetFocusSweepCommand } from "../command/sweep.command"
import { AggregationType } from "../const/2541"
import { TransitionTypeList } from "../const/64918"
import { PanoSizeKey } from "../const/76609"
import { DataType } from "../const/79728"
import { CameraSymbol, PanoSymbol, StorageSymbol, SweepDataSymbol } from "../const/symbol.const"
import { panoSource, placementType } from "../const/typeString.const"
import { DebugInfo } from "../core/debug"
import { OpenDeferred } from "../core/deferred"
import EngineContext from "../core/engineContext"
import MarketContext from "../core/marketContext"
import { MdsStore } from "../core/mds.store"
import { Module } from "../core/module"
import { CameraData } from "../data/camera.data"
import { LayersData } from "../data/layers.data"
import { SweepsData } from "../data/sweeps.data"
import { SweepExceptionError, SweepTransitionActiveExceptionError } from "../error/sweepException.error"
import { TransitionExceptionError } from "../error/transitionException.error"
import { SweepsLocation, SweepsSkybox } from "../interface/sweep.interface"
import { VisionParase } from "../math/2569"
import { EndMoveToSweepMessage, MoveToSweepBeginMessage, SweepDataMessage } from "../message/sweep.message"
import { AlignmentType, PlacementType, SweepObject } from "../object/sweep.object"
import { ObservableMap } from "../observable/observable.map"
import { SweepsMonitor } from "../observable/sweepsMonitor"
import * as N from "../other/40731"
import { QuaternionToJson, Vector3ToJson } from "../other/59296"
import { DiffState } from "../other/71954"
import GetSweeps from "../test/GetSweeps"
import { makePerspectiveFov } from "../utils/camera.utils"
import { toDate } from "../utils/date.utils"
import { easeInOutCubic } from "../utils/ease.utils"
import { BuildOnStale, ExpiringResource } from "../utils/expiringResource"
import CameraDataModule from "./cameraData.module"
import { PanoRenderer } from "./sweepPanoTiling.module"

declare global {
  interface SymbolModule {
    [SweepDataSymbol]: SweepDataModule
  }
}
const E = new DebugInfo("mds-sweep-serializer")

class AnchorSerializer {
  serialize(e) {
    const t: { tags?: any[] } = {}
    if (e.enabled || e.vrenabled) {
      t.tags = []
      e.enabled && t.tags.push("JMYDCase")
      e.vrenabled && t.tags.push("vr")
    }
    return this.validate(t) ? t : null
  }

  validate(e) {
    if (!e) return !1
    const t = ["tags"],
      n = t.some(t => t in e),
      i = 0 === Object.keys(e).filter(e => !t.includes(e)).length,
      s = void 0 === e.tags || Array.isArray(e.tags),
      r = s && n && i
    if (!r) {
      E.debug("Invalid AnchorPatch:", {
        tagsIsArrayIfPresent: s,
        hasSomeChanges: n,
        hasNoExtraChanges: i,
        mutableFields: t,
        data: e
      })
    }
    return r
  }
}

const P = new DebugInfo("mds-sweep-serializer")
const x = {
  [placementType.AUTO]: PlacementType.AUTO,
  [placementType.MANUAL]: PlacementType.MANUAL,
  [placementType.UNPLACED]: PlacementType.UNPLACED
}
const k = {
  [panoSource.VISION]: AlignmentType.ALIGNED,
  [panoSource.UPLOAD]: AlignmentType.UNALIGNED
}

class SweepDeserializer {
  deserialize(e: SweepsLocation) {
    if (!e || !this.validate(e)) return P.debug("Deserialized invalid Sweep data from MDS", e), null
    const r = e
    const sweepObject = new SweepObject()
    sweepObject.id = r.id
    sweepObject.index = r.index
    sweepObject.enabled = !!r.tags?.includes("JMYDCase") && !!r.enabled
    sweepObject.vrenabled = !!r.tags?.includes("vr")
    sweepObject.neighbours = r.neighbors || []
    r.position && (sweepObject.floorPosition = VisionParase.fromVisionVector(r.position))
    sweepObject.floorId = r.floor?.id || null
    sweepObject.roomId = r.room?.id || null
    const panoObject = r.pano
    let label = panoObject.label || ""
    label === `${sweepObject.index}` && (label = "")
    sweepObject.name = label
    sweepObject.alignmentType = k[panoObject.source]
    sweepObject.uuid = panoObject.sweepUuid || ""
    sweepObject.alignmentType === AlignmentType.ALIGNED
      ? (sweepObject.placementType = PlacementType.AUTO)
      : (sweepObject.placementType = x[panoObject.placement])
    if (panoObject.position) {
      const e = VisionParase.fromVisionVector(panoObject.position)
      sweepObject.placementType !== PlacementType.AUTO && e.distanceTo(sweepObject.floorPosition) > 1e3 && (sweepObject.placementType = PlacementType.UNPLACED)
      sweepObject.position = e
    }
    sweepObject.resolutions = []

    const c = panoObject.skyboxes || []

    if (panoObject.resolutions) {
      for (const e of panoObject.resolutions) {
        const t = this.getPanoSizeClass(e)

        const n = this.makeSkybox(c.find(t => t.resolution === e))
        if (t && n) {
          sweepObject.resolutions.push(t)
          sweepObject.skyboxes[t] = n
        } else {
          P.debug(`Invalid pano size class ${e}`)
        }
      }
    }

    if (panoObject.rotation) {
      sweepObject.rotation = VisionParase.fromVisionQuaternion(panoObject.rotation)
    }

    if (!sweepObject.floorId) {
      sweepObject.alignmentType === AlignmentType.ALIGNED
        ? P.warn(`Aligned sweep ${sweepObject.index} has no floor association`)
        : sweepObject.placementType === PlacementType.MANUAL && P.debug(`Manually placed sweep ${sweepObject.index} has no floor association`)
      if (!sweepObject.roomId) {
        sweepObject.alignmentType === AlignmentType.ALIGNED && P.warn(`Aligned sweep ${sweepObject.index} has no room association`)
      }
    }
    return sweepObject
  }

  validate(e: SweepsLocation) {
    if (!e) return !1
    const t: any = [],
      n = ["id", "index", "tags"]
    if (
      (t.push(() => n.every(t => t in e)),
      t.push(() => "number" == typeof e.index),
      t.push(() => !!e.position && (0, N.u)(e.position)),
      t.push(() => "pano" in e && !!e.pano),
      e.pano)
    ) {
      const { placement: n, source: i, position: s } = e.pano
      t.push(() => !!n && n in x), t.push(() => !!i && i in k), t.push(() => !!s && (0, N.u)(s))
    }
    return t.every(e => e())
  }

  getPanoSizeClass(e: string) {
    const t = {
      low: PanoSizeKey.BASE,
      high: PanoSizeKey.STANDARD,
      "2k": PanoSizeKey.HIGH,
      "4k": PanoSizeKey.ULTRAHIGH
    }
    return e in t ? t[e] : void 0
  }

  makeSkybox(e?: SweepsSkybox) {
    if (e && e.tileUrlTemplate && e.tileResolution && e.tileCount)
      return new ExpiringResource(
        {
          tileUrlTemplate: e.tileUrlTemplate,
          tileResolution: parseInt(e.tileResolution, 10),
          tileCount: e.tileCount,
          urlTemplate: null !== e.urlTemplate ? e.urlTemplate : void 0
        },
        toDate(e.validUntil)
      )
  }
}

const D = new DebugInfo("mds-sweep-serializer")

class PanoSerializer {
  serialize(e) {
    const t: any = {}
    e.rotation && (t.rotation = QuaternionToJson(VisionParase.toVisionQuaternion(e.rotation)))
    e.position && (t.position = Vector3ToJson(VisionParase.toVisionVector(e.position)))
    if (e.placementType && e.placementType === PlacementType.UNPLACED) {
      t.resetPlacement = !0
      t.resetFloor = !0
      t.resetRoom = !0
    }
    "roomId" in e && (e.roomId ? (t.roomId = e.roomId) : (t.resetRoom = !0))
    "floorId" in e && (e.floorId ? ((t.floorId = e.floorId), t.roomId || (t.resetRoom = !0)) : (t.resetFloor = !0))
    "name" in e && (t.label = e.name || "")
    return this.validate(t) ? t : null
  }

  validate(e) {
    if (!e) return !1
    const t = ["resetPlacement", "resetFloor", "resetRoom", "rotation", "position", "floorId", "roomId", "label"],
      n = t.some(t => t in e),
      i = 0 === Object.keys(e).filter(e => !t.includes(e)).length,
      s = n && i
    if (!s) {
      D.debug("Invalid PanoramaLocation:", {
        hasSomeChanges: n,
        hasNoExtraChanges: i,
        mutableFields: t,
        data: e
      })
    }
    return s
  }
}

const M = new DebugInfo("mds-sweep-store")

class SweepStore extends MdsStore {
  deserializer: SweepDeserializer
  panoSerializer: PanoSerializer
  anchorSerializer: AnchorSerializer

  constructor(e?) {
    super(...arguments)
    this.deserializer = new SweepDeserializer()
    this.panoSerializer = new PanoSerializer()
    this.anchorSerializer = new AnchorSerializer()
    this.prefetchKey = "data.model.locations"
  }

  async read(e = {}) {
    const { readonly } = this.config

    const a = {
      modelId: this.getViewId()
    }
    // pw
    //点位数据

    let locations: SweepsLocation[] = await GetSweeps(a.modelId, !readonly)
    // let locations: SweepsLocation[] = []
    if (readonly) {
      // const i = await this.query(v.GetShowcaseSweeps, a, e)
      // locations = i?.data?.model?.locations
    } else {
      // const t = await this.query(v.GetSweeps, a, e)
      // locations = t?.data?.model?.locations
    }
    if (!locations || !Array.isArray(locations)) return null
    const l: Record<string, SweepObject> = {}
    for (const e of locations) {
      if (!e) continue
      const t = this.deserializer.deserialize(e)
      t && (l[t.id] = t)
    }
    return l
  }

  async refresh() {
    return super.refresh({
      fetchPolicy: "no-cache"
    })
  }

  async update(e) {
    if (!e || 0 === e.length) return
    const t = this.getViewId()
    let n = ""
    const i: { modelId?: string } = {}
    i.modelId = t
    let s = ""
    for (const t of e) {
      const e = this.panoSerializer.serialize(t)
      const r = this.anchorSerializer.serialize(t)
      if (!e && !r) {
        M.info("No changes to update:", t)
        continue
      }
      n += "" + (e ? `, $pano${t.id}: PanoramicImageLocationPatch!` : "") + ` ${r ? `, $anchor${t.id}: AnchorPatch!` : ""} `
      i[`pano${t.id}`] = e
      i[`anchor${t.id}`] = r
      s += `\n        ${e ? `\n          panoLocation${t.id}: patchPanoLocation(modelId: $modelId, , locationId: "${t.id}", patch: $pano${t.id}) {\n            id\n            placement\n          }` : ""}\n        ${r ? `\n          panoAnchor${t.id}: patchAnchor(modelId: $modelId, , anchorId: "${t.id}", patch: $anchor${t.id}) {\n            id\n            tags\n          }` : ""}\n      `
    }
    if ("" === s) return
    const r = gql`
      mutation sweepUpdate($modelId: ID! ${n}) {
        ${s}
      }
    `
    return this.mutate(r, i).then(() => {})
  }
}

const z = easeInOutCubic

export default class SweepDataModule extends Module {
  data: SweepsData
  monitor: SweepsMonitor<ObservableMap<SweepObject>> | null
  internalProgress: Boolean
  engine: EngineContext
  market: MarketContext
  store: SweepStore
  cameraModule: CameraDataModule
  cameraData: CameraData
  panoRenderer: PanoRenderer

  constructor() {
    super()
    this.name = "sweep-data"
    this.data = new SweepsData()
    this.monitor = null
    this.internalProgress = !1
    this.moveToSweep = this.moveToSweep.bind(this)
    this.activateSweepUnsafe = this.activateSweepUnsafe.bind(this)
    this.instantSweepTransition = this.instantSweepTransition.bind(this)

    this.beginSweepTransition = this.beginSweepTransition.bind(this)
    this.endSweepTransition = this.endSweepTransition.bind(this)
  }

  async init(e, t: EngineContext) {
    const { readonly } = e
    this.engine = t
    this.market = this.engine.market
    this.store = await this.initSweepStore(e, t)
    const i = (await this.store.read()) || {}
    const a = [this.filterSweepData]
    a.forEach(e => e(i))
    BuildOnStale(i, async () => {
      if (this.store.refresh) {
        const e = (await this.store.refresh()) || {}
        a.forEach(t => t(e)), this.data.refresh(e)
      } else this.log.debug("Can't refresh sweep URLs - operation not supported")
    })
    this.data.addSweeps(i)
    this.market.register(this, SweepsData, this.data)
    const o = await t.getModuleBySymbol(StorageSymbol)

    if (!readonly) {
      this.monitor = new SweepsMonitor(
        this.data.getCollection(),
        {
          aggregationType: AggregationType.NextFrame,
          shallow: !0
        },
        t
      )
      this.monitor.onChanged(() =>
        this.engine.commandBinder.issueCommand(
          new SaveCommand({
            dataTypes: [DataType.SWEEPS]
          })
        )
      )
    }
    this.cameraModule = await this.engine.getModuleBySymbol(CameraSymbol)
    this.cameraData = await t.market.waitForData(CameraData)
    this.bindings.push(
      t.commandBinder.addBinding(NoneSweepCommand, async () => {
        this.data.currentSweep = void 0
        this.data.commit()
      }),
      t.commandBinder.addBinding(SetFocusSweepCommand, async e => {
        if (e.sweepId)
          try {
            const t = e.sweepId
            await this.activateSweepUnsafe({
              sweepId: t
            }),
              this.beginSweepTransition({
                sweepId: t,
                transitionTime: 0,
                internalProgress: !0
              }),
              (this.data.currentSweep = t),
              this.endSweepTransition({
                sweepId: t
              }),
              this.data.commit()
          } catch (e) {
            this.log.error(e)
          }
        else (this.data.currentSweep = void 0), this.data.commit()
      }),
      t.commandBinder.addBinding(ModifySweepNeighborsCommand, async e => {
        if (e.id) {
          let t = !1
          const n = this.data.getSweep(e.id)
          if (n) {
            for (const i of e.added) -1 === n.neighbours.indexOf(i) && (n.neighbours.push(i), (t = !0))
            for (const i of e.removed) {
              const e = n.neighbours.indexOf(i)
              ;-1 !== e && (n.neighbours.splice(e, 1), (t = !0))
            }
            t && this.data.setDirty()
          }
        }
      }),
      o.onSave(() => this.save(), {
        dataType: DataType.SWEEPS
      })
    )
  }

  async initSweepStore(e, t) {
    const { readonly, baseUrl } = e
    const s = await t.market.waitForData(LayersData)
    const r = new SweepStore({
      context: s.mdsContext,
      readonly,
      baseUrl
    })
    const a = () => {
      r.setStoreViewId(s.getWorkshopOrBaseId())
    }
    a()
    this.bindings.push(s.onPropertyChanged("currentViewId", a))
    return r
  }

  moveToSweep(e) {
    const n = new OpenDeferred()
    let i = e.sweepId
    if (i && !this.data.containsSweep(i) && this.data.getSweepByUuid(i)) {
      i = this.data.getSweepByUuid(i)?.id
      e.sweepId = i
    }
    if (!i || !this.data.containsSweep(i)) {
      return this.log.error(`moveToSweep error ${JSON.stringify(e)}`, "Invalid sweep"), OpenDeferred.reject(new SweepExceptionError("Invalid sweep"))
    }
    const s = e
    if (!this.data.canTransition() || !this.cameraData.canTransition()) throw new SweepTransitionActiveExceptionError()
    if (!this.data.containsSweep(i)) throw new SweepExceptionError("Invalid sweep")

    this.activateSweepUnsafe(s)
      .then(() => {
        if (!this.data.canTransition()) throw new SweepTransitionActiveExceptionError()
        return this.beginSweepTransition(s), this.defaultSweepCameraMove(n, s)
      })
      .then(() => {
        this.endSweepTransition(s), n.resolve()
      })
      .catch(e => {
        e instanceof SweepTransitionActiveExceptionError || e instanceof SweepExceptionError
          ? this.log.info(`moveToSweep ignored ${JSON.stringify(s)}`, e)
          : e instanceof TransitionExceptionError &&
            (this.data.transition.from &&
              this.endSweepTransition({
                sweepId: this.data.transition.from
              }),
            this.log.info(`exception moving to sweep ${JSON.stringify(s)}`, e)),
          n.reject(e)
      })

    return n.promise()
  }

  async activateSweepUnsafe(e) {
    if (!this.panoRenderer) {
      this.panoRenderer = (await this.engine.getModuleBySymbol(PanoSymbol)).getRenderer()
    }
    return this.panoRenderer.activateSweep(e.sweepId, !0)
  }

  instantSweepTransition(e: string) {
    const t = this.data.currentSweep
    this.beginSweepTransition({
      sweepId: e,
      transitionTime: 0,
      internalProgress: !0
    })
    this.data.currentSweep = e
    this.data.commit()
    this.engine.broadcast(new SweepDataMessage(e, t))
    this.endSweepTransition({
      sweepId: e
    })
  }

  beginSweepTransition(e) {
    this.data.activateTransition(e.sweepId, this.data.currentSweep)
    this.internalProgress = e.internalProgress || !1
    this.data.transition.progress.modifyAnimation(0, 1, e.transitionTime || 0, e.easing || z)
    this.data.commit()
    this.engine.broadcast(new MoveToSweepBeginMessage(e.sweepId, this.data.currentSweep))
  }

  endSweepTransition(e) {
    const t = this.data.transition.from
    const n = this.data.getSweep(e.sweepId)
    this.data.deactivateTransition()
    this.data.currentSweep = e.sweepId
    this.data.transition.progress.stop(1)
    this.internalProgress = !1
    this.data.commit()
    this.engine.broadcast(new EndMoveToSweepMessage(e.sweepId, n.alignmentType, n.placementType, t))
  }

  async defaultSweepCameraMove(e, t) {
    const n = {
      position: this.data.getSweep(t.sweepId).position,
      rotation: t.rotation
    }
    const i = makePerspectiveFov(this.cameraData.aspect())
    let s = TransitionTypeList.Interpolate
    if (t.transitionType && TransitionTypeList[t.transitionType]) {
      s = t.transitionType
    }
    if (this.data.isSweepUnaligned(t.sweepId) || this.data.isSweepUnaligned(this.data.currentSweep!)) {
      s = TransitionTypeList.FadeToBlack
    }

    const r = this.cameraModule.moveTo({
      transitionType: s,
      pose: n,
      transitionTime: t.transitionTime,
      transitionSpeedMultiplier: t.transitionSpeedMultiplier,
      projection: i,
      easing: t.easing,
      rotationDelay: t.rotationDelay
    })
    let l = !1
    return (
      r.progress(n => {
        if (this.data.transition.progress.updateProgress(n)) {
          e.notify(n)
        }
        if (n >= 0.5 && !l) {
          l = !0
          const e = this.data.currentSweep
          this.data.currentSweep = t.sweepId
          this.data.commit()
          this.engine.broadcast(new SweepDataMessage(t.sweepId, e))
        }
      }),
      r.nativePromise()
    )
  }

  filterSweepData(e: Record<string, SweepObject>) {
    for (const t in e) {
      const n = e[t]
      n.neighbours = n.neighbours.filter(t => t in e)
    }
  }

  onUpdate(e: number) {
    this.internalProgress && this.data.transition.active && this.data.transition.progress.tick(e)
  }

  dispose(e) {
    super.dispose(e)
    const t = this?.store
    t?.dispose?.call(t)
  }

  async save() {
    if (!this.store || !this.monitor) throw Error("No store configured for saving sweep edits!")
    const e = this.monitor.getDiffRecord()
    this.monitor.clearDiffRecord()
    const t = e
      .filter(e => e.action === DiffState.updated)
      .map(e => {
        const t = this.data.getSweep(e.index)
        const n = Object.assign(
          {
            id: e.index
          },
          e.diff
        )
        return (
          ("position" in n || "rotation" in n) && ((n.position = t.position), (n.rotation = t.rotation)),
          ("enabled" in n || "vrenabled" in n) && ((n.enabled = t.enabled), (n.vrenabled = t.vrenabled)),
          n
        )
      })
    return this.store.update(t)
  }
}
