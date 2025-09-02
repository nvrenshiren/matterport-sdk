import { Quaternion, Vector3 } from "three"
import * as p from "../math/2569"
import * as u from "../other/45059"
import * as v from "../64927"
import * as o from "../utils/nav.urlParam"
import { SetCameraStartCommand, SetMoveCameraOnViewChangeCommand } from "../command/camera.command"
import { RegisterDuplicateViewHelperCommand, UnregisterDuplicateViewHelperCommand } from "../command/layers.command"
import { SaveCommand } from "../command/save.command"
import { DataType } from "../const/79728"
import { CameraStartSymbol, StorageSymbol } from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import EngineContext from "../core/engineContext"
import { MdsStore } from "../core/mds.store"
import { Module } from "../core/module"
import { CamStartData, DeepLinkPose } from "../data/camstart.data"
import { LayersData } from "../data/layers.data"
import { SnapshotsData } from "../data/snapshots.data"
import { StartLocationViewData } from "../data/start.location.view.data"
import { SweepsData } from "../data/sweeps.data"
import { ExpiringResource } from "../utils/expiringResource"
import { StartLocationCreatedMessage } from "../message/startlocation.message"
import { SnapshotObject } from "../object/snapshot.object"
import { SnapshotDeserializer } from "../parser/snapshotDeserializer"
import { PanoramaOrMesh, ViewModes } from "../utils/viewMode.utils"
import StorageModule from "./storage.module"
import GetModelImage from "../test/GetModelImage"
import GetStartLocations from "../test/GetStartLocations"
import { NavURLParam } from "../utils/nav.urlParam"
import { createRotationMatrixFromQuaternion } from "../math/2569"
declare global {
  interface SymbolModule {
    [CameraStartSymbol]: CameraStartModule
  }
}
class E {
  serialize(e) {
    return {
      image: e.sid
    }
  }
}

const debug = new DebugInfo("mds-camera-start-store")

class O extends MdsStore {
  baseModelId: any
  deserializer: SnapshotDeserializer
  serializer: E
  prefetchKey: string
  constructor(e, t) {
    super(e)
    this.baseModelId = t
    this.deserializer = new SnapshotDeserializer()
    this.serializer = new E()
    this.prefetchKey = "data.model.image"
  }

  async read(e) {
    const { readonly } = this.config
    const i = {
      modelId: this.getViewId()
    }
    //pw
    // const s = await this.query(v.GetModelImage, i, e)
    // const r = s?.data?.model?.image
    const r = await GetModelImage(i.modelId, !readonly)
    return {
      image: r?.id || "",
      snapshot: this.deserializer.deserialize(r)
    }
  }

  async update(e) {
    const t = this.getViewId()
    const n = this.serializer.serialize(e)
    if (0 === Object.keys(n).length) throw new Error("No data to update?")
    return Promise.resolve()
  }

  async getStartLocationSweeps() {
    const { readonly } = this.config
    const n = {
      modelId: this.baseModelId
    }
    //pw
    // const e = (
    //   await this.query(v.GetStartLocations, n, {
    //     fetchPolicy: "no-cache"
    //   })
    // )?.data
    // const i = e?.model?.views
    const i = await GetStartLocations(n.modelId, !readonly)
    const s: Array<{ viewId: string; sweepId: string }> = []
    if (i) {
      i.forEach(one => {
        const r = one.model.image.snapshotLocation.anchor.id
        r &&
          s.push({
            viewId: one.id,
            sweepId: r
          })
      })
    }
    return s
  }
}

export default class CameraStartModule extends Module {
  store: O | null
  duplicateViewData: CamStartData
  sweepData: SweepsData
  data: CamStartData
  storage: StorageModule
  engine: EngineContext
  snapshotsData: SnapshotsData
  startLocationViewData: StartLocationViewData
  duplicateViewHelper: {
    beforeDuplicate: Function
    afterDuplicate: Function
  }
  processData: (e) => void
  beforeViewDuplicate: () => void
  afterViewDuplicate: () => void
  snapshotDataLoadPromise: Promise<void>

  constructor() {
    super(...arguments)
    this.name = "camera-start"
    this.store = null
    this.duplicateViewData = new CamStartData("", new ExpiringResource("", new Date()))
    this.processData = async e => {
      let s, a
      const o = e.image,
        l = e.snapshot

      if (l) {
        s = this.buildCameraStart(l)
        a = l.thumbnailUrl
      } else {
        if (o) {
          await this.snapshotDataLoadPromise
          s = this.getIconStartPose(o) ? this.getIconStartPose(o) : void 0
          a = this.getIconThumbnail(o)
        }
      }

      if (!s) {
        s = this.getStartFallback() ? this.getStartFallback() : void 0
      }

      if (s.pano.uuid) {
        const e = this.sweepData.getSweep(s.pano.uuid)

        if (e && !e.enabled) {
          this.log.warn(`Enabled hidden start sweep ${s.pano.uuid}`)
          e.enabled = !0
          e.commit()
        }
      }
      // if (
      //   (l
      //     ? ((s = this.buildCameraStart(l)), (a = l.thumbnailUrl))
      //     : o &&
      //     (await this.snapshotDataLoadPromise, (s = null !== (t = this.getIconStartPose(o)) && void 0 !== t ? t : void 0), (a = this.getIconThumbnail(o))),
      //   s || (s = null !== (n = this.getStartFallback()) && void 0 !== n ? n : void 0),
      //     null === (i = null == s ? void 0 : s.pano) || void 0 === i ? void 0 : i.uuid)
      // ) {
      //   const e = this.sweepData.getSweep(s.pano.uuid)
      //   e && !e.enabled && (this.log.warn(`Enabled hidden start sweep ${s.pano.uuid}`), (e.enabled = !0), e.commit())
      // }
      this.data.atomic(() => {
        this.data.icon = o
        if (a && this.data.thumb) {
          this.data.thumb.refreshFrom(a)
        } else {
          this.data.thumb = a
        }
        if (a) {
          a.onStale = async () => {
            await this?.store?.refresh()
          }
        }
        this.data.pose.copy(null != s ? s : new DeepLinkPose())
      })
      this.data.commit()
    }
    this.beforeViewDuplicate = async () => {
      this.duplicateViewData.copy(this.data, !0)
    }
    this.afterViewDuplicate = async () => {
      this.data.copy(this.duplicateViewData, !0)
      this.data.commit()
      await this.save()
    }
  }

