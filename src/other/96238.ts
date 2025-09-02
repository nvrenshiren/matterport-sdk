import o from "classnames"
import * as s from "react"
import * as n from "react/jsx-runtime"

import * as k from "player.js"
import * as h from "./38242"
import * as p from "./38772"
import * as u from "./49627"
import * as g from "./56382"
import * as B from "./66102"
import * as F from "./84426"
import * as x from "../const/70371"
import { DebugInfo } from "../core/debug"
class f extends s.Component {
  constructor(e) {
    super(e)
  }
  render() {
    const { className: e, cover: t, data: i, onClick: s, style: a } = this.props,
      r = o("oembed", "oembed-text", e, { "oembed-text--cover": t }),
      d = i.provider_name ? `${i.provider_name} content` : "Embedded content",
      c = i.author_name ? `from ${i.author_name}` : ""
    return (0, n.jsxs)(
      "div",
      Object.assign(
        { className: r, style: a, onClick: s },
        { children: [i.title && (0, n.jsx)("h3", { children: i.title }), (0, n.jsx)("p", { children: `${d} ${c}` })] }
      )
    )
  }
}
const w = ["soundcloud", "spotify"]
class b extends s.Component {
  constructor(e) {
    super(e)
  }
  getAttributes() {
    const { data: e } = this.props
    let t = e.thumbnail_url,
      i = e.thumbnail_width,
      n = e.thumbnail_height
    return (!t || !i || !n) && e.type === g.ht.PHOTO && ((t = e.url), (i = e.width), (n = e.height)), { url: t, width: i, height: n }
  }
  render() {
    const { className: e, cover: t, data: i, disabled: s, maxHeight: a, maxWidth: r, onClick: d, style: c } = this.props,
      { url: l, width: h, height: u } = this.getAttributes()
    if (!l || !h || !u) return (0, n.jsx)(f, Object.assign({}, this.props))
    const m = (function (e, t) {
        return e < 128 || t < 128
      })(h, u),
      p =
        !s &&
        (function (e) {
          const t = (e.provider_name || "").toLowerCase()
          return e.type === g.ht.VIDEO ? "giphy" !== t : !(e.type !== g.ht.RICH || !w.includes(t))
        })(i),
      v = o("oembed", "oembed-thumbnail", e, { "oembed-thumbnail--cover": t, "oembed-thumbnail--cover--icon": t && m }),
      b = Object.assign(Object.assign({}, c), { backgroundImage: `url('${l}')` })
    if (!t) {
      const { width: e, height: t } = (function (e, t, i, n) {
        let s = e,
          a = t
        if (i && s > i) {
          const e = i / s
          ;(s *= e), a && (a *= e)
        }
        if (a && n && a > n) {
          const e = n / a
          ;(s *= e), (a *= e)
        }
        return { width: s, height: a }
      })(h, u, r, a)
      ;(b.width = `${e}px`), (b.height = `${t}px`)
    }
    return (
      t && m && (b.maxWidth = 1.5 * h + "px"),
      (0, n.jsx)(
        "div",
        Object.assign(
          { className: v, style: b, onClick: s ? void 0 : d },
          {
            children:
              p &&
              (0, n.jsx)(SettingsLabel, {
                className: "oembed-thumbnail__cta",
                iconClass: "icon-play-unicode",
                buttonStyle: IconButtonAttribute.OVERLAY,
                buttonSize: ButtonSize.LARGE
              })
          }
        )
      )
    )
  }
}
const T = ({ id: e, className: t, onClick: i, url: a, cover: r, style: d, containerWidth: c }) => {
  const { height: l } = (0, u.iP)(),
    h = (0, s.useCallback)(
      t => {
        i && i(t, e)
      },
      [i, e]
    ),
    m = o({ "image-cover": !!r }, t),
    p = 4 / 3,
    g = 0.8 * l,
    v = Math.min(Math.round(c / p), g)
  return (0, n.jsxs)(
    "div",
    Object.assign(
      {
        className: o("oembed-image fill-cover-image", m),
        style: Object.assign(Object.assign({}, d), { minHeight: v, maxWidth: c }),
        onClick: i ? h : void 0
      },
      {
        children: [
          (0, n.jsx)("div", { className: "fill-blur", style: { backgroundImage: `url('${a}')` } }),
          (0, n.jsx)("img", { className: o("image", m), src: a, style: { maxHeight: Math.min(g, Math.round(c * p)) }, onClick: i ? h : void 0 })
        ]
      }
    )
  )
}
class C extends s.Component {
  constructor(e) {
    super(e)
  }
  render() {
    const { className: e, cover: t, data: i, onClick: s, style: a, containerWidth: r } = this.props,
      d = o("oembed", "oembed-photo", e, { "oembed-photo--cover": t })
    return (0, n.jsx)(T, { url: i.url, style: a, onClick: s, className: d, containerWidth: r })
  }
}
function D(e) {
  const { className: t, children: i } = e
  if (!i) return null
  const s = o("oembed", "oembed-loading", t)
  return (0, n.jsx)("div", Object.assign({ className: s }, { children: i }))
}
const A = { flickr: !0, instagram: !0 },
  S = /^<iframe.*>.*<\/iframe>$/
