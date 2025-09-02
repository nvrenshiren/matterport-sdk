import { PrefetchPolicyType } from "./const/prefetch.const"
import { DebugInfo } from "./core/debug"
import { GetModelPrefetch } from "./interface/global.interface"
import { ModelClient } from "./modelClient"
import { dataFromJsonByString } from "./utils/object.utils"
const PrefetchedquerycacheDebugInfo = new DebugInfo("PrefetchedQueryCache")
export class PrefetchedQueryCache {
  client: ModelClient
  config: any
  data?: GetModelPrefetch
  preloadPromise: Promise<boolean>
  constructor(e) {
    const { initialData, baseUrl } = e
    this.client = new ModelClient({
      baseUrl
    })
    this.config = e
    initialData && (this.data = initialData)
  }
  async read(e, t, n: any = {}) {
    const { prefetchKey, prefetchPolicy = this.config.prefetchPolicy } = n
    if (!prefetchKey || prefetchPolicy === PrefetchPolicyType.NONE) return
    if ((null == t ? void 0 : t.modelId) !== this.config.variables.modelId) return
    prefetchPolicy !== PrefetchPolicyType.PRELOAD || this.preloadPromise || this.preload()
    void 0 === this.data && this.preloadPromise && (await this.preloadPromise)
    const a = this.has(prefetchKey)
    PrefetchedquerycacheDebugInfo.debug(`Cache ${a ? "hit" : "miss"} for ${prefetchKey}`)
    return a ? this.data : void 0
  }
  clear() {
    this.data = void 0
  }
  async preload() {
    this.preloadPromise = (async () => {
      try {
        return !0
      } catch (e) {
        PrefetchedquerycacheDebugInfo.info(e)
        this.data = undefined
        return !1
      }
    })()
    return this.preloadPromise
  }
  has(e) {
    return void 0 !== dataFromJsonByString(this.data, e)
  }
}
