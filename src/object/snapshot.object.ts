import { Quaternion, Vector3 } from "three"
import { ExpiringResource } from "../utils/expiringResource"
import { SnapshotCategory } from "../const/50090"
import { ObservableObject } from "../observable/observable.object"
import { ViewModes } from "../utils/viewMode.utils"
import { UploadState } from "../modules/snapshotsEditor.module"
export class SnapshotObject extends ObservableObject {
  category: SnapshotCategory
  sid: string
  thumbnailUrl: ExpiringResource
  imageUrl: ExpiringResource
  name: string
  is360: boolean
  height: number
  width: number
  created: Date
  modified: Date
  visionLabel: string
  visionName: string
  imageBlob: Blob
  metadata: {
    cameraMode: ViewModes
    cameraPosition: Vector3
    cameraQuaternion: Quaternion
    scanId?: string
    orthoZoom: number
    ssZoom: number
    floorId: string | null
    floorVisibility: number[]
  }
  state: UploadState
  constructor() {
    super()
    this.category = SnapshotCategory.USER
  }
  clone() {
    return new SnapshotObject().copy(this)
  }
  copy(e: SnapshotObject) {
    this.sid = e.sid
    this.thumbnailUrl = e.thumbnailUrl
    this.imageUrl = e.imageUrl
    this.name = e.name
    this.is360 = e.is360
    this.category = e.category
    this.height = e.height
    this.width = e.width
    this.created = e.created
    this.modified = e.modified
    this.visionLabel = e.visionLabel
    this.visionName = e.visionName
    this.imageBlob = e.imageBlob
    this.metadata = {
      cameraMode: e.metadata.cameraMode,
      cameraPosition: e.metadata.cameraPosition.clone(),
      cameraQuaternion: e.metadata.cameraQuaternion.clone(),
      scanId: e.metadata.scanId,
      orthoZoom: e.metadata.orthoZoom,
      ssZoom: e.metadata.ssZoom,
      floorId: e.metadata.floorId,
      floorVisibility: e.metadata.floorVisibility
    }
    this.commit()
    return this
  }
  isInsidePano() {
    return this.metadata.cameraMode === ViewModes.Panorama && "" !== this.metadata.scanId
  }
  refresh(e: SnapshotObject) {
    this.thumbnailUrl.refreshFrom(e.thumbnailUrl)
    this.imageUrl.refreshFrom(e.imageUrl)
  }
}
