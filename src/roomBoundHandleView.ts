import { BufferGeometry, Float32BufferAttribute, MathUtils, RawShaderMaterial, UniformsUtils } from "three"
import * as o from "./const/25869"
import * as h from "./const/82403"
import { ColorSpace } from "./const/color.const"
import * as d from "./math/81729"
import { RoomBoundViewMesh } from "./roomBoundViewMesh"
import { easeOutQuad } from "./utils/ease.utils"
import * as n from "./webgl/3297"
import { calculateWorldUnitsFromScreenWidth } from "./math/81729"
const u = {
  baseState: { opacity: 1, innerColor: ColorSpace.MIRROR, outerColor: ColorSpace.PORTAL },
  hoverState: { opacity: 1, innerColor: ColorSpace.MIRROR, outerColor: ColorSpace.PORTAL },
  selectState: { opacity: 1, innerColor: ColorSpace.MP_BRAND, outerColor: ColorSpace.WHITE },
  dimState: { opacity: 1, innerColor: ColorSpace.MIRROR, outerColor: ColorSpace.PORTAL }
}
class HandleMaterial extends RawShaderMaterial {
  constructor() {
    super({
      fragmentShader: n.pr.fragmentShader,
      vertexShader: n.pr.vertexShader,
      uniforms: UniformsUtils.clone(n.pr.uniforms),
      name: "HandleMaterial",
      transparent: !0,
      depthTest: !1,
      extensions: { derivatives: !0 }
    })
  }
}
export class RoomBoundHandleView extends RoomBoundViewMesh {
  constructor(t, e, i) {
    const a = new Float32Array([-1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1]),
      r = new BufferGeometry()
    r.setAttribute("position", new Float32BufferAttribute(a, 3)),
      r.setIndex([0, 2, 1, 0, 3, 2]),
      super(t, r, new HandleMaterial(), e),
      (this.roomBoundViewData = i),
      (this.targetRadius = 0.3),
      (this.prevRadius = 0.3),
      (this.renderOrder = o.o.NODE),
      (this.colors = u),
      this.animation.onChanged(() => this.onAnimationChange()),
      (this.onBeforeRender = () => {
        this.material.uniforms.opacity.value = this.opacity * (1 - this.pitchFactor) * Number(this.roomBoundViewData.roomWallsVisible)
      })
  }
  onAnimationChange() {
    const t = this.prevColorState,
      e = this.targetColorScheme
    this.material.uniforms.outlineColor.value.lerpColors(t.outerColor, e.outerColor, this.animation.value),
      this.material.uniforms.baseColor.value.lerpColors(t.innerColor, e.innerColor, this.animation.value),
      (this.opacity = MathUtils.lerp(t.opacity, e.opacity, this.animation.value))
    const i = MathUtils.lerp(this.prevRadius, this.targetRadius, this.animation.value)
    this.setRadius(i)
  }
  setPitchFactor(t) {
    super.setPitchFactor(t), (this.visible = this.pitchFactor < 1)
  }
  raycast(t, e) {
    const i = []
    if ((super.raycast(t, i), i.length > 0)) {
      const s = i[0].point,
        o = t.ray.origin.distanceTo(this.position),
        a = calculateWorldUnitsFromScreenWidth(o, this.cameraData.pose.projection.asThreeMatrix4(), this.cameraData.width),
        r = h.Nh * a
      s.distanceTo(this.position) < h.pp + r && e.push(i[0])
    }
  }
  updateMaterial() {
    ;(this.prevRadius = this.material.uniforms.radius.value),
      (this.targetRadius = h.pp + (this.hoverState.active ? h.XG : 0) + (this.selectState.active ? h.XG : 0)),
      super.updateMaterial(),
      this.prevColorState.innerColor.copy(this.material.uniforms.baseColor.value),
      this.prevColorState.outerColor.copy(this.material.uniforms.outlineColor.value),
      (this.prevColorState.opacity = this.material.opacity),
      this.animation.modifyAnimation(0, 1, h.rP, easeOutQuad)
  }
  setRadius(t) {
    this.material.uniforms.radius.value = t
  }
  updatePosition(t) {
    this.position.copy(t)
  }
}
