import {
  AddInMemoryLayerCommand,
  AddUserLayerCommand,
  AddUserViewCommand,
  CheckForProxyLayerCommand,
  ConvertModelToLayeredCommand,
  DataLayerDuplicateCommand,
  LayerItemsCopyCommand,
  LayerItemsCopyNewCommand,
  LayerItemsMoveCommand,
  LayerSelectCommand,
  LayerToggleCommand,
  LayerToggleCommonCommand,
  LayerToggleVisibleCommand,
  ModelViewSetCommand,
  RegisterConfirmViewChangeCommand,
  RegisterDuplicateViewHelperCommand,
  RenameLayerCommand,
  SetLayerPositionCommand,
  UnregisterDuplicateViewHelperCommand,
  ViewDeleteCommand,
  ViewDuplicateCommand,
  ViewItemsDeleteCommand,
  ViewRenameCommand,
  ViewToggleEnableCommand,
  DeleteLayerCommand as _DeleteLayerCommand,
  DisableWorkshopSessionCommand as _DisableWorkshopSessionCommand
} from "../command/layers.command"
import { SaveCommand } from "../command/save.command"
import { DataLayerType, ModelViewType } from "../const/63319"
import { DataType } from "../const/79728"
import { defaultLayerId, prefetchKey } from "../const/mds.const"
import { LayersSymbol } from "../const/symbol.const"
import { searchModeType } from "../const/typeString.const"
import { DebugInfo } from "../core/debug"
import EngineContext from "../core/engineContext"
import { MdsStore } from "../core/mds.store"
import MdsContext from "../core/mdsContext"
import { Module } from "../core/module"
import { LayersData } from "../data/layers.data"
import { PolicyData } from "../data/policy.data"
import { SettingsData } from "../data/settings.data"
import { BaseExceptionError } from "../error/baseException.error"
import { InvalidViewError, MdsWriteError } from "../error/mdsRead.error"
import { LayerAddedMessage, LayersBatchItemsCompleteMessage } from "../message/layer.message"
import { ModelView } from "../modelView"
import { ModelviewDeserializer } from "../modelviewDeserializer"
import { DataLayer } from "../object/dataLayer.object"
import { isIncludes } from "../other/29708"
import { FeaturesNotesModeKey } from "../other/39586"
import { DataLayersFeatureKey, LayersPolicy, ModelViewsFeatureKey, getViewsPolicy } from "../other/76087"
import { ObjectInsightsFeatureKey } from "../other/96776"
import { AggregateSubscription } from "../subscription/aggregate.subscription"
import { changeUrlWithParams } from "../utils/browser.utils"
import { toDate } from "../utils/date.utils"
import { copyURLSearchParams } from "../utils/urlParams.utils"
import { isBaseView, isInsightsView, isLayeredBaseView } from "../utils/view.utils"

declare global {
  interface SymbolModule {
    [LayersSymbol]: LayersModule
  }
}

class LayersViewError extends BaseExceptionError {
  constructor(e, t = "80001") {
    super(e)
    this.name = "LayersViewError"
    this.code = t
  }
}

const P = new DebugInfo("MdsModelViewStore")

class ViewStore extends MdsStore {
  deserializer: ModelviewDeserializer

  constructor(e) {
    super(e)
    this.prefetchKey = prefetchKey
    this.deserializer = new ModelviewDeserializer()
  }

  async read() {
    if (!this.viewId) throw new InvalidViewError("Cannot read Views, no initial view configured")
    //pw
    // const n = (
    //   await this.query(I.GetViews, {
    //     modelId: this.viewId
    //   }).catch(e => {
    //     throw new MdsReadError(e)
    //   })
    // )?.data?.model?.views
    const n = [
      {
        id: this.viewId,
        type: "matterport.model.default",
        name: "",
        enabled: true
      }
    ]
    const i: any[] = []
    if (n) {
      for (const e of n) {
        const deserialize = this.deserializer.deserialize(e)
        deserialize && i.push(deserialize)
      }
    }
    i.sort((e, t) => e.created.getTime() - t.created.getTime())
    return i
  }

  async readView(e) {
    //pw
    // const i = (
    //   await this.query(I.GetView, {
    //     viewId: e
    //   }).catch(e => {
    //     throw new MdsReadError(e)
    //   })
    // )?.data?.modal?.views
    const i = []
    if (!i || 1 !== i.length) throw new InvalidViewError("GetView failed")
    const s = this.deserializer.deserialize(i[0])
    if (!s) throw new InvalidViewError("Cannot read view")
    return s
  }

  async create(e) {
    const t = this.getBaseViewId()
    // return this.mutate(I.AddUserView, {
    //   modelId: t,
    //   name: e
    // }).then(e => {
    //   return this.deserializer.deserialize(e?.data?.addView)
    // })
    return Promise.resolve()
  }

