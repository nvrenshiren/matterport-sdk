import { Quaternion, Vector3 } from "three"
import { ExpiringResource } from "../utils/expiringResource"
import { Data } from "../core/data"
import { ViewModes } from "../utils/viewMode.utils"
export class CamStartData extends Data {
  name: string
  moveCameraOnViewChange: boolean
  icon?: string
  thumb?: ExpiringResource
  pose: DeepLinkPose
  deepLinkPose: DeepLinkPose
  constructor(e?: string, t?: ExpiringResource, n?) {
    super()
    this.name = "cam-start"
    this.moveCameraOnViewChange = !0
    this.icon = e
    this.thumb = t

    this.pose = new DeepLinkPose()
    n && this.pose.copy(n)
  }
  copy(e: CamStartData, t = !1) {
    this.icon = e.icon
    t ? e.thumb && this.thumb?.refreshFrom(e.thumb) : (this.thumb = e.thumb)
    this.pose.copy(e.pose)
    return this
  }
  getStartingPose() {
    return this.deepLinkPose || this.pose
  }
  get hasCameraPose() {
    return this.pose && this.pose.camera && void 0 !== this.pose.camera.position
  }
}
export class DeepLinkPose {
  mode: ViewModes
  camera: { position?: Vector3; rotation?: Quaternion; zoom?: number }
  pano: { uuid?: string }
  floorVisibility?: number[]
  constructor(e = ViewModes.Panorama, t?: Vector3, n?: Quaternion, s?: number, r?, a?) {
    this.mode = e
    this.camera = {
      position: t || void 0,
      rotation: n || void 0,
      zoom: s || void 0
    }
    this.pano = r || {
      uuid: void 0
    }
    this.floorVisibility = a || void 0
  }
  copy(e: { mode: ViewModes; camera: { position?: Vector3; rotation?: Quaternion; zoom?: number }; pano: { uuid?: string }; floorVisibility?: number[] }) {
    this.camera.position = copyVector(e.camera.position, this.camera.position)
    this.camera.rotation = copyEuler(e.camera.rotation, this.camera.rotation)
    this.camera.zoom = e.camera.zoom
    this.pano.uuid = e.pano.uuid ? e.pano.uuid.slice() : void 0
    this.mode = e.mode
    this.floorVisibility = e.floorVisibility ? e.floorVisibility.slice() : void 0
    return this
  }
}

const copyVector = (e?: Vector3, t?: Vector3) => (e && t ? t.copy(e) : e && !t ? e.clone() : void 0)
const copyEuler = (e?: Quaternion, t?: Quaternion) => (e && t ? t.copy(e) : e && !t ? e.clone() : void 0)
