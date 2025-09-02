import * as n from "react"
import * as s from "./1358"
function r(e) {
  return e ? Array.from(e.rooms.values()) : []
}
function a() {
  const e = (0, s.S)(),
    [t, i] = (0, n.useState)(r(e))
  return (
    (0, n.useEffect)(() => {
      if (!e) return () => {}
      const t = () => i(r(e)),
        n = e.onRoomsChanged({ onRemoved: e => t, onUpdated: e => t, onChildUpdated: e => t, onAdded: e => t })
      return (
        t(),
        () => {
          n.cancel()
        }
      )
    }, [e]),
    t
  )
}
export const q = a
