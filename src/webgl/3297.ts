import * as O from "../const/82403"
import { ColorSpace } from "../const/color.const"
import v from "../glsl/14536.glsl"
import E from "../glsl/25888.glsl"
import h from "../glsl/40134.glsl"
import y from "../glsl/47706.glsl"
import r from "../glsl/67498.glsl"
import x from "../glsl/72292.glsl"
import l from "../glsl/73293.glsl"
import C from "../glsl/73868.glsl"
import m from "../glsl/86242.glsl"
import u from "../glsl/93670.glsl"
import { Vector2, Vector3 } from "three"
const w = {
    uniforms: {
      outlineColor: { type: "v4", value: ColorSpace.BLACK },
      baseColor: { type: "v4", value: ColorSpace.SINE },
      outlinePct: { type: "f", value: 0.8 },
      radius: { type: "f", value: O.pp },
      opacity: { type: "f", value: 1 }
    },
    vertexShader: r,
    fragmentShader: l
  },
  A = {
    uniforms: {
      outlineColor: { type: "v3", value: ColorSpace.WHITE },
      color: { type: "v3", value: ColorSpace.WHITE },
      lineStart: { type: "v3", value: new Vector3() },
      lineEnd: { type: "v3", value: new Vector3() },
      width: { type: "f", value: 1 },
      selectedWidth: { type: "f", value: 0.01 },
      opacity: { type: "f", value: 1 }
    },
    vertexShader: h,
    fragmentShader: u
  },
  T = {
    uniforms: { baseColor: { type: "v4", value: ColorSpace.WHITE }, isDoor: { type: "f", value: 1 }, opacity: { type: "f", value: 1 } },
    vertexShader: m,
    fragmentShader: v
  },
  I = {
    uniforms: {
      opacity: { type: "f", value: 1 },
      centerSpacing: { type: "f", value: 24 },
      radius: { type: "f", value: 4 },
      color: { type: "v4", value: ColorSpace.LENS_GRAY }
    },
    vertexShader: y,
    fragmentShader: x
  },
  P = {
    uniforms: {
      tip: { type: "v2", value: new Vector2() },
      normal: { type: "v2", value: new Vector2() },
      height: { type: "f", value: 0 },
      color: { type: "v4", value: ColorSpace.WHITE },
      opacity: { type: "f", value: 1 },
      outline: { type: "f", value: 1 },
      outlineColor: { type: "v4", value: ColorSpace.BLACK },
      screenSize: { type: "v2", value: new Vector2() },
      paddingPx: { type: "f", value: 2 },
      widthPx: { type: "f", value: 12 },
      heightPx: { type: "f", value: 6 },
      aaPaddingPx: { type: "f", value: 2 },
      metersPerPx: { type: "f", value: 0.01 }
    },
    vertexShader: E,
    fragmentShader: C
  }

export const AK = I
export const LD = A
export const Ud = P
export const pr = w
export const z6 = T
