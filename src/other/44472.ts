import r from "classnames"
import * as n from "react/jsx-runtime"

import * as c from "react"
import { LinkType } from "./52528"
import { BlockTypeList } from "../const/block.const"
function l(e) {
  const { text: t, keyPrefix: i, markers: s } = e,
    [r, a] = s,
    o = []
  let l = t,
    d = l.search(`${r}|${a}`),
    u = l.search(r)
  for (; d > -1; ) {
    const e = d === u,
      s = l.slice(0, d),
      h = t.length - l.length,
      f = `${i},${h}-${h + d}`
    e ? o.push((0, n.jsx)(c.Fragment, { children: s }, f)) : o.push((0, n.jsx)("span", Object.assign({ "data-blocktype": "marker" }, { children: s }), f)),
      (l = l.slice(d + (e ? r.length : a.length), l.length)),
      (d = l.search(`${r}|${a}`)),
      (u = l.search(r))
  }
  if (l.length) {
    const e = `${i},${t.length - l.length}-${t.length}`
    o.push((0, n.jsx)(c.Fragment, { children: l }, e))
  }
  return 0 === o.length ? (0, n.jsx)(n.Fragment, { children: t }) : (0, n.jsx)(n.Fragment, { children: o })
}
function d(e) {
  const { block: t, children: i, onClick: s } = e
  return s
    ? (0, n.jsx)(
        "a",
        Object.assign(
          {
            className: `link-annotation ${LinkType.USER}`,
            onClick: s,
            "data-id": t.id || void 0,
            "data-value": t.value || void 0,
            "data-blocktype": t.blockType
          },
          { children: i }
        )
      )
    : (0, n.jsx)("span", Object.assign({ "data-blocktype": t.blockType }, { children: i }))
}
function u(e) {
  const { block: t, children: i, onClick: s } = e
  return s
    ? (0, n.jsx)("a", Object.assign({ className: `link-annotation ${LinkType.USER}`, onClick: s, "data-blocktype": t.blockType }, { children: i }))
    : (0, n.jsx)("span", Object.assign({ "data-blocktype": t.blockType }, { children: i }))
}
function h(e) {
  const { block: t, children: i, linksActive: s, onClick: r } = e
  return r || s
    ? (0, n.jsx)(
        "a",
        Object.assign(
          {
            href: `${t.value}`,
            target: "_blank",
            className: `link-annotation ${LinkType.LINK}`,
            onClick: r,
            "data-blocktype": t.blockType,
            "data-value": t.value
          },
          { children: i }
        )
      )
    : (0, n.jsx)("span", Object.assign({ "data-blocktype": t.blockType, "data-value": t.value }, { children: i }))
}
function f(e) {
  const { block: t, keyPrefix: i, markers: s } = e,
    { blockType: r, text: o } = t,
    c = s ? (0, n.jsx)(l, { keyPrefix: i, text: o, markers: s }) : (0, n.jsx)(n.Fragment, { children: o })
  return r === BlockTypeList.USER
    ? (0, n.jsx)(d, Object.assign({}, e, { children: c }))
    : r === BlockTypeList.HASH
      ? (0, n.jsx)(u, Object.assign({}, e, { children: c }))
      : r === BlockTypeList.LINK && t.value
        ? (0, n.jsx)(h, Object.assign({}, e, { children: c }))
        : c
}
function p(e) {
  const t = e.textParser.parse(e.text),
    i = r("text-box-text", e.className)
  return (0, n.jsx)(
    "div",
    Object.assign(
      { className: i },
      {
        children: t.map((t, i) =>
          (0, n.jsx)(
            f,
            { keyPrefix: `${t.blockType}${i}`, block: t, linksActive: !!e.linksActive, onClick: e.onClick, markers: e.markers },
            `${t.blockType}${i}`
          )
        )
      }
    )
  )
}
export const S = p
