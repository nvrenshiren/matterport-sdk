import * as j from "../const/59323"
import * as xe from "../const/xr.const"
import * as X from "../other/39586"
import * as je from "../other/56382"
import * as We from "../other/96776"

import { DebugInfo, DebugLevel } from "./debug"
import { OpenDeferred } from "./deferred"

import "webgl-memory"
import { MoveToSweepCommand } from "../command/navigation.command"
import { TourStepCommand, TourStopCommand } from "../command/tour.command"
import { ChangeViewmodeCommand } from "../command/viewmode.command"
import { mdsPrefetch } from "../const/mds.const"
import { tilingPreloadQualityKey } from "../const/quality.const"
import { discoverSpaceUrlKey } from "../const/settings.const"
import {
  AnnotationsSymbol,
  Apiv2Symbol,
  AppPhaseSymbol,
  CameraStartSymbol,
  CameraSymbol,
  CanvasSymbol,
  ContainerDataSymbol,
  ControlsCommonSymbol,
  ControlsDHSymbol,
  ControlsFPSymbol,
  ControlsInsideSymbol,
  ControlsZoomSymbol,
  CurrentPanoSymbol,
  CursorControllerSymbol,
  CursorMeshSymbol,
  CursorSymbol,
  DeepLinksSymbol,
  DwellAnalyticsSymbol,
  ErrorUISymbol,
  FloorStateSymbol,
  FloorSymbol,
  GuiSymbol,
  HotKeysSymbol,
  InitUISymbol,
  InputSymbol,
  InteractionSymbol,
  LabelDataSymbol,
  LabelRenderSymbol,
  LayersSymbol,
  LinesSymbol,
  LocaleSymbol,
  MattertagDataSymbol,
  MeasurementModeSymbol,
  MeshApiFixupSymbol,
  MeshQuerySymbol,
  MeshTrimDataSymbol,
  ModeChangeSymbol,
  ModeSymbol,
  ModelDataSymbol,
  ModelMeshQualitySymbol,
  ModelMeshSymbol,
  ModelRatingSymbol,
  MouseSymbol,
  NavSymbol,
  NavigationSymbol,
  NotesSymbol,
  ObjectTagSuggestionsDataSymbol,
  OrderedListsSymbol,
  OrthographicControlsSymbol,
  PanoSymbol,
  PanoTilesSymbol,
  PathSymbol,
  PinsSymbol,
  PolicySymbol,
  PortalNavSymbol,
  PortalSymbol,
  PreRendererSymbol,
  PucksSymbol,
  RaycastFatSymbol,
  RaycastFloorSymbol,
  RaycastOctreeSymbol,
  RaycastSymbol,
  RaycasterSymbol,
  RoomBoundDataSymbol,
  RoomBoundRendererSymbol,
  RoomBoundSymbol,
  RoomsSymbol,
  RttSymbol,
  ScanInfoSymbol,
  SchedulerSymbol,
  ScreenshotsSymbol,
  SettingsSymbol,
  ShowcaseSettingsSymbol,
  ShowcaseStartSymbol,
  SkyboxSymbol,
  SnappingSymbol,
  SnapshotsDataSymbol,
  SnapshotsEditorSymbol,
  StorageSymbol,
  StreamingMeshSymbol,
  StreamingTextureSymbol,
  SweepDataSymbol,
  SweepPinMeshSymbol,
  SweepPinSymbol,
  SweepViewdataSymbol,
  TagsSymbol,
  ToolsSymbol,
  ToursControlsSymbol,
  ToursDataSymbol,
  UsersSymbol,
  VideoSymbol,
  ViewUISymbol,
  VisibleMeshBoundsSymbol,
  WebglContextLossSymbol,
  WebglRendererSymbol,
  WebxrSymbol
} from "../const/symbol.const"
import { embedlyKey, featuresMattertagsKey } from "../const/tag.const"
import { ToolsList } from "../const/tools.const"
import { AppData, AppMode, AppStatus } from "../data/app.data"
import { CamStartData } from "../data/camstart.data"
import { LayersData } from "../data/layers.data"
import { ModelData } from "../data/model.data"
import { PolicyData } from "../data/policy.data"
import { TourData } from "../data/tour.data"
import { UsersData } from "../data/users.data"
import { ViewmodeData } from "../data/viewmode.data"
import { ModelArchivedError, ModelComplianceError, ModelDeletedError, ModelFailedError, ModelPendingError, ModelProcessingError } from "../error/model.error"
import { WEBGLGENERICError, WEBGLUNSUPPORTEDError } from "../error/webgl.error"
import { ApplicationLoadedMessage } from "../message/app.message"
import GuiModule from "../modules/gui.module"
import ShowcaseGui from "../modules/showcaseGui.module"
import { ShowcaseMessage, SymbolLoadDoneMessage, SymbolLoadMessage } from "../other/2032"
import { ErrorText } from "../other/26837"
import { setKey } from "../utils/apikey.utils"
import { isMobilePhone, sameWindow } from "../utils/browser.utils"
import { getModelUrls, getURLOrigin } from "../utils/url.utils"
import { getURLParams } from "../utils/urlParams.utils"
import AB from "./ab"
import Engine, { ModuleItem } from "./engine"
import EngineTick from "./engineTick"
import { LazyLoader } from "./lazyLoader"
import MdsContext from "./mdsContext"
import { RequestManager } from "./request"
import { ISubscription, createSubscription } from "./subscription"