function Pp(e) {
  return S.test(e)
}
function O(e, t) {
  let i
  return (
    (i = P(e)
      ? (function (e) {
          const t = document.createElement("div")
          t.innerHTML = e
          const i = t.firstChild,
            n = i.style
          return (n.maxWidth = "100%"), (n.maxHeight = "100%"), (n.minWidth = ""), (n.minHeight = ""), i
        })(e)
      : (function (e, t) {
          const i = document.createElement("iframe")
          i.setAttribute("allow", "encrypted-media; autoplay; fullscreen")
          let n = ""
          return (
            (n =
              t && t === x.z.Instagram
                ? "\n      <style>\n        html, body { padding: 0; margin: 0; border: 0; }\n        img { display: block; max-width: 100%; height: auto; border: 0; }\n        iframe { display: block; max-width: 100%; border: 0; }\n      </style>\n    "
                : "\n      <style>\n        html, body { padding: 0; margin: 0; border: 0; }\n        img, iframe { display: block; max-width: 100%; height: auto; border: 0; }\n      </style>\n    "),
            (i.srcdoc = `<!doctype html>${n.replace(/\s+/g, " ")}${e}`),
            i
          )
        })(e, t)),
    i.src || (e => void 0 !== e && !!A[e.toLowerCase()])(t)
      ? i.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups allow-presentation")
      : i.setAttribute("sandbox", "allow-same-origin"),
    i
  )
}
function I(e) {
  const { className: t, data: i, loadingComponent: a, onClick: r, style: d, onLoad: c } = e,
    [l, h] = (0, s.useState)(),
    [u, m] = (0, s.useState)(),
    [p, g] = (0, s.useState)(!0),
    [v, y] = (0, s.useState)(i.height)
  ;(0, s.useLayoutEffect)(() => {
    const e = l
    let t = null
    if (e) {
      for (; e.lastChild; ) e.removeChild(e.lastChild)
      const n = O(i.html, i.provider_name)
      ;(n.onload = () => {
        c && n && c(n), g(!1)
      }),
        e.appendChild(n),
        (t = e => {
          const t = (e => {
            let t
            try {
              t = JSON.parse(e.data)
            } catch (e) {
              return
            }
            if ("iframe.resize" !== t.context) return
            const i = t.src.replace(/http(s?):\/\//, "//"),
              n = document.querySelector('iframe[src="' + i + '"]')
            return n ? { iframe: n, height: t.height } : void 0
          })(e)
          t && t.iframe === n && y(t.height)
        }),
        window.addEventListener("message", t)
    }
    return () => {
      t && window.removeEventListener("message", t)
    }
  }, [l, i.html, i.provider_name, c])
  const f = (0, s.useCallback)(e => {
      e && (m(e.offsetWidth), h(e))
    }, []),
    w = (0, s.useMemo)(() => {
      var e
      if (!v || !u) return "30%"
      let t
      if ((null === (e = i.provider_name) || void 0 === e ? void 0 : e.toLowerCase()) === x.z.Flickr) t = (i.height || i.thumbnail_height || 220) / i.width
      else {
        t = (v || i.height || i.thumbnail_height || 220) / u
      }
      return `${Math.max(30, 100 * t).toPrecision(4)}%`
    }, [v, u, i.height, i.width, i.thumbnail_height, i.provider_name])
  return (0, n.jsxs)(
    "div",
    Object.assign(
      { className: o("oembed-iframe--wrapper", t), style: d, onClick: r },
      {
        children: [
          (0, n.jsx)(D, Object.assign({ className: p ? "" : "is-loaded" }, { children: a })),
          (0, n.jsx)("div", {
            className: o("oembed-iframe__container", i.provider_name && `oembed-iframe--src-${i.provider_name.replace(/\s/g, "-")}`, p && "is-loading"),
            ref: f,
            style: { paddingBottom: w }
          })
        ]
      }
    )
  )
}
const OembedVideoDebugInfo = new DebugInfo("oembed-video")
class M extends s.Component {
  constructor() {
    super(...arguments),
      (this.isUnmounting = !1),
      (this.onIFrameLoad = async e => {
        if (!this.isUnmounting)
          try {
            const t = await (function (e) {
              const t = new k.Player(e)
              return new Promise((e, i) => {
                t.on("ready", () => {
                  e(t)
                })
              })
            })(e)
            if (this.isUnmounting) return
            isMobilePhone() || t.play()
          } catch (e) {
            OembedVideoDebugInfo.warn("unable to autoplay video"), OembedVideoDebugInfo.warn(e)
          }
      })
  }
  componentWillUnmount() {
    this.isUnmounting = !0
  }
  render() {
    const { className: e, cover: t } = this.props
    if (t) return (0, n.jsx)(b, Object.assign({}, this.props))
    const i = o("oembed", "oembed-video", e)
    return (0, n.jsx)(I, Object.assign({}, this.props, { className: i, onLoad: this.onIFrameLoad }))
  }
}
const j = e => {
  const { className: t, cover: i } = e
  if (i) return (0, n.jsx)(b, Object.assign({}, e))
  const s = o("oembed", "oembed-rich", t)
  return (0, n.jsx)(I, Object.assign({}, e, { className: s }))
}
function R(e) {
  const { children: t, className: i } = e
  if (!t) return null
  const s = o("oembed", "oembed-error", i)
  return (0, n.jsx)("div", Object.assign({ className: s }, { children: t }))
}
const OembedErrorsDebugInfo = new DebugInfo("oembed-errors")
class V extends s.Component {
  constructor(e) {
    super(e), (this.state = { caughtError: void 0 })
  }
  static getDerivedStateFromError(e) {
    return { caughtError: e }
  }
  componentDidCatch(e) {
    OembedErrorsDebugInfo.warn(e.message)
  }
  componentDidUpdate(e) {
    var t, i
    e.data !== this.props.data && this.setState({ caughtError: void 0 }),
      e.error !== this.props.error && (null === (i = (t = this.props).onError) || void 0 === i || i.call(t))
  }
  render() {
    const {
        className: e,
        cover: t,
        data: i,
        disabled: s,
        renderError: a,
        loadingComponent: o,
        maxHeight: r,
        maxWidth: d,
        onClick: c,
        style: l,
        thumbnail: h,
        error: u,
        containerWidth: m
      } = this.props,
      { caughtError: p } = this.state
    if (a && (u || p)) return (0, n.jsx)(R, Object.assign({ className: e }, { children: a(u, p) }))
    if (!i) return (0, n.jsx)(D, Object.assign({ className: e }, { children: o }))
    const v = { className: e, cover: t, maxHeight: r, maxWidth: d, onClick: c, style: l, containerWidth: m }
    return h
      ? (0, n.jsx)(b, Object.assign({ data: i, disabled: s }, v))
      : i.type === g.ht.PHOTO
        ? (0, n.jsx)(C, Object.assign({ data: i }, v))
        : i.type === g.ht.VIDEO
          ? (0, n.jsx)(M, Object.assign({ data: i, loadingComponent: o }, v))
          : i.type === g.ht.RICH
            ? (0, n.jsx)(j, Object.assign({ data: i, loadingComponent: o }, v))
            : null
  }
}
const { ATTACHMENTS: _ } = PhraseKey.SHOWCASE,
  H = { 200: _.ERROR_200_MESSAGE, 401: _.ERROR_401_MESSAGE, 403: _.ERROR_403_MESSAGE, 404: _.ERROR_404_MESSAGE, 429: _.ERROR_429_MESSAGE },
  U = ({ error: e, compact: t, scriptError: i }) => {
    const [a, o] = (0, s.useState)(null),
      r = (0, B.b)(),
      d =
        (null == e ? void 0 : e.status) &&
        (e => {
          const t = H[e]
          if (t) return t
          switch (Math.floor(+e / 100)) {
            case 2:
              return _.ERROR_200_MESSAGE
            case 4:
              return _.ERROR_4XX_MESSAGE
            case 5:
              return _.ERROR_5XX_MESSAGE
          }
        })(e.status),
      c = i ? i.message : r.t(d || _.FAILED_TO_LOAD_MESSAGE),
      l = (0, s.useCallback)(e => {
        o(e)
      }, [])
    return (0, n.jsx)(
      "div",
      Object.assign(
        { className: "embed-error-container", ref: l },
        {
          children: t
            ? (0, n.jsx)(F.u, { title: c, target: a })
            : (0, n.jsxs)(n.Fragment, {
                children: [
                  (0, n.jsx)("span", { className: "icon icon-error" }),
                  (0, n.jsx)("div", Object.assign({ className: "embed-error-message" }, { children: c }))
                ]
              })
        }
      )
    )
  }
var G = function (e, t, i, n) {
  var s,
    a = arguments.length,
    o = a < 3 ? t : null === n ? (n = Object.getOwnPropertyDescriptor(t, i)) : n
  if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) o = Reflect.decorate(e, t, i, n)
  else for (var r = e.length - 1; r >= 0; r--) (s = e[r]) && (o = (a < 3 ? s(o) : a > 3 ? s(t, i, o) : s(t, i)) || o)
  return a > 3 && o && Object.defineProperty(t, i, o), o
}
@p.Z
class z extends s.Component {
  constructor(e) {
    super(e),
      (this.isUnmounting = !1),
      (this.handleError = () => {
        const { onError: e } = this.props
        e && e(this.props.attachment.parentId)
      }),
      (this.renderError = (e, t) => {
        const { compact: i } = this.props
        return (0, n.jsx)(U, { error: e, scriptError: t, compact: i })
      }),
      (this.state = { embed: null, error: void 0 })
  }
  componentDidMount() {
    this.getEmbeddedMedia()
  }
  componentWillUnmount() {
    this.isUnmounting = !0
  }
  componentDidUpdate(e) {
    this.props.attachment.id !== e.attachment.id && this.getEmbeddedMedia()
  }
  async getEmbeddedMedia() {
    const { attachment: e } = this.props,
      { commandBinder: t } = this.context
    let i,
      n = null
    try {
      if (((n = await t.issueCommand(new LoadAttachmentEmbedCommand(e))), !n)) throw new Error("embed not found")
    } catch (e) {
      i = e
    }
    this.isUnmounting || this.setState({ attachmentId: e.id, embed: n, error: i })
  }
  render() {
    const { compact: e, height: t, width: i, onClick: s, style: a, thumbnail: r, containerWidth: d } = this.props,
      { embed: c, error: l } = this.state,
      h = c && this.state.attachmentId === this.props.attachment.id,
      u = (0, n.jsx)("div", { className: "gui-spinner-icon" }),
      m = !!i && !!t,
      p = o("embedded-media", { clickable: s && !l })
    return (0, n.jsx)(V, {
      className: p,
      data: h && null != c ? c : void 0,
      style: a,
      cover: m,
      loadingComponent: u,
      renderError: this.renderError,
      error: l,
      thumbnail: r,
      disabled: e,
      maxWidth: i,
      maxHeight: t,
      onClick: l ? void 0 : s,
      onError: this.handleError,
      containerWidth: d
    })
  }
}
z.contextType = AppReactContext

