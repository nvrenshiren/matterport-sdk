import * as i from "react"
import { MAX_VIEW_NAME_LENGTH } from "../const/23829"
import { ModelViewType } from "../const/63319"
import { PhraseKey } from "../const/phrase.const"
import { substrString } from "../utils/func.utils"
import * as l from "./27839"
import * as r from "./66102"
const { LAYERS: d } = PhraseKey.WORKSHOP
function u(e, t, n) {
  let i
  try {
    i = n ? (null == e ? void 0 : e.getView(n)) : null
  } catch (e) {}
  let s = null == i ? void 0 : i.name
  if (!s)
    switch (null == i ? void 0 : i.viewType) {
      case ModelViewType.INSIGHTS:
        s = t.t(d.DEFAULT_INSIGHTS_VIEW_NAME)
        break
      case ModelViewType.TRUEPLAN:
        s = t.t(d.DEFAULT_TRUEPLAN_VIEW_NAME)
        break
      default:
        s = t.t(d.DEFAULT_VIEW_NAME)
    }
  return substrString(s, MAX_VIEW_NAME_LENGTH)
}
function h(e) {
  const t = (0, l._)(),
    n = (0, r.b)(),
    [s, a] = (0, i.useState)(u(t, n, e))
  return (
    (0, i.useEffect)(() => {
      if (!t) return () => {}
      function i() {
        a(u(t, n, e))
      }
      const s = t.onModelViewsChanged(i)
      return i(), () => s.cancel()
    }, [t, e, n]),
    s
  )
}
export const A = h
