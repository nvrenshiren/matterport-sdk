import * as a from "../const/59323"
import { TourMode } from "../const/tour.const"
import { tourModeType } from "../const/typeString.const"
import { BtnText } from "../data/player.options.data"
import { SettingsData } from "../data/settings.data"
function o(e: SettingsData) {
  const t = e.tryGetProperty(BtnText.HighlightReel, !0),
    n = e.getOverrideParam(a.rU, a.iL),
    i = e.getOverrideParam(a.PR, a.l4)
  return t && n !== a.Nu && i !== a.pQ
}
function l(e: SettingsData, t: tourModeType) {
  const n = (function (e) {
    const t = e.tryGetProperty(BtnText.TourButtons, !0)
    const n = e.getOverrideParam(a.o9, a.qe)
    const i = e.getOverrideParam(a.PR, a.l4)
    return t && n !== a.Wf && i !== a.pQ
  })(e)
  const i = o(e)
  return n || i ? (c(e, t) ? TourMode.STORIES : TourMode.LEGACY) : TourMode.NONE
}
function c(e: SettingsData, t: tourModeType) {
  const n = e.getOverrideParam(a.PR, a.l4)
  return n === a.yY || (n !== a.C7 && t === tourModeType.STORY)
}
function d(e: SettingsData, t: tourModeType) {
  const n = e.tryGetProperty(BtnText.TourButtons, !0)
  const a = e.tryGetProperty(BtnText.HighlightReel, !0)
  return n || a ? (t === tourModeType.STORY ? TourMode.STORIES : TourMode.LEGACY) : TourMode.NONE
}

export const Cf = c

export const aW = l

export const ug = o

export const w7 = d
