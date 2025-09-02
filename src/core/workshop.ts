import * as Je from "../message/feature.message"
import * as Q from "../const/48945"
import * as j from "../const/59323"
import * as st from "../const/62519"
import { FocusOnPinInsideCommand, FocusOnPointInsideCommand, MoveToSweepCommand } from "../command/navigation.command"
import { ChangeViewmodeCommand } from "../command/viewmode.command"
import * as ne from "../const/14439"

import { TourStepCommand, TourStopCommand } from "../command/tour.command"
import { PrefetchPolicyType } from "../const/prefetch.const"
import { socialSharingKey } from "../const/settings.const"
import {
  Apiv2Symbol,
  AppPhaseSymbol,
  BlurDataSymbol,
  CameraStartSymbol,
  FloorSymbol,
  GuiSymbol,
  LabelDataSymbol,
  LayersSymbol,
  MattertagDataSymbol,
  MeasurementModeSymbol,
  PanoSymbol,
  RoomsSelectorSymbol,
  SettingsSymbol,
  ShowcaseSettingsSymbol,
  SnapshotsDataSymbol,
  StorageSymbol,
  SweepDataSymbol,
  TagsSymbol,
  ToursDataSymbol,
  TransformGizmoSymbol,
  WorkShopAnalyticsSymbol,
  WorkShopBlurEditSymbol,
  WorkShopBlurSuggestSymbol,
  WorkShopCatalogSymbol,
  WorkShopFloorsEditSymbol,
  WorkShopGridUnderlaySymbol,
  WorkShopGuiSymbol,
  WorkShopLabelsEditSymbol,
  WorkShopLayersToolSymbol,
  WorkShopOptionsEditSymbol,
  WorkShopPinConnectionSymbol,
  WorkShopPinNumbersSymbol,
  WorkShopRoomBoundToolSymbol,
  WorkShopRotationInteractionSymbol,
  WorkShopSweepEditSymbol,
  WorkShopSweepPinEditSymbol,
  WorkShopTourEditSymbol,
  WorkShopTrimEditSymbol
} from "../const/symbol.const"
import { featuresMattertagsKey } from "../const/tag.const"
import { AppMode } from "../data/app.data"
import { LayersData } from "../data/layers.data"
import { ModelData } from "../data/model.data"
import { PolicyData } from "../data/policy.data"
import { SettingsData } from "../data/settings.data"
import { TourData } from "../data/tour.data"
import { ApplicationLoadedMessage } from "../message/app.message"
import WorkshopUiModule from "../modules/workshopUi.module"
import { isMobilePhone } from "../utils/browser.utils"
import { waitRun } from "../utils/func.utils"
import { DebugInfo } from "./debug"
import Engine from "./engine"
import ShowCase from "./showcase"

