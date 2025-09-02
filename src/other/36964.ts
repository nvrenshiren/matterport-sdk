import * as i from "react"
function s(e) {
  const [t, n] = (0, i.useState)(e.value)
  return (
    (0, i.useEffect)(() => {
      const t = e.onChanged(n)
      return n(e.value), () => t.cancel()
    }, [e]),
    t
  )
}

export const y = s
