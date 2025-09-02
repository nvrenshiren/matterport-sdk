import * as n from "react/jsx-runtime"
import * as s from "./6335"
import * as a from "./6608"
export function A({ item: e }) {
  const { imgUrl: t, color: i, icon: o } = e
  return t
    ? (0, n.jsx)(s.X, { className: "thumbnail-image", resource: t })
    : o
      ? (0, n.jsx)(a.C, { badgeStyle: void 0 !== i ? { background: i, borderColor: i } : {}, iconClass: o })
      : null
}
