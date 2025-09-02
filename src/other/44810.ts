import * as n from "react/jsx-runtime"
import * as d from "./15501"
import { FeaturesNotesModeKey } from "./39586"
import { FeaturesNotesKey } from "../const/39693"
import * as l from "./50875"
import * as c from "./51978"
import * as h from "./95006"
import { featuresMattertagsKey } from "../const/tag.const"
import { ToolsList } from "../const/tools.const"
function u({ parentTool: e }) {
  const t = (0, c.y)(featuresMattertagsKey, !1),
    i = (0, c.y)(FeaturesNotesKey, !1),
    u = (0, c.y)(FeaturesNotesModeKey, !1),
    m = (0, d.R)(),
    p = i && u
  return (!p && !t) || (t && e !== ToolsList.TAGS) || (!t && e !== ToolsList.NOTES)
    ? null
    : (0, n.jsxs)("div", Object.assign({ className: "overlay-ui" }, { children: [(0, n.jsx)(h.I, {}), (0, n.jsx)(l.E, { notesEnabled: p, openModal: m })] }))
}
export const w = u