  async delete(e, t) {
    const modelId = this.getBaseViewId()
    if (e === modelId) throw new InvalidViewError("Cannot delete the base view")
    // const s = !!(
    //   await this.mutate(I.DeleteView, {
    //     modelId,
    //     viewId: e,
    //     deleteLayersIfOrphaned: t
    //   })
    // )?.data?.deleteView

    // !s && P.error("View deletion failed!")
    // return s
    return !0
  }

  async copyItemsToLayer(e, t, n) {
    // const s = !!(
    //   await this.mutate(I.CopyViewDataToLayer, {
    //     viewId: e,
    //     layerId: t,
    //     copyDataFrom: n
    //   })
    // )?.data?.copyViewData
    // !s && P.error("CopyViewData failed!")
    // return s
    return !0
  }

  async moveItemsToLayer(e, t, n) {
    // const s = !!(
    //   await this.mutate(I.MoveViewDataToLayer, {
    //     viewId: e,
    //     layerId: t,
    //     viewSelections: n
    //   })
    // )?.data?.moveViewData
    // !s && P.error("MoveViewDataToLayer failed!")
    // return s
    return !0
  }

  async deleteItemsFromView(e, t) {
    if (t.find(e => !e.ids || !e.ids.length)) {
      P.error("deleteItemsFromView fails without list of ids")
      return !1
    }

    // const i = !!(
    //   await this.mutate(I.DeleteFromView, {
    //     viewId: e,
    //     viewSelections: t
    //   })
    // )?.data?.deleteFromView
    // !i && P.error("DeleteFromView failed!")
    // return i
    return !0
  }

  async rename(e, t) {
    // const s = (
    //   await this.mutate(I.RenameView, {
    //     viewId: e,
    //     name: t
    //   })
    // )?.data?.patchView?.name
    // if (null == s) throw new MdsWriteError("Unable to rename view!")
    // return s
    return t
  }

  async setEnabled(e, t) {
    // const s = (
    //   await this.mutate(I.SetViewEnabled, {
    //     viewId: e,
    //     enabled: t
    //   })
    // )?.data?.patchView?.enabled
    // if (null == s) throw new MdsWriteError("Unable to enable/disable view!")
    // return s
    return t
  }

  async convertModelToLayered(e) {
    // const n = (
    //   await this.mutate(I.ConvertRootViewToLayered, {
    //     modelId: e
    //   })
    // )?.data?.convertRootViewToLayered
    //pw
    const n = null
    if (null == n) throw new MdsWriteError("Unable to convert model to layered!")
    const i = this.deserializer.deserialize(n)
    if (!i) throw new InvalidViewError("Cannot read converted view")
    return i
  }

  async convertModelToLegacy(e) {
    // const n = (
    //   await this.mutate(I.ConvertRootViewToLegacy, {
    //     modelId: e
    //   })
    // )?.data?.convertRootViewToLegacy
    //pw
    const n = null
    if (null == n) throw new MdsWriteError("Unable to convert model to legacy!")
    const i = this.deserializer.deserialize(n)
    if (!i) throw new InvalidViewError("Cannot read converted view")
    return i
  }

  async duplicate(e, t, n, i) {
    // var s
    // const r = await this.mutate(I.DuplicateView, {
    //   modelId: e,
    //   viewId: t,
    //   name: n,
    //   enabled: i
    // })
    // return this.deserializer.deserialize(r?.data?.addView)
    return undefined
  }

  async hasWorkshopChanges(e) {
    // const s = (
    //   await this.client
    //     .query(I.GetMergeDiff, {
    //       viewId: e
    //     })
    //     .catch(e => {
    //       throw new MdsReadError(e)
    //     })
    // )?.data?.model?.mergeDiff?.typesModified
    const s = []
    return !!s && s.length > 0
  }
}

const D = new DebugInfo("mds-modelview-deserializer")

class LayerStoreDeserialize {
  deserialize(e) {
    return e && e.layer.id && e.layer.type
      ? new DataLayer({
          id: e.layer.id,
          name: e.layer.label || "",
          visible: e.visible,
          position: e.position,
          toggled: !0,
          layerType: this.getLayerType(e.layer.type),
          created: toDate(e.layer.created),
          modified: toDate(e.layer.modified)
        })
      : (D.debug("Invalid layer data from MDS"), null)
  }

  getLayerType(e: DataLayerType) {
    return isIncludes(DataLayerType, e) ? e : DataLayerType.OTHER
  }
}

class LayerStore extends MdsStore {
  deserializer: LayerStoreDeserialize

  constructor(e) {
    super(e)
    this.deserializer = new LayerStoreDeserialize()
    this.prefetchKey = "data.view.layers"
  }

  async read() {
    return this.readLayersForView(this.getViewId())
  }

