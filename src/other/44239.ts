import i from "ua-parser-js"
import { getGeoIpLocation } from "../getGeoIpLocation"
import { isIPad, isMobilePhone } from "../utils/browser.utils"
import { randomUUID } from "../utils/random.utils"
const o = e => `${e}_3.0`,
  l = e => e,
  c = e => {
    var t, n
    return {
      pme: null !== (n = (null !== (t = window.MP_PLATFORM_METADATA) && void 0 !== t ? t : {}).pme) && void 0 !== n && n
    }
  },
  d = e => ({
    height: e.innerHeight,
    width: e.innerWidth
  }),
  u = e => ({
    width: e.screen.width,
    height: e.screen.height,
    density: e.devicePixelRatio
  }),
  h = () => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone
    } catch (e) {
      return ""
    }
  },
  p = () => {
    const e = new i.UAParser().getResult()
    let t = e.os.name,
      n = e.browser.name
    const s = Object.assign({}, e.device)
    return (
      isIPad() && ((t = "iPadOS"), (s.vendor = "Apple"), (s.model = "iPad"), (s.type = "tablet"), "Safari" === n && (n = "Mobile Safari")),
      {
        browser: {
          name: n,
          major: e.browser.major,
          version: e.browser.version,
          language: navigator.language || "",
          languages: navigator.languages ? navigator.languages.join(", ") : ""
        },
        os: {
          name: t,
          version: e.os.version
        },
        device: {
          vendor: s.vendor,
          model: s.model,
          type: s.type
        }
      }
    )
  }
function m(e) {
  var t
  const n = window,
    i = n.parent !== n,
    s = "1" === e.play || "true" === e.play
  return Object.assign(
    {
      model_id: e.model || e.m || "",
      language_tag: null !== (t = e.lang) && void 0 !== t ? t : null,
      quickstart: "1" === e.qs,
      is_mobile: isMobilePhone(),
      iframe: i,
      session_id: randomUUID(),
      platform: p(),
      pme: c(),
      authTokenProvided: !!e.auth || !!e.connectauth
    },
    f(s)
  )
}
function f(e) {
  const t = window,
    n = t.innerWidth / t.innerHeight,
    i = t.parent !== t
  return {
    start_source: e ? "autoplay" : i ? "click" : "fullpage",
    autoplay: e,
    aspect_ratio: isFinite(n) ? n : 1,
    window: d(t)
  }
}
function g(e, t) {
  const n = window
  return {
    app: {
      name: o(t),
      version: "20240906"
    },
    locale: e,
    screen: u(n),
    timezone: h(),
    location: {}
  }
}
function v(e, t, n) {
  const i = g(t, n)
  return (
    getGeoIpLocation(e).then(e => {
      i.location = {
        city: e.city,
        country: e.country_name,
        region: e.region
      }
    }),
    i
  )
}

export const F$ = l
export const FW = m
export const bC = v
export const vx = f
