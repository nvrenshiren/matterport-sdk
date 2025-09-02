import { ModelViewType } from "../const/63319"
import { ModelView } from "../modelView"
export function isLayeredBaseView(e: ModelView) {
  return e.viewType === ModelViewType.LAYERED_BASE
}
export function isBaseView(e: ModelView) {
  return isLayeredBaseView(e) || e.viewType === ModelViewType.BASE
}
export function isUserView(e: ModelView) {
  return e.viewType === ModelViewType.USER
}
export function isInsightsView(e: ModelView) {
  return e.viewType === ModelViewType.INSIGHTS
}
