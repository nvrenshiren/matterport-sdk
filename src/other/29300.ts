import n from "classnames"
import * as s from "react/jsx-runtime"
import * as a from "./66102"
import { PhraseKey } from "../const/phrase.const"

function l({ room: t }) {
  return (0, s.jsx)(d, { warningKey: PhraseKey.WORKSHOP.ROOMS.ROOM_MISSING_DIMENSIONS, missing: !t.canDisplayDimensions() })
}
function c({ room: t }) {
  return (0, s.jsx)(d, { warningKey: PhraseKey.WORKSHOP.ROOMS.ROOM_MISSING_HEIGHT, missing: !t.canDisplayHeight() })
}
function h({ room: t }) {
  return (0, s.jsx)(d, { warningKey: PhraseKey.WORKSHOP.ROOMS.ROOM_MISSING_INFO, missing: !t.canDisplayDimensions() || !t.canDisplayHeight() })
}
function d({ missing: t, warningKey: e }) {
  const i = (0, a.b)().t(e)
  return t ? (0, s.jsx)("div", Object.assign({ className: n("room-missing-info-warning", "room-detail-child-container") }, { children: i })) : null
}

export const Vr = l
export const Ah = h
export const tL = c