import { ButtonSize, IconButtonAttribute, SettingsLabel } from "./16507"
import { useAnalytics } from "./19564"
import * as W from "./21149"
import { AttachmentRemoveCommand, LoadAttachmentEmbedCommand } from "../command/attachment.command"
import { AttachmentCategory } from "../const/32347"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"
import { isMobilePhone } from "../utils/browser.utils"
const $ = function (e, t, i, n) {
  var s,
    a = arguments.length,
    o = a < 3 ? t : null === n ? (n = Object.getOwnPropertyDescriptor(t, i)) : n
  if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) o = Reflect.decorate(e, t, i, n)
  else for (var r = e.length - 1; r >= 0; r--) (s = e[r]) && (o = (a < 3 ? s(o) : a > 3 ? s(t, i, o) : s(t, i)) || o)
  return a > 3 && o && Object.defineProperty(t, i, o), o
}
const { ATTACHMENTS: K } = PhraseKey.SHOWCASE,
  Z = e => {
    e.stopPropagation()
  }
@p.Z
class Y extends s.Component {
  constructor(e) {
    super(e),
      (this.isUnmounting = !1),
      (this.setContainerRef = e => {
        this.setState({ containerRef: e })
      }),
      (this.state = { mediaUrl: "", containerRef: null })
  }
  componentDidMount() {
    this.loadMedia()
  }
  componentWillUnmount() {
    this.isUnmounting = !0
  }
  componentDidUpdate(e) {
    e.attachment.id !== this.props.attachment.id && this.loadMedia()
  }
  getImageUrl() {
    const { attachment: e, cover: t, smartWidth: i, smartHeight: n } = this.props,
      { mediaUrl: s } = this.state
    if (!(0, W.lV)(e)) return null
    if (!t || void 0 === i || void 0 === n || !(0, W.Uq)(e)) return s
    const a = -1 !== s.indexOf("?")
    return `${s}${a ? "&" : "?"}height=${n}&crop=${i}:${n},smart`
  }
  async loadMedia() {
    const { attachment: e, thumbnail: t } = this.props,
      i = t && e.thumbnailUrl ? e.thumbnailUrl : e.url,
      n = await i.get()
    this.isUnmounting || this.setState({ mediaUrl: n })
  }
  render() {
    const { attachment: e, inline: t, onClick: i, style: s, containerWidth: a } = this.props,
      { id: r, category: d, filename: l, bytes: h } = e
    if (d !== AttachmentCategory.UPLOAD) return null
    const u = this.getImageUrl(),
      m = o("attachment-view", { clickable: !!i })
    if (u) return (0, n.jsx)(T, { id: r, url: u, style: s, onClick: i, className: m, containerWidth: a })
    {
      const { mediaUrl: e } = this.state,
        a = this.context.locale.t(K.DOWNLOAD_TOOLTIP),
        r = h ? (0, W.VV)(h) : ""
      return (0, n.jsxs)(
        "div",
        Object.assign(
          { className: o(m, "attachment-other", { inline: t }), onClick: i, style: s },
          {
            children: [
              !t && (0, n.jsx)("div", { className: "icon icon-paper-clip" }),
              (0, n.jsxs)(
                "div",
                Object.assign(
                  { className: "attachment-label" },
                  {
                    children: [
                      (0, n.jsx)("div", Object.assign({ className: "file-label" }, { children: l })),
                      r && !t && (0, n.jsx)("div", Object.assign({ className: "size-label" }, { children: r }))
                    ]
                  }
                )
              ),
              !t &&
                e &&
                (0, n.jsxs)(n.Fragment, {
                  children: [
                    (0, n.jsx)(
                      "a",
                      Object.assign(
                        { className: "link download-link", ref: this.setContainerRef, href: e, download: !0, onClick: Z },
                        { children: (0, n.jsx)("span", { className: "icon-download" }) }
                      )
                    ),
                    (0, n.jsx)(F.u, { target: this.state.containerRef, title: a })
                  ]
                })
            ]
          }
        )
      )
    }
  }
}
function J({ id: e, width: t, height: i, srcDoc: a, onLoad: o }) {
  const r = new URLSearchParams(new URL(e, window.location.href).search).get("parent"),
    d = (0, s.useCallback)(
      function (e) {
        o(e.currentTarget, r || "")
      },
      [o, r]
    )
  return (0, n.jsx)(
    "iframe",
    {
      style: { width: t ? `${t}px` : "100%", height: i ? `${i}px` : "100%", border: 0 },
      srcDoc: a,
      onLoad: d,
      referrerPolicy: "no-referrer",
      sandbox: "allow-scripts"
    },
    e
  )
}
Y.contextType = AppReactContext

