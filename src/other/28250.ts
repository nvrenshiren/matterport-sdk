import * as i from "react"
import * as l from "./34646"
import * as r from "./49627"
import * as o from "./56421"
import * as a from "./74554"
import { TourMode } from "../const/tour.const"
function c() {
  const e = (0, o.S)(),
    t = (0, l.s)(),
    n = (0, i.useRef)(0),
    [a, c] = (0, i.useState)(!1),
    d = t.active,
    u = e === TourMode.STORIES
  return (
    (0, r.rf)(
      () => (
        c(!0),
        window.clearTimeout(n.current),
        d
          ? () => {}
          : ((n.current = window.setTimeout(() => {
              c(!1)
            }, 3e3)),
            () => window.clearTimeout(n.current))
      ),
      [d]
    ),
    u && (d || a)
  )
}
const d = (0, a.M)("showStoryTour", c)

export const J = c
export const j = d
