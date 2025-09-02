import NodeURL from "node:url"
export const getModelUrls = function (model = "", sceneId = "", host: string) {
  let sid: string | undefined
  let urlBase: string
  let urlModel: string

  if (model.match(/^https?/)) {
    const t = NodeURL.parse(model)
    urlBase = t.protocol + "//" + t.host
    urlModel = model
    sid = model.match(/[^/]*$/)?.[0]
  } else {
    if (host.match(/^https?/)) {
      const e = NodeURL.parse(host)
      urlBase = e.protocol + "//" + e.host
    } else {
      urlBase = window.location.protocol + "//" + host
    }
    urlModel = urlBase + "/api/player/models/" + model
    sid = model
  }
  return {
    sceneId,
    sid,
    urlBase,
    urlModel,
    urlFiles: urlModel + (urlModel.match(/\/$/) ? "files" : "/files"),
    urlThumb: urlModel + (urlModel.match(/\/$/) ? "thumb" : "/thumb")
  }
}
export const mergParamsToURL = (e: string, t = {}) => {
  for (const n in t) {
    const i = t[n]
    e += (-1 === e.indexOf("?") ? "?" : "&") + `${n}=${i}`
  }
  return e
}
export const getDomainName = e => e.replace(/^https?:\/\/(?:www.)?/i, "").replace(/\/(.*)/, "")
export const urlRegList = [/^([a-z0-9\-]*\.)*matterport\.com$/, /^([a-z0-9\-]*\.)*matterportvr\.cn$/, /^localhost$/]
export function checkAllowHost(e) {
  try {
    const t = new URL(e).hostname
    for (const e of urlRegList) if (t.match(e)) return !0
  } catch (e) {}
  return !1
}
export const getURLOrigin = (e: string) => {
  if (checkAllowHost(e)) {
    return new URL(e).origin
  }
  return null
}
export function workToShow(e = window.location.href) {
  let t = e
  return checkAllowHost(t) && (t = t.replace(/\/work\/(\?.*)?$/, "/show/$1")), new URL(t)
}
export function u(e) {
  ;["q", "qK", "qF", "tag", "note", "comment", "pin-pos", "cloudEdit"].forEach(t => e.delete(t))
}
export function h(e, t, n) {
  const i = workToShow(),
    s = new URLSearchParams(window.location.search)
  u(s)
  const r = encodeURIComponent(e)
  if ((r && s.set("q", r), t.length > 0)) {
    const e = encodeURIComponent(t.join(","))
    s.set("qK", e)
  }
  if (n.length > 0) {
    const e = encodeURIComponent(n.join(","))
    s.set("qF", e)
  }
  return (i.search = s.toString()), (i.hash = ""), i.toString()
}

export const Uo = h

export const on = u
