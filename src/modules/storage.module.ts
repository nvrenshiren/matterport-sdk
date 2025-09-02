import { SaveCommand } from "../command/save.command"
import { TransactionPhase } from "../const/45905"
import { DataType } from "../const/79728"
import { StorageSymbol } from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { createSubscription } from "../core/subscription"
import { AppData, AppMode } from "../data/app.data"
import { CameraData } from "../data/camera.data"
import { FloorsViewData } from "../data/floors.view.data"
import { LayersData } from "../data/layers.data"
import { StorageData } from "../data/storage.data"
import { SweepsData } from "../data/sweeps.data"
import { ViewmodeData } from "../data/viewmode.data"
import { BaseExceptionError } from "../error/baseException.error"
import { ForbiddenError, UnauthorizedError } from "../error/model.error"
import { AppChangeMessage } from "../message/app.message"
import { ForbiddenErrorMessage, PublishErrorMessage } from "../message/error.message"
import { ModelClient } from "../modelClient"
import { ModelView } from "../modelView"
import { changeUrlWithParams } from "../utils/browser.utils"
import { NavURLParam } from "../utils/nav.urlParam"
import { Lock } from "../worker/lock"

declare global {
  interface SymbolModule {
    [StorageSymbol]: StorageModule
  }
}

class StorageError extends BaseExceptionError {
  constructor(e, t = "50001") {
    super(e)
    this.name = "StorageError"
    this.code = t
  }
}

class PublishForbiddenError extends BaseExceptionError {
  constructor(e, t = "53100") {
    super(e)
    this.name = "ForbiddenError"
    this.code = t
  }
}

class SaveError extends BaseExceptionError {
  constructor(e, t = "53100") {
    super(e)
    this.name = "SaveError"
    this.code = t
  }
}

class PublishError extends BaseExceptionError {
  constructor(e, t = "53200") {
    super(e)
    this.name = "PublishError"
    this.code = t
  }
}

function u(e) {
  return (
    {
      [DataType.BLUR_SUGGESTIONS]: "12",
      [DataType.BLURS]: "01",
      [DataType.FLOORS]: "02",
      [DataType.HIGHLIGHTS]: "03",
      [DataType.LABELS]: "04",
      [DataType.MATTERTAGS]: "05",
      [DataType.MEASUREMENTS]: "06",
      [DataType.NOTES]: "07",
      [DataType.OBJECT_ANNOTATIONS]: "15",
      [DataType.ORDERED_LISTS]: "13",
      [DataType.PHOTOS]: "08",
      [DataType.PLUGINS]: "17",
      [DataType.SETTINGS]: "09",
      [DataType.START_LOCATION]: "10",
      [DataType.SWEEPS]: "11",
      [DataType.LAYERS]: "14",
      [DataType.ROOM_BOUNDS]: "16"
    }[e] || "99"
  )
}

const L = new DebugInfo("publishing-manager")

class C {
  engine: EngineContext
  lock: Lock
  client: ModelClient

  constructor(e, t, n) {
    this.engine = t
    this.lock = n
    this.client = e
    const { market: i } = this.engine
    Promise.all([i.waitForData(AppData), i.waitForData(LayersData)]).then(([e, n]) => {
      const i = n.getWorkshopSessionView()
      if (i)
        if (e.application === AppMode.WORKSHOP) this.publish(i)
        else {
          const e = t.subscribe(AppChangeMessage, t => {
            t.application === AppMode.WORKSHOP && (e.cancel(), this.publish(i))
          })
        }
    })
  }

  async publish(e: ModelView) {
    const t = await this.lock.lock()
    L.debug("Publishing")
    await this.mergeView(e.id).catch(e => {
      L.error(e)
      t.unlock()
      const n = "53200"
      if (e instanceof ForbiddenError || e instanceof UnauthorizedError) {
        const t = new PublishForbiddenError(e, n)
        throw (this.engine.broadcast(new ForbiddenErrorMessage(t, [])), t)
      }
      const i = new PublishError(e, n)
      throw (this.engine.broadcast(new PublishErrorMessage(i, [])), i)
    })
    t.unlock()
    ;(await this.hasWorkshopChanges(e.id)) ? L.error("Auto-Publishing failed") : (L.debug("Auto-Publishing completed"), this.reloadWorkshop())
  }

  async mergeView(e: string) {
    // const client = await this.client
    //     .query(E.PublishView, {
    //       viewId: e
    //     })
    //     .catch(e => {
    //       throw new MdsWriteError(e)
    //     }),
    //   n = "53200" === getValFromURL("error", "")
    // if (!ModelClient.isOk(client) || n) {
    //   const e = new MdsWriteError(ModelClient.getErrorMessage(client))
    //   throw (n && (e.isMock = !0), e)
    // }
  }

