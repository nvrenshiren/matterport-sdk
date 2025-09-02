import * as s from "react"
import { AppReactContext } from "../context/app.context"
export function Y(e, t) {
  const { engine: i } = (0, s.useContext)(AppReactContext)
  return (0, s.useCallback)(
    (...n) => {
      const s = t ? (Array.isArray(t) ? t : t(...n)) : []
      i.commandBinder.issueCommand(new e(...s))
    },
    [e, t, i]
  )
}
