import a from "../glsl/80218.glsl"
import * as w from "../const/28361"
import * as m from "../webgl/skySphere.mesh"
import { InputSymbol, SkyboxSymbol, WebglRendererSymbol } from "../const/symbol.const"
import { RenderLayer, RenderLayers } from "../core/layers"
import { Module } from "../core/module"
import { BtnText } from "../data/player.options.data"
import { CameraData } from "../data/camera.data"
import l from "../glsl/46262.glsl"

import { SettingsData } from "../data/settings.data"
import { CameraRigConfig } from "../utils/camera.utils"
import { DirectionVector } from "../webgl/vector.const"
import { PickingPriorityType } from "../const/12529"
import { BackgroundColorDefault } from "../const/28361"
import {
  BackSide,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  FrontSide,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  RawShaderMaterial,
  SphereGeometry,
  UniformsUtils,
  Vector3
} from "three"
import { Material } from "three/src/materials/Material"
import { InputManager } from "../webgl/inputManager"
import { ShaderMaterial } from "three/src/materials/ShaderMaterial"
import EngineContext from "../core/engineContext"
import { ShowCaseScene } from "../webgl/showcase.scene"
import InputIniModule from "./inputIni.module"
import { SkySphereMesh } from "../webgl/skySphere.mesh"

declare global {
  interface SymbolModule {
    [SkyboxSymbol]: SkyboxModule
  }
}
const d = {
  sky: {
    uniforms: {
      topColor: { type: "v3", value: new Vector3(0.094, 0.102, 0.11) },
      bottomColor: { type: "v3", value: new Vector3(0.2, 0.216, 0.235) },
      cameraMatrix: { type: "m4", value: new Matrix4() },
      inverseProjectionMatrix: { type: "m4", value: new Matrix4() },
      radius: { type: "f", value: 1e4 }
    },
    vertexShader: a,
    fragmentShader: l
  }
}

class c extends RawShaderMaterial {
  constructor(e = {}) {
    super(
      Object.assign(
        {
          fragmentShader: d.sky.fragmentShader,
          vertexShader: d.sky.vertexShader,
          uniforms: UniformsUtils.clone(d.sky.uniforms),
          name: "SkyboxMaterial"
        },
        e
      )
    )
  }
}

class f {
  scene: ShowCaseScene
  cameraData: CameraData
  addToRaycasting: (e: any, t: any, n?: any) => void
  removeFromRaycasting: (e: any) => void
  renderLayer: RenderLayer
  bindings: any[]
  skyVisual: Mesh
  material: ShaderMaterial
  skyCollider: Mesh

  constructor(e, t, i, s, o = RenderLayers.ALL) {
    this.scene = e
    this.cameraData = t
    this.addToRaycasting = i
    this.removeFromRaycasting = s
    this.renderLayer = o
    this.bindings = []
  }

  init() {
    const { visualMesh: e, colliderMesh: t } = this.setupSkysphere()
    this.skyVisual = e
    this.material = this.skyVisual.material
    this.skyCollider = t
  }

  dispose() {
    this.material.uniforms.pano0Map.value.dispose()
    this.material.uniforms.pano1Map.value.dispose()
    this.material.dispose()
    this.skyVisual.geometry.dispose()
  }

  activate(e) {
    this.scene.addChild(this.scene.ids.Root, this.skyVisual)
    this.skyVisual.updateMatrixWorld(!0)
    this.skyVisual.visible = !0
    this.addToRaycasting(this.skyCollider, !1)
  }

  deactivate(e) {
    for (const e of this.bindings) e.cancel()
    this.bindings = []
    this.scene.removeChild(this.scene.ids.Root, this.skyVisual)
    this.scene.removeChild(this.scene.ids.CameraRig, this.skyCollider)
    this.removeFromRaycasting(this.skyCollider)
  }

  updateBackgroundColors(e, t) {
    const i = new Color(e),
      s = new Color(t)
    this.material.uniforms.topColor.value.set(i.r, i.g, i.b)
    this.material.uniforms.bottomColor.value.set(s.r, s.g, s.b)
  }

  beforeRender() {
    this.skyCollider.position.copy(this.cameraData.pose.position)
    this.material.uniforms.cameraMatrix.value.compose(this.cameraData.pose.position, this.cameraData.pose.rotation, DirectionVector.UNIT)
    this.material.uniforms.inverseProjectionMatrix.value.copy(this.cameraData.pose.projection.asThreeMatrix4())
    this.material.uniforms.inverseProjectionMatrix.value.invert()
  }

  render() {}

  setupSkysphere(e?) {
    const t = new SphereGeometry(1e4, 5, 5)
    t.computeBoundingBox()
    const i = CameraRigConfig.far - 10,
      s = new Float32Array([-1, 1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0]),
      o = new BufferGeometry()
    o.setAttribute("position", new Float32BufferAttribute(s, 3)), o.setIndex([0, 1, 2, 0, 2, 3]), e || (e = new c({ side: FrontSide }))
    const n = new SkySphereMesh(o, e)
    n.layers.mask = this.renderLayer.mask
    n.name = "Skysphere"
    n.renderOrder = PickingPriorityType.boundingSkybox
    n.updateMatrixWorld(!0)
    n.frustumCulled = !1
    e.uniforms.radius.value = i
    e.depthWrite = !1
    e.depthTest = !1
    return {
      visualMesh: n,
      colliderMesh: new SkySphereMesh(t, new MeshBasicMaterial({ opacity: 0, depthWrite: !1, side: BackSide }))
    }
  }
}

export default class SkyboxModule extends Module {
  skybox: f

  constructor() {
    super(...arguments)
    this.name = "skybox-module"
  }

  async init(e, t: EngineContext) {
    const [i, s, r, n] = await Promise.all([
        t.getModuleBySymbol(WebglRendererSymbol),
        t.market.waitForData(SettingsData),
        t.getModuleBySymbol(InputSymbol),
        t.market.waitForData(CameraData)
      ]),
      a = t.claimRenderLayer("skybox"),
      h = i.getScene()
    this.skybox = new f(h, n, r.registerMesh, r.unregisterMesh, a)
    t.addComponent(this, this.skybox)
    const l = s.tryGetProperty(BtnText.BackgroundColor, BackgroundColorDefault.default)
    this.skybox.updateBackgroundColors(w.K[l].bgPrimary, w.K[l].bgSecondary),
      this.bindings.push(
        s.onPropertyChanged(BtnText.BackgroundColor, e => {
          this.skybox.updateBackgroundColors(w.K[e].bgPrimary, w.K[e].bgSecondary)
        })
      )
  }
}