const { ATTACHMENTS: q } = PhraseKey.SHOWCASE,
  Q = ({ attachment: e, onClick: t, inline: i, canDelete: a, hero: m, containerWidth: p, width: g, height: v, thumbnail: y, onError: f, onDelete: w }) => {
    const { commandBinder: b, locale: T } = (0, s.useContext)(AppReactContext),
      C = useAnalytics(),
      [E, D] = (0, s.useState)(null),
      [x, A] = (0, u.h4)(),
      S = (0, s.useMemo)(() => T.t(q.DELETE_ATTACHMENT_TOOLTIP), [T]),
      P = (0, W.lV)(e),
      O = (0, h.e)(),
      I = {
        attachment: e,
        thumbnail: y,
        containerWidth: p || A.width,
        onClick: t
          ? i => {
              t && t(i, e.id)
            }
          : void 0
      }
    return (0, n.jsxs)(
      "div",
      Object.assign(
        { className: o("attachment", `attachment-${e.category}`, { inline: !!i, hero: !!m, "non-viewable": !P }), ref: x },
        {
          children: [
            e.category === AttachmentCategory.UPLOAD
              ? (0, n.jsxs)(n.Fragment, {
                  children: [
                    (0, n.jsx)(
                      "div",
                      Object.assign({ className: "attachment-preview", ref: D }, { children: (0, n.jsx)(Y, Object.assign({}, I, { inline: i })) })
                    ),
                    a && (0, n.jsx)(F.u, { target: E, title: null == e ? void 0 : e.filename })
                  ]
                })
              : e.category === AttachmentCategory.EXTERNAL
                ? (0, n.jsx)(z, Object.assign({}, I, { compact: i, width: g, height: v, onError: f }))
                : X(e)
                  ? (0, n.jsx)(J, { id: e.src, width: e.width, height: e.height, srcDoc: e.srcDoc, onLoad: e.onLoad })
                  : (0, n.jsx)("div", { children: "Unknown Attachment Category" }),
            a &&
              (0, n.jsx)(F.zx, {
                icon: "close",
                className: "attachment-delete",
                size: F.qE.SMALL,
                variant: F.Wu.FAB,
                theme: "dark",
                tooltip: S,
                tooltipOptions: { placement: "bottom-start" },
                onClick: t => {
                  t.stopPropagation(),
                    t.preventDefault(),
                    a && (C.trackGuiEvent("attachments_click_remove", { tool: O }), w ? w(e) : b.issueCommand(new AttachmentRemoveCommand(e)))
                }
              })
          ]
        }
      )
    )
  }
function X(e) {
  return e.category === AttachmentCategory.SANDBOX
}

export const P = Q