import { ToursMetersPerSecondKey } from "../const/14439"
import { FeaturesLabelsKey } from "../const/23037"
import { Features360ViewsKey } from "../const/360.const"
import { FeaturesTagIconsKey, TagBillboardDockKey, TagBillboardShareKey } from "../const/48945"
import { FeaturesTiledMeshKey } from "../const/53203"
import { TourStoriesKey } from "../const/59323"
import { FeaturesDollhouseNudge, FeaturesRoomboundsFloorplanNudgekEY } from "../const/62496"
import { DollhousePeekabooKey } from "../const/66777"
import { TextureLOD } from "../const/80626"
import { FeaturesMeasurementsNudgeKey } from "../const/8824"
import { subscriberPromptActiveKey } from "../const/96365"
import { MeshTextureQuality } from "../const/99935"
import { FeaturesFloorselectKey } from "../const/floor.const"
import { modelRatingDialogKey, modelRatingDialogPromptKey } from "../const/modelRating.const"
import { PrefetchPolicyType } from "../const/prefetch.const"
import { SpacesPluginsConfigKey, SpacesPluginsDebugKey, SpacesPluginsGroupsKey, SpacesPluginsKey } from "../const/spaces.const"
import { FeaturesSweepPucksKey } from "../const/sweep.const"
import { UserPreferencesKeys } from "../const/user.const"
import { XRBrowserLockKey } from "../const/xr.const"
import { interpolateValue } from "../math/96042"
import InteractionmodeModule from "../modules/Interactionmode.module"
import AnnotationsModule from "../modules/annotations.module"
import AppPhaseModule from "../modules/appPhase.module"
import CameraDataModule from "../modules/cameraData.module"
import CameraStartModule from "../modules/cameraStart.module"
import CanvasModule from "../modules/canvas.module"
import CommonControlsModule from "../modules/commonControls.module"
import ContainerDataModule from "../modules/containerData.module"
import CurrentPanoMarkerModule from "../modules/currentPanoMarker.module"
import CursorControllerModule from "../modules/cursorController.module"
import CursorDataModule from "../modules/cursorData.module"
import CursorMeshModule from "../modules/cursorMesh.module"
import DeepLinkerModule from "../modules/deepLinker.module"
import DollhouseControlsModule from "../modules/dollhouseControls.module"
import ErrorGuiModule from "../modules/errorGui.module"
import FatCasterModule from "../modules/fatCaster.module"
import FloorCasterModule from "../modules/floorCaster.module"
import FloorplanControlsModule from "../modules/floorplanControls.module"
import FloorsModule from "../modules/floors.module"
import FloorsViewDataModule from "../modules/floorsViewData.module"
import InputIniModule from "../modules/inputIni.module"
import LayersModule from "../modules/layers.module"
import LinesModule from "../modules/lines.module"
import LoadingUiModule from "../modules/loadingUi.module"
import LocaleModule from "../modules/locale.module"
import MattertagDataModule from "../modules/mattertagData.module"
import MeshApiDataFixupsModule from "../modules/meshApiDataFixups.module"
import MeshQualityModule from "../modules/meshQuality.module"
import MeshQueryModule from "../modules/meshQuery.module"
import ModelDataModule from "../modules/modelData.module"
import ModelMeshModule from "../modules/modelMesh.module"
import MouseCursorModule from "../modules/mouseCursor.module"
import NavigationModule from "../modules/navigation.module"
import NotesModule from "../modules/notes.module"
import ObjectTagSuggestionsDataModule from "../modules/objectTagSuggestionsData.module"
import OrderedListsModule from "../modules/orderedLists.module"
import OrthographicControlsModule from "../modules/orthographicControls.module"
import PanoramaControlsModule from "../modules/panoramaControls.module"
import PinsModule from "../modules/pins.module"
import PolicyModule from "../modules/policy.module"
import PrerendererModule from "../modules/prerenderer.module"
import RaycasterModule from "../modules/raycaster.module"
import RenderToTextureModule from "../modules/renderToTexture.module"
import RoomDataModule from "../modules/roomData.module"
import SchedulerModule from "../modules/scheduler.module"
import ScreenshotsModule from "../modules/screenshots.module"
import SettingsModule, { SettingPersistence } from "../modules/settings.module"
import ShowcaseHotkeysModule from "../modules/showcaseHotkeys.module"
import ShowcaseSettingsModule from "../modules/showcaseSettings.module"
import ShowcaseStartModule from "../modules/showcaseStart.module"
import ShowcaseWebglContextLossModule from "../modules/showcaseWebglContextLoss.module"
import SkyboxModule from "../modules/skybox.module"
import SnapshotsDataModule from "../modules/snapshotsData.module"
import SnapshotsEditorModule from "../modules/snapshotsEditor.module"
import StorageModule from "../modules/storage.module"
import SweepDataModule from "../modules/sweepData.module"
import SweepPanoTilingModule from "../modules/sweepPanoTiling.module"
import SweepPathModule from "../modules/sweepPath.module"
import SweepPinMeshModule from "../modules/sweepPinMesh.module"
import SweepPinNavigationModule from "../modules/sweepPinNavigation.module"
import SweepPortalMeshModule from "../modules/sweepPortalMesh.module"
import SweepPortalNavigationModule from "../modules/sweepPortalNavigation.module"
import SweepViewdataModule from "../modules/sweepViewdata.module"
import TagsModule from "../modules/tags.module"
import ToolsModule from "../modules/tools.module"
import TrimDataModule from "../modules/trimData.module"
import UserInfoModule, { UserInfoClass } from "../modules/userInfo.module"
import UsersModule from "../modules/users.module"
import ViewmodeModule from "../modules/viewmode.module"
import ViewmodeChangeModule from "../modules/viewmodeChange.module"
import VisibleMeshBoundsModule from "../modules/visibleMeshBounds.module"
import WebglRendererModule from "../modules/webglrender.module"
import ZoomControlsModule from "../modules/zoomControls.module"
import { hasRoomBound } from "../other/47309"
import { SubscriberPromptRegisterSetting } from "../other/83038"
import { PrefetchedQueryCache } from "../prefetchedQueryCache"
import { CheckThreshold } from "../utils/49827"
import { HasTool } from "../utils/59425"
import { waitRun } from "../utils/func.utils"
import { PreFetchedModelData } from "../utils/predata.utils"
import { getUnitType } from "../utils/unit.utils"
import { isPanorama } from "../utils/viewMode.utils"
import LabelDataModule from "../modules/labelData.module"
import UserLabelsModule from "../modules/userLabels.module"
import MeasurementModeModule from "../modules/measurementMode.module"
import ModelRatingModule from "../modules/modelRating.module"
import ScaninfoDataModule from "../modules/scaninfoData.module"
import SweepPucksModule from "../modules/sweepPucks.module"
import ToursControlsModule from "../modules/toursControls.module"
import ToursDataModule from "../modules/toursData.module"
import VideoRecorderModule from "../modules/videoRecorder.module"
import WebxrModule from "../modules/webxr.module"
import RoomBoundDataModule from "../modules/roomBoundData.module"
import RoomBoundModule from "../modules/roomBound.module"
import RoomBoundRendererModule from "../modules/roomBoundRenderer.module"
import modelMeshGui from "../gui/modelMesh.gui"
import navGui from "../gui/nav.gui"
import raycastOctreeGui from "../gui/raycastOctree.gui"
import panoTilesGui from "../gui/panoTiles.gui"
import raycastGui from "../gui/raycast.gui"
import snappingGui from "../gui/snapping.gui"
import webglRendererGui from "../gui/webglRenderer.gui"
import streamingMeshGui from "../gui/streamingMesh.gui"
import streamingTextureGui from "../gui/streamingTexture.gui"

const getAssetBasePath = (path = "./") => {
  path = path.replace(/\/*$/, "/")
  const t = new URL(path, document.baseURI)
  const i = [
    /^https:\/\/static\.matterport\.com(:[0-9]+)?\//,
    /^https:\/\/static\.matterportvr\.cn(:[0-9]+)?\//,
    /^https:\/\/[^\/]+\.awsstatic\.com\/([^?#]+\/)?matterport\/.*/,
    /^http:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?\/.*/
  ].find(e => t.href.match(e))
    ? t.origin
    : document.baseURI
  return new URL(t.pathname, i).toString()
}
const getHost = (e, t) => {
  const i = e.apiHost || t.apiHost
  if (i) {
    const e = getURLOrigin(i)
    if (e) return e
  }
  return window.location.origin
}

