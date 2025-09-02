import vertexShader from "../glsl/35490.glsl"
import fragmentShader from "../glsl/8346.glsl"

class PortalMaterial extends RawShaderMaterial {
  constructor(e, t) {
    const i = UniformsUtils.clone(PortalMaterial.uniforms)
    i.tNoHover.value = e
    i.tHover.value = t
    i.tPortal.value = null
    super({ vertexShader, fragmentShader, uniforms: i, name: "PortalMaterial", transparent: !0 })
  }
  static uniforms: Record<string, IUniform & { type: string }>
}
PortalMaterial.uniforms = {
  tNoHover: { type: "t", value: null },
  tHover: { type: "t", value: null },
  tPortal: { type: "t", value: null },
  progress: { type: "f", value: 1 },
  opacity: { type: "f", value: 1 }
}
import * as l from "../const/4359"
import * as m from "../const/23331"
import { PickingPriorityType } from "../const/12529"
import { CheckThreshold } from "../utils/49827"
import { CubeTexture, Intersection, IUniform, Mesh, PlaneGeometry, RawShaderMaterial, Raycaster, Texture, UniformsUtils } from "three"
import { SweepLinkItem } from "../modules/sweepPortalMesh.module"
import { CameraData } from "../data/camera.data"
export enum PortalMeshState {
  HIDE = 0,
  ONTOP = 2,
  SHOW = 1
}
export class PortalMesh extends Mesh<PlaneGeometry, PortalMaterial> {
  uniforms: any
  portalData: SweepLinkItem
  hoverProgress: number
  hovered: boolean
  constructor(e, t) {
    const i = new PortalMaterial(l.P.get().toInteriorTexture, l.P.get().toInteriorHoverTexture)
    super(PortalMesh.geometry, i)
    this.layers.mask = t.mask
    this.uniforms = i.uniforms
    this.renderOrder = PickingPriorityType.portals
    this.setState(PortalMeshState.HIDE)
    this.update(e)
  }

  update(e: SweepLinkItem) {
    this.portalData = e
    this.position.copy(e.position)
    if (null !== e.lookDirection) {
      const t = e.lookDirection.clone().add(e.position)
      this.lookAt(t)
    }
    this.hoverProgress = 0
    this.hovered = !1
    e.toExterior
      ? ((this.uniforms.tNoHover.value = l.P.get().toExteriorTexture), (this.uniforms.tHover.value = l.P.get().toExteriorHoverTexture))
      : ((this.uniforms.tNoHover.value = l.P.get().toInteriorTexture), (this.uniforms.tHover.value = l.P.get().toInteriorHoverTexture))
  }
  resetMesh(e = 0, t = !1, i = !1) {
    this.uniforms.opacity.value = e
    this.visible = 0 !== e
    this.material.depthTest = t
    this.material.depthWrite = i
  }
  setHover(e: boolean) {
    this.hovered = e
  }
  setState(e: PortalMeshState) {
    switch (e) {
      case PortalMeshState.HIDE:
        this.resetMesh(0, !0, !0)
        break
      case PortalMeshState.SHOW:
        this.resetMesh(1, !0, !0)
        break
      case PortalMeshState.ONTOP:
        this.resetMesh(1)
    }
  }
  render(e: number, t: CameraData) {
    this.hovered && this.hoverProgress < 1 ? (this.hoverProgress += e / 300) : !this.hovered && this.hoverProgress > 0 && (this.hoverProgress -= e / 300)
    this.hoverProgress = CheckThreshold(this.hoverProgress, 0, 1)
    this.uniforms.progress.value = this.hoverProgress
    if (this.portalData?.billboard) {
      const e = t.pose.position
      const i = this.position.copy(this.portalData.position)
      const n = e.distanceTo(i)
      n < m.nm ? i.lerpVectors(e, i, m.nm / n) : n > m.iz && i.lerpVectors(e, i, m.iz / n), this.lookAt(t.pose.position)
    }
  }
  updatePortalTexture(e: Texture | CubeTexture) {
    this.uniforms.tPortal.value = e
  }
  raycast(e: Raycaster, t: Intersection[]) {
    if (!this.visible) return
    const i: Intersection[] = []
    super.raycast(e, i)
    i.length > 0 && ((i[0].distance /= 1e4), t.push(i[0]))
  }
  static geometry: PlaneGeometry
}
PortalMesh.geometry = new PlaneGeometry(m.vX, m.vX)
