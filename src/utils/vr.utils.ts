import { presentationMlsModeKey } from "../const/settings.const"
import { DebugInfo } from "../core/debug"
import { isAndroid, isMobilePhone, isOculusBrowser } from "./browser.utils"

export enum XrBrowsers {
  unsupported = "unsupported",
  webxr = "webxr"
}

export const VRCanUSE = e => {
  const t = !!e.tryGetProperty("is_vr", !1)
  const n = e.tryGetProperty(presentationMlsModeKey, !1)
  const i = e.getOverrideParam("vr", 1)
  return t && !(!i || (2 === i && !isAndroid())) && !n
}
export const getVRPlatform = async (e = !1) => {
  const t = await VRSessionSupported.isSessionSupported("immersive-vr")
  return window.isSecureContext && (e || isOculusBrowser() || !isMobilePhone()) && t ? XrBrowsers.webxr : XrBrowsers.unsupported
}
const VrPlatformSelectDebugInfo = new DebugInfo("vr-platform-select")
const apiExists = () => {
  const e = void 0 !== navigator && "xr" in navigator && void 0 !== navigator.xr && "isSessionSupported" in navigator.xr && "requestSession" in navigator.xr
  return window.isSecureContext && e
}
export const VRSessionSupported = {
  isSessionSupported: async (e: XRSessionMode = "immersive-vr") => {
    let n = !1
    if (apiExists())
      try {
        n = !!(await navigator?.xr?.isSessionSupported(e))
      } catch (e) {
        VrPlatformSelectDebugInfo.info("WebXR disabled", e)
      }
    return VrPlatformSelectDebugInfo.debug(`WebXR session type: ${e} supported: ${n}`), n
  },
  apiExists
}
