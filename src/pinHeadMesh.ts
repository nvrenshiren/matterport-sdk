import * as a from "./math/81729"
import * as r from "./const/84958"
import { PickingPriorityType } from "./const/12529"
import { Mesh, MeshBasicMaterial, Vector3 } from "three"
import { calculateCameraCollisionResponse } from "./math/81729"
import { PinConfig } from "./const/84958"
import {Color} from 'three'
export class PinHeadMesh extends Mesh {
  geomScale: Vector3
  worldPosition: Vector3
  constructor(e, t, n, r) {
    super(t, n)
      //根据图片尺寸来
      this.geomBaseScale = new Vector3(1, 1, 1)
      this.geomScale = new Vector3(1, 1, 1)
      this.userData.sid = e
      this.worldPosition = new Vector3()
      this.layers.mask = r.mask
      this.renderOrder = PickingPriorityType.pins
      this.scale.set(0.01, 0.01, 0.01)
  }
  dispose() {
    this.material.dispose()
    this.geometry.dispose()
  }
  updatePosition(e) {
    this.position.copy(e.stemNormal).setLength(Math.max(e.stemLength, 0.01))
  }
  update(e, t, n,parent) {
    //缩放大小
    this.geomScale.set(parent.geomBaseScale.x*parent.iconSize||1,parent.geomBaseScale.y*parent.iconSize||1,parent.geomBaseScale.z||1)
    this.quaternion.copy(e.quaternion)
    const i = PinConfig.pinHeadMesh.scale
    this.getWorldPosition(this.worldPosition)
    const s = calculateCameraCollisionResponse(this.worldPosition, e, t, n, i)
    this.scale.set(s * this.geomScale.x, s * this.geomScale.y, s * this.geomScale.z)
    this.updatePosition(parent)

    //更新颜色
    if(this.material){
      this.material.color = new Color(parent.color)
    }
  }
}
