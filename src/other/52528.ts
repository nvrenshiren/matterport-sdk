import { BlockTypeList } from "../const/block.const"
import { EncodingRegExp } from "../utils/browser.utils"

export enum LinkType {
  HASH = "link-hashtag",
  LINK = "link-url",
  TEXT = "",
  USER = "link-user"
}
export class TextParser {
  serialize: (e: HTMLElement) => string
  deserialize: (e: any, t: any, i: any, n?: any) => any
  serializeText: (e: HTMLElement) => string
  serializeAnchor: (e: HTMLElement) => string
  serializeElement: (e: HTMLElement, t: boolean) => string
  validateEmail: (e: string) => boolean
  markers: any
  links: boolean
  hashtags: boolean
  users: any
  constructor(e) {
    this.serialize = e => {
      const t: string[] = []
      const i: HTMLElement[] = [].slice.call(e.childNodes)
      for (const e of i)
        switch (e.nodeName) {
          case "#text":
            t.push(this.serializeText(e))
            break
          case "A":
            t.push(this.serializeAnchor(e))
            break
          case "P":
          case "DIV":
            t.push(this.serializeElement(e, !0))
            break
          case "SPAN":
            t.push(this.serializeElement(e, !1))
            break
          case "BR":
            break
          default:
            t.push(this.serialize(e))
        }
      return t.join("")
    }
    this.deserialize = (e, t, i, n = this.markers) => {
      const s = this.parse(e).map(e => this.createNode(e, t, i))
      return n ? this.parseMarkers(s, n) : s
    }
    this.serializeText = (e: ChildNode) => {
      let t = this.sanitizeText(e.textContent || "")
      if (this.links) {
        const e = new RegExp(
            /https?:\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?/gi
          ),
          i = document.createElement("a")
        ;(t = t.replace(e, e => ((i.href = e), `[${e}](${i.href})`))), i.remove()
      }
      this.hashtags && (t = t.replace(/(#\w*)/, e => `[${e}]`))
      return t.replace(/\<\s*br\s*\/?>/gi, "\n")
    }
    this.serializeAnchor = e => {
      const t = e.dataset.blocktype
      const i = this.sanitizeText(e.innerText || e.textContent || "")
      let n = i
      switch (t) {
        case BlockTypeList.HASH:
          n = `[${i}]`
          break
        case BlockTypeList.USER:
          if (this.users) {
            let t = e.dataset.id || "",
              i = e.dataset.value || ""
            if (!t && !i && ((i = "@" === n[0] ? n.substr(1) : n), i)) {
              const e = this.users.getUserInfoByEmail(i)
              e && (t = e.id)
            }
            ;(t || this.validateEmail(i)) && (n = `[@${t}](${i})`)
          }
          break
        case BlockTypeList.LINK:
          const t = e.dataset.value || e.href
          t && (n = `[${i}](${t})`)
          break
        default:
          e.href && (n = `[${i}](${e.href})`)
      }
      return n
    }
    this.serializeElement = (e, t) => {
      let i = t ? "\n" : " "
      return e.childNodes.length > 0 && (i += this.serialize(e)), i
    }
    this.validateEmail = (() => {
      const e = /\S+@\S+\.\S+/
      const t = document.createElement("input")
      t.type = "email"
      t.required = !0
      return i => ((t.value = i), "function" == typeof t.checkValidity ? t.checkValidity() : e.test(i))
    })()
    const { links, hashtags, users, markers } = e
    this.links = links || !1
    this.hashtags = hashtags || !1
    this.users = users
    this.markers = markers
  }

  parseMarkers(e, t) {
    const [i, n] = t
    let s = !1
    const r = new RegExp(i + "|" + n)
    for (let t = 0; t < e.length; t++) {
      const i = e[t],
        { nodeType: n, textContent: a } = i,
        o = 3 === n
      if (!a) continue
      o ? e.splice(t, 1) : (i.textContent = null)
      const c = a.split(r)
      c.forEach((n, r) => {
        if ("" !== n) {
          let r
          if (s) {
            const e = document.createElement("span")
            e.setAttribute("data-blocktype", "marker"), (r = e), (r.textContent = n)
          } else r = document.createTextNode(n)
          o ? e.splice(t++, 0, r) : i.appendChild(r)
        }
        r < c.length - 1 && (s = !s)
      }),
        o && t--
    }
    return e
  }
  createNode(e, t, i) {
    switch (e.blockType) {
      case BlockTypeList.USER:
        const r = document.createElement(i ? "a" : "span")
        if ((r.setAttribute("data-blocktype", e.blockType), i)) {
          const t = r
          ;(t.className = `link-annotation ${LinkType.USER}`), t.removeAttribute("href"), i && (t.onclick = i)
          const s = e.id || "",
            a = e.value || ""
          s && t.setAttribute("data-id", s), a && t.setAttribute("data-value", a)
        }
        return (r.textContent = `${e.text}`), r
      case BlockTypeList.HASH:
        const a = document.createElement(i ? "a" : "span")
        if ((a.setAttribute("data-blocktype", e.blockType), i)) {
          const e = a
          ;(e.className = `link-annotation ${LinkType.HASH}`), e.removeAttribute("href"), i && (e.onclick = i)
        }
        return (a.textContent = `${e.text}`), a
      case BlockTypeList.LINK:
        if (e.value) {
          const s = document.createElement(i || t ? "a" : "span")
          if ((s.setAttribute("data-blocktype", e.blockType), s.setAttribute("data-value", e.value), i || t)) {
            const r = s
            t && (r.href = `${e.value}`), (r.target = "_blank"), (r.className = `link-annotation ${LinkType.LINK}`), i && (r.onclick = i)
          }
          return (s.textContent = `${e.text}`), s
        }
    }
    return document.createTextNode("" + e.text)
  }
  parse(e) {
    const t: Array<{ blockType: string; markdown: any; id: string; value: string; text: string }> = []
    if (!e) return []
    const i = e.split("[").map((e, t) => (0 === t ? e : "[" + e))
    let n = 0
    for (; n < i.length; ) {
      const e = this.parseIntoBlocks(i[n], t)
      e && i.splice(n + 1, 0, e), n++
    }
    return t
  }
  getPlainText(e) {
    return this.parse(e)
      .map(e => e.text)
      .join("")
  }
  searchMarkdown(e, t) {
    let i = -1,
      n = 0,
      s = 0
    const r = this.parse(e).map(e => {
      let r
      return this.matchTextBlock(e, t) ? (s++, -1 === i && (i = n), (r = e.markdown)) : (r = e.text), (n += e.text.length), r
    })
    return -1 === i ? null : { markdown: r.join(""), matchIndex: i, textLength: n, numMatches: s }
  }
  getUserMentions(e) {
    return this.parse(e)
      .filter(e => e.blockType === BlockTypeList.USER && e.value)
      .map(e => e.value || "")
  }
  matchTextBlock(e, t) {
    if (e.blockType === t.blockType)
      if (e.blockType === BlockTypeList.USER) {
        if (e.id === t.id) return !0
        if (e.value === t.value) return !0
      } else if (e.blockType === BlockTypeList.HASH) return e.text === t.text
    return !1
  }
  parseIntoBlocks(e, t) {
    if (this.users) {
      const i = this.getUserBlock(e)
      if (i) return t.push(i), e.slice(i.markdown.length)
    }
    if (this.links) {
      const i = this.getLinkBlock(e)
      if (i && i.value && -1 === i.value.indexOf("javascript:")) return t.push(i), e.slice(i.markdown.length)
    }
    if (this.hashtags) {
      const i = this.getHashBlock(e)
      if (i) return t.push(i), e.slice(i.markdown.length)
    }
    const i = this.getTextBlock(e)
    return i && t.push(i), null
  }
  getTextBlock(e) {
    return 0 === e.length ? null : { blockType: BlockTypeList.TEXT, text: e, markdown: e }
  }
  getHashBlock(e) {
    const t = e.match(TextParser.hashRegex)
    return !t || t.length < 2 ? null : { blockType: BlockTypeList.HASH, markdown: t[0], text: t[1] }
  }
  static hashRegex: RegExp
  getUserBlock(e) {
    if (!this.users) return null
    const t = e.match(TextParser.userRegex)
    if (!t || t.length < 3) return null
    let i = t[1].substr(1),
      n = t[2]
    const r = n ? this.users.getUserInfoByEmail(n) : this.users.getUserInfoById(i),
      o = r ? r.name : ""
    return (i = r ? r.id : i), (n = r ? r.email : n), { blockType: BlockTypeList.USER, markdown: t[0], id: i, value: n, text: `@${o || n}` }
  }
  static userRegex: RegExp
  getLinkBlock(e) {
    const t = e.match(TextParser.linkRegEx)
    if (!t) return null
    const i = t[2]
    let n = 1,
      r = 0
    for (; r < i.length && ("(" === i[r] ? n++ : ")" === i[r] && n--, 0 !== n); ) r++
    const o = i.length - r
    let c = this.conditionallyEncode(t[2].substring(0, r))
    return -1 === c.indexOf("://") && (c = "http://" + c), { blockType: BlockTypeList.LINK, markdown: t[0].substring(0, t[0].length - o), text: t[1], value: c }
  }
  static linkRegEx: RegExp
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
  sanitizeText(e) {
    return e
      .replace(/\]\(/g, "]&zwnj;(")
      .replace(/[\u200B]/g, "")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
  }
}
TextParser.hashRegex = /\[(#(\w|-)*)\]/
TextParser.userRegex = /\[(@\w*)\]\(([^\)\(\[\]]*)\)/
TextParser.linkRegEx = /\[([^\]]*)\]\((.*)\)/
