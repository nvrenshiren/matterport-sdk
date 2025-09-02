import { Texture, TextureLoader } from "three"
import { ThreeLoadingManager } from "../webgl/loading.manager"
import { DebugInfo } from "../core/debug"
const debugInfo = new DebugInfo("texture")
export const LoadTexture = (e: string, t?: (texture: Texture) => void, n?: (event: ErrorEvent) => void) => {
  const s = new TextureLoader(ThreeLoadingManager)
  s.crossOrigin = "anonymous"
  return s.load(e, t, void 0, t => {
    debugInfo.error(`Failed to load ${e}`)
    n && n(t)
  })
}
