import { CubeTexture, Texture } from "three"
import { PanoSizeKey } from "../const/76609"
import { DebugInfo } from "../core/debug"
import * as a from "../utils/func.utils"
import { UserApiClient } from "../modules/userInfo.module"
import { booleanMap } from "../utils/func.utils"
const ApiDebugInfo = new DebugInfo("api"),
  l = {
    [PanoSizeKey.BASE]: 256,
    [PanoSizeKey.STANDARD]: 1024,
    [PanoSizeKey.HIGH]: 2048,
    [PanoSizeKey.ULTRAHIGH]: 4096
  }
export class ShowcaseTextureLoader {
  api: UserApiClient
  sweepCubeTextures: any
  constructor(e) {
    this.api = e
    this.sweepCubeTextures = {}
  }
  useTexture(e) {
    const t = this.getTexture(e)
    if (!t) throw Error("Texture for sweep not loaded before using")
    return t
  }
  loadFace(e, t, n, s) {
    return this.loadFaceImage(e, t, n, s).then(e => {
      const t = new Texture(e)
      return (t.needsUpdate = !0), t
    })
  }
  load(e, t = PanoSizeKey.STANDARD) {
    const n = this.sweepCubeTextures[e.id]
    if (n)
      return (
        ApiDebugInfo.debug("Skipping load of pano, already loaded"),
        new Promise(function (e, t) {
          e(n)
        })
      )
    const s = [2, 4, 0, 5, 1, 3].map(n => this.loadFaceImage(e, t, n)),
      a = Promise.all(s).then(t => {
        const n = new CubeTexture(t)
        return (n.flipY = !1), (n.needsUpdate = !0), (this.sweepCubeTextures[e.id] = n), n
      })
    return (
      a.catch(() => {
        ApiDebugInfo.error(`Downloading cubemap for pano ${e.id} failed`)
      }),
      a
    )
  }
  unload(e: string) {
    var t
    const n = this.sweepCubeTextures[e]
    if (!n) throw Error("Texture for sweep not loaded before unloading")
    n.dispose(),
      null === (t = n.images) ||
        void 0 === t ||
        t.forEach(e => {
          var t, n
          null === (n = (t = e).close) || void 0 === n || n.call(t)
        }),
      (this.sweepCubeTextures[e] = null)
  }
  unloadAll(e) {
    const t = booleanMap(e)
    for (const e of Object.keys(this.sweepCubeTextures)) this.sweepCubeTextures[e] && !t[e] && this.unload(e)
  }
  async loadFaceImage(e, t, n, i?) {
    const s = l[t],
      r = await e.getFaceUrl(t, n)
    return this.api.getImageBitmap(r, s, s, i)
  }
  getTexture(e) {
    return this.sweepCubeTextures[e]
  }
}