  async readLayersForView(e, t = !0) {
    const s = {
      viewId: e,
      modelId: e
    }
    const r = {
      prefetchKey: t ? this.prefetchKey : void 0,
      fetchPolicy: t ? "cache-first" : "no-cache"
    }
    //pw
    // const a = (
    //   await this.query(k.GetLayers, s, r).catch(e => {
    //     throw new MdsReadError(e)
    //   })
    // ).data?.view?.layers

    const a = [
      {
        layer: {
          id: "aaaaaaaaaaaaaaaaaaaaaaaaa",
          created: "2020-02-11T01:21:33Z",
          modified: "2024-08-06T09:02:40Z",
          type: "matterport.base",
          name: null,
          label: ""
        },
        position: 0,
        visible: true
      }
    ]
    if (!a) throw new Error("No layers to read for view!")
    const o: DataLayer[] = []
    for (const e of a) {
      const t = this.deserializer.deserialize(e)
      t && o.push(t)
    }
    return o
  }

  async addLayer(e, t, n, i, s = !0) {
    //pw
    // const o = {
    //   viewId: this.getViewId(),
    //   label: e,
    //   writable: t,
    //   position: n,
    //   copyDataFrom: i,
    //   generateIds: s
    // }
    // const l = (
    //   await this.mutate(k.AddLayer, o).catch(e => {
    //     throw new MdsWriteError(e)
    //   })
    // ).data?.layer?.id
    // if (!l) throw new Error("Unable to get id for new layer")
    // return l
    return ""
  }

  async addCommonLayer(e, t) {
    //pw
    // const s = {
    //   viewId: this.getViewId(),
    //   label: e,
    //   position: t
    // }
    // const r = (
    //   await this.mutate(k.AddCommonLayer, s).catch(e => {
    //     throw new MdsWriteError(e)
    //   })
    // ).data?.layer?.id
    // if (!r) throw new Error("Unable to get id for new common layer")
    // await this.refresh()
    // return r
    return ""
  }

  async duplicateLayer(e, t, n) {
    //pw
    // const r = {
    //   viewId: this.getViewId(),
    //   label: e,
    //   visible: t,
    //   copyDataFrom: n
    // }
    // const a = (
    //   await this.mutate(k.DuplicateLayer, r).catch(e => {
    //     throw new MdsWriteError(e)
    //   })
    // ).data?.layer?.id
    // if (!a) throw new Error("Unable to duplicate layer")
    // await this.refresh()
    // return a
    return ""
  }

  async convertLayerToCommon(e, t, n) {
    //pw
    // const r = {
    //   viewId: this.getViewId(),
    //   layerId: e,
    //   visible: t,
    //   position: n
    // }
    // if (
    //   !(
    //     await this.mutate(k.ConvertToCommonLayer, r).catch(e => {
    //       throw new MdsWriteError(e)
    //     })
    //   ).data?.convertToCommonLayer?.id
    // ) {
    //   throw new Error("Unable to convert layer to common")
    // }
    await this.refresh()
  }

  async convertLayerToDedicated(e) {
    //pw
    // const i = {
    //   viewId: this.getViewId(),
    //   layerId: e
    // }
    // if (
    //   !(
    //     await this.mutate(k.ConvertToDedicatedLayer, i).catch(e => {
    //       throw new MdsWriteError(e)
    //     })
    //   ).data?.convertToDedicatedLayer?.id
    // ) {
    //   throw new Error("Unable to convert layer to dedicated")
    // }

    await this.refresh()
  }

  async patchLayer(e, t, n, i, s) {
    //pw
    // const o = {
    //   viewId: this.getViewId(),
    //   layerId: e,
    //   layerLabel: t,
    //   writable: n,
    //   position: i,
    //   visible: s
    // }
    // if (
    //   !(
    //     await this.mutate(k.PatchLayer, o).catch(e => {
    //       throw new MdsWriteError(e)
    //     })
    //   ).data?.patchLayer?.id
    // ) {
    //   throw new Error("No data returned by patch")
    // }
    // if (!n || !i || !s) {
    //   await this.refresh()
    // }
  }

  async patchLayerViews(e, t, n, i?) {
    //pw
    // const a = t.map(e => ({
    //   viewId: e,
    //   visible: n,
    //   remove: i
    // }))
    // const o = {
    //   viewId: this.getViewId(),
    //   layerId: e,
    //   views: a
    // }
    // if (
    //   !(
    //     await this.mutate(k.PatchLayerViews, o).catch(e => {
    //       throw new MdsWriteError(e)
    //     })
    //   ).data?.patchLayerViews?.id
    // ) {
    //   throw new Error("No data returned by patchLayerViews")
    // }

    await this.refresh()
  }

  async deleteLayer(e) {
    //pw
    // const t = {
    //   viewId: this.getViewId(),
    //   layerId: e
    // }
    // await this.mutate(k.DeleteLayer, t).catch(e => {
    //   throw new MdsWriteError(e)
    // })
    return !0
  }

