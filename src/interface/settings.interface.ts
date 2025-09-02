import { TransitionTypeKey } from "../const/14715"
import { FeaturesNotesModeKey } from "../other/39586"
import { ToolsBlurEditorKey } from "../const/44109"
import { RoomBoundUserViewErrorKey, ShowcaseRoomBoundsKey } from "../other/47309"
import { FeaturesTagIconsKey } from "../const/48945"
import { lookAccelerationKey } from "../modules/panoramaControls.module"
import { TourStoriesKey } from "../const/59323"
import { ShowcaseDollhouseKey, ShowcaseFloorPlanKey } from "../other/65019"
import { DollhousePeekabooKey } from "../const/66777"
import { ModelViewsFeatureKey, DataLayersFeatureKey } from "../other/76087"
import { ObjectInsightsFeatureKey } from "../other/96776"
import { PanoSizeBaseKey, ToursMetersPerSecondKey } from "../const/14439"
import { Features360ViewsKey } from "../const/360.const"
import { modelRatingDialogKey, modelRatingDialogPromptKey } from "../const/modelRating.const"
import { presentationTitleKey, brandingEnabledKey, presentationMlsModeKey } from "../const/settings.const"
import { FeaturesSweepPucksKey } from "../const/sweep.const"
import { embedlyKey, featuresMattertagsKey } from "../const/tag.const"
import { cloudInitialToolKey } from "../const/tools.const"
import { UserPreferencesKeys } from "../const/user.const"
import { XRBrowserLockKey } from "../const/xr.const"
import { BtnText } from "../data/player.options.data"
import { PhotoGridVisibleKey } from "../modules/workshopUi.module"
import { FeaturesNotesKey } from "../const/39693"
import { BackgroundColorDefault } from "../const/28361"
import { FeaturesTiledMeshKey, TrimFloorKey, WireframeEnabledKey } from "../const/53203"
import { FeaturesFloorselectKey } from "../const/floor.const"
import { tilingPreloadQualityKey } from "../const/quality.const"
import { PanoSizeKey } from "../const/76609"
import { PanDirectionList } from "../const/transition.const"
import { FeaturesCursorKey } from "../const/cursor.const"

export interface OverrideParams {
  hr: number
  gt: number
  tour: number
  wts: number
  st: number
  kb: number
  m: string
  hl: string
  play: number
  qs: string
  applicationKey: string
  useLegacyIds: string
  nt: number
  expand: number
  tag: string
  tool: string
  note: string
  noInstancing: number
  brand: string
  mls: string
  title: string
  tagNav: string
  lang: string
  "pin-pos": string
  sspa: number
}

export interface SettingsDataProperties {
  [FeaturesTiledMeshKey]: boolean
  [BtnText.BackgroundColor]: string
  [BtnText.DetailsAddress]: boolean
  [BtnText.DetailsEmail]: boolean
  [BtnText.DetailsExternalUrl]: boolean
  [BtnText.DetailsModelName]: boolean
  [BtnText.DetailsName]: boolean
  [BtnText.DetailsPhone]: boolean
  [BtnText.DetailsSummary]: boolean
  [BtnText.Dollhouse]: boolean
  [BtnText.DollhousePanSpeed]: number
  [BtnText.FloorPlan]: boolean
  [BtnText.FloorSelect]: boolean
  [BtnText.HighlightReel]: boolean
  [BtnText.InstantTransitions]: boolean
  [BtnText.Labels]: boolean
  [BtnText.LabelsDollhouse]: boolean
  [BtnText.Measurements]: boolean
  [BtnText.PanAngle]: number
  [BtnText.PanDirection]: PanDirectionList
  [BtnText.PanSpeed]: number
  [BtnText.PresentedBy]: boolean
  [BtnText.RoomBounds]: boolean
  [BtnText.SavedMeasurements]: boolean
  [BtnText.SpaceSearch]: boolean
  [BtnText.TourButtons]: boolean
  [BtnText.TransitionSpeed]: number
  [BtnText.TransitionTime]: number
  [BtnText.Units]: boolean
  [BtnText.ZoomDuration]: number

  [modelRatingDialogKey]: any
  [modelRatingDialogPromptKey]: any
  [XRBrowserLockKey]: any
  [presentationTitleKey]: any
  [brandingEnabledKey]: boolean
  [presentationMlsModeKey]: boolean
  [ModelViewsFeatureKey]: boolean
  [DataLayersFeatureKey]: boolean
  [TourStoriesKey]: boolean
  [FeaturesTagIconsKey]: boolean
  [DollhousePeekabooKey]: boolean
  [FeaturesSweepPucksKey]: boolean
  [RoomBoundUserViewErrorKey]: boolean
  [lookAccelerationKey]: boolean
  [cloudInitialToolKey]: string
  [ShowcaseDollhouseKey]: boolean
  [ToolsBlurEditorKey]: boolean
  [Features360ViewsKey]: boolean
  [TransitionTypeKey]: number
  [FeaturesNotesModeKey]: boolean
  [ObjectInsightsFeatureKey]: boolean
  [UserPreferencesKeys.BlursAddNudgeSeen]: boolean
  [UserPreferencesKeys.DollhouseUserNudgeSeen]: boolean
  [UserPreferencesKeys.FloorplanRoomsUserNudgeSeen]: boolean
  [UserPreferencesKeys.HighlightReelSettingsTab]: boolean
  [UserPreferencesKeys.LastRatingPromptTime]: number
  [UserPreferencesKeys.MeasurementContinuousLines]: boolean
  [UserPreferencesKeys.MeasurementSnapping]: boolean
  [UserPreferencesKeys.MeasurementUserNudgeSeen]: boolean
  [UserPreferencesKeys.NotesAddNudgeSeen]: boolean
  [UserPreferencesKeys.NotesModeNudgeSeen]: boolean
  [UserPreferencesKeys.SubscriberPromptDismissed]: boolean
  [UserPreferencesKeys.TagsAddNudgeSeen]: boolean
  [UserPreferencesKeys.TourMobileNavigationPromptSeen]: boolean
  [UserPreferencesKeys.TourTextNudgeDismissed]: boolean
  [UserPreferencesKeys.UnitType]: boolean
  [embedlyKey]: boolean
  [PhotoGridVisibleKey]: boolean
  assetBasePath: string
  quickstart: boolean
  [PanoSizeBaseKey]: PanoSizeKey
  [featuresMattertagsKey]: boolean
  [ShowcaseFloorPlanKey]: any
  [ShowcaseRoomBoundsKey]: boolean
  [FeaturesNotesKey]: boolean
  [BackgroundColorDefault.default]: string
  [WireframeEnabledKey]: boolean
  [TrimFloorKey]: number
  [FeaturesFloorselectKey]: string
  [tilingPreloadQualityKey]: PanoSizeKey | null
  [ToursMetersPerSecondKey]: number
  [FeaturesCursorKey]: boolean
}
