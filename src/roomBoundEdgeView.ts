import {
  AlwaysStencilFunc,
  BufferGeometry,
  Float32BufferAttribute,
  GreaterStencilFunc,
  KeepStencilOp,
  Line3,
  MathUtils,
  Mesh,
  RawShaderMaterial,
  ReplaceStencilOp,
  UniformsUtils,
  Vector2,
  Vector3
} from "three"
import * as o from "./math/19098"
import * as u from "./webgl/3297"
import * as r from "./math/81729"
import * as c from "./const/25869"
import * as d from "./const/82403"
import { ColorSpace } from "./const/color.const"
import { RoomBoundViewMesh } from "./roomBoundViewMesh"
import * as n from "./utils/ease.utils"
import { easeOutQuad } from "./utils/ease.utils"
import { calculateWorldUnitsFromScreenWidth } from "./math/81729"
import { calculateWallNeighborsVectors } from "./math/19098"
const p = {
  baseState: { innerColor: ColorSpace.WHITE, outerColor: ColorSpace.WHITE, opacity: 1 },
  hoverState: { innerColor: ColorSpace.WHITE, outerColor: ColorSpace.NEPTUNE, opacity: 1 },
  selectState: { innerColor: ColorSpace.WHITE, outerColor: ColorSpace.NEPTUNE, opacity: 1 },
  dimState: { innerColor: ColorSpace.WHITE, outerColor: ColorSpace.WHITE, opacity: 0.5 },
  highlightState: { innerColor: ColorSpace.WHITE, outerColor: ColorSpace.NEPTUNE, opacity: 1 }
}
export class RoomBoundEdgeView extends RoomBoundViewMesh {
  constructor(t, e, i, h, m) {
    const f = new Float32Array([0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, -1, 0, 1, -1, 0, 0, 1, 0, 2, -1, 0, 2, -1, 0, -1, 1, 0, -1]),
      v = new BufferGeometry()
    v.setAttribute("position", new Float32BufferAttribute(f, 3)), v.setIndex([0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 3, 2, 6, 3, 7, 4, 0, 9, 1, 0, 5, 8])
    const g = new RawShaderMaterial({
      uniforms: UniformsUtils.clone(u.LD.uniforms),
      vertexShader: u.LD.vertexShader,
      fragmentShader: u.LD.fragmentShader,
      transparent: !0,
      depthTest: !1,
      stencilRef: 65535,
      stencilFuncMask: 1 << c.$.OPENINGS,
      stencilFail: KeepStencilOp,
      stencilZFail: KeepStencilOp,
      stencilZPass: KeepStencilOp,
      stencilFunc: GreaterStencilFunc,
      stencilWrite: !0,
      extensions: { derivatives: !0 }
    })
    super(t, v, g, e),
      (this.roomBoundViewData = i),
      (this.lineLabel = h),
      (this.isAddState = m),
      (this.line3 = new Line3(new Vector3(), new Vector3())),
      (this.widthCache = 0.1),
      (this.updateMaterial = () => {
        super.updateMaterial(), this.targetColorScheme !== p.highlightState || this.isAddState() || (this.targetColorScheme = p.baseState)
        const t = this.material.uniforms
        this.prevColorState.innerColor.copy(t.color.value),
          this.prevColorState.outerColor.copy(t.outlineColor.value),
          (this.prevColorState.opacity = t.opacity.value)
        const e = this.selectState.active || this.highlightState.active,
          i = this.hoverState.active
        ;(this.renderOrder = e || i ? c.o.HIGHLIGHTED_EDGE : c.o.EDGE),
          this.animation.modifyAnimation(0, 1, d.rP, easeOutQuad),
          this.lineLabel.setVisible(this.selectState.active || this.highlightState.active || this.hoverState.active)
      }),
      (this.raycast = (() => {
        const t = new Vector3(),
          e = new Vector2(),
          i = new Vector2()
        return (s, o) => {
          const a = this.line3.closestPointToPoint(s.ray.origin, !0, t)
          e.set(a.x, a.z), i.set(s.ray.origin.x, s.ray.origin.z)
          const n = e.distanceTo(i),
            c = s.ray.origin.distanceTo(this.line3.start),
            h = calculateWorldUnitsFromScreenWidth(c, this.cameraData.pose.projection.asThreeMatrix4(), this.cameraData.width),
            u = d.Nh * h
          n < 0.5 * Math.max(this.widthCache, d.ZT) + u &&
            o.push({ distance: c, object: this, point: a.clone(), face: { a: -1, b: -1, c: -1, materialIndex: -1, normal: new Vector3(0, 1, 0) } })
        }
      })()),
      (this.onEdgePositionChanged = (() => {
        const t = new Vector3(),
          e = new Vector3(),
          i = new Vector3(),
          s = new Vector3(),
          a = new Vector3(),
          r = new Vector3(),
          n = new Vector3()
        return (l, c, h) => {
          const d = l.getWall(this.roomBoundsId)
          d.from.getVec3(t), d.to.getVec3(e)
          const u = this.geometry.getAttribute("position")
          d.getBiasAdjustmentVec(n),
            i.set(t.x, t.y + c, t.z),
            s.set(e.x, e.y + c, e.z),
            a.addVectors(i, n),
            r.addVectors(s, n),
            this.line3.start.copy(a),
            this.line3.end.copy(r),
            this.material.uniforms.lineStart.value.copy(a),
            this.material.uniforms.lineEnd.value.copy(r),
            (this.material.uniforms.width.value = d.width),
            this.stencilMat.uniforms.lineStart.value.copy(a),
            this.stencilMat.uniforms.lineEnd.value.copy(r),
            (this.stencilMat.uniforms.width.value = d.width),
            (this.widthCache = d.width),
            this.lineLabel.updateDimensions(a, r, d.width, h),
            u.setXYZ(0, i.x, i.y, i.z),
            u.setXYZ(3, s.x, s.y, s.z)
          const { fromLeft: p, fromRight: m, toLeft: f, toRight: v } = calculateWallNeighborsVectors(d, l)
          u.setXYZ(1, m.primary.x, m.primary.y + c, m.primary.z),
            u.setXYZ(2, v.primary.x, v.primary.y + c, v.primary.z),
            u.setXYZ(4, f.primary.x, f.primary.y + c, f.primary.z),
            u.setXYZ(5, p.primary.x, p.primary.y + c, p.primary.z),
            u.setXYZ(9, m.bevel.x, m.bevel.y + c, m.bevel.z),
            u.setXYZ(6, v.bevel.x, v.bevel.y + c, v.bevel.z),
            u.setXYZ(7, f.bevel.x, f.bevel.y + c, f.bevel.z),
            u.setXYZ(8, p.bevel.x, p.bevel.y + c, p.bevel.z),
            (u.needsUpdate = !0),
            this.geometry.computeBoundingBox(),
            this.geometry.computeBoundingSphere()
        }
      })()),
      (this.renderOrder = c.o.EDGE),
      this.geometry.computeBoundingBox(),
      this.geometry.computeBoundingSphere(),
      (this.colors = p),
      (this.material.uniforms.selectedWidth.value = 0.03)
    const y = g.clone()
    ;(y.stencilRef = 65535),
      (y.stencilFuncMask = 1 << c.$.OPENINGS),
      (y.stencilWriteMask = 1 << c.$.EDGE),
      (y.stencilFail = KeepStencilOp),
      (y.stencilZFail = KeepStencilOp),
      (y.stencilZPass = ReplaceStencilOp),
      (y.stencilFunc = AlwaysStencilFunc),
      (y.stencilWrite = !0),
      (y.colorWrite = !1),
      (this.stencilMat = y)
    const b = new Mesh(this.geometry, this.stencilMat)
    ;(b.renderOrder = c.o.EDGE_STENCIL), (this.stencilMesh = b)
    const x = ColorSpace.WHITE.clone()
    this.animation.onChanged(() => {
      const t = this.prevColorState,
        e = this.targetColorScheme
      this.material.uniforms.outlineColor.value.lerpColors(t.outerColor, e.outerColor, this.animation.value)
      this.material.uniforms.color.value.lerpColors(t.innerColor, e.innerColor, this.animation.value)
      const i = MathUtils.lerp(t.opacity, e.opacity, this.animation.value)
      ;(this.opacity = i), x.copy(ColorSpace.WHITE).multiplyScalar(this.opacity)
    }),
      (this.onBeforeRender = () => {
        ;(this.material.depthTest = 1 === this.pitchFactor),
          (this.material.uniforms.opacity.value = (1 - this.pitchFactor) * this.opacity * Number(this.roomBoundViewData.roomWallsVisible)),
          this.lineLabel.update()
      })
  }
  tickAnimations(t) {
    super.tickAnimations(t), this.lineLabel.tickAnimations(t)
  }
  setLabelVisible(t) {
    this.lineLabel.setVisible(t)
  }
  dispose() {
    super.dispose(), this.lineLabel.dispose()
  }
}
