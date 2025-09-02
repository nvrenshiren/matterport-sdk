import { Color, Float32BufferAttribute, FrontSide, InstancedBufferAttribute, InstancedBufferGeometry, Mesh, RawShaderMaterial, UniformsUtils } from "three"
import { PickingPriorityType } from "../const/12529"
import { LineShader } from "./line.shader"
export enum DashUnits {
  METERS = 1,
  PIXELS = 0
}
export class ScreenLine extends Mesh<InstancedBufferGeometry, RawShaderMaterial> {
  start: Float32Array
  startAttrib: InstancedBufferAttribute
  end: Float32Array
  endAttrib: InstancedBufferAttribute
  constructor(t, e) {
    const i = new Float32Array([-9999, -9999, -9999, 9999, 9999, 9999, -9999, -9999, -9999, 9999, 9999, 9999, 9999, 9999, 9999, -9999, -9999, -9999])
    const n = new Float32Array([1, 1, 0, 0, -1, -1])
    const l = new Float32Array([0, 1, 0, 1, 0, 1])
    const c = new InstancedBufferGeometry()
    c.setAttribute("position", new Float32BufferAttribute(i, 3))
    c.setAttribute("offsetDirection", new Float32BufferAttribute(n, 1))
    c.setAttribute("t", new Float32BufferAttribute(l, 1))
    c.setIndex([0, 2, 1, 2, 3, 1, 2, 4, 3, 4, 5, 3])
    let h = {}
    let d = {}
    e?.dashUnits === DashUnits.METERS && ((h = { WORLDSPACE_DASH: !0 }), (d = { derivatives: !0 }))
    super(
      c,
      new RawShaderMaterial({
        uniforms: UniformsUtils.clone(LineShader.screenline.uniforms),
        side: FrontSide,
        vertexShader: LineShader.screenline.vertexShader,
        fragmentShader: LineShader.screenline.fragmentShader,
        transparent: !0,
        depthTest: e.depthTest,
        depthWrite: e.depthWrite,
        depthFunc: e.depthFunc,
        defines: h,
        extensions: d
      })
    )
    this.start = new Float32Array(3 * t.length)
    this.startAttrib = new InstancedBufferAttribute(this.start, 3)
    this.geometry.setAttribute("start", this.startAttrib)
    this.end = new Float32Array(3 * t.length)
    this.endAttrib = new InstancedBufferAttribute(this.end, 3)
    this.geometry.setAttribute("end", this.endAttrib)
    this.updateEndpoints(t)
    this.geometry.computeBoundingBox()
    this.geometry.computeBoundingSphere()
    this.renderOrder = PickingPriorityType.lines
    this.onBeforeRender = t => {
      t.getSize(this.material.uniforms.screenSize.value)
    }
    this.material.uniforms.dashed.value = +e.dashed
    this.material.uniforms.dashSize.value = e.dashSize
    this.material.uniforms.gapSize.value = e.gapSize
    this.material.uniforms.lineWidth.value = e.lineWidth
    this.material.uniforms.color.value.copy(e.color)
    this.material.uniforms.opacity.value = e.opacity
  }
  updateEndpoints(t) {
    if (3 * t.length !== this.start.length) throw new Error("Realloc lines to change line count")
    for (let e = 0; e < t.length; e++) {
      const i = t[e]
      i[0].toArray(this.start, 3 * e)
      i[1].toArray(this.end, 3 * e)
    }
    this.startAttrib.needsUpdate = !0
    this.endAttrib.needsUpdate = !0
  }
  opacity(t: number) {
    this.material.uniforms.opacity.value = t
  }
  color(t: Color) {
    this.material.uniforms.color.value.copy(t)
  }
}
