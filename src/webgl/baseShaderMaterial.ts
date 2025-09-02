import { GLSL3, RawShaderMaterial } from "three"
export class BaseShaderMaterial extends RawShaderMaterial {
  onBeforeCompile(e, t) {
    super.onBeforeCompile(e, t)
    t.capabilities.isWebGL2 &&
      this.glslVersion !== GLSL3 &&
      ((e.glslVersion = GLSL3), (e.vertexShader = r + e.vertexShader), (e.fragmentShader = a + e.fragmentShader))
  }
}
const r = "\n#define attribute in\n#define varying out\n#define texture2D texture\n"
const a =
  "\n#define varying in\nout highp vec4 pc_fragColor;\n#define gl_FragColor pc_fragColor\n#define gl_FragDepthEXT gl_FragDepth\n#define texture2D texture\n#define textureCube texture\n#define texture2DProj textureProj\n"
