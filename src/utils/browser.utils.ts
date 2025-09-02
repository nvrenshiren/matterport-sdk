import { urlRegList } from "./url.utils"
import { DebugInfo } from "../core/debug"
import { getValFromURL } from "./urlParams.utils"
const debugInfo = new DebugInfo("util-browser")
export const isMobilePhone = function () {
  const e = navigator.userAgent || navigator.vendor
  const t = new RegExp(
    "(android|bbd+|meego).+mobile|android|avantgo|bada/|blackberry|blazer|compal|elaine|fennec|\n    hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|\n    palm( os)?|phone|p(ixi|re)/|plucker|pocket|psp|series(4|6)0|symbian|treo|up.(browser|link)|vodafone|\n    wap|windows ce|xda|xiino|MatterScan",
    "i"
  )
  const n = new RegExp(
    "1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|\n    amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|\n    br(e|v)w|bumb|bw-(n|u)|c55/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|\n    devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|\n    g560|gene|gf-5|g-mo|go(.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|\n    a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|\n    jemu|jigs|kddi|keji|kgt( |/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|/(k|l|u)|50|54|-[a-w])|libw|lynx|\n    m1-w|m3ga|m50/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|\n    zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|\n    nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|\n    po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55/|\n    sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|\n    sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|\n    tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|\n    vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|\n    zeto|zte-",
    "i"
  )
  return (t.test(e) || n.test(e.substr(0, 4)) || isIPad()) && !isOculusBrowser()
}
export const EncodingRegExp = /([\s\{\}\"\']|[^\x00-\x7F]|%[^0-9a-fA-F]{2})+/g
export const checkFirefoxVersion = (e: RegExp, t: string) => {
  const result = window.navigator.userAgent.match(e)
  const n = result ? result[1].split(t) : []
  return {
    major: parseInt(n[0], 10) || 0,
    minor: parseInt(n[1], 10) || 0,
    patch: parseInt(n[2], 10) || 0
  }
}
export const isIPad = () => {
  const e = window.navigator.userAgent
  return /iPad/.test(e) || (isMac() && navigator.maxTouchPoints > 1)
}
export const isIPhone = () => {
  const e = window.navigator.userAgent
  return /iPod|iPhone/.test(e) || (isMac() && navigator.maxTouchPoints > 1)
}
export const isMac = () => {
  const e = window.navigator.platform
  return /MAC/.test(e.toUpperCase())
}
export const isWindows = () => {
  const e = window.navigator.platform
  return /WIN/.test(e.toUpperCase())
}
export const isAndroid = () => -1 !== window.navigator.userAgent.indexOf("Android")
export const isWebkit = () => isFirefox() || isSafari()
let g: boolean | null = null
export const isFirefox = () => {
  if (null == g) {
    const e = window.navigator.userAgent
    g = -1 !== e.indexOf("Firefox")
  }
  return g
}
let y: boolean | null = null
export const isSafari = () => {
  if (null == y) {
    const e = window.navigator ? window.navigator.userAgent : null
    y = !!window["safari"] || !(!e || !(/\b(iPad|iPhone|iPod)\b/.test(e) || (e.match("Safari") && !e.match("Chrome"))))
  }
  return y
}
export const FirefoxVersion = () => {
  if (!isFirefox()) throw new Error("Not a Firefox browser")
  return checkFirefoxVersion(/Firefox\/((?:\d+\.?){1,3})/, ".")
}
export const isOculusBrowser = () => -1 !== window.navigator.userAgent.indexOf("OculusBrowser")
export const isGooglebot = () => {
  switch (getValFromURL("bot", 2)) {
    case 0:
      return !1
    case 1:
      return !0
    case 2:
      return -1 !== navigator.userAgent.indexOf("Googlebot")
    default:
      return !1
  }
}
export const winCanTouch = () => "ontouchstart" in window
export const sharePhone = () => "share" in navigator && (isMobilePhone() || isIPad())
export const sameWindow = () => window.parent !== window
export const sameShowcase = () =>
  sameWindow() &&
  (() => {
    const e = new URL(document.referrer)
    return urlRegList.some(t => t.test(e.hostname))
  })()
export const SearchSplit = () => window.location.search.substr(1).split("&")
export const changeUrlWithParams = (e, t = !1) => {
  if (!e) return
  const n = `${window.location.origin}${window.location.pathname}?${e}`
  t ? window.history.pushState({}, "", n) : window.location.replace(n)
}
export const replaceUrlWithHash = (e = "") => {
  const t = `${window.location.origin}${window.location.pathname}${window.location.search}#${e}`
  window.location.replace(t)
}
export const downloadFlies = (function () {
  const e = window.URL || window.webkitURL
  const t = document.createElement("a")
  document.body.appendChild(t)
  t.style.display = "none"
  return (n: Blob, i: string) => {
    const s = e.createObjectURL(n)
    t.href = s
    t.download = i
    t.click()
    e.revokeObjectURL(s)
  }
})()
export const hasFullscreenElement = function () {
  return !!(document.fullscreenElement || document["mozFullScreenElement"] || document["webkitFullscreenElement"] || document["msFullscreenElement"])
}
export const canFullscreen = function () {
  return (
    !isIPad() &&
    !isIPhone() &&
    !!(document.fullscreenEnabled || document["mozFullScreenEnabled"] || document["webkitFullscreenEnabled"] || document["msFullscreenEnabled"])
  )
}
export const requestFullscreen = function (e: HTMLElement) {
  e.requestFullscreen
    ? e.requestFullscreen()
    : e["mozRequestFullScreen"]
      ? e["mozRequestFullScreen"]()
      : e["webkitRequestFullscreen"]
        ? e["webkitRequestFullscreen"]()
        : e["msRequestFullscreen"] && e["msRequestFullscreen"]()
}
export const exitFullscreen = function () {
  document.exitFullscreen
    ? document.exitFullscreen()
    : document["mozCancelFullScreen"]
      ? document["mozCancelFullScreen"]()
      : document["webkitExitFullscreen"]
        ? document["webkitExitFullscreen"]()
        : document["msExitFullscreen"] && document["msExitFullscreen"]()
}
export function featurePolicyCheck(e) {
  try {
    return document["featurePolicy"].allowsFeature(e)
  } catch (t) {
    debugInfo.warn(t)
    debugInfo.warn(`Feature Policy check failed, defaulting ${e} to false.`)
    return !1
  }
}
export const getLanguage = () => {
  const locale = Intl?.DateTimeFormat()?.resolvedOptions().locale || navigator.language
  const t = {
    language: "en",
    region: void 0,
    script: void 0,
    ext: void 0
  }
  const n = new RegExp(
    [/^([a-z]{2,3})/, /(?:[_-]([ut]{1}[_-][a-z\-\_]+))?/, /(?:[_-]([a-z]{4}))?/, /(?:[_-]([a-z]{2}))?$/].map(e => e.source).join(""),
    "i"
  ).exec(locale)
  if (n) {
    const [, language, ext, script, region] = n
    Object.assign(t, {
      language,
      ext,
      script,
      region
    })
  }
  return t.language || ""
}
