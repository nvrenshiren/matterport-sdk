import { Mesh } from "three"
import { PickingPriorityType } from "../const/12529"
import * as r from "../const/53203"
import { RoomMesh } from "./roomMesh"
export class DepthPassRoomMesh extends Mesh {
  roomMesh: RoomMesh
  excludeFromOctree: boolean
  constructor(e: RoomMesh) {
    super()
    this.roomMesh = e
    this.excludeFromOctree = !0
    this.layers.mask = e.layers.mask
    this.name = `DepthPassRoomMesh:${e.meshGroup}-${e.meshSubgroup}`
    this.renderOrder = PickingPriorityType.ghostFloorDepthPrepass
    this.visible = !1
    this.roomMesh.onOpacityUpdate = e => {
      this.visible = e < r.xx.FADE_OPAQUE
    }
    this.roomMesh.onBuild = () => {
      this.geometry = this.roomMesh.geometry
      this.material = this.roomMesh.material
    }
    this.roomMesh.onMaterialUpdate = () => {
      this.material = this.roomMesh.material
    }
    let t = !0,
      i = !0
    this.onBeforeRender = (e, s, o, r, n, a) => {
      this.roomMesh.updateUniforms(n, a)
      t = n.colorWrite
      i = n.depthWrite
      n.colorWrite = !1
      n.depthWrite = !0
    }
    this.onAfterRender = (e, s, o, r, n, a) => {
      n.colorWrite = t
      n.depthWrite = i
    }
  }
}