const FeaturesAutoDesignerKey = "features/auto-designer"
const debugInfo = new DebugInfo("JMYDCase")
export default class ShowCase {
  engine: Engine
  inWorkshop: boolean
  editModePreferred: boolean
  bindings: ISubscription[]
  logLevel: DebugLevel
  storeQueue: RequestManager
  apiQueue: RequestManager
  analyticsQueue: RequestManager
  errorPromise: OpenDeferred<any>
  forceLogin: boolean
  openingTool: null | string
  isSDK: boolean
  uiLoading: Promise<void>
  sceneLoader: LazyLoader
  modulesLoadedPromise: OpenDeferred<any>
  stopTourHook: (e: any) => Promise<void>
  settingOverrides: any
  assetBasePath: string
  overrideParams: any
  quickstart: boolean
  apiHost: string
  oEmbedDeferred: OpenDeferred<any>
  oEmbedConsumer: any
  container: HTMLElement
  modelUrls: ReturnType<typeof getModelUrls>
  initialViewId?: string
  mdsContext: MdsContext
  engineTick: EngineTick
  canvas: HTMLCanvasElement
  apiConfig: any
  baseModelId: string
  showcaseGui: ShowcaseGui
  guiModule: GuiModule
  constructor(inWorkshop: boolean, settings: any = {}, editModePreferred = !1) {
    this.inWorkshop = inWorkshop
    this.editModePreferred = editModePreferred
    this.bindings = []
    this.logLevel = DebugLevel.INFO
    this.storeQueue = new RequestManager()
    this.apiQueue = new RequestManager()
    this.analyticsQueue = new RequestManager({
      concurrency: 1
    })
    this.errorPromise = new OpenDeferred()
    this.forceLogin = !1
    this.openingTool = null
    this.isSDK = !1
    this.uiLoading = Promise.resolve()
    this.sceneLoader = new LazyLoader()
    this.modulesLoadedPromise = new OpenDeferred()
    this.stopTourHook = async (e: Engine) => {
      const tourData = e.market.tryGetData(TourData)
      tourData && tourData.tourPlaying && (await e.commandBinder.issueCommand(new TourStopCommand()), await waitRun(10))
    }

    this.settingOverrides = Object.assign({}, settings)
    this.assetBasePath = this.settingOverrides.assetBasePath = getAssetBasePath(this.settingOverrides.assetBasePath || "../")
    const { container, overrideParams = getURLParams(), sceneId = "" } = this.settingOverrides
    this.overrideParams = overrideParams
    this.quickstart = "1" === overrideParams.qs || void 0 !== overrideParams.note || void 0 !== overrideParams.tag
    const applicationKey = overrideParams.applicationKey || settings.applicationKey
    this.isSDK = null != applicationKey
    setKey(applicationKey || null)
    this.apiHost = getHost(overrideParams, this.settingOverrides)
    this.oEmbedDeferred = new OpenDeferred()
    this.oEmbedConsumer = this.oEmbedDeferred.nativePromise()
    this.apiHost !== window.location.origin && (this.settingOverrides.apiHost = this.apiHost)
    this.container = container || document.body
    this.modelUrls = getModelUrls(overrideParams.m || overrideParams.model, sceneId, this.apiHost)

    this.initialViewId = this.modelUrls.sid
    this.mdsContext = new MdsContext(this.initialViewId)
  }
  getManifest(): ModuleItem[] {
    return [
      {
        type: InitUISymbol,
        // promise: () => import("../modules/loadingUi.module")
        promise: () => Promise.resolve({ default: LoadingUiModule })
      },
      {
        type: AppPhaseSymbol,
        // promise: () => import("../modules/appPhase.module")
        promise: () => Promise.resolve({ default: AppPhaseModule })
      },
      {
        type: SettingsSymbol,
        // promise: () => import("../modules/settings.module")
        promise: () => Promise.resolve({ default: SettingsModule })
      },
      // {
      //   type: AnalyticsSymbol,
      //   promise: () => import("../modules/analytics.module")
      // },
      {
        type: Apiv2Symbol,
        // promise: () => import("../modules/userInfo.module")
        promise: () => Promise.resolve({ default: UserInfoModule })
      },
      {
        type: ModelDataSymbol,
        // promise: () => import("../modules/modelData.module")
        promise: () => Promise.resolve({ default: ModelDataModule })
      },
      {
        type: RaycasterSymbol,
        // promise: () => import("../modules/raycaster.module")
        promise: () => Promise.resolve({ default: RaycasterModule })
      },
      {
        type: CameraStartSymbol,
        // promise: () => import("../modules/cameraStart.module")
        promise: () => Promise.resolve({ default: CameraStartModule })
      },
      {
        type: SnapshotsDataSymbol,
        // promise: () => import("../modules/snapshotsData.module")
        promise: () => Promise.resolve({ default: SnapshotsDataModule })
      },
      {
        type: LocaleSymbol,
        // promise: () => import("../modules/locale.module")
        promise: () => Promise.resolve({ default: LocaleModule })
      },
      {
        type: SweepDataSymbol,
        // promise: () => import("../modules/sweepData.module")
        promise: () => Promise.resolve({ default: SweepDataModule })
      },
      // {
      //   type: AppAnalyticsSymbol,
      //   promise: () => import("../modules/showcaseAnalytics.module")
      // },
      {
        type: WebglRendererSymbol,
        // promise: () => import("../modules/webglrender.module")
        promise: () => Promise.resolve({ default: WebglRendererModule })
      },
      {
        type: CanvasSymbol,
        // promise: () => import("../modules/canvas.module")
        promise: () => Promise.resolve({ default: CanvasModule })
      },
      {
        type: InputSymbol,
        // promise: () => import("../modules/inputIni.module")
        promise: () => Promise.resolve({ default: InputIniModule })
      },
      {
        type: ErrorUISymbol,
        // promise: () => import("../modules/errorGui.module")
        promise: () => Promise.resolve({ default: ErrorGuiModule })
      },
      {
        type: WebglContextLossSymbol,
        // promise: () => import("../modules/showcaseWebglContextLoss.module")
        promise: () => Promise.resolve({ default: ShowcaseWebglContextLossModule })
      },
      {
        type: CameraSymbol,
        // promise: () => import("../modules/cameraData.module")
        promise: () => Promise.resolve({ default: CameraDataModule })
      },
      {
        type: SchedulerSymbol,
        // promise: () => import("../modules/scheduler.module")
        promise: () => Promise.resolve({ default: SchedulerModule })
      },
      {
        type: LayersSymbol,
        // promise: () => import("../modules/layers.module")
        promise: () => Promise.resolve({ default: LayersModule })
      },
      {
        type: PolicySymbol,
        // promise: () => import("../modules/policy.module")
        promise: () => Promise.resolve({ default: PolicyModule })
      },
      {
        type: UsersSymbol,
        // promise: () => import("../modules/users.module")
        promise: () => Promise.resolve({ default: UsersModule })
      },
      {
        type: StorageSymbol,
        // promise: () => import("../modules/storage.module")
        promise: () => Promise.resolve({ default: StorageModule })
      },
      {
        type: ContainerDataSymbol,
        // promise: () => import("../modules/containerData.module")
        promise: () => Promise.resolve({ default: ContainerDataModule })
      },
      {
        type: VisibleMeshBoundsSymbol,
        // promise: () => import("../modules/visibleMeshBounds.module")
        promise: () => Promise.resolve({ default: VisibleMeshBoundsModule })
      },
      {
        type: SweepViewdataSymbol,
        // promise: () => import("../modules/sweepViewdata.module")
        promise: () => Promise.resolve({ default: SweepViewdataModule })
      },
      {
        type: SkyboxSymbol,
        // promise: () => import("../modules/skybox.module")
        promise: () => Promise.resolve({ default: SkyboxModule })
      },
      {
        type: ModeSymbol,
        // promise: () => import("../modules/viewmode.module")
        promise: () => Promise.resolve({ default: ViewmodeModule })
      },
      {
        type: ModeChangeSymbol,
        // promise: () => import("../modules/viewmodeChange.module")
        promise: () => Promise.resolve({ default: ViewmodeChangeModule })
      },
      {
        type: FloorSymbol,
        // promise: () => import("../modules/floors.module")
        promise: () => Promise.resolve({ default: FloorsModule })
      },
      {
        type: RttSymbol,
        // promise: () => import("../modules/renderToTexture.module")
        promise: () => Promise.resolve({ default: RenderToTextureModule })
      },
      {
        type: ToolsSymbol,
        // promise: () => import("../modules/tools.module")
        promise: () => Promise.resolve({ default: ToolsModule })
      },
      {
        type: ControlsCommonSymbol,
        // promise: () => import("../modules/commonControls.module")
        promise: () => Promise.resolve({ default: CommonControlsModule })
      },
      {
        type: ControlsInsideSymbol,
        // promise: () => import("../modules/panoramaControls.module")
        promise: () => Promise.resolve({ default: PanoramaControlsModule })
      },
      {
        type: MouseSymbol,
        // promise: () => import("../modules/mouseCursor.module")
        promise: () => Promise.resolve({ default: MouseCursorModule })
      },
      {
        type: FloorStateSymbol,
        // promise: () => import("../modules/floorsViewData.module")
        promise: () => Promise.resolve({ default: FloorsViewDataModule })
      },
      {
        type: RoomsSymbol,
        // promise: () => import("../modules/roomData.module")
        promise: () => Promise.resolve({ default: RoomDataModule })
      },
      {
        type: InteractionSymbol,
        // promise: () => import("../modules/Interactionmode.module")
        promise: () => Promise.resolve({ default: InteractionmodeModule })
      },
      {
        type: ControlsDHSymbol,
        // promise: () => import("../modules/dollhouseControls.module")
        promise: () => Promise.resolve({ default: DollhouseControlsModule })
      },
      {
        type: ControlsFPSymbol,
        // promise: () => import("../modules/floorplanControls.module")
        promise: () => Promise.resolve({ default: FloorplanControlsModule })
      },
      {
        type: ControlsZoomSymbol,
        // promise: () => import("../modules/zoomControls.module")
        promise: () => Promise.resolve({ default: ZoomControlsModule })
      },
      {
        type: HotKeysSymbol,
        // promise: () => import("../modules/showcaseHotkeys.module")
        promise: () => Promise.resolve({ default: ShowcaseHotkeysModule })
      },
      {
        type: ShowcaseStartSymbol,
        // promise: () => import("../modules/showcaseStart.module")
        promise: () => Promise.resolve({ default: ShowcaseStartModule })
      },
      {
        type: ShowcaseSettingsSymbol,
        // promise: () => import("../modules/showcaseSettings.module")
        promise: () => Promise.resolve({ default: ShowcaseSettingsModule })
      },
      {
        type: NavigationSymbol,
        // promise: () => import("../modules/navigation.module")
        promise: () => Promise.resolve({ default: NavigationModule })
      },
      {
        type: ModelMeshSymbol,
        // promise: () => import("../modules/modelMesh.module")
        promise: () => Promise.resolve({ default: ModelMeshModule })
      },
      {
        type: ModelMeshQualitySymbol,
        // promise: () => import("../modules/meshQuality.module")
        promise: () => Promise.resolve({ default: MeshQualityModule })
      },
      {
        type: MeshQuerySymbol,
        // promise: () => import("../modules/meshQuery.module")
        promise: () => Promise.resolve({ default: MeshQueryModule })
      },
      {
        type: MeshApiFixupSymbol,
        // promise: () => import("../modules/meshApiDataFixups.module")
        promise: () => Promise.resolve({ default: MeshApiDataFixupsModule })
      },
      {
        type: MeshTrimDataSymbol,
        // promise: () => import("../modules/trimData.module")
        promise: () => Promise.resolve({ default: TrimDataModule })
      },
      {
        type: OrthographicControlsSymbol,
        // promise: () => import("../modules/orthographicControls.module")
        promise: () => Promise.resolve({ default: OrthographicControlsModule })
      },

      {
        type: PanoSymbol,
        // promise: () => import("../modules/sweepPanoTiling.module")
        promise: () => Promise.resolve({ default: SweepPanoTilingModule })
      },
      {
        type: AnnotationsSymbol,
        // promise: () => import("../modules/annotations.module")
        promise: () => Promise.resolve({ default: AnnotationsModule })
      },

      {
        type: CurrentPanoSymbol,
        // promise: () => import("../modules/currentPanoMarker.module")
        promise: () => Promise.resolve({ default: CurrentPanoMarkerModule })
      },
      {
        type: CursorSymbol,
        // promise: () => import("../modules/cursorData.module")
        promise: () => Promise.resolve({ default: CursorDataModule })
      },
      {
        type: CursorMeshSymbol,
        // promise: () => import("../modules/cursorMesh.module")
        promise: () => Promise.resolve({ default: CursorMeshModule })
      },
      {
        type: CursorControllerSymbol,
        // promise: () => import("../modules/cursorController.module")
        promise: () => Promise.resolve({ default: CursorControllerModule })
      },
      {
        type: DeepLinksSymbol,
        // promise: () => import("../modules/deepLinker.module")
        promise: () => Promise.resolve({ default: DeepLinkerModule })
      },
      {
        type: RaycastFatSymbol,
        // promise: () => import("../modules/fatCaster.module")
        promise: () => Promise.resolve({ default: FatCasterModule })
      },
      {
        type: RaycastFloorSymbol,
        // promise: () => import("../modules/floorCaster.module")
        promise: () => Promise.resolve({ default: FloorCasterModule })
      },
      {
        type: LinesSymbol,
        // promise: () => import("../modules/lines.module")
        promise: () => Promise.resolve({ default: LinesModule })
      },
      {
        type: MattertagDataSymbol,
        // promise: () => import("../modules/mattertagData.module")
        promise: () => Promise.resolve({ default: MattertagDataModule })
      },
      {
        type: PinsSymbol,
        // promise: () => import("../modules/pins.module")
        promise: () => Promise.resolve({ default: PinsModule })
      },
      // {
      //   type: NotesSymbol,
      //   // promise: () => import("../modules/notes.module")
      //   promise: () => Promise.resolve({ default: NotesModule })
      // },
      {
        type: ObjectTagSuggestionsDataSymbol,
        // promise: () => import("../modules/objectTagSuggestionsData.module")
        promise: () => Promise.resolve({ default: ObjectTagSuggestionsDataModule })
      },
      {
        type: OrderedListsSymbol,
        // promise: () => import("../modules/orderedLists.module")
        promise: () => Promise.resolve({ default: OrderedListsModule })
      },
      {
        type: PreRendererSymbol,
        // promise: () => import("../modules/prerenderer.module")
        promise: () => Promise.resolve({ default: PrerendererModule })
      },

      {
        type: ScreenshotsSymbol,
        // promise: () => import("../modules/screenshots.module")
        promise: () => Promise.resolve({ default: ScreenshotsModule })
      },

      {
        type: SnapshotsEditorSymbol,
        // promise: () => import("../modules/snapshotsEditor.module")
        promise: () => Promise.resolve({ default: SnapshotsEditorModule })
      },
      {
        type: PathSymbol,
        // promise: () => import("../modules/sweepPath.module")
        promise: () => Promise.resolve({ default: SweepPathModule })
      },
      {
        type: SweepPinMeshSymbol,
        // promise: () => import("../modules/sweepPinMesh.module")
        promise: () => Promise.resolve({ default: SweepPinMeshModule })
      },
      {
        type: SweepPinSymbol,
        // promise: () => import("../modules/sweepPinNavigation.module")
        promise: () => Promise.resolve({ default: SweepPinNavigationModule })
      },
      {
        type: PortalSymbol,
        // promise: () => import("../modules/sweepPortalMesh.module")
        promise: () => Promise.resolve({ default: SweepPortalMeshModule })
      },
      {
        type: PortalNavSymbol,
        // promise: () => import("../modules/sweepPortalNavigation.module")
        promise: () => Promise.resolve({ default: SweepPortalNavigationModule })
      },
      {
        type: TagsSymbol,
        // promise: () => import("../modules/tags.module")
        promise: () => Promise.resolve({ default: TagsModule })
      },

      {
        type: LabelDataSymbol,
        // promise: () => import("../modules/labelData.module")
        promise: () => Promise.resolve({ default: LabelDataModule })
      },
      {
        type: LabelRenderSymbol,
        // promise: () => import("../modules/userLabels.module")
        promise: () => Promise.resolve({ default: UserLabelsModule })
      },
      {
        type: MeasurementModeSymbol,
        // promise: () => import("../modules/measurementMode.module")
        promise: () => Promise.resolve({ default: MeasurementModeModule })
      },
      {
        type: ModelRatingSymbol,
        // promise: () => import("../modules/modelRating.module")
        promise: () => Promise.resolve({ default: ModelRatingModule })
      },
      {
        type: ScanInfoSymbol,
        // promise: () => import("../modules/scaninfoData.module")
        promise: () => Promise.resolve({ default: ScaninfoDataModule })
      },
      {
        type: PucksSymbol,
        // promise: () => import("../modules/sweepPucks.module")
        promise: () => Promise.resolve({ default: SweepPucksModule })
      },
      {
        type: ToursControlsSymbol,
        // promise: () => import("../modules/toursControls.module")
        promise: () => Promise.resolve({ default: ToursControlsModule })
      },
      {
        type: ToursDataSymbol,
        // promise: () => import("../modules/toursData.module")
        promise: () => Promise.resolve({ default: ToursDataModule })
      },
      {
        type: VideoSymbol,
        // promise: () => import("../modules/videoRecorder.module")
        promise: () => Promise.resolve({ default: VideoRecorderModule })
      },
      {
        type: WebxrSymbol,
        // promise: () => import("../modules/webxr.module")
        promise: () => Promise.resolve({ default: WebxrModule })
      },
      {
        type: RoomBoundDataSymbol,
        // promise: () => import("../modules/roomBoundData.module")
        promise: () => Promise.resolve({ default: RoomBoundDataModule })
      },
      {
        type: RoomBoundSymbol,
        // promise: () => import("../modules/roomBound.module")
        promise: () => Promise.resolve({ default: RoomBoundModule })
      },
      {
        type: RoomBoundRendererSymbol,
        // promise: () => import("../modules/roomBoundRenderer.module")
        promise: () => Promise.resolve({ default: RoomBoundRendererModule })
      }
    ]
  }
  getAppPhases(e: Engine) {
    return {
      [AppStatus.UNINITIALIZED]: [],
      [AppStatus.WAITING]: [
        (async () => {
          await e.getModuleBySymbol(InitUISymbol)
        })()
      ],
      [AppStatus.LOADING]: [(async () => (await e.getModuleBySymbol(InitUISymbol)).waitForPlaying)()],
      [AppStatus.STARTING]: [
        (async () => (await e.getModuleBySymbol(ShowcaseStartSymbol)).waitForFirstRender)(),
        (async () => (await e.getModuleBySymbol(MeshTrimDataSymbol)).waitForData)()
      ],
      [AppStatus.PLAYING]: [(async () => (await e.getModuleBySymbol(ShowcaseStartSymbol)).waitForFlyin)()],
      [AppStatus.ERROR]: [this.errorPromise.nativePromise()]
    }
  }
  stop() {
    this.engineTick && this.engineTick.stop()
  }
  setError(e) {
    this.errorPromise.reject(e)
    this.stop()
  }
  public async load(e: Engine, config: { coldStart: boolean; autoPlay: boolean }): Promise<void> {
    this.engine = e
    this.engine.loadModuleBySymbol({
      type: AppPhaseSymbol,
      config: {
        tasks: this.getAppPhases(e)
      }
    })
    const settingsModule = await this.engine.loadModuleBySymbol({
      type: SettingsSymbol,
      config: {
        useGUI: !0,
        queryScope: this.container.getRootNode(),
        overrideParams: this.overrideParams
      }
    })

    // this.loadAnalytics()
    const apiClinet = await this.engine.loadModuleBySymbol({
      type: Apiv2Symbol,
      config: {
        baseUrl: this.modelUrls.urlBase,
        apiQueue: this.apiQueue,
        storeQueue: this.storeQueue,
        prefetchedData: window.MP_PREFETCHED_MODELDATA,
        preloadConfig: "JMYDCase",
        mdsContext: this.mdsContext
      }
    })

    const userApiClient = apiClinet.getApi()
    const userInfoClass = await userApiClient.user
    const d = userInfoClass.loggedIn
    const settings = this.setInitialSettings(userInfoClass, settingsModule, config)
    this.engine.getModuleBySymbol(AppPhaseSymbol).then(n => {
      n.updateActiveApp(AppMode.SHOWCASE), config.coldStart || this.engine.broadcast(new ApplicationLoadedMessage(AppMode.SHOWCASE))
    })
    this.engine.market.waitForData(AppData).then(t => {
      t.onChanged(async () => {
        const n = this.overrideParams.oops
        n && t.phase !== AppStatus.ERROR && (t.phase = AppStatus.ERROR)
        if (t.phase === AppStatus.ERROR) {
          const i = t.error
          const s = await this.engine.getModuleBySymbol(ErrorUISymbol)
          throw (
            (n
              ? s.showError(n)
              : i instanceof ModelArchivedError
                ? s.showError(ErrorText.MODEL_ARCHIVED)
                : i instanceof ModelComplianceError
                  ? s.showError(ErrorText.MODEL_COMPLIANCE)
                  : i instanceof ModelDeletedError
                    ? s.showError(ErrorText.MODEL_DELETED)
                    : i instanceof ModelFailedError
                      ? s.showError(ErrorText.MODEL_FAILED)
                      : i instanceof ModelPendingError
                        ? s.showError(ErrorText.MODEL_PENDING)
                        : i instanceof ModelProcessingError
                          ? s.showError(ErrorText.MODEL_PROCESSING)
                          : i instanceof WEBGLUNSUPPORTEDError
                            ? s.showError(ErrorText.WEBGL_UNSUPPORTED)
                            : i instanceof WEBGLGENERICError
                              ? s.showError(ErrorText.WEBGL_GENERIC)
                              : s.showError(ErrorText.GENERIC),
            i)
          )
        }
      })
    })
    this.bindings.push(
      ShowcaseMessage({
        messageBus: this.engine.msgBus
      })
    )
    const bindings: SymbolLoadMessage[] = [
      new SymbolLoadMessage({
        symbol: ModelMeshSymbol,
        // callback: () =>import("../gui/modelMesh.gui").then(t => t.default(this.engine))
        callback: () => Promise.resolve(modelMeshGui(this.engine))
      })
    ]
    this.overrideParams.debug &&
      bindings.push(
        new SymbolLoadMessage({
          symbol: NavSymbol,
          // callback: () => import("../gui/nav.gui").then(t => t.default(this.engine))
          callback: () => Promise.resolve(navGui(this.engine))
        }),
        new SymbolLoadMessage({
          symbol: RaycastOctreeSymbol,
          // callback: () => import("../gui/raycastOctree.gui").then(t => t.default(this.engine))
          callback: () => Promise.resolve(raycastOctreeGui(this.engine))
        }),
        new SymbolLoadMessage({
          symbol: PanoTilesSymbol,
          // callback: () => import("../gui/panoTiles.gui").then(t => t.default(this.engine))
          callback: () => Promise.resolve(panoTilesGui(this.engine))
        }),
        new SymbolLoadMessage({
          symbol: RaycastSymbol,
          // callback: () => import("../gui/raycast.gui").then(t => t.default(this.engine))
          callback: () => Promise.resolve(raycastGui(this.engine))
        }),
        new SymbolLoadMessage({
          symbol: SnappingSymbol,
          // callback: () => import("../gui/snapping.gui").then(t => t.default(this.engine))
          callback: () => Promise.resolve(snappingGui(this.engine))
        }),
        new SymbolLoadMessage({
          symbol: WebglRendererSymbol,
          // callback: () => import("../gui/webglRenderer.gui").then(t => t.default(this.engine))
          callback: () => Promise.resolve(webglRendererGui(this.engine))
        })
      )
    this.overrideParams.tiledmesh &&
      bindings.push(
        new SymbolLoadMessage({
          symbol: StreamingMeshSymbol,
          // callback: () => import("../gui/streamingMesh.gui").then(t => t.default(this.engine))
          callback: () => Promise.resolve(streamingMeshGui(this.engine))
        }),
        new SymbolLoadMessage({
          symbol: StreamingTextureSymbol,
          // callback: () => import("../gui/streamingTexture.gui").then(t => t.default(this.engine))
          callback: () => Promise.resolve(streamingTextureGui(this.engine))
        })
      )
    bindings.forEach(t => this.engine.msgBus.broadcast(t))
    this.bindings.push(
      createSubscription(
        () => null,
        () => bindings.forEach(t => this.engine.msgBus.broadcast(new SymbolLoadDoneMessage(t.payload)))
      )
    )
    if (!config.coldStart) return void (this.uiLoading = this.loadUI(!0))
    debugInfo.info("JMYDCase version: 20240906")
    const { container } = this
    this.canvas = document.createElement("canvas")
    this.canvas.className = "webgl-canvas"
    const canvasContainer = container.querySelector("#canvas-container")
    const appContainer = container.querySelector("#app-container")
    const mainDiv = container.querySelector("main") || document.body
    const reactContainer = container.querySelector("#react-render-root") || document.body
    this.logLevel = parseInt(this.overrideParams.log, 10)
    this.overrideParams.hasOwnProperty("log") && !isNaN(this.logLevel) && (DebugInfo.level = this.logLevel)
    this.quickstart && debugInfo.info("Quickstart engaged. Hold on to your knickers. " + performance.now())
    this.engine.loadModuleBySymbol({
      type: ContainerDataSymbol,
      config: {
        element: this.container
      }
    })
    this.engine.loadModuleBySymbol({
      type: LocaleSymbol,
      config: {
        isLoggedIn: userInfoClass.loggedIn,
        queue: this.apiQueue
      }
    })
    this.engine.loadModuleBySymbol({
      type: ErrorUISymbol,
      config: {
        apiHost: this.apiHost,
        container: this.container
      }
    })
    // this.engine.loadModuleBySymbol({
    //   type: SdkLandingSymbol,
    //   config: {
    //     container: this.container
    //   }
    // })

    await this.startAuthAndPolicyModules()
    this.engine.loadModuleBySymbol({
      type: WebglRendererSymbol,
      config: {
        canvas: this.canvas,
        useWebGL2: "1" === this.overrideParams.gl2,
        antialias: "1" === this.overrideParams.aa,
        useEffectComposer: !(!this.settingOverrides || !this.settingOverrides.hasOwnProperty("useEffectComposer")) && !!this.settingOverrides.useEffectComposer
      }
    })
    this.engine.loadModuleBySymbol({
      type: CameraSymbol
    })
    this.engine.loadModuleBySymbol({
      type: CanvasSymbol,
      config: {
        canvas: this.canvas,
        container: canvasContainer
      }
    })
    this.engine.loadModuleBySymbol({
      type: SchedulerSymbol
    })
    // this.engine.loadModuleBySymbol({
    //   type: SensorsSymbol
    // })
    const webglRendererModule = await this.engine.getModuleBySymbol(WebglRendererSymbol)
    this.engineTick = new EngineTick(this.engine, webglRendererModule.threeRenderer, e => {
      this.engine.getModuleBySymbol(ErrorUISymbol).then(t => {
        this.setError(e), t.showError(ErrorText.GENERIC)
      })
    })
    this.apiConfig = await userApiClient.getConfigs("JMYDCase")
    this.setupOEmbedConsumer(this.settingOverrides.embedlyKey)
    const userFlags = userInfoClass.getFlags("JMYDCase/")
    const hasMDS = userFlags.has(mdsPrefetch)

    this.loadPrefetchedData(this.initialViewId, hasMDS)
    const { q: T, qK: P, qF: k } = this.overrideParams
    this.engine.loadModuleBySymbol({
      type: WebglContextLossSymbol,
      config: {
        notificationDelayFrames: 60
      }
    })
    const { settingsData } = settingsModule
    this.openingTool = HasTool(settingsData)
    this.forceLogin = this.openingTool === ToolsList.NOTES && !d && !sameWindow()
    let editModePreferred = this.editModePreferred
    editModePreferred && this.forceLogin && (debugInfo.warn("Cannot start in edit mode. Need to login to view note."), (editModePreferred = !1))
    const D = {
      [tilingPreloadQualityKey]: null,
      quickstart: this.quickstart,
      lang: this.overrideParams.lang,
      perf: this.overrideParams.perf,
      perfInterval: this.overrideParams.perfInterval,
      [discoverSpaceUrlKey]: this.apiConfig?.discover_space_url || ""
    }
    for (const e in D) settingsModule.updateSetting(e, D[e])
    if (this.settingOverrides) for (const e in this.settingOverrides) settingsModule.updateSetting(e, this.settingOverrides[e])
    const configAB = new AB(this.apiConfig)
    const z = configAB.serialize() || []

    this.loadInitialAppModules(z, webglRendererModule.gpuInfo)
    const policyData = await this.engine.market.waitForData(PolicyData)
    this.baseModelId = await this.loadViewsAndStorage(this.initialViewId)
    await this.engine.loadModuleBySymbol({
      type: UsersSymbol,
      config: {
        baseUrl: this.modelUrls.urlBase,
        api: userApiClient,
        viewId: this.initialViewId,
        queue: this.apiQueue,
        mdsContext: this.mdsContext
      }
    })
    // this.forceLogin && this.openingTool === ToolsList.NOTES && (await this.loginToNote(this.baseModelId))
    settingsModule.hasProperty(embedlyKey) || settingsModule.updateSetting(embedlyKey, this.apiConfig.embedly_key)
    this.loadInitialDataModules(settings, editModePreferred)
    const stopTourHook = () => this.stopTourHook(this.engine)
    this.engine.commandBinder.hookCommand(MoveToSweepCommand, !0, stopTourHook)
    this.engine.commandBinder.hookCommand(ChangeViewmodeCommand, !0, stopTourHook)
    this.engine.commandBinder.hookCommand(TourStepCommand, !0, stopTourHook)
    try {
      await this.engine.waitForLoadingModules()
    } catch (t) {
      this.setError(t)
      this.engine.tick()
    }
    const [Z, X] = await Promise.all([this.engine.market.waitForData(ModelData), this.engine.market.waitForData(CamStartData)])
    this.engine.loadModuleBySymbol({
      type: VisibleMeshBoundsSymbol
    })
    const { details, organizationId } = Z.model
    container.getRootNode() instanceof ShadowRoot || (document.title = details.name)
    this.canvas.setAttribute("aria-label", details.name)
    const deepLinkPose = X.getStartingPose()
    if (this.quickstart && !(deepLinkPose && isPanorama(deepLinkPose.mode))) {
      debugInfo.warn("Disabling quickstart. No panorama start position."), (this.quickstart = !1), settingsModule.updateSetting("quickstart", !1)
    }
    const { maxMeshTextureQuality, textureLODThreshold } = (e => {
      let maxMeshTextureQuality: MeshTextureQuality, textureLODThreshold: number
      if (isMobilePhone()) {
        isMobilePhone() && e
          ? ((maxMeshTextureQuality = MeshTextureQuality.ULTRA), (textureLODThreshold = 10))
          : ((maxMeshTextureQuality = MeshTextureQuality.MEDIUM), (textureLODThreshold = 6))
      } else {
        maxMeshTextureQuality = MeshTextureQuality.ULTRA
        textureLODThreshold = 20
      }

      return {
        maxMeshTextureQuality,
        textureLODThreshold
      }
    })(webglRendererModule.isHighPerformanceMobileGPU())
    debugInfo.info({
      maxMeshTextureQuality,
      textureLODThreshold,
      gpuInfo: webglRendererModule.gpuInfo
    })

    await this.engine.loadModuleBySymbol({
      type: PanoSymbol
    })
    await this.engine.loadModuleBySymbol({
      type: SkyboxSymbol
    })
    this.quickstart && (this.loadPanoControls(editModePreferred), this.engineTick.start())

    const initUIModule = await this.engine.getModuleBySymbol(InitUISymbol)
    await initUIModule.waitForPlaying
    this.canvas.setAttribute("tabIndex", "0")
    this.engine.loadModuleBySymbol({
      type: MouseSymbol,
      config: {
        container: this.container
      }
    })

    this.engine.loadModuleBySymbol({
      type: ModelMeshSymbol,
      config: {
        startingMode: this.quickstart ? deepLinkPose.mode : null,
        textureLOD: TextureLOD.RAYCAST,
        colorizeRooms: "1" === this.overrideParams.colorizeRooms,
        colorizeChunks: "1" === this.overrideParams.colorizeChunks,
        wireframe: "1" === this.overrideParams.wireframe,
        gltfConfig: {
          dracoDecoderPath: this.settingOverrides.dracoDecoderPath || `/three/libs/draco/gltf/`,
          basisTranscoderPath: this.settingOverrides.basisTranscoderPath || `/three/libs/basis/`
        }
      }
    })
    this.engine.loadModuleBySymbol({
      type: MeshTrimDataSymbol,
      config: {
        baseModelId: this.baseModelId,
        baseUrl: this.modelUrls.urlBase,
        queue: this.storeQueue
      }
    })
    this.engine.loadModuleBySymbol({
      type: ModelMeshQualitySymbol,
      config: {
        maxQuality: maxMeshTextureQuality,
        textureLOD: TextureLOD.RAYCAST,
        textureLODThreshold
      }
    })
    this.engine.loadModuleBySymbol({
      type: ModeChangeSymbol
    })
    this.engine.loadModuleBySymbol({
      type: ModeSymbol,
      config: {
        startingMode: this.quickstart ? deepLinkPose.mode : null
      }
    })
    this.engine.loadModuleBySymbol({
      type: RoomsSymbol,
      config: {
        baseModelId: this.baseModelId,
        baseUrl: this.modelUrls.urlBase
      }
    })
    this.engine.loadModuleBySymbol({
      type: SweepViewdataSymbol
    })
    this.engine.loadModuleBySymbol({
      type: FloorSymbol,
      config: {
        baseModelId: this.baseModelId,
        baseUrl: this.modelUrls.urlBase,
        readonly: !0,
        queue: this.storeQueue
      }
    })
    this.engine.loadModuleBySymbol({
      type: FloorStateSymbol,
      config: {
        startingFloorsVisibility: this.quickstart ? deepLinkPose.floorVisibility : void 0,
        allowFloorChanges: settings.Features[FeaturesFloorselectKey]
      }
    })
    this.engine.loadModuleBySymbol({
      type: RttSymbol
    })

    this.engine.loadModuleBySymbol({
      type: ToolsSymbol
    })

    this.engine.loadModuleBySymbol({
      type: InteractionSymbol
    })
    this.engine.loadModuleBySymbol({
      type: ControlsDHSymbol
    })
    this.engine.loadModuleBySymbol({
      type: ControlsFPSymbol
    })
    this.engine.loadModuleBySymbol({
      type: OrthographicControlsSymbol
    })
    this.engine.loadModuleBySymbol({
      type: ControlsZoomSymbol,
      config: {
        enabled: "1" !== this.overrideParams.nozoom
      }
    })
    this.engine.loadModuleBySymbol({
      type: ShowcaseStartSymbol
    })
    this.engine.loadModuleBySymbol({
      type: NavigationSymbol,
      config: {
        enableWheel: "1" === this.overrideParams.nozoom
      }
    })
    this.engine.loadModuleBySymbol({
      type: MeshQuerySymbol
    })
    this.engine.loadModuleBySymbol({
      type: RaycastFloorSymbol
    })
    this.engine.loadModuleBySymbol({
      type: MeshApiFixupSymbol
    })
    this.engine.loadModuleBySymbol({
      type: HotKeysSymbol
    })

    this.quickstart || (this.engineTick.start(), this.loadPanoControls(editModePreferred))
    await this.engine.waitForLoadingModules()
    "0" !== this.overrideParams.portal &&
      (this.engine.loadModuleBySymbol({
        type: PortalSymbol
      }),
      this.engine.loadModuleBySymbol({
        type: PortalNavSymbol
      }))
    this.engine.loadModuleBySymbol({
      type: SweepPinMeshSymbol,
      config: {
        showPinsInFloorplanDollhouse: "0" !== this.overrideParams.pin
      }
    })
    this.engine.loadModuleBySymbol({
      type: SweepPinSymbol
    })
    this.engine.loadModuleBySymbol({
      type: PucksSymbol,
      config: {
        checkRenderModes: () => {
          const t = this.engine.market.tryGetData(TourData)
          if (t && t.isTourActive()) return !1
          const n = this.engine.market.tryGetData(ViewmodeData)
          return !!n && n.isInside()
        }
      }
    })
    this.engine.loadModuleBySymbol({
      type: LabelDataSymbol,
      config: {
        baseUrl: this.modelUrls.urlBase,
        readonly: !0,
        queue: this.storeQueue
      }
    })
    this.engine.loadModuleBySymbol({
      type: LabelRenderSymbol
    })
    const tagIconsEnabled = settingsModule.getProperty(FeaturesTagIconsKey)
    this.engine.loadModuleBySymbol({
      type: PinsSymbol,
      config: {
        tagIconsEnabled
      }
    })
    this.engine.loadModuleBySymbol({
      type: AnnotationsSymbol
    })

    SubscriberPromptRegisterSetting(settingsModule, this.apiConfig, this.overrideParams, userFlags, d, policyData, this.inWorkshop, configAB)
    const ge = this.overrideParams.stories
    const ve = "1" === ge || ("0" !== ge && policyData.hasPolicy(j.R3))
    settingsModule.updateSetting(TourStoriesKey, ve)
    // this.engine.getModuleBySymbol(AnalyticsSymbol).then(e => {
    //   e.trackFeatures(`${j.Yi}:${ve}`), (0, Ve.ID)(e, policyData)
    // })
    this.engine.loadModuleBySymbol({
      type: ToursDataSymbol,
      config: {
        baseUrl: this.modelUrls.urlBase,
        readonly: !0,
        storyToursFeature: ve,
        looping: "1" === this.overrideParams.lp,
        queue: this.storeQueue,
        baseModelId: this.baseModelId
      }
    })

    const objectTagsEnabled = (0, We.yQ)(userInfoClass, organizationId, policyData, settingsData)
    this.engine.loadModuleBySymbol({
      type: TagsSymbol,
      config: {
        objectTagsEnabled,
        viewId: this.initialViewId
      }
    })
    this.engine.loadModuleBySymbol({
      type: OrderedListsSymbol,
      config: {
        workshop: this.inWorkshop,
        baseUrl: this.modelUrls.urlBase
      }
    })
    this.loadUserDependentModules(d, settingsData, policyData, userFlags)
    this.engine.loadModuleBySymbol({
      type: RaycastFatSymbol,
      config: {
        debug: "1" === this.overrideParams.fcdbg
      }
    })
    this.engine.loadModuleBySymbol({
      type: LinesSymbol
    })
    this.engine.loadModuleBySymbol({
      type: MattertagDataSymbol,
      config: {
        baseUrl: this.modelUrls.urlBase,
        readonly: !0,
        objectTagsEnabled,
        parserOptions: {
          supportLinks: !this.overrideParams.mls || "0" === this.overrideParams.mls,
          keepLinkLabels: !0
        },
        queue: this.storeQueue
      }
    })
    this.engine.loadModuleBySymbol({
      type: PathSymbol
    })
    this.engine.loadModuleBySymbol({
      type: ToursControlsSymbol
    })
    this.engine.loadModuleBySymbol({
      type: PreRendererSymbol
    })
    this.engine.loadModuleBySymbol({
      type: CursorSymbol
    })
    this.engine.loadModuleBySymbol({
      type: CursorMeshSymbol
    })
    this.engine.loadModuleBySymbol({
      type: CursorControllerSymbol
    })
    this.engine.loadModuleBySymbol({
      type: ScanInfoSymbol,
      config: {
        baseUrl: this.modelUrls.urlBase
      }
    })
    this.engine.loadModuleBySymbol({
      type: DeepLinksSymbol
    })

    this.engine.loadModuleBySymbol({
      type: CurrentPanoSymbol
    })
    this.engine.loadModuleBySymbol({
      type: ScreenshotsSymbol
    })
    this.engine.loadModuleBySymbol({
      type: VideoSymbol
    })
    this.engine.loadModuleBySymbol({
      type: MeasurementModeSymbol,
      config: {
        baseUrl: this.modelUrls.urlBase,
        readonly: !0
      }
    })
    this.engine.loadModuleBySymbol({
      type: SnapshotsEditorSymbol
    })
    // this.engine.loadModuleBySymbol({
    //   type: DwellAnalyticsSymbol
    // })

    if (objectTagsEnabled) {
      const minConfidence = this.overrideParams.minConfidence ? CheckThreshold(parseFloat(this.overrideParams.minConfidence), 0.01, 1) : void 0
      this.engine.loadModuleBySymbol({
        type: ObjectTagSuggestionsDataSymbol,
        config: {
          debug: !!this.overrideParams.debug,
          baseUrl: this.modelUrls.urlBase,
          baseModelId: this.baseModelId,
          minConfidence
        }
      })
    }
    const xrBrowsersUnlocked = settingsModule.getProperty(XRBrowserLockKey)
    this.engine.loadModuleBySymbol({
      type: WebxrSymbol,
      config: {
        enableEventPositions: !0,
        framebufferScaling: Math.min(this.overrideParams.xrframebuffer ? parseFloat(this.overrideParams.xrframebuffer) : 0, 1),
        tracking: +(this.overrideParams.xrtracking || 0),
        xrBrowsersUnlocked
      }
    })
    if (settingsModule.getProperty(modelRatingDialogKey)) {
      const promptEnabled = settingsModule.getProperty(modelRatingDialogPromptKey)
      this.engine.loadModuleBySymbol({
        type: ModelRatingSymbol,
        config: {
          baseModelId: this.baseModelId,
          baseUrl: this.modelUrls.urlBase,
          queue: this.storeQueue,
          promptEnabled,
          debug: "1" === this.overrideParams.modelRatingDebug
        }
      })
    }
    this.engine.getModuleBySymbol(ModelDataSymbol).then(() => {
      hasRoomBound(policyData, settingsData, this.inWorkshop) &&
        (this.engine.loadModuleBySymbol({
          type: RoomBoundDataSymbol,
          config: {
            baseUrl: this.modelUrls.urlBase,
            readonly: !this.inWorkshop,
            requestQueue: this.storeQueue
          }
        }),
        this.engine.loadModuleBySymbol({
          type: RoomBoundRendererSymbol
        }),
        this.engine.loadModuleBySymbol({
          type: RoomBoundSymbol
        }))
    })

    // this.engine.loadModuleBySymbol({
    //   type: ReactThreeFiberExternal
    // })
    await this.engine.waitForLoadingModules()
    this.modulesLoadedPromise.resolve()
    //pw
    debugInfo.info(this.apiConfig, "apiConfig")
    debugInfo.info(this.overrideParams, "overrideParams")
    debugInfo.info(this.settingOverrides, "settingOverrides")
    debugInfo.info(settingsModule.settingsData.properties.map, "settingsData")
  }
  setInitialSettings(e: UserInfoClass, t: SettingsModule, n) {
    const i = e.getFlags("JMYDCase/")
    const s = interpolateValue(parseFloat(this.overrideParams.wts))
    const { labels, mt, allowRating, tiledmesh, tagIcons } = this.overrideParams
    const d = i.has(FeaturesMeasurementsNudgeKey)
    const u = getUnitType(navigator.language)
    const h = i.has(modelRatingDialogKey) ? "0" !== allowRating : "1" === allowRating
    const p = this.inWorkshop && e.loggedIn && h
    const m = p && i.has(modelRatingDialogPromptKey) ? "0" !== allowRating : "1" === allowRating
    const f = i.has(FeaturesTagIconsKey) ? "0" !== tagIcons : "1" === tagIcons
    const g = i.has(FeaturesTiledMeshKey) ? "0" !== tiledmesh : "1" === tiledmesh
    const v = i.has(FeaturesAutoDesignerKey) ? "0" !== this.overrideParams.ad : "1" === this.overrideParams.ad
    const y = i.has(XRBrowserLockKey) ? "0" !== this.overrideParams[xe.nE] : "1" === this.overrideParams[xe.nE]
    const b = {
      Features: {
        [FeaturesSweepPucksKey]: !0,
        [Features360ViewsKey]: !0,
        [FeaturesTiledMeshKey]: g,
        [FeaturesAutoDesignerKey]: v,
        [FeaturesLabelsKey]: "0" !== labels,
        [featuresMattertagsKey]: "0" !== mt,
        [FeaturesFloorselectKey]: "0" !== this.overrideParams.f,
        [ToursMetersPerSecondKey]: s,
        [FeaturesMeasurementsNudgeKey]: d,
        [FeaturesDollhouseNudge]: !1,
        [FeaturesRoomboundsFloorplanNudgekEY]: !1,
        [modelRatingDialogKey]: p,
        [modelRatingDialogPromptKey]: m,
        [subscriberPromptActiveKey]: !1,
        [mdsPrefetch]: i.has(mdsPrefetch),
        [FeaturesTagIconsKey]: f,
        [TagBillboardShareKey]: !0,
        [TagBillboardDockKey]: !0,
        [XRBrowserLockKey]: y
      },
      "User Preferences": {
        [UserPreferencesKeys.UnitType]: u,
        [UserPreferencesKeys.MeasurementSnapping]: !0,
        [UserPreferencesKeys.MeasurementContinuousLines]: !0,
        [UserPreferencesKeys.MeasurementUserNudgeSeen]: !1,
        [UserPreferencesKeys.DollhouseUserNudgeSeen]: !1,
        [UserPreferencesKeys.NotesModeNudgeSeen]: !1,
        [UserPreferencesKeys.LastRatingPromptTime]: null,
        [UserPreferencesKeys.SubscriberPromptDismissed]: !1,
        [UserPreferencesKeys.TourTextNudgeDismissed]: !1,
        [UserPreferencesKeys.TourMobileNavigationPromptSeen]: !1
      }
    }
    for (const e in b) {
      for (const n in b[e]) {
        if (void 0 === b[e][n]) continue
        const i = "User Preferences" === e ? SettingPersistence.LOCAL_STORAGE : SettingPersistence.NONE
        t.registerSetting(e, n, b[e][n], !0, i)
      }
    }
    t.updateSetting("assetBasePath", this.assetBasePath)
    const E = i.has(DollhousePeekabooKey) ? "0" !== this.overrideParams.peekaboo : "1" === this.overrideParams.peekaboo
    t.updateSetting(DollhousePeekabooKey, E && !this.isSDK)
    return b
  }
  setPluginPolicySettings(e, t) {
    const i = {
      enabled: t.hasPolicy(SpacesPluginsKey),
      canConfig: t.hasPolicy(SpacesPluginsConfigKey),
      canDebug: t.hasPolicy(SpacesPluginsDebugKey),
      groups: t.getPolicy(SpacesPluginsGroupsKey)?.options || []
    }
    return e.setProperty(SpacesPluginsConfigKey, i.canConfig && i.enabled), e.setProperty(SpacesPluginsKey, i.enabled), i
  }
  loadUserDependentModules(e, t, n, i) {
    // this.engine.market.waitForData(UsersData).then(s => {
    //   ;(0, X.$p)(e, n, s, t, i) &&
    //     this.engine.loadModuleBySymbol({
    //       type: NotesSymbol,
    //       config: {
    //         workshop: this.inWorkshop,
    //         baseUrl: this.modelUrls.urlBase,
    //         readonly: !1
    //       }
    //     })
    // })
  }
  async unload(e: Engine) {
    this.mdsContext.sharedCaches.delete(this.prefetchCache)
    try {
      await e.commandBinder.issueCommand(new TourStopCommand())
    } catch (e) {
      debugInfo.debug("JMYDCase unload called before tour controls registered, ignoring stopTour", e)
    }
    await this.uiLoading
    await this.showcaseGui?.unloadUi().catch(e => {
      debugInfo.error(e)
    })
    e.commandBinder.resetHooks()
    this.bindings.forEach(e => e.cancel()), (this.bindings.length = 0)
  }