  async convertToProxiedLayering() {
    //pw
    // const e = {
    //   modelId: this.getBaseViewId()
    // }
    // await this.mutate(k.ConvertToProxiedLayering, e)
    return !0
  }
}

export default class LayersModule extends Module {
  viewChangeConfirmers: Array<() => Promise<any>>
  duplicateHelpers: Set<{
    beforeDuplicate: Function
    afterDuplicate: Function
  }>
  onHistoryPop: () => void
  data: LayersData
  layerModelAndUpdate: (...t: any[]) => Promise<void>
  viewStore: ViewStore
  layerStore: LayerStore
  checkForProxyLayer: (...t: any[]) => Promise<void>
  settingsData: SettingsData
  config: any
  engine: EngineContext
  editViewHandlers: AggregateSubscription
  editLayerHandlers: AggregateSubscription

  constructor() {
    super(...arguments)
    this.name = "layers"
    this.viewChangeConfirmers = []
    this.duplicateHelpers = new Set()
    this.onHistoryPop = () => {
      if (this.data.getCurrentView().viewType === ModelViewType.SESSION) return
      const e = copyURLSearchParams(),
        t = e.get("m") || e.get("model")
      t && t !== this.data.currentViewId && this.setActiveModelView(t)
    }
    this.layerModelAndUpdate = this.modifyInsideSaveCommand(
      (() => {
        let e: Promise<any>
        return async () => {
          if (!e) {
            e = new Promise(async e => {
              const t = this.data.getBaseModelView()
              if (t && !isLayeredBaseView(t)) {
                const e = await this.viewStore.convertModelToLayered(t.id),
                  n = await this.layerStore.readLayersForView(this.data.getBaseModelId(), !1)
                this.updateViewDetails(t, e), t.layers.replace(n)
              }
              e(void 0)
            })
          }
          await e
        }
      })()
    )
    this.checkForProxyLayer = this.modifyInsideSaveCommand(async () => {
      if (this.data.isWorkshopSessionView()) throw new Error("Workshop session view not supported!")
      const e = this.data.getBaseModelView()
      if (!e) return
      if (!this.data.getProxyLayerId()) {
        await this.layerStore.convertToProxiedLayering()
        const t = await this.layerStore.readLayersForView(this.data.getBaseModelId(), !1)
        if (!e) throw new Error("Expected base view when converting to proxied layer!!")
        e.layers.replace(t)
        const n = this.data.getCurrentView()
        if (n !== e) {
          const e = await this.layerStore.readLayersForView(n.id, !1)
          n.layers.replace(e)
        }
      }
    })
  }

