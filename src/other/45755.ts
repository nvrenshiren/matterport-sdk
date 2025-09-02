import { useContext, useEffect, useState } from "react"
import { AppReactContext } from "../context/app.context"
import { Data } from "../core/data"
import { DataType } from "../core/marketContext"
export function useDataHook<D extends DataType = typeof Data>(e: D) {
  return () => useData(e)
}
export function useData<D extends DataType = typeof Data>(e: D) {
  const { market } = useContext(AppReactContext)
  const [n, r] = useState(market.tryGetData(e))
  useEffect(() => {
    let n = !1
    market.waitForData(e).then(e => {
      n || r(e)
    })
    return () => {
      n = !0
    }
  }, [market, e])
  return n
}