  async init(e, t: EngineContext) {
    const { readonly, baseUrl, baseModelId } = e
    const { commandBinder, market } = t
    const [f, g, v] = await Promise.all([t.getModuleBySymbol(StorageSymbol), market.waitForData(SweepsData), market.waitForData(LayersData)])
    this.storage = f
    this.sweepData = g
    this.data = new CamStartData()
    this.engine = t
    this.snapshotDataLoadPromise = market.waitForData(SnapshotsData).then(e => {
      this.snapshotsData = e
    })
    const y = NavURLParam.deserialize()

    if (y) {
      const e = u.J(y, this.sweepData)
      u.l(e, this.sweepData)
        ? ((this.data.deepLinkPose = new DeepLinkPose()), this.data.deepLinkPose.copy(e), this.log.debug("Starting Camera Pose", this.data.deepLinkPose))
        : this.log.error("Invalid start pose", e)
    }
    this.bindings.push(
      commandBinder.addBinding(SetCameraStartCommand, async e => this.updateStartLocationFromSnapshot(e.snapshotSid)),
      commandBinder.addBinding(SetMoveCameraOnViewChangeCommand, async e => {
        this.data.moveCameraOnViewChange = e.moveCamera
        this.data.commit()
      })
    )
    this.store = new O(
      {
        context: v.mdsContext,
        readonly,
        baseUrl
      },
      baseModelId
    )
    this.store.onNewData(this.processData)
    await this.store.refresh()
    if (!readonly) {
      this.bindings.push(
        this.storage.onSave(() => this.save(), {
          dataType: DataType.START_LOCATION
        })
      )
    }

    this.duplicateViewHelper = {
      beforeDuplicate: this.beforeViewDuplicate,
      afterDuplicate: this.afterViewDuplicate
    }
    commandBinder.issueCommand(new RegisterDuplicateViewHelperCommand(this.duplicateViewHelper))
    t.market.register(this, CamStartData, this.data)
    this.startLocationViewData = new StartLocationViewData()

    readonly
      ? t.market.register(this, StartLocationViewData, this.startLocationViewData)
      : this.fetchAllStartLocations().then(() => {
          t.market.register(this, StartLocationViewData, this.startLocationViewData)
        })
  }

  dispose(e) {
    e.commandBinder.issueCommand(new UnregisterDuplicateViewHelperCommand(this.duplicateViewHelper))
  }

  async updateStartLocationFromSnapshot(e) {
    const t = this.snapshotsData.get(e)
    const n = this.buildCameraStart(t)
    const i = new CamStartData(t.sid, t.thumbnailUrl, n)
    this.data.copy(i, !0)
    this.data.commit()
    this.engine.broadcast(new StartLocationCreatedMessage(t.is360))
    await this.engine.commandBinder.issueCommand(
      new SaveCommand({
        dataTypes: [DataType.START_LOCATION]
      })
    )
  }

  async fetchAllStartLocations() {
    if (this.store) {
      const e = await this.store.getStartLocationSweeps()

      this.startLocationViewData.setStartLocations(e)
    }
  }

  async save() {
    const e = this.data.icon
    if (!e || !this.store) return void this.log.warn("Unable to save start location")
    const t = this.snapshotsData.get(e)
    this.store.update(t).then(() => {
      this.fetchAllStartLocations()
    })
  }

  buildCameraStart(e: SnapshotObject) {
    const t: {
      mode: ViewModes
      camera: {
        position?: Vector3
        rotation?: Quaternion
        zoom?: number
      }
      pano: {
        uuid?: string
      }
      floorVisibility?: number[]
    } = {
      mode: e.metadata.cameraMode,
      camera: {
        position: e.metadata.cameraPosition,
        rotation: e.metadata.cameraQuaternion,
        zoom: e.metadata.orthoZoom
      },
      pano: {}
    }
    if (PanoramaOrMesh(t.mode)) {
      t.pano = {
        uuid: e.metadata.scanId
      }
    }
    t["floorVisibility"] = e.metadata.floorVisibility
    return t
  }

  defaultCameraStart(e) {
    return {
      mode: ViewModes.Panorama,
      camera: {
        position: e.position,
        rotation: createRotationMatrixFromQuaternion(e.rotation),
        zoom: 0
      },
      pano: {
        uuid: e.id
      }
    }
  }

  getStartFallback() {
    const e = this.sweepData.getFirstAlignedSweep() || this.sweepData.getFirstSweep()
    return !e ? null : this.defaultCameraStart(e)
  }

  getIconStartPose(e) {
    let t: any = null
    if (e && e in this.snapshotsData.collection) {
      t = new DeepLinkPose().copy(this.buildCameraStart(this.snapshotsData.get(e)))
    }

    if (!u.l(t, this.sweepData)) {
      t = null
    }
    return t
  }

  getIconThumbnail(e) {
    if (e && e in this.snapshotsData.collection) return this.snapshotsData.get(e).thumbnailUrl
  }
}