  async init(e, t: EngineContext) {
    const { baseUrl, readonly, viewId, mdsContext } = e
    const { commandBinder: d, market: u } = t
    const [p, m] = await Promise.all([t.market.waitForData(SettingsData), t.market.waitForData(PolicyData)])
    this.data = new LayersData(
      mdsContext,
      new ModelView({
        id: viewId
      })
    )
    this.settingsData = p
    this.config = e
    this.viewStore = new ViewStore({
      context: mdsContext,
      readonly,
      baseUrl,
      viewId
    })
    this.engine = t
    await this.loadViews()
    const b = await this.getInitialViewId()
    const E = b === this.data.getWorkshopSessionView()?.id
    const S = getViewsPolicy(m)
    const O = !E && this.isViewsPolicyEnabled(S)
    this.setViewsFeatureSetting(O)
    const _ = !E && this.isDataLayersPolicyEnabled(S)
    this.setLayersFeatureSetting(_)
    mdsContext.baseViewId = this.data.getBaseModelId()
    this.layerStore = new LayerStore({
      context: mdsContext,
      readonly,
      baseUrl
    })
    if (_) {
      this.layerStore.onNewData(async e => {
        const t = e.filter(e => e.layerType !== DataLayerType.WORKSHOP).sort((e, t) => e.position - t.position)
        if (!t.length) throw new Error("No layers available!!")
        const n = this.data.getCurrentView(),
          i = n.layers.filter(e => e.layerType === DataLayerType.IN_MEMORY)
        for (const e of i) t.push(e)
        n.layers.replace(t)
        const r = this.data.activeLayerId
        if (!r || !t.find(e => e.id === r)) {
          const e = this.data.filterUserFacingLayers(t)
          this.data.setActiveCurrentLayer(e[0].id)
        }
      })
    }
    if (this.data.currentViewId !== this.data.getBaseModelId() || !_) {
      const e = await this.layerStore.readLayersForView(this.data.getBaseModelId(), !1)
      const t = this.data.getBaseModelView()
      t && t.layers.replace(e)
    }
    mdsContext.autoProvisionLayerCheckCallback = async e => {
      this.data.getLayer(e) || (await this.layerStore.refresh())
    }
    await this.setActiveModelView(b)
    this.updateMdsContext()
    _ || (this.data.setBaseLayerOnly(), this.data.setActiveCurrentLayer(defaultLayerId))
    window.addEventListener("popstate", this.onHistoryPop)
    if (!this.config.readonly) {
      this.bindings.push(
        d.addBinding(
          _DisableWorkshopSessionCommand,
          this.modifyInsideSaveCommand(() => this.disableWorkshopSession())
        ),
        d.addBinding(ConvertModelToLayeredCommand, () => this.convertModelToLayered()),
        d.addBinding(CheckForProxyLayerCommand, () => this.checkForProxyLayer())
      )
      if (O) {
        this.editViewHandlers = new AggregateSubscription(
          d.addBinding(
            AddUserViewCommand,
            this.modifyInsideSaveCommand(e => this.addUserView(e.name))
          ),
          d.addBinding(
            ViewDeleteCommand,
            this.modifyInsideSaveCommand(e => this.deleteView(e.viewId))
          ),
          d.addBinding(
            ViewRenameCommand,
            this.modifyInsideSaveCommand(e => this.renameView(e.viewId, e.name))
          ),
          d.addBinding(
            ViewToggleEnableCommand,
            this.modifyInsideSaveCommand(e => this.setViewEnabled(e.viewId, e.enabled))
          ),
          d.addBinding(
            ViewDuplicateCommand,
            this.modifyInsideSaveCommand(e => this.duplicateView(e.viewId, e.name))
          )
        )
        O || this.editViewHandlers.cancel()
      }
      if (_) {
        this.editLayerHandlers = new AggregateSubscription(
          d.addBinding(
            AddUserLayerCommand,
            this.modifyInsideSaveCommand(e => this.addLayer(e.label, e.common))
          ),
          d.addBinding(
            DataLayerDuplicateCommand,
            this.modifyInsideSaveCommand(e => this.duplicateLayer(e.layerId, e.label))
          ),
          d.addBinding(
            _DeleteLayerCommand,
            this.modifyInsideSaveCommand(e => this.deleteLayer(e.layerId))
          ),
          d.addBinding(
            LayerToggleCommonCommand,
            this.modifyInsideSaveCommand(e => this.toggleLayerAsCommon(e.layerId, e.common))
          ),
          d.addBinding(
            LayerToggleVisibleCommand,
            this.modifyInsideSaveCommand(e => this.toggleLayerVisible(e.layerId, e.visible))
          ),
          d.addBinding(
            RenameLayerCommand,
            this.modifyInsideSaveCommand(e => this.renameLayer(e.layerId, e.label))
          ),
          d.addBinding(
            SetLayerPositionCommand,
            this.modifyInsideSaveCommand(e => this.setLayerPosition(e.layerId, e.position))
          ),
          d.addBinding(
            LayerItemsCopyCommand,
            this.modifyInsideSaveCommand(e => this.copyItemsToLayer(e.items, e.layerId))
          ),
          d.addBinding(
            LayerItemsCopyNewCommand,
            this.modifyInsideSaveCommand(e => this.copyItemsToLayer(e.items, null, e.name))
          ),
          d.addBinding(
            LayerItemsMoveCommand,
            this.modifyInsideSaveCommand(e => this.moveItemsToLayer(e.items, e.layerId))
          ),
          d.addBinding(
            ViewItemsDeleteCommand,
            this.modifyInsideSaveCommand(e => this.deleteItemsFromView(e.items))
          )
        )
        _ || this.editLayerHandlers.cancel()
      }
    }

    _ && this.bindings.push(d.addBinding(LayerToggleCommand, e => this.toggleLayer(e.layerId, e.on)))
    O && _ && this.bindings.push(this.data.onPropertyChanged("currentViewId", () => this.updateMdsContext()))
    this.bindings.push(
      d.addBinding(AddInMemoryLayerCommand, async e => this.addInMemoryLayer(e.layerProps)),
      d.addBinding(ModelViewSetCommand, e => this.setActiveModelView(e.viewId)),
      d.addBinding(RegisterConfirmViewChangeCommand, async e => this.registerConfirmViewChange(e.confirmViewChange)),
      d.addBinding(RegisterDuplicateViewHelperCommand, async e => this.duplicateHelpers.add(e)),
      d.addBinding(UnregisterDuplicateViewHelperCommand, async e => this.duplicateHelpers.delete(e)),
      d.addBinding(LayerSelectCommand, e => this.selectLayer(e.layerId, e.selected))
    )
    u.register(this, LayersData, this.data)
    let w = this.onInMemoryLayerChanges()
    this.data.onPropertyChanged("currentViewId", () => {
      w && w.cancel(), (w = this.onInMemoryLayerChanges())
    })
  }

  dispose(e) {
    super.dispose(e)
    this.editViewHandlers?.cancel()
    this.editLayerHandlers?.cancel()
    window.removeEventListener("popstate", this.onHistoryPop)
  }

