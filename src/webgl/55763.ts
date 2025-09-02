import { Color, DoubleSide, Matrix4, RawShaderMaterial, UniformsUtils, Vector2 } from "three"
import * as s from "../const/84958"
import d from "../glsl/24819.glsl"
import a from "../glsl/27670.glsl"
import m from "../glsl/50929.glsl"
import l from "../glsl/72742.glsl"
import g from "../glsl/747.glsl"
import h from "../glsl/79652.glsl"
import { basicShader } from "./basic.shader"
import { PinConfig } from "../const/84958"
export const PinUniforms = {
  pinHead: {
    uniforms: {
      alpha: {
        type: "f",
        value: 1
      },
      color: {
        type: "c",
        value: new Color()
      },
      bg: {
        type: "t",
        value: null
      },
      mask: {
        type: "t",
        value: null
      }
    },
    vertexShader: a,
    fragmentShader: l
  },
  pinStem: {
    uniforms: {
      pinHeadMatrix: {
        value: new Matrix4()
      },
      resolution: {
        value: new Vector2()
      },
      alpha: {
        value: 1
      }
    },
    vertexShader: d,
    fragmentShader: h
  },
  pinSelected: {
    vertexShader: m,
    fragmentShader: g
  }
}
export class PinHeadMaterial extends RawShaderMaterial {
  constructor(e, t, n, s) {
    const r = UniformsUtils.clone(PinUniforms.pinHead.uniforms)
    ;(r.bg.value = t),
      (r.mask.value = n),
      r.color.value.copy(e),
      (r.alpha.value = s),
      super({
        fragmentShader: PinUniforms.pinHead.fragmentShader,
        vertexShader: PinUniforms.pinHead.vertexShader,
        uniforms: r,
        name: "PinHeadMaterial",
        transparent: !0
      })
  }
}
export class PinStemMaterial extends RawShaderMaterial {
  constructor() {
    const e = UniformsUtils.clone(PinUniforms.pinStem.uniforms)
    super({
      fragmentShader: PinUniforms.pinStem.fragmentShader,
      vertexShader: PinUniforms.pinStem.vertexShader,
      uniforms: e,
      name: "PinStemMaterial",
      linewidth: PinConfig.stem.width,
      opacity: PinConfig.stem.opacity,
      transparent: PinConfig.stem.transparent,
      alphaTest: PinConfig.stem.opacity * PinConfig.stem.alphaTest
    })
  }
}
export class InstancedPinStemMaterial extends RawShaderMaterial {
  constructor() {
    const e = UniformsUtils.clone(PinUniforms.pinStem.uniforms)
    super({
      defines: {
        INSTANCED: !0
      },
      fragmentShader: PinUniforms.pinStem.fragmentShader,
      vertexShader: PinUniforms.pinStem.vertexShader,
      uniforms: e,
      name: "InstancedPinStemMaterial",
      linewidth: PinConfig.stem.width,
      opacity: PinConfig.stem.opacity,
      transparent: PinConfig.stem.transparent,
      alphaTest: PinConfig.stem.opacity * PinConfig.stem.alphaTest
    })
  }
}
export class InstancedPinHeadMaterial extends RawShaderMaterial {
  constructor(e, t) {
    const n = UniformsUtils.clone(PinUniforms.pinHead.uniforms)
    ;(n.bg.value = e),
      (n.mask.value = t),
      super({
        defines: {
          INSTANCED: !0
        },
        fragmentShader: PinUniforms.pinHead.fragmentShader,
        vertexShader: PinUniforms.pinHead.vertexShader,
        uniforms: n,
        name: "InstancedPinHeadMaterial",
        transparent: !0
      })
  }
}
export class InstancedPinHeadCustomMaterial extends RawShaderMaterial {
  constructor(e, t) {
    super({
      defines: {
        INSTANCED: t
      },
      vertexShader: basicShader.basicTextured.vertexShader,
      fragmentShader: basicShader.basicTextured.fragmentShader,
      uniforms: {
        alpha: {
          value: 1
        },
        tDiffuse: {
          value: e
        }
      },
      name: "InstancedPinHeadCustomMaterial",
      transparent: !0
    })
  }
}
export class PinSelectedMaterial extends RawShaderMaterial {
  constructor() {
    super({
      depthTest: !0,
      depthWrite: !1,
      transparent: !0,
      side: DoubleSide,
      vertexShader: PinUniforms.pinSelected.vertexShader,
      fragmentShader: PinUniforms.pinSelected.fragmentShader
    })
  }
}
