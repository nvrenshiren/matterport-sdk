import * as n from "react/jsx-runtime"
import a from "classnames"

function o({ current: e, min: t, max: i }) {
  const s = (void 0 !== t && e < t) || e > i
  return (0, n.jsxs)("div", Object.assign({ className: a("text-counter", { error: s }) }, { children: [e, "/", i] }))
}

export const R = o