  async getInitialViewId() {
    const { viewId, inWorkshop } = this.config
    const n = this.data.getBaseModelView()
    if (inWorkshop && n && n.id === viewId && !isLayeredBaseView(n)) {
      const e = this.data.getWorkshopSessionView()
      if (e && e.enabled) {
        if (await this.viewStore.hasWorkshopChanges(e.id)) return e.id
      }
    }
    return viewId as string
  }

  isDataLayersPolicyEnabled(e: LayersPolicy) {
    return [LayersPolicy.LAYERS_ONLY, LayersPolicy.VIEWS_AND_LAYERS].includes(e)
  }

  isViewsPolicyEnabled(e: LayersPolicy) {
    return [LayersPolicy.VIEWS_OPTIONAL_OPT_IN, LayersPolicy.VIEWS_ENABLED, LayersPolicy.VIEWS_AND_LAYERS].includes(e)
  }

  setViewsFeatureSetting(e: boolean) {
    this.settingsData.setProperty(ModelViewsFeatureKey, e)
    // this.engine.getModuleBySymbol(AnalyticsSymbol).then(t => {
    //   t.trackFeatures(`${SETTING_USER_VIEWS_ANALYTIC}:${e}`)
    // })
  }

  setLayersFeatureSetting(e: boolean) {
    this.data.layersEnabled = e
    this.data.commit()
    this.settingsData.setProperty(DataLayersFeatureKey, e)
    // this.engine.getModuleBySymbol(AnalyticsSymbol).then(t => {
    //   t.trackFeatures(`${SETTING_DATA_LAYERS_ANALYTIC}:${e}`)
    // })
  }

  async loadViews() {
    const e = await this.viewStore.read()
    e.length > 0 && (this.data.setViews(e), this.log.debug("Loaded views", e))
  }

  async setActiveModelView(e: string) {
    const { currentViewId } = this.data
    if (e === currentViewId || !(await this.canChangeView())) return
    const n = this.data.getView(e)
    if (n) {
      const e = currentViewId
      this.log.debug(`Switching to view: ${n.id} (${n.viewType}), from: ${e}`), this.data.setCurrentView(n.id), await this.refreshView(n, e)
    } else this.log.warn(`Missing model view '${e}'`)
  }

  async refreshView(e, t?) {
    const mdsContext = this.config.mdsContext as MdsContext
    const i = this.settingsData.tryGetProperty(DataLayersFeatureKey, !1)
    //pw
    // const r = new PrefetchedQueryCache({
    //   baseUrl: this.config.baseUrl,
    //   prefetchPolicy: PrefetchPolicyType.PRELOAD,
    //   query: GetModelViewPrefetch,
    //   variables: {
    //     modelId: e.id,
    //     includeDisabled: !this.config.readonly,
    //     includeLayers: i && this.viewSupportsLayers()
    //   },
    //   initialData: void 0
    // })
    // mdsContext.sharedCaches.add(r)
    // ;(await r.preload())
    //   ? (i && (this.layerStore.setStoreViewId(e.id), await this.layerStore.refresh()),
    //     await mdsContext.setCurrentViewId(e.id),
    //     this.updateBrowserOnViewChange(e),
    //     t
    //       ? (mdsContext.sharedCaches.delete(r), this.engine.broadcast(new ModelViewChangeCompleteMessage()))
    //       : this.config.modulesLoadedPromise.then(() => {
    //           mdsContext.sharedCaches.delete(r)
    //         }))
    //   : t && this.data.setCurrentView(t)
    t && this.data.setCurrentView(t)
    for (const e of this.data.commonInMemoryLayers) await e.applyTransactions()
    for (const t of e.layers) t.layerType === DataLayerType.IN_MEMORY && (await t.applyTransactions())
  }

  async canChangeView() {
    for (const e of this.viewChangeConfirmers) if (!(await e())) return !1
    return !0
  }

  registerConfirmViewChange(e: () => Promise<any>) {
    this.viewChangeConfirmers.push(e)
  }

  updateBrowserOnViewChange(e) {
    if (e.viewType === ModelViewType.SESSION) return
    const t = copyURLSearchParams()
    const n = t.get("m") || t.get("model")
    e.id !== n && (t.has("model") ? t.set("model", e.id) : t.has("m") && t.set("m", e.id), changeUrlWithParams(t.toString(), !0))
  }

  async disableWorkshopSession() {
    const e = this.data.getWorkshopSessionView()
    if (!e) return void this.log.debug("No Workshop Session View to disable.")
    if (!e.enabled) return
    const t = await this.viewStore.setEnabled(e.id, !1)
    e.enabled = t
    e.commit()
  }

  async addUserView(e) {
    if (!this.data.validateViewName(e)) throw new LayersViewError("Invalid view name!")
    const t = await this.viewStore.create(e)
    t && (this.data.addView(t), this.log.debug("Added new view"), await this.setActiveModelView(t.id))
  }

