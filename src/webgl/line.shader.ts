import { Color, UniformsLib, UniformsUtils, Vector2, Vector3 } from "three"
import a from "../glsl/44724.glsl"
import d from "../glsl/52059.glsl"
import p from "../glsl/56449.glsl"
import c from "../glsl/7188.glsl"
import h from "../glsl/75215.glsl"
import { basicShader } from "./basic.shader"

export const LineShader = {
  endpoint: {
    uniforms: { opacity: { type: "f", value: 1 }, color: { type: "c", value: new Color() }, bg: { type: "t", value: null } },
    vertexShader: basicShader.basicTextured.vertexShader,
    fragmentShader: a
  },
  line: {
    uniforms: UniformsUtils.merge([
      UniformsLib.common,
      UniformsLib.fog,
      {
        linewidth: { value: 4 },
        resolution: { value: new Vector2(0, 0) },
        dashScale: { value: 1 },
        dashSize: { value: 0.025 },
        gapSize: { value: 0.05 },
        mask: { value: null }
      }
    ]),
    vertexShader: c,
    fragmentShader: d
  },
  screenline: {
    uniforms: {
      lineWidth: { value: 1 },
      screenSize: { value: new Vector2(0, 0) },
      dashed: { value: 0 },
      dashSize: { value: 1 },
      gapSize: { value: 1 },
      antialiasWidth: { value: 1 },
      color: { value: new Color(1, 0, 0) },
      opacity: { value: 1 },
      start: { value: new Vector3() },
      end: { value: new Vector3() }
    },
    vertexShader: h,
    fragmentShader: p
  }
}
