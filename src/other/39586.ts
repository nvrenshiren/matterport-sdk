import { FeaturesNotesKey, FeaturesNotesNudgeKey } from "../const/39693"
export const FeaturesNotesModeKey = "features/notes-mode"
function r(e, t, n, r, a) {
  if (!e) return !1
  let o = !1
  const l = t.hasPolicy("spaces.notes"),
    c = n.isCommenter()
  return (
    (o = l && c),
    o && (r.setProperty(FeaturesNotesModeKey, o), r.setProperty(FeaturesNotesKey, o), r.setProperty(FeaturesNotesNudgeKey, o && a.has(FeaturesNotesNudgeKey))),
    o
  )
}

export const $p = r
