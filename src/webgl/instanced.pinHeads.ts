import { Color, InstancedBufferAttribute, InstancedMesh, PlaneGeometry } from "three"
import { PickingPriorityType } from "../const/12529"
import { PinDefaultSize } from "../const/84958"
import { DebugInfo } from "../core/debug"
import { InstancedPinHeadCustomMaterial, InstancedPinHeadMaterial } from "./55763"
const Instancedpinheads = new DebugInfo("InstancedPinHeads")
export class InstancedPinHeads extends InstancedMesh {
  updateMaskTexture: (e: any) => void
  maxCount: number
  opacityAttrib: InstancedBufferAttribute
  maskRectAttrib: InstancedBufferAttribute
  strokeWidthAttrib: InstancedBufferAttribute
  renderedPins: never[]
  constructor(e, t, n, s) {
    const l = new PlaneGeometry(PinDefaultSize, PinDefaultSize)
    const c = new InstancedBufferAttribute(new Float32Array(e), 1)
    l.setAttribute("instanceAlpha", c)
    const d = new InstancedBufferAttribute(new Float32Array(4 * e), 4)
    const u = new InstancedBufferAttribute(new Float32Array(e), 1)
    l.setAttribute("instanceMaskRect", d), l.setAttribute("instanceStrokeWidth", u)
    const h = s && n ? new InstancedPinHeadMaterial(t, n) : new InstancedPinHeadCustomMaterial(t, !0)
    super(l, h, e)
    this.updateMaskTexture = e => {
      if (this.material && this.material instanceof InstancedPinHeadMaterial) {
        const t = this.material.uniforms
        t.mask.value !== e && ((t.mask.value = e), (this.material.uniformsNeedUpdate = !0))
      }
    }
    this.material = h
    this.maxCount = e
    this.opacityAttrib = c
    this.maskRectAttrib = d
    this.strokeWidthAttrib = u
    this.setColorAt(0, new Color())
    this.renderedPins = []
    this.renderOrder = PickingPriorityType.pins
  }
  update(e) {
    let t = 0
    this.renderedPins.length = 0
    for (const n of e) {
      if (!n.visible) continue
      if (t >= this.maxCount) {
        Instancedpinheads.error("Instance count is too small!")
        continue
      }
      this.setMatrixAt(t, n.pinHeadMatrix),
        this.setColorAt(t, n.pinColor),
        this.opacityAttrib.setX(t, n.opacity * n.opacityAnimation.value * n.opacityScale),
        this.strokeWidthAttrib.setX(t, n.pinStrokeWidth)
      const e = n.pinIconUVRect
      e && this.maskRectAttrib.setXYZW(t, e.minU, e.minV, e.maxU, e.maxV), t++, this.renderedPins.push(n)
    }
    this.count = t
    this.visible = this.count > 0
    this.instanceMatrix.needsUpdate = !0
    this.opacityAttrib.needsUpdate = !0
    this.maskRectAttrib.needsUpdate = !0
    this.strokeWidthAttrib.needsUpdate = !0
    this.instanceColor ? ((this.instanceColor.needsUpdate = !0), this.computeBoundingSphere()) : Instancedpinheads.error("Instance color should be defined")
  }
}
