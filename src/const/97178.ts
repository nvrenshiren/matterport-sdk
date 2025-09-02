import { Color, Matrix4, Vector2, Vector3, Vector4 } from "three"
import { ModelChunkType } from "./34742"
import y from "../glsl/23059.glsl"
import a from "../glsl/34912.glsl"
import g from "../glsl/56547.glsl"
import O from "../glsl/62397.glsl"
import _ from "../glsl/65849.glsl"
import l from "../glsl/66367.glsl"
import d from "../glsl/67230.glsl"
import E from "../glsl/73209.glsl"
import m from "../glsl/82981.glsl"
import h from "../glsl/88880.glsl"

export const MaxTrimsPerFloor = 10
export const ModelShaderConfig = {
  cube: {
    uniforms: {
      map: {
        type: "t",
        value: null
      },
      opacity: {
        type: "f",
        value: 1
      }
    },
    vertexShader: a,
    fragmentShader: l
  },
  blurCube: {
    uniforms: {
      map: {
        type: "t",
        value: null
      },
      opacity: {
        type: "f",
        value: 1
      },
      dir: {
        type: "v2",
        value: new Vector2(0, 0)
      }
    },
    vertexShader: d,
    fragmentShader: h
  },
  modelChunk: {
    uniforms: {
      [ModelChunkType.MeshTexture]: {
        map: {
          type: "t",
          value: null
        },
        meshOpacity: {
          type: "f",
          value: 0
        },
        opacity: {
          type: "f",
          value: 1
        }
      },
      [ModelChunkType.MeshTrimVertex]: {
        meshTrimMatrices: {
          type: "mat4array",
          value: []
        },
        meshTrimsDiscardContents: {
          type: "barray",
          value: new Array(MaxTrimsPerFloor).fill(!0)
        },
        hasKeepVolume: {
          type: "b",
          value: !1
        }
      },
      [ModelChunkType.MeshTrimPixel]: {
        meshTrimMatrices: {
          type: "mat4array",
          value: []
        },
        meshTrimsDiscardContents: {
          type: "barray",
          value: new Array(MaxTrimsPerFloor).fill(!0)
        },
        hasKeepVolume: {
          type: "b",
          value: !1
        }
      },
      [ModelChunkType.FloorTrimVertex]: {
        floorHeightMin: {
          type: "f",
          value: 0
        },
        floorHeightMax: {
          type: "f",
          value: 1
        },
        floorTrimHeight: {
          type: "f",
          value: 1
        }
      },
      [ModelChunkType.FloorTrimPixel]: {
        floorHeightMin: {
          type: "f",
          value: 0
        },
        floorHeightMax: {
          type: "f",
          value: 1
        },
        floorTrimHeight: {
          type: "f",
          value: 1
        }
      },
      [ModelChunkType.PanoTexture]: {
        pano0Map: {
          type: "t",
          value: null
        },
        pano0Position: {
          type: "v3",
          value: new Vector3()
        },
        pano0Matrix1: {
          type: "m4",
          value: new Matrix4()
        },
        pano0Matrix2: {
          type: "m4",
          value: new Matrix4()
        },
        panoOpacity: {
          type: "f",
          value: 1
        }
      },
      [ModelChunkType.PanoTextureTransition]: {
        progress: {
          type: "f",
          value: 0
        },
        pano1Map: {
          type: "t",
          value: null
        },
        pano1Position: {
          type: "v3",
          value: new Vector3()
        },
        pano1Matrix1: {
          type: "m4",
          value: new Matrix4()
        },
        pano1Matrix2: {
          type: "m4",
          value: new Matrix4()
        }
      },
      [ModelChunkType.PanoOverlay]: {
        overlay0Map: {
          type: "t",
          value: null
        },
        overlay0Matrix: {
          type: "m4",
          value: new Matrix4()
        }
      },
      [ModelChunkType.PanoOverlayTransition]: {
        overlay1Map: {
          type: "t",
          value: null
        },
        overlay1Matrix: {
          type: "m4",
          value: new Matrix4()
        }
      },
      [ModelChunkType.ColorOverlay]: {
        colorOverlay: {
          type: "v4",
          value: null
        }
      },
      [ModelChunkType.MeshPreviewSphere]: {
        meshPreviewCenter: {
          type: "v3",
          value: null
        },
        meshPreviewSize: {
          type: "f",
          value: 0.3
        }
      },
      [ModelChunkType.Wireframe]: {
        time: {
          type: "f",
          value: 0
        },
        fill: {
          type: "c",
          value: new Color(16711680)
        },
        stroke: {
          type: "c",
          value: new Color(16777215)
        },
        dualStroke: {
          type: "b",
          value: !1
        },
        fillEnabled: {
          type: "b",
          value: !1
        },
        insideAltColor: {
          type: "b",
          value: !1
        },
        thickness: {
          type: "f",
          value: 0.1
        },
        secondThickness: {
          type: "f",
          value: 0.1
        },
        dashEnabled: {
          type: "b",
          value: !1
        },
        dashRepeats: {
          type: "f",
          value: 10
        },
        dashOverlap: {
          type: "b",
          value: !1
        },
        dashLength: {
          type: "f",
          value: 0.1,
          range: [0, 1]
        },
        dashAnimate: {
          type: "b",
          value: !1
        },
        squeeze: {
          type: "b",
          value: !1
        },
        squeezeMin: {
          type: "f",
          value: 0.1
        },
        squeezeMax: {
          type: "f",
          value: 1
        },
        wireframeOpacity: {
          type: "f",
          value: 1,
          range: [0, 1]
        }
      }
    },
    vertexShader: m,
    fragmentShader: g
  },
  modelOutside: {
    uniforms: {
      map: {
        type: "t",
        value: null
      },
      opacity: {
        type: "f",
        value: 1
      },
      colorOverlay: {
        type: "v4",
        value: new Vector4(0, 0, 0, 0)
      }
    },
    vertexShader: y,
    fragmentShader: E
  },
  depth: {
    uniforms: {
      opacity: {
        type: "f",
        value: 1
      },
      maxDistance: {
        type: "f",
        value: 20
      }
    },
    vertexShader: O,
    fragmentShader: _
  }
}
