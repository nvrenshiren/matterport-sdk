import * as i from "react"
import { AppReactContext } from "../context/app.context"
function r(e, t) {
  const { settings: n } = (0, i.useContext)(AppReactContext),
    [r, a] = (0, i.useState)(n.tryGetProperty(e, t))
  return (
    (0, i.useEffect)(() => {
      if (!e) return a(t), () => {}
      const i = () => {
          a(n.tryGetProperty(e, t))
        },
        s = n.onPropertyChanged(e, i)
      return i(), () => s.cancel()
    }, [n, e, t]),
    r
  )
}
export const y = r
