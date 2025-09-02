import { ToolsList, cloudInitialToolKey } from "../const/tools.const"
import { SettingsData } from "../data/settings.data"
export function HasTool(e: SettingsData, t?: boolean) {
  const n = e.tryGetProperty(cloudInitialToolKey, "")
  if (n) return n
  if (t) return null
  const r = e.getOverrideParam("tag", "") ? ToolsList.TAGS : e.getOverrideParam("note", "") ? ToolsList.NOTES : null
  if (r) return r
  const a = e.getOverrideParam("tool", "").toUpperCase()
  return a || null
}
export function isDeepLinkParam(e: SettingsData, t) {
  return t.deepLinkParam ? e.getOverrideParam(t.deepLinkParam, "") : ""
}
