import { fileCommon, functionCommon, requestCommon } from "@ruler3d/common"
import { DeleteSnapshotCommand, RenameSnapshotCommand, SetCurrentSnapshotPhotoCommand, UploadSnapshotCommand } from "../command/snapshot.command"
import { SnapshotCategory } from "../const/50090"
import { SnapshotsDataSymbol } from "../const/symbol.const"
import { snapshotType, viewModesType } from "../const/typeString.const"
import EngineContext from "../core/engineContext"
import { MdsStore } from "../core/mds.store"
import { Module } from "../core/module"
import { FloorsData } from "../data/floors.data"
import { LayersData } from "../data/layers.data"
import { SnapshotsData } from "../data/snapshots.data"
import { SweepsData } from "../data/sweeps.data"
import { VisionParase } from "../math/2569"
import { GalleryImageAddMessage } from "../message//snapshot.message"
import { SnapshotObject } from "../object/snapshot.object"
import { QuaternionToJson, Vector3ToJson } from "../other/59296"
import { SnapshotDeserializer } from "../parser/snapshotDeserializer"
import { randomUUID } from "../utils/random.utils"
import { ViewModes } from "../utils/viewMode.utils"
import GetSnapshots from "../test/GetSnapshots"

declare global {
  interface SymbolModule {
    [SnapshotsDataSymbol]: SnapshotsDataModule
  }
}
const m = {
  [ViewModes.Dollhouse]: viewModesType.DOLLHOUSE,
  [ViewModes.Floorplan]: viewModesType.FLOORPLAN,
  [ViewModes.Panorama]: viewModesType.PANORAMA,
  [ViewModes.Outdoor]: viewModesType.PANORAMA,
  [ViewModes.Transition]: viewModesType.MESH,
  [ViewModes.Orthographic]: viewModesType.MESH,
  [ViewModes.Mesh]: viewModesType.MESH
}

export class SnapshotsSerialize {
  constructor() {}

  serialize(e: SnapshotObject, t: { floorsData: FloorsData }) {
    const n: string[] = []
    for (const [i, s] of e.metadata.floorVisibility.entries())
      if (1 === s) {
        const e = t.floorsData.getFloorAtIndex(i)
        e && n.push(e.id)
      }
    return {
      label: e.name,
      contents: {
        filename: `${e.name}.jpg`,
        blob: e.imageBlob
      },
      snapshotLocation: {
        anchorId: e.metadata.scanId,
        visibleFloorIds: n,
        position: Vector3ToJson(VisionParase.toVisionVector(e.metadata.cameraPosition)),
        rotation: QuaternionToJson(VisionParase.toVisionCameraQuaternion(e.metadata.cameraQuaternion)),
        viewMode: m[e.metadata.cameraMode],
        zoom: e.metadata.cameraMode === ViewModes.Floorplan ? e.metadata.orthoZoom : e.metadata.ssZoom
      },
      photoType: e.category === SnapshotCategory.PANORAMA ? snapshotType.EQUIRECTANGULAR : snapshotType.PHOTO2D
    }
  }
}

class SnapshotsStore extends MdsStore {
  deserializer: SnapshotDeserializer
  serializer: SnapshotsSerialize

  constructor(e) {
    super(...arguments)
    this.deserializer = new SnapshotDeserializer()
    this.serializer = new SnapshotsSerialize()
    this.prefetchKey = "data.model.assets.photos"
  }

  async read(e?) {
    const { readonly } = this.config
    const t = {
      modelId: this.getViewId()
    }
    const data = await GetSnapshots(t.modelId, !readonly)
    if (!data) return {}
    const s = data.map(e => this.deserializer.deserialize(e))
    const r: Record<string, SnapshotObject> = {}
    for (const e of s) e && (r[e.sid] = e)
    return r
  }

  async refresh() {
    return super.refresh({
      fetchPolicy: "no-cache"
    })
  }

