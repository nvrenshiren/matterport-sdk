import * as i from "react"
import { AppReactContext } from "../context/app.context"
function r(e, t) {
  const { messageBus: n } = (0, i.useContext)(AppReactContext)
  ;(0, i.useEffect)(() => {
    const i = n.subscribe(e, t)
    return () => i.cancel()
  }, [n, e, t])
}

export const U = r
