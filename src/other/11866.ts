import d from "classnames"
import * as o from "react"
import * as n from "react/jsx-runtime"
import { Vector3 } from "three"
import * as l from "./15130"
import * as m from "./38242"
import * as p from "./84426"
import { PhraseKey } from "../const/phrase.const"
import { socialSharingKey } from "../const/settings.const"
import { DeepLinksSymbol } from "../const/symbol.const"
import { AppReactContext } from "../context/app.context"
import { NavURLParam } from "../utils/nav.urlParam"
function v(e) {
  const { label: t, className: i, darkTheme: s, analyticAction: a, urlParams: r, includeCameraView: v, buttonVariant: y } = e,
    { analytics: f, engine: w, editMode: b, locale: T, market: C, settings: E } = (0, o.useContext)(AppReactContext),
    [D, x] = (0, o.useState)(!1),
    A = b || E.tryGetProperty(socialSharingKey, !1),
    S = (0, m.e)(),
    P = (0, o.useCallback)(e => {
      e.stopPropagation()
    }, []),
    O = (0, o.useCallback)(
      e => {
        e.stopPropagation(),
          D ||
            (!(async function (e, t) {
              const i = (await t.getModuleBySymbol(DeepLinksSymbol)).creator.createDeepLink({
                additionalParams: e,
                paramFilter: e => !["q", "qK", "qF", "tag", "note", "comment", "pin-pos", "cloudEdit"].includes(e)
              })
              ;(i.hash = ""), (0, l.v)(i.href)
            })(r, w),
            x(!0),
            f.trackGuiEvent(a, { tool: S }))
      },
      [r, D, x, f, b, v, C]
    )
  ;(0, o.useEffect)(() => {
    if (!D) return () => {}
    const e = window.setTimeout(() => x(!1), 2500)
    return () => window.clearTimeout(e)
  }, [D])
  let I = y || (!t ? p.Wu.FAB : p.Wu.TERTIARY),
    k = "share",
    N = t,
    M = t ? void 0 : T.t(PhraseKey.COPY_LINK),
    j = !1
  return (
    D && ((I = p.Wu.TERTIARY), (k = void 0), (N = T.t(PhraseKey.SHARE_COPIED)), (M = void 0), (j = !0)),
    A
      ? (0, n.jsx)(
          "div",
          Object.assign(
            { className: d("url-link-copy", i, { "link-copied": D }), onClick: P },
            {
              children: (0, n.jsx)(p.zx, {
                icon: k,
                label: N,
                size: p.qE.SMALL,
                variant: I,
                theme: s ? "dark" : "light",
                disabled: j,
                tooltip: M,
                tooltipOptions: { placement: "bottom" },
                onClick: O
              })
            }
          )
        )
      : null
  )
}
var y = function (e, t) {
  var i = {}
  for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && t.indexOf(n) < 0 && (i[n] = e[n])
  if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
    var s = 0
    for (n = Object.getOwnPropertySymbols(e); s < n.length; s++)
      t.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, n[s]) && (i[n[s]] = e[n[s]])
  }
  return i
}
function f(e) {
  const { prefix: t, pin: i, id: o } = e,
    r = y(e, ["prefix", "pin", "id"]),
    { stemNormal: d, stemLength: c, anchorPosition: l } = i,
    h = { [`${t}`]: o, "pin-pos": NavURLParam.encodeVector3(new Vector3().copy(d).setLength(c).add(l)) }
  return (0, n.jsx)(v, Object.assign({ urlParams: h }, r))
}
export const O = f
