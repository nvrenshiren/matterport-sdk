import n1 from "../glsl/29535.glsl"
import n2 from "../glsl/37198.glsl"
const defaultMaterialParamters: ShaderMaterialParameters = {
  extensions: {
    derivatives: !0
  },
  defines: {
    RING_COUNT: 0,
    USE_TEXTURE: !1
  },
  uniforms: {
    discRadius: {
      value: 0.2
    },
    discNormal: {
      value: new Vector3(0, 0, 1)
    },
    ringRadii: {
      value: []
    },
    ringColors: {
      value: []
    },
    opacity: {
      value: 1
    },
    tint: {
      value: new Color(1, 1, 1)
    },
    texture: {
      value: null
    },
    viewMatrixInverse: {
      value: new Matrix4()
    },
    projectionMatrixInverse: {
      value: new Matrix4()
    }
  },
  vertexShader: n1,
  fragmentShader: n2,
  side: FrontSide,
  transparent: !0
}

import { BaseShaderMaterial } from "./baseShaderMaterial"
import {
  Camera,
  Color,
  ColorRepresentation,
  FrontSide,
  Matrix4,
  Mesh,
  Scene,
  ShaderMaterialParameters,
  SphereGeometry,
  Texture,
  UniformsUtils,
  Vector2,
  Vector3,
  Vector4,
  WebGLRenderer
} from "three"
import { PuckImageryDefaultConfig } from "../const/puckImagery.const"
const tempColor = new Color()
const ringsParamtersList = [
  {
    outerRadius: 1,
    innerRadius: 0.75,
    color: 16777215,
    opacity: 1
  }
]
class MarkerMaterial extends BaseShaderMaterial {
  constructor(parameters = ringsParamtersList) {
    super(
      Object.assign(Object.assign({}, defaultMaterialParamters), {
        defines: Object.assign({}, defaultMaterialParamters.defines),
        uniforms: UniformsUtils.clone(defaultMaterialParamters.uniforms)
      })
    )
    this.setRings(parameters)
    Object.defineProperty(this, "opacity", {
      set(value: number) {
        this.uniforms.opacity.value = value
      },
      get() {
        return this.uniforms.opacity.value
      }
    })
  }
  setDiscNormal(value: Vector3) {
    this.uniforms.discNormal.value.copy(value)
  }
  setDiscRadius(value: number) {
    this.uniforms.discRadius.value = value
  }
  setRings(parameters: any[]) {
    parameters = parameters || []
    this.defines.RING_COUNT !== parameters.length && ((this.defines.RING_COUNT = parameters.length), (this.needsUpdate = !0))
    this.uniforms.ringRadii.value = parameters.map(({ innerRadius, outerRadius }) => new Vector2(innerRadius || -1, outerRadius))
    this.uniforms.ringColors.value = parameters.map(({ color, opacity }) => (tempColor.set(color), new Vector4(tempColor.r, tempColor.g, tempColor.b, opacity)))
  }
  setTexture(value: Texture) {
    if (this.defines.USE_TEXTURE !== !!value) {
      this.defines.USE_TEXTURE = !!value
      this.needsUpdate = !0
    }
    this.uniforms.texture.value = value
  }
  getTexture() {
    return this.uniforms.texture.value
  }
  setTint(value: ColorRepresentation) {
    this.uniforms.tint.value.set(null != value ? value : 0xffffff)
  }
  getTint(): Color {
    return this.uniforms.tint.value
  }
  onBeforeRender(renderer: WebGLRenderer, scene: Scene, camera: Camera) {
    this.uniforms.projectionMatrixInverse.value.copy(camera.projectionMatrixInverse)
    this.uniforms.viewMatrixInverse.value.copy(camera.matrixWorld)
  }
}

export interface MarkerMeshParameters {
  texture?: typeof PuckImageryDefaultConfig | Texture | null
  rings?: typeof PuckImageryDefaultConfig
  tint?: Color
  opacity?: number
  radius?: number
  normal?: Vector3
}

export class MarkerMesh extends Mesh<SphereGeometry, MarkerMaterial> {
  constructor(parameter?: MarkerMeshParameters) {
    super(new SphereGeometry(Math.sqrt(2), 8, 6), new MarkerMaterial())
    this.onBeforeRender = (renderer: WebGLRenderer, scene: Scene, camera: Camera) => {
      this.material.onBeforeRender(renderer, scene, camera)
    }
    parameter && this.configure(parameter)
  }
  configure(parameters: MarkerMeshParameters) {
    const { radius, normal, rings, texture, opacity, tint } = parameters
    const { material } = this
    void 0 !== radius && (this.scale.setScalar(radius), material.setDiscRadius(radius))
    void 0 !== normal && material.setDiscNormal(normal)
    void 0 !== rings && material.setRings(rings)
    void 0 !== texture && material.setTexture(texture as Texture)
    void 0 !== tint && material.setTint(tint)
    void 0 !== opacity && (material.opacity = opacity)
  }
  dispose() {
    this.material.getTexture()?.dispose()
    this.geometry.dispose()
  }
}
