import { Color, Vector3 } from "three"
import { IconType, PinColorVariant, PinType } from "../const/62612"
import { TransitionTypeList } from "../const/64918"
import { IconCodeMap } from "../const/iconMap.const"
import { SettingsData } from "../data/settings.data"
import { NavURLParam } from "../utils/nav.urlParam"
export function getIconColor(
  e: {
    baseColor: Color
    hoverColor: Color
    dimmedColor: Color
  },
  t: PinColorVariant
) {
  switch (t) {
    case PinColorVariant.DEFAULT:
      return e.baseColor
    case PinColorVariant.DIMMED:
      return e.dimmedColor
    case PinColorVariant.HIGHLIGHTED:
      return e.hoverColor
  }
}
export function getIconKey(e: PinType, t?: string, i?: boolean) {
  const n = i ? t : void 0
  return n && IconCodeMap[n] ? n : IconType[e]
}
export function isCommentLargeIcon(e: string) {
  return { x: 0, y: 5 }
}
const h = async (e: SettingsData, t, i) => {
  const s = new Vector3().copy(t.stemNormal).setLength(t.stemLength).add(t.anchorPosition)
  const a = NavURLParam.decodeVector3(e.getOverrideParam("pin-pos", NavURLParam.encodeVector3(s)))
  i((a && a.distanceTo(s) > 0.1) || null === NavURLParam.deserialize() ? TransitionTypeList.FadeToBlack : null)
}

export const W4 = h
