import * as i from "react/jsx-runtime"
import r from "classnames"

import * as a from "./85384"
function o(e) {
  const t = (0, a.i)(),
    { activeStep: n, currentStep: s, highlights: o } = e,
    l = o[s],
    c = n !== s,
    d = ((null == l ? void 0 : l.title) || (null == l ? void 0 : l.description)) && t && !c
  return (0, i.jsx)(
    "div",
    Object.assign(
      {
        className: "overlay-layer"
      },
      {
        children: (0, i.jsx)("div", {
          className: r("tour-story-scrim", {
            active: d
          })
        })
      }
    )
  )
}

export const G = o
