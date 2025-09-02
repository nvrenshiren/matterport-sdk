import { ShowcaseConfigData, ShowcaseQueries } from "../interface/global.interface"

declare global {
  interface Window {
    MP_PREFETCHED_MODELDATA: ShowcaseConfigData
  }
}

export class PreFetchedModelData {
  static get hasPassword() {
    const { model: e } = window.MP_PREFETCHED_MODELDATA || {}
    return e && e.has_public_access_password
  }
  static getQuery<T extends keyof ShowcaseQueries>(e: T) {
    const s = window.MP_PREFETCHED_MODELDATA?.queries || ({} as ShowcaseQueries)
    switch (e) {
      case "GetModelPrefetch": {
        const t = s[e]
        if (!t) return
        const r = t.data?.model
        if (!r) return
        if (!r.locations?.length) return
        return t
      }
      default:
        return s[e]
    }
  }
  static get config() {
    return window.MP_PREFETCHED_MODELDATA?.config
  }
}
