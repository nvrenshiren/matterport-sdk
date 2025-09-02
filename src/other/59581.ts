import * as i from "react"
import * as s from "./45755"
import { AppData } from "../data/app.data"
import { useDataHook } from "./45755"
const a = useDataHook(AppData)
function o() {
  const e = a(),
    [t, n] = (0, i.useState)(e ? e.phase : null)
  return (
    (0, i.useEffect)(() => {
      if (!e) return () => {}
      const t = e.onPropertyChanged("phase", n)
      return n(e.phase), () => t.cancel()
    }, [e]),
    t
  )
}

export const W = o
