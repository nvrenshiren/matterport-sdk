import { hasPolicySpacesElements } from "../utils/71570"
import { BtnText } from "../data/player.options.data"
import { PolicyData } from "../data/policy.data"
import { SettingsData } from "../data/settings.data"
export const ShowcaseRoomBoundsKey = "JMYDCase-room-bounds"
export const RoomBoundsKey = "room-bounds"

export const RoomBoundUserViewErrorKey = "room_bound_user_view_error"
function c(e: SettingsData) {
  const t = e.tryGetProperty(BtnText.RoomBounds, !1)
  const n = e.tryGetProperty(BtnText.FloorPlan, !1) || e.tryGetProperty(BtnText.Dollhouse, !1)
  return t && n
}
export function hasRoomBound(e: PolicyData, t: SettingsData, n: boolean) {
  return !!hasPolicySpacesElements(e) && !t.tryGetProperty(RoomBoundUserViewErrorKey, !1) && (c(t) || n)
}

export const G = c
