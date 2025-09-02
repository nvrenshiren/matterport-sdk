import * as ii from "react"
import * as a from "./61531"
import { MoveToSweepBeginMessage } from "../message/sweep.message"
import { TourSteppedMessage } from "../message/tour.message"
function o() {
  const [e, t] = (0, ii.useState)(!1),
    n = (0, ii.useCallback)(() => {
      t(!0)
    }, []),
    o = (0, ii.useCallback)(() => {
      t(!1)
    }, [])
  return (0, a.U)(TourSteppedMessage, n), (0, a.U)(MoveToSweepBeginMessage, o), e
}

export const i = o
