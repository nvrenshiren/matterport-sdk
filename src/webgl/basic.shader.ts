import r from "../glsl/25848.glsl"

import o from "../glsl/22505.glsl"

import c from "../glsl/5725.glsl"

import { Vector3 } from "three"
import u from "../glsl/47301.glsl"

export const basicShader = {
  basicTextured: {
    uniforms: {
      tDiffuse: {
        type: "t",
        value: null
      },
      alpha: {
        type: "f",
        value: 1
      }
    },
    vertexShader: r,
    fragmentShader: o
  },
  screenSpaceColored: {
    uniforms: {
      color: {
        type: "v3",
        value: new Vector3(0, 0, 0)
      },
      opacity: {
        type: "f",
        value: 1
      }
    },
    vertexShader: c,
    fragmentShader: u
  }
}
