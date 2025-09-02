import * as s from "react"
import * as n from "react/jsx-runtime"
import * as d from "./30851"
import * as c from "./46362"
import * as o from "./66102"
import * as l from "./7096"
import * as h from "./84426"
import { AnnotationGrouping } from "../const/63319"
import { PhraseKey } from "../const/phrase.const"
const { SEARCH: u } = PhraseKey.SHOWCASE
function m(e) {
  const { excludeEmptyGroups: t, activeItemId: i, grouping: a, emptyPhrase: m } = e,
    p = (0, s.useRef)(null),
    g = (0, o.b)(),
    v = (0, d.D)(),
    y = 0 === (0, c.s)().length,
    f = a === AnnotationGrouping.FLOOR,
    w = a === AnnotationGrouping.ROOM,
    b = a === AnnotationGrouping.LAYER,
    T = a === AnnotationGrouping.DATE,
    C = void 0 !== t ? t : v,
    E = g.t(m || u.EMPTY_LIST_MESSAGE),
    D = !!C && y,
    x = Object.assign(Object.assign({}, e), { scrollRef: null == p ? void 0 : p.current, excludeEmptyGroups: C, activeItemId: i })
  return D
    ? (0, n.jsx)(h.gQ, { message: E })
    : (0, n.jsx)(
        "div",
        Object.assign(
          { className: "list-contents searchable-list", ref: p },
          {
            children: f
              ? (0, n.jsx)(l.kG, Object.assign({}, x))
              : w
                ? (0, n.jsx)(l.Om, Object.assign({}, x))
                : b
                  ? (0, n.jsx)(l.iy, Object.assign({}, x))
                  : T
                    ? (0, n.jsx)(l.qF, Object.assign({}, x))
                    : (0, n.jsx)(l.kz, Object.assign({}, x))
          }
        )
      )
}
export const D = m
