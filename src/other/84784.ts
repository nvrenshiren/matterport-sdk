import * as n from "../const/75668"
import { PhraseKey } from "../const/phrase.const"
const i = {
  [n.Vm]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.BALCONY,
  [n.YN]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.BASEMENT,
  [n.yn]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.BATHROOM,
  [n.sc]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.BEDROOM,
  [n.xi]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.BONUS_ROOM,
  [n.e$]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.CLOSET,
  [n.gk]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.DEN,
  [n.O4]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.DINING_ROOM,
  [n.y5]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.DRIVEWAY,
  [n.jt]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.ENTRANCE,
  [n.tI]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.EXERCISE_ROOM,
  [n.Zd]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.EXTERIOR,
  [n.yg]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.FACADE,
  [n.KT]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.FAMILY_ROOM,
  [n.x1]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.GAME_ROOM,
  [n.kA]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.GARAGE,
  [n.v6]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.GARDEN,
  [n.QM]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.GREAT_ROOM,
  [n.HT]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.GYM,
  [n.xu]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.HALLWAY,
  [n.Z2]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.KITCHEN,
  [n.aj]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.LAUNDRY,
  [n.mN]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.LIBRARY,
  [n.I3]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.LIVING_ROOM,
  [n.er]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.LOFT,
  [n.Nk]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.MEDIA_ROOM,
  [n.no]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.OFFICE,
  [n.ub]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.OTHER,
  [n.CF]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.PANTRY,
  [n.oF]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.PATIO,
  [n.qH]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.POOL,
  [n.pM]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.SAUNA,
  [n.a6]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.STAIRCASE,
  [n.X$]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.UTILITY_ROOM,
  [n.Os]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.VOID,
  [n.DQ]: PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.WORKSHOP_ROOM
}
function r(e, t, o) {
  const n = t.t(PhraseKey.SHOWCASE.ROOMS.DEFAULT_NAME)
  return o && e ? o.getRoomLabel(e, n) : n
}
function a(e, t) {
  const { id: o, label: i } = e
  if (!o) return i || t.t(PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.OTHER)
  return o.indexOf(n.Rt) > -1
    ? o
        .split(n.Rt)
        .map(e => t.t(l({ id: o, label: i })))
        .join(n.X9)
    : t.t(l({ id: o, label: i }))
}
function l(e) {
  const { id: t, label: o } = e,
    n = i[t]
  return n || o || PhraseKey.WORKSHOP.LABEL_SUGGESTIONS.OTHER
}
function d(e) {
  if (e.length < 2) return e
  for (const t of n.Ds) if (t.length === e.length && t.every(t => -1 !== e.indexOf(t))) return t.slice()
  return e
}

export const LN = r
export const Nw = a
export const ZJ = d
