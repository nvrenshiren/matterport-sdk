import * as n from "react"
function s(e) {
  const t = (function () {
    const [, e] = (0, n.useState)(0)
    return (0, n.useCallback)(() => {
      e(e => e + 1)
    }, [])
  })()
  return (
    (0, n.useEffect)(() => {
      if ((t(), null != e)) {
        const i = e.onChanged(t)
        return () => {
          i.cancel()
        }
      }
      return () => {}
    }, [e, t]),
    e
  )
}
export const m = s