  async deleteView(e) {
    if (!this.data.canDeleteView(e)) throw new LayersViewError("Cannot delete model view")
    const t = this.data.getView(e)
    if (!t) throw new LayersViewError("Cannot delete missing view")
    const n = e === this.data.currentViewId
    const i = !isInsightsView(t)
    ;(await this.viewStore.delete(e, i)) &&
      this.data.atomic(() => {
        if ((this.data.deleteView(e), this.log.debug("Deleted user view"), n)) {
          const e = this.data.getBaseModelId()
          if (!e) throw new LayersViewError("No base view")
          this.setActiveModelView(e)
        }
      })
  }

  async copyItemsToLayer(e, t, n?) {
    const { currentViewId: i } = this.data
    const s = {}
    const r: any[] = []
    e.forEach(e => {
      if (e.supportsLayeredCopyMove()) {
        s[e.typeId] || (s[e.typeId] = [])
        const t = e.parentId || e.id
        s[e.typeId].push(t)
        r.push(e)
      }
    })
    const o: any[] = []
    for (const e in s)
      o.push({
        viewId: i,
        type: e,
        ids: s[e]
      })
    let l
    if (t) l = await this.viewStore.copyItemsToLayer(i, t, o)
    else {
      if (!n) throw new LayersViewError("No layer id or name for copy")
      l = await this.addLayer(n, !1, o)
    }
    l && (this.data.mdsContext.refreshLayeredStores(o.map(e => e.type)), this.engine.broadcast(new LayersBatchItemsCompleteMessage(r)))
  }

  async moveItemsToLayer(e, t) {
    const { currentViewId: n } = this.data
    const i = {}
    const s: any[] = []
    e.forEach(e => {
      if (e.supportsLayeredCopyMove()) {
        i[e.typeId] || (i[e.typeId] = [])
        const t = e.parentId || e.id
        i[e.typeId].push(t), s.push(e)
      }
    })
    const r: any[] = []
    for (const e in i)
      r.push({
        type: e,
        ids: i[e],
        all: !1
      })
    ;(await this.viewStore.moveItemsToLayer(n, t, r)) &&
      (this.data.mdsContext.refreshLayeredStores(r.map(e => e.type)), this.engine.broadcast(new LayersBatchItemsCompleteMessage(s)))
  }

  async deleteItemsFromView(e) {
    if (!this.data.canBatchDeleteInActiveView()) return void this.log.debug("Cannot batch delete items in non-layered model")
    const { currentViewId: t } = this.data
    const n = {}
    const i: any[] = []
    e.forEach(e => {
      if (e.supportsBatchDelete()) {
        n[e.typeId] || (n[e.typeId] = [])
        const t = e.parentId || e.id
        n[e.typeId].push(t), i.push(e)
      }
    })
    const s: any[] = []
    for (const e in n) {
      s.push({
        type: e,
        ids: n[e]
      })
    }

    ;(await this.viewStore.deleteItemsFromView(t, s)) &&
      (this.data.mdsContext.refreshLayeredStores(s.map(e => e.type)), this.engine.broadcast(new LayersBatchItemsCompleteMessage(i)))
  }

  getLayerTypesToDuplicate() {
    const e = [searchModeType.LABEL, searchModeType.MEASUREMENTPATH, searchModeType.MATTERTAG]
    this.settingsData.tryGetProperty(FeaturesNotesModeKey, !1) && e.push(searchModeType.NOTE)
    return this.settingsData.tryGetProperty(ObjectInsightsFeatureKey, !1) && e.push(searchModeType.OBJECTANNOTATION), e
  }

  async duplicateLayer(e, t) {
    const n = this.data.getLayer(e)
    if (!n) throw new LayersViewError("Unable to find layer to duplicate")
    const i = n.layerType === DataLayerType.BASE_LAYER,
      r = n.layerType === DataLayerType.VIEW_DATA_LAYER
    if (i || r) return void this.log.debug("Duplicate not supported on base or view layer")
    const o = this.getLayerTypesToDuplicate()
    const l = this.data.getCurrentView().id
    const c = o.map(t => ({
      viewId: l,
      layerId: e,
      type: t
    }))
    ;(await this.layerStore.duplicateLayer(t, n.visible, c)) && this.data.mdsContext.refreshLayeredStores(o)
  }

  async renameView(e, t) {
    const n = this.data.getView(e)
    if (!n) throw new LayersViewError("View does not exist")
    if (!this.data.validateViewName(t)) throw new LayersViewError("Invalid view name!")
    const i = await this.viewStore.rename(e, t)
    n.name = i
    n.commit()
  }

  async setViewEnabled(e, t) {
    const n = this.data.getView(e)
    if (!n) throw new LayersViewError("View does not exist")
    if (!this.data.canDisableView(e)) throw new LayersViewError("Unable to enable/disable view")
    const i = await this.viewStore.setEnabled(e, t)
    n.enabled = i
    n.commit()
  }

