import { getDomainName } from "../utils/url.utils"
import { spacesConfig, spacesSubscriberPromptKey, subscriberPromptActiveKey, subscriberPromptConfig, subscriberPromptKey } from "../const/96365"
import { presentationMlsModeKey } from "../const/settings.const"
import { DebugInfo } from "../core/debug"
import SettingsModule, { SettingPersistence } from "../modules/settings.module"
import { getKey } from "../utils/apikey.utils"
import { getLanguage } from "../utils/browser.utils"
export const SubscriberPromptDebugInfo = new DebugInfo("subscriber-prompt")

export const SubscriberPromptRegisterSetting = async (settingsModule: SettingsModule, apiConfig, urlValues, flags, loggedIn, r, inWorkshop, o) => {
  const domainDenylist = apiConfig.subscriber_prompt_denylist || subscriberPromptConfig.domainDenylist,
    { popupAllowed, bannerAllowed } = await Pe({
      urlValues,
      settingsData: settingsModule.settingsData,
      flags,
      loggedIn,
      inWorkshop,
      hasPolicy: r.hasPolicy.bind(r),
      domainDenylist
    })
  if ((SubscriberPromptDebugInfo.debug(`popupAllowed: ${popupAllowed}, bannerAllowed: ${bannerAllowed}`), popupAllowed || bannerAllowed)) {
    settingsModule.updateSetting(subscriberPromptActiveKey, !0)
    const popupEnabled = popupAllowed && ("1" === urlValues[spacesConfig.forcePopup] || !!o.get("subscriber_prompt_a_popup"))
    const bannerEnabled = bannerAllowed || "1" === urlValues[spacesConfig.forceBanner]
    const popupDelay = apiConfig.subscriber_prompt_a_delay_ms || subscriberPromptConfig.popupDelay
    SubscriberPromptDebugInfo.debug(`popupEnabled: ${popupEnabled}, bannerEnabled: ${bannerEnabled}`)
    settingsModule.registerSetting(
      "Subscriber Prompt",
      subscriberPromptActiveKey,
      {
        popupDelay,
        popupEnabled,
        bannerEnabled
      },
      !1,
      SettingPersistence.NONE
    )
  }
}
async function Pe({ urlValues, settingsData, flags, loggedIn, inWorkshop, hasPolicy, domainDenylist }) {
  const hasKey = null != getKey()
  const l = urlValues[spacesConfig.enabled]
  const c = flags.has(subscriberPromptKey) ? "0" !== l : "1" === l
  const d = hasPolicy(spacesSubscriberPromptKey) || "1" === urlValues[spacesConfig.forcePolicy]
  const u = !loggedIn
  const h = settingsData.tryGetProperty(presentationMlsModeKey, !1)
  const p = urlValues[spacesConfig.forceReferrer] || document.referrer
  const m = await domainNoDeny(p, domainDenylist)
  SubscriberPromptDebugInfo.debug("referrer eligible: ", m.toString())
  const f = !hasKey && !inWorkshop
  const g = (function (e) {
    return e.getOverrideParam("lang", getLanguage())
  })(settingsData).startsWith("en")
  const v = c && !h && f && g && u
  return {
    popupAllowed: v && d && m,
    bannerAllowed: v
  }
}
async function domainNoDeny(referrer: string, domainDenylist: string[]) {
  if (!referrer) return !0
  if (!window.crypto || !window.crypto.subtle) return !1
  const n = new URL(referrer)
  const i = getDomainName(n.hostname)
  const sha = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(i))
  const unit = new Uint8Array(sha)
  const list: string = Array.prototype.map.call(unit, e => ("0" + e.toString(16)).slice(-2)).join("")
  return !domainDenylist.includes(list)
}
