import { AlwaysStencilFunc, BoxGeometry, RawShaderMaterial, ReplaceStencilOp, UniformsUtils, Vector3 } from "three"
import * as n from "../const/25869"
import * as d from "../const/82403"
import { ColorSpace } from "../const/color.const"
import { RoomBoundHandleView } from "../roomBoundHandleView"
import { RoomBoundViewMesh } from "../roomBoundViewMesh"
import { easeOutQuad } from "../utils/ease.utils"
import * as c from "./3297"
import { RelativePosType } from "./80978"
class u extends RawShaderMaterial {
  constructor() {
    super({
      fragmentShader: c.z6.fragmentShader,
      vertexShader: c.z6.vertexShader,
      uniforms: UniformsUtils.clone(c.z6.uniforms),
      name: "OpeningMaterial",
      depthTest: !1,
      transparent: !0,
      stencilFunc: AlwaysStencilFunc,
      stencilWrite: !1
    })
  }
}
const p = new BoxGeometry(1, 1, 1)
class m extends RoomBoundViewMesh {
  constructor(t, e, i, o) {
    super(t, p.clone(), new u(), i),
      (this.floorId = e),
      (this.roomBoundViewData = o),
      (this.onEdgePositionChanged = (() => {
        const t = new Vector3()
        return (e, i, s, o) => {
          t.subVectors(i, e), this.scale.set(t.length(), 0.05, s), this.stencilPrepass && this.stencilPrepass.scale.set(t.length(), 0.05, s)
          const a = Math.atan2(i.x - e.x, i.z - e.z) + Math.PI / 2
          ;(this.rotation.y = a), this.stencilPrepass && (this.stencilPrepass.rotation.y = a)
          const r = t.addVectors(i, e).multiplyScalar(0.5)
          this.position.copy(r), this.stencilPrepass && this.stencilPrepass.position.copy(r), this.startHandle.position.copy(e), this.endHandle.position.copy(i)
          const n = o === RelativePosType.DOOR ? 1 : 0
          ;(this.material.uniforms.isDoor.value = n), this.stencilPrepass && (this.stencilPrepass.material.uniforms.isDoor.value = n)
        }
      })()),
      (this.renderOrder = n.o.OPENING_LINES),
      (this.startHandle = new y(t, i, o, this)),
      (this.endHandle = new b(t, i, o, this)),
      this.animation.onChanged(() => {
        this.material.uniforms.baseColor.value.lerpColors(ColorSpace.WHITE, ColorSpace.NEPTUNE, this.animation.value)
      })
  }
  setPitchFactor(t) {
    super.setPitchFactor(t),
      (this.visible = this.pitchFactor < 1 && this.roomBoundViewData.roomWallsVisible),
      this.startHandle.setPitchFactor(t),
      this.endHandle.setPitchFactor(t),
      this.stencilPrepass && this.stencilPrepass.setPitchFactor(t)
  }
  updateMaterial() {
    const t = this.selectState.active || this.hoverState.active || this.highlightState.active
    this.animation.modifyAnimation(this.animation.value, t ? 1 : 0, d.rP, easeOutQuad)
  }
  tickAnimations(t) {
    super.tickAnimations(t), this.startHandle.tickAnimations(t), this.endHandle.tickAnimations(t)
  }
}
export class RoomBoundOpeningView extends m {
  constructor(t, e, i, s) {
    super(t, e, i, s), (this.floorId = e), (this.stencilPrepass = new v(t, e, i, s))
  }
}
class v extends m {
  constructor(t, e, i, s) {
    super(t, e, i, s),
      (this.floorId = e),
      (this.renderOrder = n.o.OPENING_STENCIL),
      (this.material.colorWrite = !1),
      (this.material.stencilRef = 65535),
      (this.material.stencilFuncMask = 1 << n.$.OPENINGS),
      (this.material.stencilWriteMask = 1 << n.$.OPENINGS),
      (this.material.stencilFail = ReplaceStencilOp),
      (this.material.stencilZFail = ReplaceStencilOp),
      (this.material.stencilZPass = ReplaceStencilOp),
      (this.material.stencilFunc = AlwaysStencilFunc),
      (this.material.stencilWrite = !0)
  }
  raycast(t, e) {}
}
export class RoomBoundOpeningHandleView extends RoomBoundHandleView {
  constructor(t, e, i, s) {
    super(t, e, i), (this.parentOpeningView = s)
  }
}
export class RoomBoundStartHandleView extends RoomBoundOpeningHandleView {}
export class RoomBoundEndHandleView extends RoomBoundOpeningHandleView {}
