import { isBaseView, isInsightsView, isLayeredBaseView, isUserView } from "../utils/view.utils"
import { MAX_LAYER_NAME_LENGTH, MAX_VIEW_NAME_LENGTH } from "../const/23829"
import { DataLayerType, ModelViewType } from "../const/63319"
import { defaultLayerId } from "../const/mds.const"
import { Data } from "../core/data"
import { DebugInfo } from "../core/debug"
import MdsContext from "../core/mdsContext"
import { createSubscription } from "../core/subscription"
import { InvalidViewError } from "../error/mdsRead.error"
import { ModelView } from "../modelView"
import { DataLayer } from "../object/dataLayer.object"
import { ChangeObserver } from "../observable/observable"
import { ObservableArray, createObservableArray } from "../observable/observable.array"
import { AggregateSubscription } from "../subscription/aggregate.subscription"
import { randomString } from "../utils/func.utils"
const debug = new DebugInfo("layers-data")
export class LayersData extends Data {
  mdsContext: MdsContext
  commonInMemoryLayers: ObservableArray<DataLayer>
  inMemoryLayers: ObservableArray<any>
  layerObservers: Set<Function>
  layerVisibilityCache: Map<string, boolean>
  layerToggledCache: Map<string, boolean>
  currentViewId: string
  initialViewId: string
  activeLayerId: string
  layersEnabled: boolean
  viewsObservable: ObservableArray<ModelView>
  aggregateLayerObserver: AggregateSubscription
  constructor(e, t) {
    super()
    this.commonInMemoryLayers = new ObservableArray()
    this.inMemoryLayers = new ObservableArray()
    this.layerObservers = new Set()
    this.layerVisibilityCache = new Map()
    this.layerToggledCache = new Map()
    this.currentViewId = ""
    this.initialViewId = ""
    this.layersEnabled = !1
    this.initialViewId = t.id
    this.viewsObservable = createObservableArray([t])
    this.mdsContext = e
  }
  setCurrentView(e) {
    if (e === this.currentViewId) return
    const t = this.getView(e)
    if (!t) throw new InvalidViewError("Model View not found")
    this.aggregateLayerObserver && this.aggregateLayerObserver.cancel(),
      debug.debug(`Active view set to ${e} (${t.viewType})`),
      (this.currentViewId = e),
      this.commit()
    const n = () => {
      this.refreshLayerCaches()
      this.layerObservers.forEach(e => e())
    }
    this.aggregateLayerObserver = new AggregateSubscription(this.getCurrentView().layers.onChanged(n), this.inMemoryLayers.onChanged(n))
    n()
  }
  getCurrentView() {
    const e = this.getView(this.currentViewId)
    if (!e) throw new InvalidViewError("Missing current model view")
    return e
  }
  getInitialView() {
    const e = this.getView(this.initialViewId)
    if (!e) throw new InvalidViewError("Missing initial model view")
    return e
  }
  addView(e) {
    this.viewsObservable.push(e)
  }
  canDeleteView(e) {
    const t = this.getView(e)
    return !!t && (isUserView(t) || isInsightsView(t))
  }
  canDisableView(e) {
    const t = this.getView(e)
    return !!t && (isUserView(t) || isInsightsView(t))
  }
  canDuplicateView(e) {
    const t = this.getView(e)
    return !!t && (isUserView(t) || isBaseView(t))
  }
  canBatchDeleteInActiveView() {
    return this.isModelLayered() || !isBaseView(this.getCurrentView())
  }
  validateViewName(e) {
    return e.length > 0 && e.length <= MAX_VIEW_NAME_LENGTH
  }
  setViews(e: ModelView[]) {
    this.viewsObservable.replace(e)
  }
  getView(e: string) {
    const t = this.viewsObservable.find(t => t.id === e)
    if (!t) throw new InvalidViewError(`Model View not found: ${e}`)
    return t
  }
  deleteView(e: string) {
    const t = this.viewsObservable.findIndex(t => t.id === e)
    ;-1 !== t && this.viewsObservable.remove(t)
  }
  hasUserViews() {
    return !!this.viewsObservable.find(e => isUserView(e))
  }
  getOrderedModelViews(e = !1) {
    const t = this.viewsObservable
        .filter(t => isUserView(t) || (e && isInsightsView(t)))
        .sort((e, t) =>
          e.name.localeCompare(t.name, void 0, {
            numeric: !0
          })
        ),
      n = this.getBaseModelView()
    return n && t.unshift(n), t
  }
  getEnabledOrderedModelViews(e = !1) {
    return this.viewsObservable
      .filter(t => t.enabled && (isUserView(t) || (e && isInsightsView(t)) || isBaseView(t)))
      .sort((e, t) =>
        e.name.localeCompare(t.name, void 0, {
          numeric: !0
        })
      )
  }
  onModelViewsChanged(e: ChangeObserver<ModelView>) {
    return this.viewsObservable.onChanged(e)
  }
  onCurrentLayersChanged(e) {
    return createSubscription(
      () => this.layerObservers.add(e),
      () => this.layerObservers.delete(e)
    )
  }
  currentLayers() {
    return this.getCurrentView().layers.values().concat(this.commonInMemoryLayers.values())
  }
  viewLayers() {
    const e = this.currentLayers()
    return this.filterUserFacingLayers(e)
  }
  filterUserFacingLayers(e: DataLayer[]) {
    const t = [DataLayerType.VIEW_DATA_LAYER, DataLayerType.USER_LAYER, DataLayerType.IN_MEMORY, DataLayerType.COMMON_USER_LAYER, DataLayerType.OTHER]
    return !!e.find(e => e.layerType === DataLayerType.VIEW_DATA_LAYER) || t.push(DataLayerType.BASE_LAYER), e.filter(e => t.includes(e.layerType))
  }
  getLayer(e: string) {
    return this.currentLayers().find(t => t.id === e)
  }
  findLayer(e: string) {
    return [...this.getCurrentView().layers.values(), ...this.inMemoryLayers.values()].find(t => t.id === e)
  }
  getActiveLayer() {
    return this.getLayer(this.activeLayerId)
  }

