import SceneModule from "../modules/scene.module"
import { OpenDeferred } from "./deferred"

export class LazyLoader {
  module: null | SceneModule
  loaderReady: OpenDeferred<any>
  loader: null | (() => Promise<SceneModule>)
  constructor() {
    this.module = null
    this.loaderReady = new OpenDeferred()
    this.loader = null
  }
  setLoader(e: () => Promise<SceneModule>) {
    this.loader || ((this.loader = e), this.loaderReady.resolve())
  }
  async getModule() {
    if (this.module) return this.module
    await this.loaderReady
    this.loader && (this.module = await this.loader())
    if (this.module) return this.module
    throw new Error("There was an error setting up the factory")
  }
}
