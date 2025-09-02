import * as i from "react/jsx-runtime"
import * as r from "./66102"
import { PhraseKey } from "../const/phrase.const"
const { ACCORDION: a, MODAL: o } = PhraseKey.WORKSHOP
function l({ itemTypePhraseKey: e, number: t }) {
  const n = (0, r.b)(),
    s = n.t(e, t),
    o = n.t(a.BATCH_DELETE_MODAL_TITLE, {
      itemType: s
    })
  return (0, i.jsx)(i.Fragment, {
    children: o
  })
}
function c({ itemTypePhraseKey: e, number: t }) {
  const n = (0, r.b)(),
    s = n.t(e, t),
    o = n.t(a.BATCH_DELETE_MODAL_MESSAGE, {
      number: t,
      itemType: s
    })
  return (0, i.jsx)(i.Fragment, {
    children: o
  })
}
const d = (e, t) => ({
  title: (0, i.jsx)(l, {
    number: e,
    itemTypePhraseKey: t
  }),
  message: (0, i.jsx)(c, {
    number: e,
    itemTypePhraseKey: t
  }),
  cancellable: !0,
  cancelPhraseKey: o.NO,
  confirmPhraseKey: o.YES
})
export const P = d