  getBaseLayerId() {
    const e = this.currentLayers().find(e => e.layerType === DataLayerType.BASE_LAYER)
    return (null == e ? void 0 : e.id) || defaultLayerId
  }
  getViewLayerId() {
    const e = this.currentLayers().find(e => e.layerType === DataLayerType.VIEW_DATA_LAYER)
    return null == e ? void 0 : e.id
  }
  getProxyLayerId() {
    const e = this.currentLayers().find(e => e.layerType === DataLayerType.PROXY_LAYER)
    return null == e ? void 0 : e.id
  }
  getViewLayerIdForBaseView() {
    const e = this.getBaseModelView()
    let t
    e && (t = e.layers.find(e => e.layerType === DataLayerType.VIEW_DATA_LAYER))
    return null == t ? void 0 : t.id
  }
  getCurrentUserLayers() {
    return this.currentLayers().filter(e => e.visible && [DataLayerType.USER_LAYER, DataLayerType.COMMON_USER_LAYER].includes(e.layerType))
  }
  setActiveCurrentLayer(e: string) {
    if (e === this.activeLayerId) return
    if (!this.currentLayers().find(t => t.id === e)) throw new Error("Invalid layer id!")
    this.activeLayerId = e
    this.commit()
  }
  layerVisible(e: string) {
    return !e || !this.layersEnabled || !!this.layerVisibilityCache.get(e)
  }
  layerToggled(e: string) {
    return !e || !this.layersEnabled || (!!this.layerVisible(e) && !!this.layerToggledCache.get(e))
  }
  toggleLayer(e: string, t: boolean) {
    const n = this.getLayer(e)
    if (!n) throw new Error("Attempt to toggle unknown layer!")
    this.layerToggledCache.set(e, t), (n.toggled = t), n.commit()
  }
  isInMemoryLayer(e: string) {
    return this.layersEnabled && (!e || !!this.inMemoryLayers.find(t => t.id === e))
  }
  addInMemoryLayer(e) {
    var t, n
    let i = randomString(11)
    for (; this.inMemoryLayers.find(e => e.id === i); ) i = randomString(11)
    const s = new DataLayer(
      Object.assign(Object.assign({}, e), {
        id: i,
        layerType: DataLayerType.IN_MEMORY,
        toggled: null !== (t = e.toggled) && void 0 !== t && t,
        visible: null !== (n = e.visible) && void 0 !== n && n
      })
    )
    e.common && this.commonInMemoryLayers.push(s)
    this.inMemoryLayers.push(s)
    return s
  }
  removeInMemoryLayer(e: string) {
    const t = this.inMemoryLayers.findIndex(t => t.id === e)
    if (-1 === t) throw new Error("In memory layer not found!")
    this.inMemoryLayers.splice(t, 1)
    const n = this.inMemoryLayers.findIndex(t => t.id === e)
    t > -1 && this.commonInMemoryLayers.splice(n, 1)
  }
  validateLayerName(e) {
    return e.length > 0 && e.length <= MAX_LAYER_NAME_LENGTH
  }
  replaceBackendLayers(e, t) {
    for (const t of e.keys) this.isInMemoryLayer(e.get(t).layerId) || e.delete(t)
    for (const n of Object.keys(t)) e.set(n, t[n])
  }
  setBaseLayerOnly() {
    this.commonInMemoryLayers.push(
      new DataLayer({
        id: defaultLayerId,
        layerType: DataLayerType.BASE_LAYER
      })
    )
  }
  getWorkshopSessionView() {
    return this.viewsObservable.find(e => e.viewType === ModelViewType.SESSION)
  }
  isWorkshopSessionView() {
    var e
    return this.getWorkshopSessionView()?.id === this.currentViewId
  }
  isWorkshopSessionViewEnabled() {
    var e
    return this.getWorkshopSessionView()?.enabled || !1
  }
  getBaseModelView() {
    return this.viewsObservable.find(e => isBaseView(e))
  }
  getBaseModelId() {
    var e
    return this.getBaseModelView()?.id || this.initialViewId
  }
  isModelLayered() {
    const e = this.getBaseModelView()
    return !!e && isLayeredBaseView(e)
  }
  isCurrentViewLayered() {
    const e = this.getCurrentView(),
      { viewType: t } = e
    return t === ModelViewType.LAYERED_BASE || t === ModelViewType.USER || t === ModelViewType.INSIGHTS
  }
  getNonworkshopViewId() {
    const e = this.getCurrentView()
    return e.viewType !== ModelViewType.SESSION ? e.id : this.getBaseModelId()
  }
  getWorkshopOrBaseId() {
    const e = this.getCurrentView()
    return e.viewType === ModelViewType.SESSION ? e.id : this.getBaseModelId()
  }
  getNotesLayerId(e) {
    if (e && this.layersEnabled) return this.activeLayerId
    const t = this.getViewLayerId()
    if (t) return t
    const n = this.getCurrentView()
    if (isBaseView(n)) return this.getBaseLayerId()
    if (this.layersEnabled) throw new Error("No View Layer in User View")
    return this.activeLayerId
  }
  getOrderedListsLayerId() {
    if (!this.layersEnabled) return
    const e = this.getViewLayerId()
    if (e) return e
    const t = this.getCurrentView()
    if (isBaseView(t)) return this.getBaseLayerId()
    throw new Error("No View Layer in User View")
  }
  refreshLayerCaches() {
    this.layerToggledCache.clear(), this.layerVisibilityCache.clear()
    const e = this.currentLayers()
    for (const t of e) this.layerToggledCache.set(t.id, t.toggled), this.layerVisibilityCache.set(t.id, t.visible)
  }
}