  async duplicateView(e, t) {
    const n = this.data.getView(e)
    if (!n) throw new LayersViewError("Cannot duplicate, view does not exist")
    if (!this.data.canDuplicateView(e)) throw new LayersViewError("Duplicate not supported on this view")
    const i = Array.from(this.duplicateHelpers.keys())
    await Promise.all(i.map(e => e.beforeDuplicate()))
    const s = await this.viewStore.duplicate(this.data.getBaseModelId(), e, t, n.enabled)
    if (!s) throw new LayersViewError("Unable to duplicate view!")
    this.data.addView(s), await this.setActiveModelView(s.id), await Promise.all(i.map(e => e.afterDuplicate()))
  }

  viewSupportsLayers() {
    return this.data.getCurrentView().viewType !== ModelViewType.SESSION
  }

  updateMdsContext() {
    const e = this.viewSupportsLayers()
    const t = this.settingsData.tryGetProperty(DataLayersFeatureKey, !1)
    const n = this.data.isCurrentViewLayered()
    this.data.mdsContext.readLayerId = e
    const i = e && t && n
    this.data.mdsContext.toggleNonBaseLayeredWrites(i!)
  }

  updateViewDetails(e, t) {
    Object.assign(e, {
      viewType: t.viewType,
      rawViewType: t.rawViewType,
      name: t.name,
      enabled: t.enabled,
      modified: t.modified
    })
    e.commit()
    this.updateMdsContext()
  }

  async convertModelToLayered() {
    if (this.data.isWorkshopSessionView()) return
    const e = this.data.getBaseModelView()
    e && !isLayeredBaseView(e) && (await this.layerModelAndUpdate())
  }

  async addLayer(e, t, n: any[] = []) {
    let i
    i = t ? await this.layerStore.addCommonLayer(e, 0) : await this.layerStore.addLayer(e, !0, 0, n)
    const s = this.data.getCurrentView()
    if (isBaseView(s) && !isLayeredBaseView(s)) {
      const e = await this.viewStore.readView(s.id)
      this.updateViewDetails(s, e)
    }
    await this.layerStore.refresh()
    this.selectLayer(i, !0)
    this.engine.broadcast(new LayerAddedMessage(i))
    return i
  }

  addInMemoryLayer(e) {
    return this.data.addInMemoryLayer(e)
  }

  onInMemoryLayerChanges() {
    const e = this.data.getCurrentView()
    const t = {
      onAdded: e => {
        e.layerType === DataLayerType.IN_MEMORY && e.applyTransactions()
      },
      onRemoved: t => {
        t.layerType === DataLayerType.IN_MEMORY && this.refreshView(e)
      }
    }
    return e.layers.onElementChanged(t)
  }

  async toggleLayerAsCommon(e, t) {
    const n = this.data.getLayer(e)
    if (!n) throw new LayersViewError("Unable to find layer to toggle common")
    t ? await this.layerStore.convertLayerToCommon(e, n.visible, 0) : await this.layerStore.convertLayerToDedicated(e)
  }

  async toggleLayerVisible(e, t) {
    const n = this.data.getLayer(e)
    if (!n) throw new LayersViewError("Unable to find layer to toggle visibility")
    if (n.layerType === DataLayerType.COMMON_USER_LAYER) {
      const n = this.data.getOrderedModelViews(!0).map(e => e.id)
      await this.layerStore.patchLayerViews(e, n, t)
    } else await this.layerStore.patchLayer(e, null, null, null, t)
  }

  async renameLayer(e, t) {
    const n = this.data.getLayer(e)!
    if (!n) throw new LayersViewError("Unable to find layer to rename")
    await this.layerStore.patchLayer(e, t, null, null, null)
    n.name = t
    n.commit()
  }

  async setLayerPosition(e, t) {
    await this.layerStore.patchLayer(e, null, null, t, null)
  }

  async deleteLayer(e) {
    if (!this.data.getLayer(e)) throw new LayersViewError("Unable to find layer to delete")
    await this.layerStore.deleteLayer(e), this.refreshView(this.data.getCurrentView())
  }

  async selectLayer(e, t) {
    const n = this.data.getViewLayerId(),
      i = this.data.getBaseLayerId(),
      s = e === n || e === i,
      r = n || i
    let o
    if (t) o = s ? r : e
    else {
      if (s) throw new LayersViewError("Cannot deselect a system layer!")
      o = r
    }
    if (!o) throw new LayersViewError("No Active layer to set")
    o !== this.data.activeLayerId && this.data.setActiveCurrentLayer(o)
  }

  async toggleLayer(e, t) {
    this.data.toggleLayer(e, t)
  }

  modifyInsideSaveCommand(e) {
    return async (...t) => {
      await this.engine.commandBinder.issueCommand(
        new SaveCommand({
          dataTypes: [DataType.LAYERS],
          onCallback: () => e(...t),
          skipDirtyUpdate: !0
        })
      )
    }
  }
}
