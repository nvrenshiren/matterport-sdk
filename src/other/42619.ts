import { NavURLParam } from "../utils/nav.urlParam"
function s(e) {
  return e.get("m") || e.get("model")
}
function a(e) {
  const t = -1 !== e.indexOf("matterport.com/show"),
    i = -1 !== e.indexOf(window.location.host + "/show")
  if (t || i) {
    const t = new URL(e),
      i = NavURLParam.deserialize(e) || void 0,
      a = s(t.searchParams),
      o = s(new URLSearchParams(window.location.search))
    return { url: e, pose: i, modelId: a && a !== o ? a : void 0 }
  }
  return { url: e }
}
export const V = a
