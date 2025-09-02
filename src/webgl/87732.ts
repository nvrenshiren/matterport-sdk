import {
  AddEquation,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  DstColorFactor,
  Euler,
  Float32BufferAttribute,
  FrontSide,
  GreaterDepth,
  GreaterStencilFunc,
  Group,
  KeepStencilOp,
  LessDepth,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  NormalBlending,
  RawShaderMaterial,
  SrcAlphaFactor,
  UniformsUtils,
  Vector2,
  Vector3
} from "three"
import * as m from "../const/25869"
import * as S from "../const/28941"
import * as f from "../const/82403"
import { ColorSpace } from "../const/color.const"
import { calculateRectangleSize } from "../math/27990"
import { isPitchFactorOrtho } from "../math/59370"
import { isSegmentInsidePolygon } from "../math/65661"
import * as y from "../math/69877"
import * as r from "../math/81729"
import { RoomBoundViewMesh } from "../roomBoundViewMesh"
import { easeOutQuad } from "../utils/ease.utils"
import * as b from "./screen.line"
import * as v from "./3297"
import { calculateWorldUnitsFromScreenWidth } from "../math/81729"
import { isPointInPolygon } from "../math/69877"
import { DashUnits, ScreenLine } from "./screen.line"
function transformPoint(t, e, i) {
  const s = (function (t) {
    return (t / 180) * Math.PI
  })(e || 0)
  if (!i || (0 === i[0] && 0 === i[1])) return rotatePoint(t, s)
  return rotatePoint(
    t.map((t, e) => t - i[e]),
    s
  ).map((t, e) => t + i[e])
}
function rotatePoint(t, e) {
  return [t[0] * Math.cos(e) - t[1] * Math.sin(e), t[0] * Math.sin(e) + t[1] * Math.cos(e)]
}
function transformPoints(t, e, i) {
  let s = []
  for (let n = 0, o = t.length; n < o; n++) s[n] = transformPoint(t[n], e, i)
  return s
}
class w extends Mesh {
  constructor(t, e, i) {
    const s = new Float32Array([-1, 0, -1, 1, 1, 1, 1, 0]),
      n = new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]),
      o = new BufferGeometry()
    o.setAttribute("offset", new Float32BufferAttribute(s, 2)), o.setAttribute("normal", new Float32BufferAttribute(n, 3)), o.setIndex([0, 3, 1, 3, 2, 1])
    super(
      o,
      new RawShaderMaterial({
        uniforms: UniformsUtils.clone(v.Ud.uniforms),
        vertexShader: v.Ud.vertexShader,
        fragmentShader: v.Ud.fragmentShader,
        side: FrontSide,
        transparent: !0,
        depthTest: !1
      })
    ),
      this.updateState(t, e, i),
      (this.renderOrder = m.o.EDGE),
      (this.frustumCulled = !1),
      (this.onBeforeRender = t => {
        t.getSize(this.material.uniforms.screenSize.value)
      })
  }
  updateState(t, e, i) {
    this.material.uniforms.tip.value.copy(t), this.material.uniforms.normal.value.copy(e), (this.material.uniforms.height.value = i)
  }
  updateOpacity(t) {
    this.material.uniforms.opacity.value = t
  }
  updateMetersPerPx(t) {
    this.material.uniforms.metersPerPx.value = t
  }
  raycast(t) {}
}
const I = {
  baseState: { innerColor: ColorSpace.LENS_GRAY, outerColor: ColorSpace.WHITE, opacity: 0 },
  hoverState: { innerColor: ColorSpace.WHITE, outerColor: ColorSpace.WHITE, opacity: 0.25 },
  selectState: { innerColor: ColorSpace.NEPTUNE, outerColor: ColorSpace.WHITE, opacity: 0 },
  dimState: { innerColor: ColorSpace.LENS_GRAY, outerColor: ColorSpace.WHITE, opacity: 0.5 }
}
class P extends RoomBoundViewMesh {
  constructor(t, e, i, a, h, d, l) {
    const c = P.getGeoFromRoom(t, e),
      u = new MeshBasicMaterial({
        color: ColorSpace.LENS_GRAY,
        depthTest: !1,
        side: DoubleSide,
        transparent: !0,
        opacity: 0,
        blending: NormalBlending,
        blendEquation: AddEquation,
        blendSrc: SrcAlphaFactor,
        blendDst: DstColorFactor,
        stencilRef: 65535,
        stencilFuncMask: 1 << m.$.EDGE,
        stencilFail: KeepStencilOp,
        stencilZFail: KeepStencilOp,
        stencilZPass: KeepStencilOp,
        stencilFunc: GreaterStencilFunc,
        stencilWrite: !0
      })
    super(t.id, c, u, i),
      (this.baseHeight = e),
      (this.roomBoundViewData = a),
      (this.labelManager = h),
      (this.units = d),
      (this.showInPerspective = l),
      (this.potentialLabels = []),
      (this.perimeterLabels = []),
      (this.dimensionCarets = [
        new w(new Vector2(), new Vector2(), 0),
        new w(new Vector2(), new Vector2(), 0),
        new w(new Vector2(), new Vector2(), 0),
        new w(new Vector2(), new Vector2(), 0)
      ]),
      (this.hideMaterial = new RawShaderMaterial({
        vertexShader: v.AK.vertexShader,
        fragmentShader: v.AK.fragmentShader,
        uniforms: UniformsUtils.clone(v.AK.uniforms),
        depthTest: !1,
        side: DoubleSide,
        transparent: !0
      })),
      (this.perimeterLabelsVisible = !1),
      (this.fullLabelVisible = !1),
      (this.hoverTimer = null),
      (this.labelHovered = !1),
      (this.heightLines = new Group()),
      (this.heightLabels = []),
      (this.intersectionPriority = S.e.Labels),
      (this.getLabelPolygon = (() => {
        const t = new Vector3(),
          e = [0, 0],
          i = [e, [0, 0], [0, 0], [0, 0], e]
        return (e, s) => {
          const o = this.cameraData.pose.position.distanceTo(s),
            a = calculateWorldUnitsFromScreenWidth(o, this.cameraData.pose.projection.asThreeMatrix4(), this.cameraData.width),
            h = e.split("\n"),
            d = h.reduce((t, e) => Math.max(t, e.length), 0),
            l = calculateRectangleSize(d, 0, 0),
            c = s.x,
            u = s.z,
            p = 0.5 * l.width * a,
            m = 0.5 * l.height * a * h.length
          return (
            t.set(c - p, 0, u - m),
            t.applyQuaternion(this.cameraData.pose.rotation),
            (i[0][0] = c - p),
            (i[0][1] = u - m),
            (i[1][0] = c + p),
            (i[1][1] = u - m),
            (i[2][0] = c + p),
            (i[2][1] = u + m),
            (i[3][0] = c - p),
            (i[3][1] = u + m),
            i
          )
        }
      })()),
      (this.standardMaterial = u),
      (this.renderOrder = m.o.ROOM),
      (this.roomLabel = this.labelManager.createRoomLabel(t.floorId, t.id)),
      this.roomLabel.addTo(this),
      this.roomLabel.setVisible(!t.hide),
      (this.room = t)
    for (const t of this.dimensionCarets) this.add(t)
    this.updateLabel(!0),
      (this.colors = I),
      this.animation.onChanged(() => {
        const t = this.prevColorState
        this.standardMaterial.color.lerpColors(t.innerColor, this.targetColorScheme.innerColor, this.animation.value)
        const e = MathUtils.lerp(t.opacity, this.targetColorScheme.opacity, this.animation.value)
        ;(this.opacity = e), (this.hideMaterial.uniforms.opacity.value = this.roomLabel.label.opacity)
      }),
      this.add(this.heightLines)
  }
  dispose() {
    this.labelManager.deleteLabel(this.roomLabel)
    for (const t of this.perimeterLabels) this.labelManager.deleteLabel(t), t.dispose()
    this.clearHoverTimer(), super.dispose()
  }
  hoverRoomLabel(t) {
    const e = () => {
      if ((!t && this.roomLabel.getDisplayingTooltip() === t) || (t && this.fullLabelVisible))
        return void (t || ((this.labelHovered = !1), this.updateMaterial()))
      this.roomLabel.setDisplayingTooltip(t), this.updateMaterial()
      const e = this.roomLabel.label.collider.material
      ;(e.opacity = t ? 0.65 : 0), (e.transparent = !0), this.updateLabel(!1), this.updateCarets()
    }
    ;(this.labelHovered = t),
      this.updatePerimeterLabelVisibility(),
      t ? null === this.hoverTimer && ((this.hoverTimer = window.setTimeout(e, f.qb)), this.updateMaterial()) : (e(), this.clearHoverTimer())
  }
  updateGeo(t, e, i) {
    ;(this.room = t), (this.baseHeight = e)
    const s = P.getGeoFromRoom(t, e)
    this.geometry.dispose(),
      (this.geometry = s),
      this.geometry.computeBoundingBox(),
      this.updateLabel(!1),
      (this.units = i),
      this.perimeterLabelsVisible && this.updatePerimeterLabels(),
      this.heightLines.children.length && this.createHeightObjects()
  }
  beforeRender() {
    this.standardMaterial.opacity = this.opacity * (1 - this.pitchFactor) * Number(this.roomBoundViewData.roomWallsVisible)
    const t = this.dimState.active ? 0.5 : 1
    for (const e of this.dimensionCarets) e.updateMetersPerPx(this.cameraData.metersPerPx()), e.updateOpacity((1 - this.pitchFactor) * t)
    const e = !isPitchFactorOrtho(this.pitchFactor)
    this.occlusionLine && (this.occlusionLine.visible = e),
      this.perspectiveLine && (this.perspectiveLine.material.depthTest = e),
      this.updateLabelBillboard(),
      this.updateMaterial(),
      this.updateCarets()
  }
  updateLabelBillboard() {
    const { position: t, rotation: e, projection: i } = this.cameraData.pose,
      { height: s } = this.cameraData,
      n = this.cameraData.isOrtho() ? this.cameraData.zoom() : 1,
      o = this.cameraData.aspect()
    this.roomLabel.label.quaternion.copy(e), this.roomLabel.label.scaleBillboard(t, e, i, n, s, o, 0.1), this.updateLabel(!1)
    for (const t of this.perimeterLabels) t.update()
  }
  updatePerimeterLabelVisibility() {
    const t = this.hoverState.active || this.labelHovered
    ;(this.perimeterLabelsVisible = this.roomBoundViewData.roomDimensionsVisible && (this.selectState.active || (t && isPitchFactorOrtho(this.pitchFactor)))),
      this.perimeterLabelsVisible && this.updatePerimeterLabels()
    for (const t of this.perimeterLabels) t.setVisible(this.perimeterLabelsVisible)
    this.updateCarets()
  }
  updateMaterial() {
    ;(this.material = this.room.hide ? this.hideMaterial : this.standardMaterial), super.updateMaterial()
    const t = this.hoverState.active || this.labelHovered,
      e = isPitchFactorOrtho(this.pitchFactor)
    this.selectState.active || t ? this.heightLines.children.length || this.createHeightObjects() : this.heightLines.clear(),
      t && e && (this.targetColorScheme = this.colors.hoverState)
    const i = this.standardMaterial
    if (
      (this.prevColorState.innerColor.copy(i.color),
      (this.prevColorState.opacity = i.opacity),
      this.animation.modifyAnimation(0, 1, f.rP, easeOutQuad),
      this.roomLabel.setDimmed(this.dimState.active),
      !this.showInPerspective && this.cameraData.pose.pitchFactor() > 0.5)
    ) {
      this.roomLabel.setVisible(!1)
      for (const t of this.perimeterLabels) t.setVisible(!1)
    } else {
      this.roomLabel.setVisible(!this.room.hide || t)
      for (const t of this.perimeterLabels) t.setVisible(this.perimeterLabelsVisible)
    }
    this.updateHeightLabels(), this.updatePerimeterLabelVisibility()
  }
  updateText(t, e) {
    ;(this.potentialLabels = t), this.updateLabel(e), this.updateCarets()
  }
  static getGeoFromRoom(t, e) {
    const { points: i, faces: s } = t.getGeometry(),
      n = i.map(t => [t.x, e, t.y]).flat(1),
      o = new BufferGeometry()
    return o.setAttribute("position", new BufferAttribute(new Float32Array(n), 3)), o.setIndex(s.flat(1)), o
  }
  updateLabel(t) {
    if (0 === this.potentialLabels.length) return
    const e = this.room.points.map(t => [t.x, t.z])
    e.push(e[0])
    const i = new Euler().setFromQuaternion(this.cameraData.pose.rotation).z,
      s = MathUtils.RAD2DEG * i,
      n = []
    if (!t) {
      const { position: t } = this.roomLabel.label,
        e = { x: t.x, y: t.z }
      this.room.holesCW.find(t => {
        const i = t.map(t => ({ x: t.x, y: t.z }))
        return isPointInPolygon(e, i)
      }) || n.push(t.clone())
    }
    n.push(this.room.getViewCenter(new Vector3(), 1.5))
    for (const t of n) {
      this.roomLabel.label.position.copy(t), (this.roomLabel.label.position.y = this.baseHeight + f.mU)
      let i = !1
      this.fullLabelVisible = !0
      for (const o of this.potentialLabels) {
        const a = transformPoints(this.getLabelPolygon(o, t), -s, [t.x, t.z])
        if (isSegmentInsidePolygon(a, e) || this.roomLabel.getDisplayingTooltip() || (t === n[n.length - 1] && "..." === o)) {
          ;(this.roomLabel.label.text = o), (i = !0)
          break
        }
        this.fullLabelVisible = !1
      }
      if (i) break
    }
  }
  updatePerimeterLabels() {
    const t = this.room.hide ? [] : this.room.minimalInnerEdges
    for (; t.length > this.perimeterLabels.length; ) this.perimeterLabels.push(this.labelManager.createPerimeterLabel(this.room.floorId, !0).addTo(this))
    for (; t.length < this.perimeterLabels.length; ) {
      const t = this.perimeterLabels.pop()
      if (!t) throw new Error("Label should exist!")
      this.labelManager.deleteLabel(t)
    }
    for (let e = 0; e < t.length; e++) {
      const i = t[e],
        s = i.start.clone()
      s.y = this.baseHeight
      const n = i.end.clone()
      ;(n.y = this.baseHeight), this.perimeterLabels[e].updateDimensions(s, n, 0, this.units)
    }
    this.labelManager.update()
  }
  updateCarets() {
    const t = this.cameraData.metersPerPx(),
      e = this.room.length / t,
      i = this.room.width / t,
      s = this.roomLabel.getSize(),
      n = s.width + 2 > e,
      o = s.height + 2 > i,
      a = this.fullLabelVisible && (n || o),
      r = this.roomBoundViewData.roomDimensionsVisible && this.roomBoundViewData.roomWallsVisible
    if (this.room.canDisplayDimensions() && !this.perimeterLabelsVisible && this.fullLabelVisible && !a && r) {
      const t = new Vector2()
      t.subVectors(this.room.w2, this.room.w1).normalize(),
        this.dimensionCarets[0].updateState(this.room.w1, t, this.baseHeight),
        (this.dimensionCarets[0].visible = !0),
        t.subVectors(this.room.w1, this.room.w2).normalize(),
        this.dimensionCarets[1].updateState(this.room.w2, t, this.baseHeight),
        (this.dimensionCarets[1].visible = !0),
        t.subVectors(this.room.l2, this.room.l1).normalize(),
        this.dimensionCarets[2].updateState(this.room.l1, t, this.baseHeight),
        (this.dimensionCarets[2].visible = !0),
        t.subVectors(this.room.l1, this.room.l2).normalize(),
        this.dimensionCarets[3].updateState(this.room.l2, t, this.baseHeight),
        (this.dimensionCarets[3].visible = !0)
    } else for (const t of this.dimensionCarets) t.visible = !1
  }
  clearHoverTimer() {
    null !== this.hoverTimer && (clearTimeout(this.hoverTimer), (this.hoverTimer = null))
  }
  createHeightObjects() {
    this.heightLines.clear()
    for (const t of this.heightLabels) this.labelManager.deleteLabel(t)
    this.heightLabels.length = 0
    const t = {
        dashed: !1,
        dashSize: 1,
        gapSize: 1,
        lineWidth: 1,
        color: ColorSpace.WHITE,
        dashUnits: DashUnits.METERS,
        depthWrite: !1,
        depthTest: !0,
        depthFunc: LessDepth,
        opacity: 1
      },
      e = {
        dashed: !0,
        dashSize: 0.08,
        gapSize: 0.04,
        lineWidth: 1,
        color: ColorSpace.WHITE,
        dashUnits: DashUnits.METERS,
        depthWrite: !1,
        depthTest: !0,
        depthFunc: GreaterDepth,
        opacity: 1
      },
      i = [],
      n = (t, e) => {
        i.push([t.clone(), e.clone()])
      },
      o = new Vector3(),
      a = new Vector3(),
      r = this.room.getInnerLoops()
    for (const t of r) {
      const e = t.length
      for (let i = 0; i < e; i++) {
        const s = this.labelManager.createPerimeterLabel(this.room.floorId, !0)
        o.copy(t[i]),
          (o.y = this.baseHeight),
          a.copy(t[(i + 1) % e]),
          (a.y = this.baseHeight),
          s.updateDimensions(o, a, 0, this.units),
          s.addTo(this),
          n(o, a),
          this.room.canDisplayHeight() && ((o.y += this.room.height), (a.y += this.room.height), n(o, a))
      }
      if (this.room.canDisplayHeight())
        for (const e of t) {
          o.copy(e), (o.y = this.baseHeight), a.copy(o), (a.y += this.room.height), n(o, a)
          const t = this.labelManager.createPerimeterLabel(this.room.floorId, !0)
          ;(t.labelGroupId = this.room.id), t.updateDimensions(o, a, 0, this.units), t.setVisible(!0), t.addTo(this.heightLines), this.heightLabels.push(t)
        }
    }
    this.labelManager.update(),
      (this.occlusionLine = new ScreenLine(i, e)),
      (this.perspectiveLine = new ScreenLine(i, t)),
      this.heightLines.add(this.perspectiveLine),
      this.heightLines.add(this.occlusionLine)
  }
  updateHeightLabels() {
    const t = this.selectState.active && !isPitchFactorOrtho(this.pitchFactor)
    for (const e of this.heightLabels) e.setVisible(t)
  }
  setPitchFactor(t) {
    ;(this.pitchFactor = t), (this.raycastEnabled = isPitchFactorOrtho(this.pitchFactor) || this.showInPerspective)
  }
}
export const c = P