  //@ts-ignore
  async create(
    e: SnapshotObject,
    t: {
      floorsData: FloorsData
    }
  ) {
    const n = this.getBaseViewId()
    const i = e.category === SnapshotCategory.TOUR

    const a = this.serializer.serialize(e, t)
    const formData = new FormData()
    formData.append("file", fileCommon.blobToFile(a.contents.blob, a.contents.filename))
    formData.append("businessType", "19")
    const {
      data: { fileSaveUrl }
    } = await requestCommon.post<any>({
      url: `${functionCommon.requestHost("api")}/v1/m/file`,
      params: formData,
      headers: {
        "Content-Type": "multipart/form-data;"
      }
    })
    return this.deserializer.deserialize({
      id: randomUUID(),
      label: a.label,
      classification: null,
      category: "tour",
      height: e.height,
      width: e.width,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      status: "available",
      filename: a.contents.filename,
      format: "image",
      url: fileSaveUrl,
      resolutions: ["icon", "thumbnail", "preview", "web", "presentation", "original"],
      type: "photo2D",
      origin: "user",
      validUntil: new Date("2099").toISOString(),
      thumbnailUrl: fileSaveUrl,
      presentationUrl: fileSaveUrl,
      snapshotLocation: {
        viewMode: "panorama",
        position: a.snapshotLocation.position,
        rotation: a.snapshotLocation.rotation,
        zoom: 1,
        floorVisibility: [
          {
            id: a.snapshotLocation.visibleFloorIds[0],
            meshId: t.floorsData.getFloor(a.snapshotLocation.visibleFloorIds[0]).meshGroup,
            sequence: t.floorsData.getFloor(a.snapshotLocation.visibleFloorIds[0]).index
          }
        ],
        anchor: {
          id: a.snapshotLocation.anchorId,
          pano: {
            id: a.snapshotLocation.anchorId,
            placement: "auto"
          }
        }
      }
    })
    // return this.client
    //   .upload(
    //     r,
    //     s,
    //     Object.assign(Object.assign({}, a), {
    //       modelId: n
    //     })
    //   )
    //   .then(e => {
    //     return this.deserializer.deserialize(e?.data?.snapshot)
    //   })
  }

  async update(e) {
    const n = this.getBaseViewId()
    // const i = (
    //   await this.client.mutate(o.PatchPhoto, {
    //     modelId: n,
    //     photoId: e.sid,
    //     label: e.name
    //   })
    // )?.data?.patchPhoto
    //pw
    const i = {}
    return this.deserializer.deserialize(i)
  }

  async delete(e) {
    const n = this.getBaseViewId()
    // return (
    //   (
    //     await this.client.mutate(o.DeletePhoto, {
    //       modelId: n,
    //       photoId: e
    //     })
    //   )?.data?.deletePhoto || !1
    // )
    return Promise.resolve(!0)
  }
}

export default class SnapshotsDataModule extends Module {
  engine: EngineContext
  store: SnapshotsStore
  sweepData: SweepsData
  snapshotsData: SnapshotsData

  constructor() {
    super(...arguments)
    this.name = "snapshots-data"
  }

  async init(e, t: EngineContext) {
    const { readonly, baseUrl, baseModelId } = e
    this.engine = t
    const o = await t.market.waitForData(LayersData)
    this.store = new SnapshotsStore({
      context: o.mdsContext,
      readonly,
      baseUrl,
      viewId: baseModelId
    })
    const l = (await this.store.read()) || {}

    this.sweepData = await t.market.waitForData(SweepsData)
    for (const e in l) this.processSnapshot(l[e])

    this.snapshotsData = new SnapshotsData(l)
    this.snapshotsData.onStale = () => this.store.read()
    t.market.register(this, SnapshotsData, this.snapshotsData)
    if (!readonly) {
      this.bindings.push(
        t.commandBinder.addBinding(UploadSnapshotCommand, ({ snapshot: e }) => this.uploadSnapshot(e)),
        t.commandBinder.addBinding(RenameSnapshotCommand, ({ id: e, name: t }) => this.renameSnapshot(e, t)),
        t.commandBinder.addBinding(DeleteSnapshotCommand, ({ id: e }) => this.deleteSnapshot(e)),
        t.commandBinder.addBinding(SetCurrentSnapshotPhotoCommand, ({ id: e }) => this.setSelectedPhoto(e))
      )
    }
  }

  async setSelectedPhoto(e: string) {
    this.snapshotsData.setSelectedPhoto(e)
  }

  async uploadSnapshot(e: SnapshotObject) {
    const t = await this.engine.market.waitForData(FloorsData)
    const n = await this.store.create(e, {
      floorsData: t
    })
    if (n) {
      this.processSnapshot(n)
      this.snapshotsData.add(n)
      this.engine.broadcast(new GalleryImageAddMessage(n))
    }
    return n
  }

  async renameSnapshot(e, t) {
    const n = this.snapshotsData.get(e)
    if (t !== n.name) return (n.name = t), n.commit(), this.snapshotsData.commit(), this.store.update(n)
  }

  async deleteSnapshot(e) {
    ;(await this.store.delete(e).catch(t => {
      this.log.debug(t), this.log.error(`Failed to delete snapshot ${e}`)
    })) && (this.snapshotsData.remove(e), this.snapshotsData.commit())
  }

  processSnapshot(e: SnapshotObject) {
    const t = e.metadata.cameraMode === ViewModes.Panorama
    const n = !this.sweepData.isSweepAligned(e.metadata.scanId)
    e.is360 = t && n
    if (t) {
      const t = this.sweepData.getSweep(e.metadata.scanId!)
      t && e.metadata.cameraPosition.copy(t.position)
    }
    e.name.match(/^[0-9.]+_[0-9.]+$/) && (e.name = ""), e.commit()
  }
}
