import { Vector4 } from "three"
import { randomColorMap } from "../utils/69984"
import { SetChunkRenderModeCommand } from "../command/webgl.command"
import { RenderingMode } from "../const/22533"
import { ModelChunkType } from "../const/34742"
import { TrimFloorKey, WireframeEnabledKey } from "../const/53203"
import { ModelShaderConfig } from "../const/97178"
import { ModelMeshSymbol, SettingsSymbol } from "../const/symbol.const"
import Engine from "../core/engine"
import { SettingsData } from "../data/settings.data"
import { SettingPersistence } from "../modules/settings.module"
export default async (e: Engine) => {
  const t = await e.getModuleBySymbol(ModelMeshSymbol)
  const [n, h] = await Promise.all([e.market.waitForData(SettingsData), e.getModuleBySymbol(SettingsSymbol)])
  const m = t.commands
  await h.loadPromise.then(() => {
    h.registerButton("Mesh", "Toggle visible", () => {
      t.meshes.forEach(e => {
        e.modelMesh.visible = !e.modelMesh.visible
      })
    })
    h.registerButton("Mesh", "Toggle UV debug", () => {
      t.meshes.forEach(t => {
        const n = t.renderer.chunkRenderingModeOverride ? null : RenderingMode.UV
        e.commandBinder.issueCommand(new SetChunkRenderModeCommand(n))
      })
    })
    h.registerButton("Mesh", "Toggle depth", () => {
      t.meshes.forEach(t => {
        const n = t.renderer.chunkRenderingModeOverride ? null : RenderingMode.Depth
        e.commandBinder.issueCommand(new SetChunkRenderModeCommand(n))
      })
    })
    h.registerButton("Mesh", "Toggle transparent", () => {
      t.meshes.forEach(t => {
        const n = t.renderer.chunkRenderingModeOverride ? null : RenderingMode.Transparent
        e.commandBinder.issueCommand(new SetChunkRenderModeCommand(n))
      })
    })
    h.registerButton("Mesh", "Toggle wireframe", () => {
      t.meshes.forEach(t => {
        const n = t.renderer.chunkRenderingModeOverride ? null : RenderingMode.Wireframe
        e.commandBinder.issueCommand(new SetChunkRenderModeCommand(n))
      })
    })
    let a = !1
    h.registerButton("Mesh", "Toggle flat shading", () => {
      a = !a
      t.meshes.forEach(e => {
        for (const t of e.modelMesh.chunks) t.setFlatShading(a)
      })
    })
    const r = (() => {
      let e = !1
      return (n: boolean, a: boolean) => {
        const r = new Vector4(1, 1, 1, 0)
        var l
        e = !e
        l = n || e
        t.meshes.forEach(e => {
          for (const t of e.modelMesh.chunks) {
            const e = a ? 100 * t.id : 100 * t.meshSubgroup,
              n = l ? randomColorMap(0.5, e) : r
            t.setColorOverlay(n)
          }
        })
      }
    })()
    h.registerButton("Mesh", "Highlight Rooms", r)
    h.registerButton("Mesh", "Highlight Chunks", () => r(!0, !0))
    n.onPropertyChanged(TrimFloorKey, e => {
      t.meshes.forEach(t => {
        for (const n of t.modelMesh.chunks) {
          const a = t.meshData.meshGroups.floors.get(n.meshGroup)
          a && n.setMaterialsUniform({ floorTrimHeight: 1 - e / 100, floorHeightMin: a.boundingBox.min.y, floorHeightMax: a.boundingBox.max.y })
        }
      })
    })
    const l = (e, t, a, r, l?) => {
      h.registerSetting(e, t, a, !0, SettingPersistence.NONE, l)
      n.onPropertyChanged(t, r)
    }
    l("Wireframe", WireframeEnabledKey, !1, e => {
      t.meshes.forEach(t => {
        for (const n of t.modelMesh.chunks) n.setWireframe(e)
      })
    })
    const p = {
      [ModelChunkType.Wireframe]: {
        Wireframe: ["thickness", "wireframeOpacity", "stroke", "fillEnabled", "fill", "insideAltColor", "dualStroke", "secondThickness"],
        "Wireframe Dashes": ["dashEnabled", "dashLength", "dashAnimate", "dashOverlap"],
        "Wireframe Advanced": ["squeeze", "squeezeMin", "squeezeMax"]
      }
    }
    for (const e in p) {
      const n = ModelShaderConfig.modelChunk.uniforms[e]
      for (const a in p[e]) {
        for (const r of p[e][a]) {
          l(
            a,
            r,
            n[r].value,
            e => {
              t.meshes.forEach(t => {
                for (const n of t.modelMesh.chunks) n.setMaterialsUniform({ [r]: e })
              })
            },
            n[r].range
          )
        }
      }
    }
  })
}
