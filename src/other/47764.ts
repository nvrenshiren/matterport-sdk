import * as i from "react"
import { AppReactContext } from "../context/app.context"
function r(e, t = null) {
  const { settings: n } = (0, i.useContext)(AppReactContext)
  return n.getOverrideParam(e, t)
}

export const L = r
