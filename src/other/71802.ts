import * as i from "react"
import { TransitionType } from "../const/transition.const"
import * as r from "./34646"
function a() {
  const e = (0, r.s)(),
    t = (0, i.useRef)(e)
  return e.type === TransitionType.FloorChange ? t.current : ((t.current = e), e)
}

export const l = a
