import * as n from "react"
import * as s from "./36773"
export function V(e) {
  const t = (0, s.Q)(),
    [i, a] = (0, n.useState)((null == t ? void 0 : t.getNoteView(e)) || null)
  return (
    (0, n.useEffect)(() => {
      if (!t) return () => {}
      const i = t.getNoteViewsMap().onChanged(function () {
        t && a(t.getNoteView(e))
      })
      return () => i.cancel()
    }, [t, e]),
    i
  )
}
