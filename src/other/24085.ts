import * as n from "react"
import { AppReactContext } from "../context/app.context"
export function tryGetModuleBySymbolSync<K extends keyof SymbolModule>(t: K) {
  const { engine: e } = (0, n.useContext)(AppReactContext),
    [i, o] = (0, n.useState)(e.tryGetModuleBySymbolSync<K>(t))
  return (
    (0, n.useEffect)(() => {
      let i = !1
      return (
        e.getModuleBySymbol(t).then(t => {
          i || o(t)
        }),
        () => {
          i = !0
        }
      )
    }, [t, e]),
    i
  )
}
