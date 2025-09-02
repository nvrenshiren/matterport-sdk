import { ModelClient } from "../modelClient"
import * as i from "../error/notImplemented.error"
import { DebugInfo } from "./debug"
import { createSubscription } from "./subscription"
import { InvalidViewError, MdsWriteError, ReadOnlyError } from "../error/mdsRead.error"
import { getValFromURL } from "../utils/urlParams.utils"
import { NotImplementedError } from "../error/notImplemented.error"
import MdsContext from "./mdsContext"
const debug = new DebugInfo("MdsStore")
export class MdsStore {
  viewId: null | string
  newDataCallbacks: Set<Function>
  config: any
  context: MdsContext
  client: ModelClient
  refreshPromise?: Promise<void>
  prefetchKey: any
  layeredType?: string
  constructor(e?) {
    this.viewId = null
    this.newDataCallbacks = new Set()
    const { baseUrl, viewId } = e
    this.config = e
    this.context = e.context

    this.client = new ModelClient({
      baseUrl
    })
    viewId && (this.viewId = viewId)
  }
  dispose() {
    this.context.refreshableStores.delete(this)
  }
  async create(...e): Promise<any> {
    throw new NotImplementedError()
  }
  async read(e = {}): Promise<any> {
    throw new NotImplementedError()
  }
  async update(...e): Promise<any> {
    throw new NotImplementedError()
  }
  async delete(...e): Promise<any> {
    throw new NotImplementedError()
  }
  onNewData(e) {
    this.context.refreshableStores.add(this)
    return createSubscription(
      () => this.newDataCallbacks.add(e),
      () => this.newDataCallbacks.delete(e)
    )
  }
  async refresh(e?): Promise<any> {
    this.refreshPromise =
      this.refreshPromise ||
      this.read(e)
        .then(e => (this.newDataCallbacks.size > 0 ? Promise.all(Array.from(this.newDataCallbacks.values()).map(t => (t(e), e))) : [e]))
        .then(([e]) => e)
        .finally(() => {
          this.refreshPromise = void 0
        })
    return this.refreshPromise
  }
  async query(e, t, n: any = {}): Promise<any> {
    if (!this.getViewId()) throw new InvalidViewError("No model view specified for query")
    const i = Object.assign(
      {
        fetchPolicy: "cache-first",
        prefetchKey: this.prefetchKey
      },
      n
    )
    const { fetchPolicy: s } = n
    let a
    if ("no-cache" !== s) {
      for (const n of this.context.sharedCaches)
        if (((a = await n.read(e, t, i)), void 0 !== a)) {
          debug.debug(`Using cached response for ${i.prefetchKey}`)
          break
        }
      if (a) return a
    }
    return this.client.query(e, t, i)
  }
  async mutate(e, t, n?): Promise<any> {
    const { readonly: i } = this.config
    if (i) throw new ReadOnlyError("Cannot mutate in read-only mode")
    if (!this.getViewId()) throw new InvalidViewError("Cannot mutate, no view was specified")
    return this.client.mutate(e, t, n).then(e => {
      const t = "53100" === getValFromURL("error", "")
      if (!ModelClient.isOk(e) || t) {
        const n = new MdsWriteError(ModelClient.getErrorMessage(e))
        throw (t && (n.isMock = !0), n)
      }
      return e
    })
  }
  setStoreViewId(e) {
    this.viewId = e
  }
  getViewId() {
    const e = this.viewId || this.context.currentViewId || this.context.baseViewId
    if (!e) throw new Error("Invalid view id!")
    return e
  }
  getBaseViewId() {
    const e = this.context.baseViewId
    if (!e) throw new Error("MdsStore baseViewId invalid!")
    return e
  }
  readLayerId() {
    return !!this.context.readLayerId
  }
  writeLayerId(e) {
    return this.context.shouldWriteLayerId(e)
  }
}