  async hasWorkshopChanges(e: string) {
    //pw
    // const s = (
    //   await this.client
    //     .query(E.GetMergeDiff, {
    //       viewId: e
    //     })
    //     .catch(e => {
    //       throw new MdsReadError(e)
    //     })
    // )?.data?.model?.mergeDiff?.typesModified
    const s = []
    return !!s && s.length > 0
  }

  async reloadWorkshop() {
    const { market } = this.engine
    const [t, n, i, s] = await Promise.all([
      market.waitForData(SweepsData),
      market.waitForData(ViewmodeData),
      market.waitForData(FloorsViewData),
      market.waitForData(CameraData)
    ])
    const r = NavURLParam.serialize({
      cameraData: s,
      viewmodeData: n,
      floorsViewData: i,
      sweepData: t
    })
    r.set("edit", "1")
    r.set("qs", "1")
    changeUrlWithParams(r.toString())
  }
}

export default class StorageModule extends Module {
  saveHandlers: Set<any>
  lock: Lock
  pendingSaves: number
  unsavedChangesPopup: (e) => void
  engine: EngineContext
  client: ModelClient
  config: any
  data: StorageData

  constructor() {
    super(...arguments)
    this.name = "storage"
    this.saveHandlers = new Set()
    this.lock = new Lock()
    this.pendingSaves = 0
    this.unsavedChangesPopup = e => {
      this.pendingSaves > 0 && e.preventDefault()
    }
  }

  async init(e, t: EngineContext) {
    const { baseUrl } = e
    this.config = e
    this.engine = t
    this.client = new ModelClient({
      baseUrl
    })
    this.data = new StorageData()
    this.bindings.push(
      t.commandBinder.addBinding(SaveCommand, e => this.save(e.dataTypes, e.onCallback, e.skipDirtyUpdate)),
      createSubscription(
        () => window.addEventListener("beforeunload", this.unsavedChangesPopup),
        () => window.removeEventListener("beforeunload", this.unsavedChangesPopup)
      )
    )
    t.market.waitForData(LayersData).then(e => {
      e.isWorkshopSessionView() && new C(this.client, this.engine, this.lock)
    })
    t.market.register(this, StorageData, this.data)
  }

  dispose(e) {
    super.dispose(e)
  }

  onSave(e, t: { dataType?: string; phase?: string } = {}) {
    const n = {
      callback: e,
      dataType: t?.dataType,
      phase: t?.phase || TransactionPhase.ON
    }
    return createSubscription(
      () => this.saveHandlers.add(n),
      () => this.saveHandlers.delete(n),
      !0
    )
  }

  async save(e, t, n = !1) {
    this.pendingSaves++
    // const i = await this.lock.lock()
    // const r = t => {
    //   this.log.error(t), this.pendingSaves--, i.unlock(), 0 === this.pendingSaves && this.data.setTransactionState(s.g.IDLE)
    //   const n = e[0] ? `531${u(e[0])}` : "53100"
    //   if (t instanceof ForbiddenError || t instanceof y.GT) {
    //     const i = new l(t, n)
    //     throw (this.engine.broadcast(new h.hu(i, e)), i)
    //   }
    //   const r = new c(t, n)
    //   throw (this.engine.broadcast(new h.dz(r, e)), r)
    // }
    // this.log.debug(`Saving ${[...e].join(", ")}...`), this.data.setTransactionState(s.g.SAVING)
    // const { before: a, on: o, after: d } = this.getCallbacksByPhase(this.saveHandlers, e)
    // await Promise.all(a.map(e => e())).catch(r),
    //   await Promise.all(o.map(e => e())).catch(r),
    //   t && (await t().catch(r)),
    //   this.engine.broadcast(new h.xj(e)),
    //   await Promise.all(d.map(e => e())).catch(r),
    //   this.pendingSaves--,
    //   i.unlock(),
    //   0 === this.pendingSaves && this.data.setTransactionState(s.g.IDLE),
    //   this.log.debug(`Saving ${[...e].join(", ")} completed`)
  }

  getCallbacksByPhase(e, t) {
    const n = Array.isArray(t) ? t : Object.values(DataType),
      i = [...e.values()].filter(e => !e.dataType || n.includes(e.dataType)),
      r = {
        [TransactionPhase.BEFORE]: [],
        [TransactionPhase.ON]: [],
        [TransactionPhase.AFTER]: []
      }
    return i.reduce((e, t) => (e[t.phase].push(() => t.callback(n)), e), r)
  }
}
// export const DataSavedMessage = _DataSavedMessage
// export const ForbiddenError = l
// export const ForbiddenErrorMessage = _ForbiddenErrorMessage
// export const PublishError = d
// export const PublishErrorMessage = _PublishErrorMessage
// export const SaveCommand = _SaveCommand
// export const SaveError = c
// export const SaveErrorMessage = _SaveErrorMessage
// export const StorageAnalytics = p.T
// export const StorageDataStorageData
// export const StorageError = o
// export const TransactionPhase = TransactionPhase
// export const TransactionState = s.g
// export const getErrorCodeForDataType = u
