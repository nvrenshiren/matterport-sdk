import * as i from "react"
import { AppReactContext } from "../context/app.context"
function r() {
  const { locale: e } = (0, i.useContext)(AppReactContext)
  return e
}

export const b = r
