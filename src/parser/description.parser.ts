import { mediaTypeList } from "../const/30643"
import { LinkType } from "../const/49947"
import * as s from "../utils/nav.urlParam"
import { LinkData, TagDescriptionChunks } from "../message/mattertag.message"
import { EncodingRegExp } from "../utils/browser.utils"
import { NavURLParam } from "../utils/nav.urlParam"

export class DescriptionParser {
  capabilites: { links: { enable: boolean; keepLabels: boolean } }
  constructor(e) {
    this.capabilites = { links: { enable: e.supportLinks, keepLabels: e.keepLinkLabels } }
  }
  parse(e: string, t) {
    const i: TagDescriptionChunks[] = []
    if (!e) return []
    e.split("[")
      .map(function (e, t) {
        return 0 === t ? e : "[" + e
      })
      .forEach(e => {
        const n = this.findLink(e)
        n ? -1 === n.url.indexOf("javascript:") && (this.addLinkChunk(i, n, t), this.addTextChunk(i, e.slice(n.markdown.length))) : this.addTextChunk(i, e)
      })
    return i
  }
  findLink(e) {
    const t = e.match(/\[([^\]]*)\]\((.*)\)/)
    if (!t) return null
    const i = t[2]
    let n = 1,
      s = 0
    for (; s < i.length && ("(" === i[s] ? n++ : ")" === i[s] && n--, 0 !== n); ) s++
    const a = i.length - s
    return { markdown: t[0].substring(0, t[0].length - a), label: t[1], url: this.conditionallyEncode(t[2].substring(0, s)) }
  }
  conditionallyEncode(e) {
    const t = e.trim()
    return this.needsEncoding(t) ? encodeURI(t) : t
  }
  needsEncoding(e) {
    if (e.match(EncodingRegExp)) return !0
    let t = e
    try {
      t = decodeURI(e)
    } catch (e) {}
    return !1
  }
  addTextChunk(e: TagDescriptionChunks[], t) {
    0 !== t.length && e.push({ type: mediaTypeList.text, text: t })
  }
  addLinkChunk(e: TagDescriptionChunks[], t, i) {
    if (!this.capabilites.links.enable) return void (this.capabilites.links.keepLabels && this.addTextChunk(e, t.label))
    const o: LinkData = { label: t.label, url: t.url, type: LinkType.EXT_LINK }
    ;-1 === o.url.indexOf("://") && (o.url = "http://" + o.url)
    const r = -1 !== o.url.indexOf("matterport.com/show"),
      d = -1 !== o.url.indexOf(window.location.host + "/show")
    if (r || d) {
      const e = -1 !== o.url.indexOf(i),
        t = NavURLParam.deserialize(o.url)
      e && t ? ((o.type = LinkType.NAVIGATION), (o.navigationData = t)) : ((o.type = LinkType.MODEL), (o.url += "&play=1"))
    }
    e.push({ type: mediaTypeList.link, link: o })
  }
  static getNumLinks(e) {
    let t = 0
    return (
      e.forEach(e => {
        "link" === e.type && void 0 !== e.link && t++
      }),
      t
    )
  }
}
