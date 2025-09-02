import * as i from "react"
import { MAX_LAYER_NAME_LENGTH } from "../const/23829"
import { DataLayerType, ModelViewType } from "../const/63319"
import { PhraseKey } from "../const/phrase.const"
import { substrString } from "../utils/func.utils"
import * as l from "./27839"
import * as r from "./66102"
const { LAYERS: d } = PhraseKey.WORKSHOP
function u(e, t, n, i) {
  const s = n ? (null == e ? void 0 : e.getLayer(n)) : null
  let r = null == s ? void 0 : s.name
  if (!r) {
    r = t.t(d.UNTITLED_LAYER_PLACEHOLDER)
    const e = null == s ? void 0 : s.layerType
    ;(null == i ? void 0 : i.viewType) === ModelViewType.TRUEPLAN && e === DataLayerType.OTHER
      ? (r = t.t(d.TRUEPLAN_LAYER_LABEL))
      : (e !== DataLayerType.BASE_LAYER && e !== DataLayerType.VIEW_DATA_LAYER) || (r = t.t(d.UNLAYERED_LAYER_LABEL))
  }
  return substrString(r, MAX_LAYER_NAME_LENGTH)
}
function h(e, t) {
  const n = (0, l._)(),
    s = (0, r.b)(),
    [a, o] = (0, i.useState)(u(n, s, e, t))
  return (
    (0, i.useEffect)(() => {
      if (!n) return () => {}
      function i() {
        o(u(n, s, e, t))
      }
      const r = n.onCurrentLayersChanged(i)
      return i(), () => r.cancel()
    }, [n, e, t, s]),
    a
  )
}
export const W = h
