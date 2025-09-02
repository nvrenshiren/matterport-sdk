export enum AnnotationGrouping {
  TYPE = "type",
  FLOOR = "floor",
  ROOM = "room",
  LAYER = "layer",
  DATE = "date"
}
export enum ModelViewType {
  BASE = "base",
  LAYERED_BASE = "layered-base",
  INSIGHTS = "insights",
  TRUEPLAN = "trueplan",
  SESSION = "session",
  USER = "user",
  OTHER = "other"
}
export enum DataLayerType {
  BASE_LAYER = "matterport.base",
  VIEW_DATA_LAYER = "matterport.user.data",
  USER_LAYER = "matterport.user.data.ext",
  IN_MEMORY = "matterport.in-memory",
  WORKSHOP = "matterport.workshop.jsonstore",
  COMMON_USER_LAYER = "matterport.user.data.common",
  OVERLAY_ASSETS_LAYER = "matterport.overlay.assets",
  PROXY_LAYER = "matterport.proxy.common",
  OTHER = "other layer type"
}
