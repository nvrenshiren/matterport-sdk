import * as s from "react"
function n(t, e, i) {
  const [n, o] = (0, s.useState)(null === t ? i : t[e])
  return (
    (0, s.useEffect)(() => {
      if (null === t) return
      const i = t.onPropertyChanged(e, t => {
        o(t)
      })
      return () => i.cancel()
    }, [t, e, i]),
    n
  )
}

export const h = n
