import * as s from "react/jsx-runtime"
import * as l from "./29300"
import * as n from "./62944"
import * as o from "./66102"
import * as r from "./94109"
import { PhraseKey } from "../const/phrase.const"
function c({ room: t }) {
  const e = (0, o.b)().t(PhraseKey.SHOWCASE.ROOMS.ROOM_INFORMATION)
  return (0, s.jsxs)(
    "div",
    Object.assign(
      { className: "room-size-info" },
      {
        children: [
          (0, s.jsx)("div", Object.assign({ className: "room-info-title" }, { children: e })),
          (0, s.jsxs)(
            "div",
            Object.assign(
              { className: "room-info-detail-container" },
              {
                children: [
                  (0, s.jsx)(r.d0, {
                    titleKey: PhraseKey.SHOWCASE.ROOMS.ROOM_AREA,
                    measurementsInMetric: [t.area],
                    measurementType: n.RV.AREA,
                    isHideable: !1,
                    visible: !0
                  }),
                  (0, s.jsx)(r.d0, {
                    titleKey: PhraseKey.SHOWCASE.ROOMS.ROOM_DIMENSIONS,
                    measurementsInMetric: t.canDisplayDimensions() ? [t.width, t.length] : [],
                    measurementType: n.RV.DISTANCE,
                    isHideable: !1,
                    visible: !0
                  }),
                  (0, s.jsx)(r.d0, {
                    titleKey: PhraseKey.SHOWCASE.ROOMS.ROOM_HEIGHT,
                    measurementsInMetric: t.canDisplayHeight() ? [t.height] : [],
                    measurementType: n.RV.DISTANCE,
                    isHideable: !1,
                    visible: !0
                  }),
                  (0, s.jsx)(r.d0, {
                    titleKey: PhraseKey.SHOWCASE.ROOMS.ROOM_PERIMETER,
                    measurementsInMetric: [t.perimeter],
                    measurementType: n.RV.DISTANCE,
                    isHideable: !1,
                    visible: !0
                  }),
                  (0, s.jsx)(l.Ah, { room: t })
                ]
              }
            )
          )
        ]
      }
    )
  )
}
export const M = c