  // async loginToNote(e) {
  //   this.forceLogin && (await this.showLoginScreen(e))
  // }
  loadInitialAppModules(e: string[], t) {
    this.engine.loadModuleBySymbol({
      type: RaycasterSymbol
    })
    this.engine.loadModuleBySymbol({
      type: InputSymbol,
      config: {
        disableWheel: "0" === this.overrideParams.wh,
        pointerPreventDefault:
          !this.settingOverrides || !this.settingOverrides.hasOwnProperty("pointerPreventDefault") || !!this.settingOverrides.pointerPreventDefault,
        rootNode: this.container.getRootNode()
      }
    })
    // this.engine.getModuleBySymbol(AnalyticsSymbol).then(n => {
    //   n.setOptions({
    //     gpu: t
    //   })
    //   n.trackFeatures(...e, `${Q.Qy}:true`)
    // })
  }
  prefetchCache: PrefetchedQueryCache
  loadPrefetchedData(e, t) {
    let n = t ? PrefetchPolicyType.CACHE : PrefetchPolicyType.NONE
    const i = this.overrideParams.prefetch
    i && Object.values(PrefetchPolicyType).includes(i) && (n = i)
    this.prefetchCache = new PrefetchedQueryCache({
      baseUrl: this.apiHost,
      prefetchPolicy: n,
      initialData: PreFetchedModelData.getQuery("GetModelPrefetch"),
      variables: {
        modelId: e
      }
    })
    this.mdsContext.sharedCaches.add(this.prefetchCache)
  }
  async loadViewsAndStorage(e) {
    await this.engine.loadModuleBySymbol({
      type: LayersSymbol,
      config: {
        viewId: e,
        baseUrl: this.apiHost,
        readonly: !0,
        inWorkshop: this.inWorkshop,
        modulesLoadedPromise: this.modulesLoadedPromise,
        mdsContext: this.mdsContext
      }
    })
    const t = (await this.engine.market.waitForData(LayersData)).getBaseModelId()
    this.engine.loadModuleBySymbol({
      type: StorageSymbol,
      config: {
        baseUrl: this.apiHost
      }
    })
    return t
  }
  async loadAnalytics() {
    // this.engine.loadModuleBySymbol({
    //   type: AnalyticsSymbol
    // })
    // this.engine.loadModuleBySymbol({
    //   type: AppAnalyticsSymbol,
    //   config: {
    //     appName: (this.settingOverrides && this.settingOverrides.appName) || "JMYDCase",
    //     provider: this.overrideParams.analytics,
    //     apiQueue: this.apiQueue,
    //     analyticsQueue: this.analyticsQueue,
    //     overrideParams: this.overrideParams
    //   }
    // })
  }
  loadInitialDataModules(e, t) {
    this.engine.loadModuleBySymbol({
      type: ShowcaseSettingsSymbol,
      config: {
        baseModelId: this.baseModelId,
        baseUrl: this.modelUrls.urlBase,
        readonly: !t,
        queue: this.storeQueue
      }
    })
    this.engine.loadModuleBySymbol({
      type: ModelDataSymbol,
      config: {
        sceneId: this.modelUrls.sceneId,
        baseModelId: this.baseModelId,
        baseUrl: this.modelUrls.urlBase,
        readonly: !t,
        queue: this.storeQueue,
        tiledMeshEnabled: e.Features[FeaturesTiledMeshKey]
      }
    })
    const n = this.settingOverrides.disableMobileRedirect
    const i = !!this.openingTool || void 0
    const s = !!this.openingTool || void 0
    const r = !!this.openingTool || void 0
    this.engine.loadModuleBySymbol({
      type: InitUISymbol,
      config: {
        disabled: this.forceLogin,
        openingTool: !!this.openingTool,
        viewId: this.initialViewId,
        baseUrl: this.modelUrls.urlBase,
        quickstart: this.quickstart,
        editMode: t,
        allowPlayInIframe: !!n,
        allowAutoPlay: !!n,
        hideTitle: s,
        hideBranding: r,
        hidePoweredBy: i
      }
    })
    this.engine.loadModuleBySymbol({
      type: SnapshotsDataSymbol,
      config: {
        baseModelId: this.baseModelId,
        baseUrl: this.modelUrls.urlBase,
        readonly: !t,
        queue: this.storeQueue
      }
    })
    this.engine.loadModuleBySymbol({
      type: SweepDataSymbol,
      config: {
        baseUrl: this.modelUrls.urlBase,
        readonly: !t,
        queue: this.storeQueue
      }
    })
    this.engine.loadModuleBySymbol({
      type: CameraStartSymbol,
      config: {
        baseModelId: this.baseModelId,
        baseUrl: this.modelUrls.urlBase,
        readonly: !t,
        queue: this.storeQueue
      }
    })
  }
  loadPanoControls(e) {
    // this.uiLoading = this.loadUI(!(e || this.forceLogin))

    this.engine.loadModuleBySymbol({
      type: ControlsCommonSymbol
    })
    this.engine.loadModuleBySymbol({
      type: ControlsInsideSymbol
    })
  }

