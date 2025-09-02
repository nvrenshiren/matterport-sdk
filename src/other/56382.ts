import * as i from "../const/70371"
class s extends Error {
  constructor(e, t, n) {
    super(e), (this.status = t), (this.type = n), Error.captureStackTrace && Error.captureStackTrace(this, s)
  }
}
class r extends s {
  constructor(e) {
    super(`Cannot request OEmbed data because no configuration matches the url ${e}`, 200, "OEmbedUrl")
  }
}
class a extends s {
  constructor(e = "unknown provider") {
    super(`Content from OEmbed provider ${e} is not currently supported`, 200, "OEmbedProvider")
  }
}
class o extends s {
  constructor(e = "unknown provider") {
    super(`Content from ${e} is type "link", which Link content is not currently supported`, 200, "OEmbedLink")
  }
}
function l(e) {
  const t = {
    width: "360",
    maxwidth: "360",
    maxheight: "640",
    url: e,
    native: "true",
    autoplay: "true"
  }
  if (e.includes("flickr") || e.includes("flic.kr")) {
    const e = Math.max(window.screen.height, window.screen.width)
    t.maxwidth = t.maxheight = t.width = `${e}`
  }
  return {
    queryParams: new URLSearchParams(t),
    headers: {
      responseType: "json"
    }
  }
}
const c = /^https:\/\/www.instagram.com/
const d = /^https:\/\/www.facebook.com/,
  u = /^https:\/\/www.facebook.com\/(.*\/)?(posts\/|activity\/|photo\.php|photos\/|permalink\.php|media\/set|questions\/|notes\/)/,
  h = /^https:\/\/www.facebook.com\/(video\.php|.*\/videos\/)/
const p = [
  {
    testUrl: function (e) {
      return c.test(e)
    },
    request: async function (e, t, n, i) {
      const { queryParams: r, headers: a } = l(e)
      n && i && r.append("access_token", `${n}|${i}`)
      const o = new URL(`https://graph.facebook.com/v10.0/instagram_oembed?${r.toString()}`)
      try {
        return await t.get(o.toString(), a)
      } catch (e) {
        const t = e
        throw new s(t.error.message, t.status_code, t.error.type)
      }
    },
    apiKeys: ["instagramAppId", "instagramClientToken"]
  },
  {
    testUrl: function (e) {
      return d.test(e)
    },
    request: async function (e, t, n, i) {
      const { queryParams: r, headers: a } = l(e)
      n && i && r.append("access_token", `${n}|${i}`)
      const o = (function (e) {
          return u.test(e)
            ? "https://graph.facebook.com/v10.0/oembed_post"
            : h.test(e)
              ? "https://graph.facebook.com/v10.0/oembed_video"
              : "https://graph.facebook.com/v10.0/oembed_page"
        })(e),
        c = new URL(`${o}?${r.toString()}`)
      try {
        return await t.get(c.toString(), a)
      } catch (e) {
        const t = e
        throw new s(t.error.message, t.status_code, t.error.type)
      }
    },
    apiKeys: ["instagramAppId", "instagramClientToken"]
  },
  {
    testUrl: () => !0,
    request: async function (e, t, n) {
      const { queryParams: i, headers: r } = l(e)
      n && i.append("key", n)
      const a = new URL(`https://api.embed.ly/1/oembed?${i.toString()}`)
      try {
        return await t.get(a.toString(), r)
      } catch (e) {
        const t = e
        throw new s(t.error_message, t.status_code, t.type)
      }
    },
    apiKeys: ["embedlyKey"]
  }
]
const m = {
  [i.z.GoogleMaps]: function (e, t) {
    return e.thumbnail_url && (e.thumbnail_url = `${e.thumbnail_url}&key=${t.googleMapsApiKey}`), e
  }
}
async function f(e, t, n) {
  const s = n.embedlyKey
  if (s) {
    const n = (function (e, t) {
      if (e.includes("i.embed.ly") || e.startsWith("blob:")) return e
      const n = Math.max(window.screen.height, window.screen.width),
        i = `&url=${encodeURIComponent(e)}&width=${n}&height=${n}`
      return `https://i.embed.ly/1/display/resize?key=${t}${i}`
    })(e, s)
    return t
      .get(n, {
        responseType: "arraybuffer"
      })
      .then(e => {
        return (
          (t = e),
          new Promise(e => {
            t || Promise.resolve(null)
            const n = t => {
                const n = t.target,
                  s = {
                    width: n.naturalWidth,
                    height: n.naturalHeight,
                    url: o,
                    type: i.h.PHOTO,
                    version: ""
                  }
                e(s)
              },
              s = new Uint8Array(t),
              r = new Blob([s]),
              a = new Image()
            a.addEventListener("load", e => n(e))
            const o = URL.createObjectURL(r)
            a.src = o
          })
        )
        var t
      })
  }
  return null
}
const g = {
  [i.z.Behance]: !1,
  [i.z.FaceBook]: !1,
  [i.z.GoogleMaps]: "googleMapsApiKey",
  [i.z.Instagram]: ["instagramAppId", "instagramClientToken"],
  [i.z.LinkedIn]: !1,
  [i.z.MixCloud]: !1,
  [i.z.Pinterest]: !1,
  [i.z.Reddit]: !0,
  [i.z.TikTok]: !0,
  [i.z.Twitter]: !0,
  [i.z.Twitch]: !1
}
class v {
  constructor(e: RequestManager<any>, t) {
    ;(this.cache = {}), (this.queue = e), (this.apiKeys = t)
  }
  async getOEmbedData(e) {
    const t = this.cache[e]
    if (t && t.type !== i.h.LINK) return Promise.resolve(t)
    let n, a
    try {
      a = await (function (e, t, n) {
        for (const i of p)
          if (i.testUrl(e)) {
            const s = i.apiKeys.map(e => n[e])
            return i.request(e, t, ...s)
          }
        throw new r(e)
      })(e, this.queue, this.apiKeys)
    } catch (e) {
      if (![401, 404, 501].includes(e.status)) throw e
      n = e
    }
    if (!a || a.type === i.h.PHOTO) {
      const t = (null == a ? void 0 : a.url) || e
      try {
        const n = await f(t, this.queue, this.apiKeys)
        if (n) return (this.cache[e] = n), n
      } catch (e) {
        if (!a) throw n || e
      }
    }
    if (!a) throw n || s
    return (this.cache[e] = a), this.validate(a)
  }
  clearCache() {
    this.cache = {}
  }
  validate(e) {
    if (
      !((e, t) => {
        const n = void 0 === e.provider_name ? void 0 : g[e.provider_name.toLowerCase()]
        return "string" == typeof n ? !!t[n] : Array.isArray(n) ? n.every(e => !!t[e]) : !1 !== n
      })(e, this.apiKeys)
    )
      throw new a(e.provider_name)
    if (e.type === i.h.LINK) throw new o(e.provider_name)
    return (function (e, t) {
      if (void 0 !== e.provider_name) {
        const n = m[e.provider_name.toLowerCase()]
        if (n) return n(e, t)
      }
      return e
    })(e, this.apiKeys)
  }
}
import * as y from "../const/66131"
import { RequestManager } from "../core/request"
const b = /[^]*youtube.com\/shorts\//gi,
  E = e => {
    if (b.test(e)) {
      return `https://youtube.com/watch?v=${e.replace(b, "").replace(/\?(.*)/g, "")}`
    }
    return e
  }
export const a_ = v
export const t1 = o
export const HF = a
export const ht = y.h
export const V0 = E
