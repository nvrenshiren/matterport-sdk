import * as s from "react"
import * as n from "react/jsx-runtime"
import * as v from "./16326"
import * as C from "./30851"
import * as y from "./31855"
import * as b from "./32279"
import * as p from "./32924"
import { DayTag } from "../utils/date.utils"
import * as u from "./36676"
import * as l from "./46362"
import * as g from "./57370"
import * as d from "./61531"
import * as r from "./66102"
import * as c from "./74349"
import * as x from "./84426"
import * as D from "./90055"
import * as T from "../const/49571"
import { AnnotationGrouping } from "../const/63319"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"
import { LayerAddedMessage } from "../message/layer.message"
function f(e = !0) {
  return w(
    (0, l.s)(),
    (function () {
      const e = []
      for (const t in DayTag) e.push({ id: t })
      const [t] = (0, s.useState)(e)
      return t
    })(),
    AnnotationGrouping.DATE,
    e
  )
}
function w(e, t, i, n) {
  const a = (0, u.s)(),
    [o, r] = (0, s.useState)([])
  return (
    (0, s.useEffect)(() => {
      if (!a) return () => {}
      const s = t.reduce(
          (e, t, n) => Object.assign(Object.assign({}, e), { [t.id]: { id: t.id, grouping: i, groupOrder: n, items: [], batchSupported: !0 } }),
          {}
        ),
        o = {}
      e.forEach(e => {
        const t = e.getGroupingId(i)
        if (t && s[t]) t && s[t].items.push(e)
        else {
          const t = e.getGroupingId(AnnotationGrouping.TYPE)
          if (t) {
            const i = a.getSearchDataTypeGroup(t)
            o[t] ||
              (o[t] = {
                id: t,
                grouping: AnnotationGrouping.TYPE,
                groupOrder: (0, y.j)(a, t, AnnotationGrouping.TYPE),
                items: [],
                batchSupported: i.batchSupported
              }),
              o[t].items.push(e)
          }
        }
      })
      let d = Object.values(s)
      return n && (d = d.filter(e => e.items.length > 0)), r(d.concat(Object.values(o))), () => {}
    }, [a, e, t, i, n]),
    o
  )
}
const { SEARCH: A } = PhraseKey.SHOWCASE,
  S = ({ group: e }) => {
    const t = (0, r.b)().t(A.EMPTY_LIST_MESSAGE)
    return (0, n.jsx)(x.gQ, { message: t })
  },
  P = 60
function O(e) {
  const { excludeEmptyGroups: t } = e,
    i = (function (e = !0) {
      const t = (0, p.W)()
      return w((0, l.s)(), t, AnnotationGrouping.FLOOR, e)
    })(t)
  return (0, n.jsx)(j, Object.assign({}, e, { dataGroups: i }))
}
function I(e) {
  const { excludeEmptyGroups: t } = e,
    i = (function (e = !0) {
      const t = (0, g.q)()
      return w((0, l.s)(), t, AnnotationGrouping.ROOM, e)
    })(t)
  return (0, n.jsx)(j, Object.assign({}, e, { dataGroups: i }))
}
function k(e) {
  const { excludeEmptyGroups: t } = e,
    i = f(t)
  return (0, n.jsx)(j, Object.assign({}, e, { dataGroups: i }))
}
function N(e) {
  const { excludeEmptyGroups: t } = e,
    i = (function (e = !0) {
      const t = (0, b.b)()

      const i = Object.values(t)
        .sort((e, t) => (e.groupOrder || T.Xs) - (t.groupOrder || T.Xs))
        .map(e => ({ id: e.id, grouping: AnnotationGrouping.TYPE, groupOrder: e.groupOrder || T.Xs, items: e.matches, batchSupported: e.batchSupported }))
      return e ? i.filter(e => e.items.length > 0) : i
    })(t)
  return (0, n.jsx)(j, Object.assign({}, e, { dataGroups: i }))
}
function M(e) {
  const { excludeEmptyGroups: t } = e,
    { editMode: i } = (0, s.useContext)(AppReactContext),
    o = (function (e = !0) {
      const t = (0, v.Y)()
      return w((0, l.s)(), t, AnnotationGrouping.LAYER, e)
    })(t),
    r = (0, D.LP)(),
    c = (i && (null == r ? void 0 : r.id)) || void 0,
    [h, u] = (0, s.useState)(void 0)
  return (
    (0, d.U)(LayerAddedMessage, ({ layerId: e }) => {
      u(e)
    }),
    (0, n.jsx)(
      j,
      Object.assign({}, e, {
        dataGroups: o,
        activeGroupId: c,
        scrollToGroupId: h,
        onScrolled: () => {
          u(void 0)
        }
      })
    )
  )
}
function j(e) {
  const { renderGroup: t, renderItem: i, dataGroups: a, activeItemId: d, activeGroupId: l, scrollToGroupId: h, onScrolled: u } = e,
    [m, p] = (0, c.s)(),
    g = (0, s.useRef)(null),
    v = (0, C.D)(),
    y = (0, s.useRef)(0),
    f = (0, r.b)()
  return (
    (0, s.useEffect)(
      () => () => {
        window.clearTimeout(y.current)
      },
      []
    ),
    (0, s.useEffect)(
      () => (
        window.clearTimeout(y.current),
        v &&
          (y.current = window.setTimeout(() => {
            v &&
              a.forEach(e => {
                e.items.length > 0 && p(e.id, !1)
              })
          }, 500)),
        () => {}
      ),
      [a]
    ),
    (0, s.useEffect)(() => {
      if (h && g.current) {
        g.current.scrollIntoView(`[data-id='${h}']`) && u && u()
      }
      return () => {}
    }, [h, g.current, a]),
    (0, s.useEffect)(() => {
      var e
      if (d) {
        let t = -1
        const i =
          null ===
            (e = a.find(e => {
              const i = e.items.findIndex(e => e.id === d)
              return -1 !== i && ((t = i), !0)
            })) || void 0 === e
            ? void 0
            : e.id
        g.current && i && g.current.focusGroupItem(i, t)
      }
      return () => {}
    }, [a, d, g]),
    (0, n.jsx)(x.UQ, {
      ref: g,
      ariaExpandLabel: f.t(PhraseKey.ACCORDIONS.EXPAND),
      ariaCollapseLabel: f.t(PhraseKey.ACCORDIONS.COLLAPSE),
      data: a,
      itemHeight: 60,
      renderItem: i,
      renderGroup: t,
      renderEmpty: S,
      onToggleCollapse: p,
      collapsedIds: m,
      activeGroupId: l,
      collapseEmptyGroups: a.length > 1
    })
  )
}
export const T6 = P
export const qF = k
export const kG = O
export const iy = M
export const Om = I
export const kz = N