  async loadUI(e) {
    const [t, n] = await Promise.all([this.engine.getModuleBySymbol(GuiSymbol), this.engine.getModuleBySymbol(ViewUISymbol)])
    this.guiModule = t
    this.showcaseGui = n
    e && t.loadUi(n.loadUi)
  }
  async startAuthAndPolicyModules() {
    await this.engine.loadModuleBySymbol({
      type: PolicySymbol,
      config: {
        baseUrl: this.modelUrls.urlBase,
        viewId: this.initialViewId,
        mdsContext: this.mdsContext
      }
    })
  }
  // async validateSdkProvider(e) {
  //   const t = !!(await this.engine.market.waitForData(PolicyData)).getPolicy(ze),
  //     n = $e.get(e) === ze
  //   return !e || !n || (t && n)
  // }
  // async showLoginScreen(modelId: string) {
  //   return (
  //     await this.engine.loadModuleBySymbol({
  //       type: LoginRedirectSymbol,
  //       config: {
  //         loginUrl: this.apiConfig?.authn_login_url || "",
  //         registerUrl: this.apiConfig?.account_register_url || "",
  //         modelId,
  //         baseUrl: this.modelUrls.urlBase,
  //         container: this.container
  //       }
  //     })
  //   ).loadUi()
  // }
  // login() {
  //   return new Promise(async e => {
  //     const t = await this.engine.loadModuleBySymbol({
  //       type: PasswordSymbol,
  //       config: {
  //         modelId: this.initialViewId,
  //         baseUrl: this.modelUrls.urlBase,
  //         container: this.container
  //       }
  //     })
  //     this.engine.subscribe(PasswordAuthenticationMessage, () => {
  //       t.hidePasswordScreen(), e(void 0)
  //     }),
  //       t.showPasswordScreen()
  //   })
  // }
  setupOEmbedConsumer(e) {
    const t = {
      embedlyKey: e || this.apiConfig.embedly_key,
      instagramAppId: this.apiConfig.instagram_app_id,
      instagramClientToken: this.apiConfig.instagram_client_token,
      googleMapsApiKey: this.apiConfig.google_maps_key
    }
    this.oEmbedDeferred.resolve(new je.a_(this.apiQueue, t))
  }
}
