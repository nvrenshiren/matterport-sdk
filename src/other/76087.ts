import { PolicyData } from "../data/policy.data"
import { getURLParams } from "../utils/urlParams.utils"
export const ModelViewsFeatureKey = "model-views-feature"
export const SETTING_USER_VIEWS_ANALYTIC = "views"
export const DataLayersFeatureKey = "data-layers-feature"
export const SETTING_DATA_LAYERS_ANALYTIC = "layers"
export const LayersPolicyKey = "spaces.webgl.layers.mode"

export enum LayersPolicy {
  DISABLED = "disabled",
  LAYERS_ONLY = "layers",
  VIEWS_AND_LAYERS = "views_layers",
  VIEWS_ENABLED = "views_enabled",
  VIEWS_OPTIONAL_OPT_IN = "user_views"
}
const LAYERS_URL_PARAM = "layers"

export function getViewsPolicy(e: PolicyData) {
  const t = (function () {
    switch (getURLParams()[LAYERS_URL_PARAM]) {
      case LayersUrlParam.DISABLED:
        return LayersPolicy.DISABLED
      case LayersUrlParam.VIEWS_ENABLED:
        return LayersPolicy.VIEWS_ENABLED
      case LayersUrlParam.VIEWS_AND_LAYERS:
        return LayersPolicy.VIEWS_AND_LAYERS
      case LayersUrlParam.LAYERS_ONLY:
        return LayersPolicy.LAYERS_ONLY
    }
  })()
  if (void 0 !== t) return t
  const n = e.getPolicy(LayersPolicyKey)
  return n && n.value ? (n.value === LayersPolicy.VIEWS_OPTIONAL_OPT_IN ? LayersPolicy.VIEWS_AND_LAYERS : n.value) : LayersPolicy.DISABLED
}
enum LayersUrlParam {
  DISABLED = "0",
  LAYERS_ONLY = "4",
  VIEWS_AND_LAYERS = "3",
  VIEWS_ENABLED = "2"
}
