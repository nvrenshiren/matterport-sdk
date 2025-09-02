import { getValFromURL } from "../utils/urlParams.utils"
export const socialSharingKey = "social_sharing"
export const brandingEnabledKey = "branding_enabled"
export const presentationMlsModeKey = "presentation_mls_mode"
export const presentationTitleKey = "presentation_title"
export const presentationAboutKey = "presentation_about"
export const discoverSpaceUrlKey = "discover_space_url"
export const urlTemplateConfig = {
  urlTemplateToken: "<file>",
  urlTemplateOverride: getValFromURL("tiledtemplate", null)
}
