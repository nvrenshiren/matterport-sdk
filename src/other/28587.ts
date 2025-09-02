import * as s from "react"
import * as i from "react/jsx-runtime"
import * as a from "./86941"
import { winCanTouch } from "../utils/browser.utils"
function o({ progress: e, screenPosition: t }) {
  if (!(0, s.useMemo)(() => winCanTouch(), []) || !t || 0 === e) return null
  const n = {
    left: t.x - 66 + "px",
    top: t.y - 66 + "px"
  }
  return (0, i.jsx)(
    "div",
    Object.assign(
      {
        className: "point-button-wrapper",
        style: n
      },
      {
        children: (0, i.jsx)(
          a.$,
          Object.assign(
            {
              progress: 100 * e,
              innerRadius: 132,
              barWidth: 8
            },
            {
              children: (0, i.jsx)("circle", {
                className: "point",
                cx: "0",
                cy: "0",
                r: "22",
                transform: "rotate(-90)",
                fill: "#fff"
              })
            }
          )
        )
      }
    )
  )
}
export const B = o