import { ToolsPhotosEditorKey, ToolsStartLocationKey } from "../const/21636"
import { ToolsLabelsKey } from "../const/23037"
import { BlurMeshKey, BlurPipelineKey } from "../const/36074"
import { ToolsBlurEditorKey } from "../const/44109"
import { hasRoomBound } from "../other/47309"
import { TourStoriesKey } from "../const/59323"
import { ToolsTourEditorKey } from "../const/73596"
import { DataLayersFeatureKey, ModelViewsFeatureKey, SETTING_USER_VIEWS_ANALYTIC } from "../other/76087"
import { ToolsScanManagementKey } from "../const/76278"
import { PanoSizeKey } from "../const/76609"
import { ToolsMeasurementsKey } from "../const/8824"
import { PanoSizeBaseKey } from "../const/14439"
import { Tools360ManagementKey } from "../const/360Management.const"
import { FeaturesFloorselectKey } from "../const/floor.const"
import { FeaturesMeshtrimKey } from "../const/meshtrim.const"
import SettingsModule from "../modules/settings.module"
import { Organization, UserInfoClass } from "../modules/userInfo.module"
import { SettingsToggler } from "./settingsToggler"
import { WorkShopFeatureMessage } from "../message/feature.message"
import GridUnderlayModule from "../modules/gridUnderlay.module"
import PinEditorModule from "../modules/pinEditor.module"
import PinNumbererModule from "../modules/pinNumberer.module"
import PinConnectionModule from "../modules/pinConnection.module"
import RotationInteractionModule from "../modules/rotationInteraction.module"
import RoomSelectorModule from "../modules/roomSelector.module"
import SweepEditorModule from "../modules/sweepEditor.module"
import LabelsEditorModule from "../modules/labelsEditor.module"
import FloorsEditorModule from "../modules/floorsEditor.module"
import TourEditorModule from "../modules/tourEditor.module"
import PlayeroptionsEditorModule from "../modules/playeroptionsEditor.module"
import MeshTrimModule from "../modules/meshTrim.module"
import TransformGizmoModule from "../modules/transformGizmo.module"
import VisionCatalogModule from "../modules/visionCatalog.module"
const debug = new DebugInfo("Workshop")
export default class WorkShop extends ShowCase {
  stopWSTourHook: (e: Engine) => Promise<void>
  settingsToggler: any
  workshopGui: WorkshopUiModule
  getWorkshopSettings: (e: any, t: any, n: any, i: any) => Record<string, any>
  constructor(e = !0, t = {}, n = !1) {
    super(e, t, n)
    this.stopWSTourHook = async e => {
      ;(await e.market.waitForData(TourData)).tourPlaying && (e.commandBinder.issueCommand(new TourStopCommand()), await waitRun(10))
    }
    this.getWorkshopSettings = (e, t, n, i) => ({
      [socialSharingKey]: !1,
      quickstart: !1,
      [ToolsMeasurementsKey]: e.has(ToolsMeasurementsKey),
      [ToolsPhotosEditorKey]: e.has(ToolsPhotosEditorKey),
      [ToolsScanManagementKey]: e.has(ToolsScanManagementKey),
      [Tools360ManagementKey]: e.has(Tools360ManagementKey),
      [ToolsLabelsKey]: e.has(ToolsLabelsKey),
      [ToolsStartLocationKey]: e.has(ToolsStartLocationKey),
      [ToolsTourEditorKey]: e.has(ToolsTourEditorKey),
      [FeaturesMeshtrimKey]: e.has(FeaturesMeshtrimKey),
      [st.v]: e.has(st.v),
      [featuresMattertagsKey]: !0,
      [FeaturesFloorselectKey]: !0,
      [PanoSizeBaseKey]: "1" === this.overrideParams[ne.T7] ? PanoSizeKey.ULTRAHIGH : PanoSizeBaseKey
    })
  }
  getManifest() {
    const e = super.getManifest()
    e.push(
      {
        type: WorkShopGridUnderlaySymbol,
        // promise: () => import("../modules/gridUnderlay.module")
        promise: () => Promise.resolve({ default: GridUnderlayModule })
      },
      // {
      //   type: WorkShopGuiSymbol,
      //   promise: () => import("../modules/workshopUi.module")
      // },
      {
        type: WorkShopSweepPinEditSymbol,
        // promise: () => import("../modules/pinEditor.module")
        promise: () => Promise.resolve({ default: PinEditorModule })
      },
      {
        type: WorkShopPinNumbersSymbol,
        // promise: () => import("../modules/pinNumberer.module")
        promise: () => Promise.resolve({ default: PinNumbererModule })
      },
      {
        type: WorkShopPinConnectionSymbol,
        // promise: () => import("../modules/pinConnection.module")
        promise: () => Promise.resolve({ default: PinConnectionModule })
      },
      {
        type: WorkShopRotationInteractionSymbol,
        // promise: () => import("../modules/rotationInteraction.module")
        promise: () => Promise.resolve({ default: RotationInteractionModule })
      },
      {
        type: RoomsSelectorSymbol,
        // promise: () => import("../modules/roomSelector.module")
        promise: () => Promise.resolve({ default: RoomSelectorModule })
      },
      {
        type: WorkShopSweepEditSymbol,
        // promise: () => import("../modules/sweepEditor.module")
        promise: () => Promise.resolve({ default: SweepEditorModule })
      },
      {
        type: WorkShopLabelsEditSymbol,
        // promise: () => import("../modules/labelsEditor.module")
        promise: () => Promise.resolve({ default: LabelsEditorModule })
      },
      {
        type: WorkShopFloorsEditSymbol,
        // promise: () => import("../modules/floorsEditor.module")
        promise: () => Promise.resolve({ default: FloorsEditorModule })
      },
      {
        type: WorkShopTourEditSymbol,
        // promise: () => import("../modules/tourEditor.module")
        promise: () => Promise.resolve({ default: TourEditorModule })
      },
      {
        type: WorkShopOptionsEditSymbol,
        // promise: () => import("../modules/playeroptionsEditor.module")
        promise: () => Promise.resolve({ default: PlayeroptionsEditorModule })
      },
      {
        type: WorkShopTrimEditSymbol,
        // promise: () => import("../modules/meshTrim.module")
        promise: () => Promise.resolve({ default: MeshTrimModule })
      },
      {
        type: TransformGizmoSymbol,
        // promise: () => import("../modules/transformGizmo.module")
        promise: () => Promise.resolve({ default: TransformGizmoModule })
      },
      // {
      //   type: WorkShopLayersToolSymbol,
      //   promise: () => import("../modules/layersTool.module")
      // },
      // {
      //   type: WorkShopRoomBoundToolSymbol,
      //   promise: () => import("../modules/roomTool.module")
      // },
      // {
      //   type: BlurDataSymbol,
      //   promise: () => import("../modules/blurData.module")
      // },
      // {
      //   type: WorkShopBlurEditSymbol,
      //   promise: () => import("../modules/blurEditor.module")
      // },
      // {
      //   type: WorkShopBlurSuggestSymbol,
      //   promise: () => import("../modules/blurSuggestions.module")
      // },
      {
        type: WorkShopCatalogSymbol,
        // promise: () => import("../modules/visionCatalog.module")
        promise: () => Promise.resolve({ default: VisionCatalogModule })
      }
    )
    return e
  }
  async load(e: Engine, config: { coldStart: boolean; autoPlay: boolean }): Promise<void> {
    if (((this.engine = e), config.coldStart)) throw Error("Workshop not designed to cold start (yet?!)")
    debug.debug("Begin load()")
    const [n, i, s, r] = await Promise.all([
      e.getModuleBySymbol(Apiv2Symbol),
      e.market.waitForData(PolicyData),
      e.market.waitForData(SettingsData),
      e.market.waitForData(LayersData)
    ])
    const a = await n.getApi().user
    const o = a.getFlags("workshop/")
    const l = a.getFlags("JMYDCase/")
    this.baseModelId = r.getBaseModelId()
    const c = this.getWorkshopSettings(o, l, i, s)
    this.settingsToggler = new SettingsToggler(s, c)
    this.settingsToggler.apply()
    const d = e.getModuleBySymbolSync(AppPhaseSymbol)
    d?.updateActiveApp(AppMode.WORKSHOP)
    // this.redirectToLogin()
    await this.loadOptionalModules(s, i)
    // Promise.all([
    //   e.loadModuleBySymbol({
    //     type: GuiSymbol
    //   }),
    //   e.loadModuleBySymbol({
    //     type: WorkShopGuiSymbol
    //   })
    // ]).then(([e, t]) => {
    //   this.guiModule = e
    //   this.workshopGui = t
    //   e.loadUi(t.loadUi)
    // })
    const stopWSTourHook = () => this.stopWSTourHook(e)
    e.commandBinder.hookCommand(MoveToSweepCommand, !0, stopWSTourHook)
    e.commandBinder.hookCommand(ChangeViewmodeCommand, !0, stopWSTourHook)
    e.commandBinder.hookCommand(TourStepCommand, !0, stopWSTourHook)
    e.commandBinder.hookCommand(FocusOnPointInsideCommand, !0, stopWSTourHook)
    e.commandBinder.hookCommand(FocusOnPinInsideCommand, !0, stopWSTourHook)
    await Promise.all([
      e.loadModuleBySymbol({
        type: WorkShopGridUnderlaySymbol
      }),
      e.loadModuleBySymbol({
        type: WorkShopPinNumbersSymbol
      }),
      e.loadModuleBySymbol({
        type: WorkShopPinConnectionSymbol
      }),
      e.loadModuleBySymbol({
        type: WorkShopRotationInteractionSymbol
      }),
      e.loadModuleBySymbol({
        type: RoomsSelectorSymbol
      }),
      e.loadModuleBySymbol({
        type: WorkShopSweepEditSymbol
      }),
      e.loadModuleBySymbol({
        type: WorkShopSweepPinEditSymbol
      })
    ])

    await e.waitForLoadingModules()
    await Promise.all([
      e.loadModuleBySymbol({
        type: WorkShopFloorsEditSymbol
      }),
      e.loadModuleBySymbol({
        type: WorkShopTourEditSymbol
      }),
      e.loadModuleBySymbol({
        type: WorkShopOptionsEditSymbol
      }),
      e.loadModuleBySymbol({
        type: WorkShopLabelsEditSymbol
      }),
      e.loadModuleBySymbol({
        type: TransformGizmoSymbol
      }),
      e.loadModuleBySymbol({
        type: WorkShopTrimEditSymbol
      })
    ])

    e.broadcast(new ApplicationLoadedMessage(AppMode.WORKSHOP))
    debug.debug("End load(), broadcasted ApplicationLoadedMessage")
  }
  overrideSyncs(e: Engine) {
    e.setLoadInjection((e, t) => {
      switch (e) {
        case String(Apiv2Symbol):
          t.preloadConfig = "workshop"
        case String(CameraStartSymbol):
        case String(FloorSymbol):
        case String(LabelDataSymbol):
        case String(MattertagDataSymbol):
        case String(MeasurementModeSymbol):
        case String(ShowcaseSettingsSymbol):
        case String(SnapshotsDataSymbol):
        case String(SweepDataSymbol):
        case String(PanoSymbol):
        case String(LayersSymbol):
        case String(ToursDataSymbol):
          t.readonly = !1
          return t
        case String(StorageSymbol):
          t.prefetchPolicy = PrefetchPolicyType.NONE
        default:
          return t
      }
    })
  }
  async unload(e: Engine) {
    this.settingsToggler.reset()
    this.workshopGui && (await this.workshopGui.unloadUi(), e.commandBinder.resetHooks())
    await super.unload(e)
  }
  async trackFeatures(e: Engine) {
    // await e.getModuleBySymbol(WorkShopAnalyticsSymbol)
    // e.getModuleBySymbol(TagsSymbol).then(() => {
    //   e.broadcast(new WorkShopFeatureMessage(Q.Qy))
    // })
    // e.getModuleBySymbol(SettingsSymbol).then(t => {
    //   !0 === t.tryGetProperty(TourStoriesKey, !1) && e.broadcast(new WorkShopFeatureMessage(j.Yi))
    // })
  }
  async redirectToLogin() {
    const e = (await this.engine.getModuleBySymbol(Apiv2Symbol)).getApi()
    const t = await e.getConfigs("JMYDCase")
    //pw   未登录时，跳转到登录页
    if (!(await e.user).loggedIn) {
      if (t && t.authn_login_url) {
        try {
          window.top && (window.top.location.href = t.authn_login_url + "?target=" + encodeURIComponent(window.top.location.href))
        } catch (e) {
          debug.error("Login redirect error: " + e)
        }
      }
    } else {
      debug.error("No authn_login_url found")
    }
  }
  async loadOptionalModules(e: SettingsData, t: PolicyData) {
    const [n, i] = await Promise.all([this.engine.getModuleBySymbol(Apiv2Symbol), this.engine.getModuleBySymbol(SettingsSymbol)])
    const s = n.getApi()
    const r = await s.user
    const a: Array<Promise<any>> = [...this.loadLayersWorkshopModules(e)]
    // if (hasRoomBound(t, e, !0) && !isMobilePhone()) {
    //   a.push(
    //     this.engine.loadModuleBySymbol({
    //       type: WorkShopRoomBoundToolSymbol,
    //       config: {
    //         rootNode: this.container.getRootNode()
    //       }
    //     })
    //   )
    // }

    // const o = await this.loadBlur(r, i)
    // a.push(...o)
    await Promise.all(a)
  }
  loadLayersWorkshopModules(e: SettingsData) {
    const t: Array<Promise<any>> = []
    e.tryGetProperty(ModelViewsFeatureKey, !1)
      ? this.engine.broadcast(new WorkShopFeatureMessage(SETTING_USER_VIEWS_ANALYTIC))
      : this.bindings.push(
          e.onPropertyChanged(ModelViewsFeatureKey, () => {
            this.engine.broadcast(new WorkShopFeatureMessage(SETTING_USER_VIEWS_ANALYTIC))
          })
        )
    // const hasLayersFeature = e.tryGetProperty(DataLayersFeatureKey, !1)
    // t.push(
    //   this.engine.loadModuleBySymbol({
    //     type: WorkShopLayersToolSymbol,
    //     config: {
    //       hasLayersFeature
    //     }
    //   })
    // )
    return t
  }
  async loadBlur(e: UserInfoClass, t: SettingsModule) {
    const n: Promise<any>[] = []
    const [i, s] = await Promise.all([this.engine.getModuleBySymbol(Apiv2Symbol), this.engine.market.waitForData(ModelData)])
    const r = i.getApi()
    const { organizationId: a } = s.model
    let o: Organization | null = null
    a && (o = await r.getOrganization(a))
    let l = !1
    o && o.blurEnabled && (l = !s.model.details.demo)
    const c = "1" === this.overrideParams.blurDebug
    c && (l = !0)
    const d = this.overrideParams.blurPipeline,
      u = e.hasFlag(BlurPipelineKey, "workshop"),
      h = l && !c && (u ? "0" !== d : "1" === d),
      p = this.overrideParams.blurMesh,
      m = e.hasFlag(BlurMeshKey, "workshop"),
      f = l && (m ? "0" !== p : "1" === p)
    t.updateSetting(ToolsBlurEditorKey, l)
    // l &&
    //   (n.push(
    //     this.engine.loadModuleBySymbol({
    //       type: BlurDataSymbol,
    //       config: {
    //         readonly: !1,
    //         modelId: this.baseModelId,
    //         baseUrl: this.modelUrls.urlBase,
    //         queue: this.storeQueue
    //       }
    //     }),
    //     this.engine.loadModuleBySymbol({
    //       type: WorkShopBlurEditSymbol,
    //       config: {
    //         debug: c,
    //         pipelineEnabled: h,
    //         meshBlurEnabled: f
    //       }
    //     })
    //   ),
    //   n.push(
    //     this.engine.loadModuleBySymbol({
    //       type: WorkShopCatalogSymbol,
    //       config: {
    //         baseModelId: this.baseModelId
    //       }
    //     })
    //   ),
    //   n.push(
    //     this.engine.loadModuleBySymbol({
    //       type: WorkShopBlurSuggestSymbol,
    //       config: {
    //         baseUrl: this.modelUrls.urlBase,
    //         debug: c,
    //         modelId: this.baseModelId,
    //         queue: this.storeQueue,
    //         readonly: !1
    //       }
    //     })
    //   ))
    return n
  }
}
