import { BtnText } from "../data/player.options.data"
import { SettingsData } from "../data/settings.data"
export const ShowcaseFloorPlanKey = "JMYDCase-floor_plan"
export const ShowcaseDollhouseKey = "JMYDCase-dollhouse"
function a(e: SettingsData, t) {
  return l(BtnText.FloorPlan, ShowcaseFloorPlanKey, "fp", e, t)
}
function o(e: SettingsData, t) {
  return l(BtnText.Dollhouse, ShowcaseDollhouseKey, "dh", e, t)
}
function l(e: BtnText, t, n, i: SettingsData, s) {
  const r = i.tryGetProperty(e, !1)
  const a = !s && 0 === i.getOverrideParam(n, 1)
  const o = r && !a
  i.setProperty(t, o)
  return o
}

export const CE = o

export const g_ = a
