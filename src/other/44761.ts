import * as n from "react"
import * as s from "./36773"
function a(e, t) {
  return t && e && e.focusedComment ? e.getReply(t, e.focusedComment.id) : null
}
function o(e) {
  const t = (0, s.Q)(),
    [i, o] = (0, n.useState)(a(t, e))
  return (
    (0, n.useEffect)(() => {
      if (!t) return () => {}
      const i = t.onFocusedCommentChanged(function () {
        o(a(t, e))
      })
      return () => i.cancel()
    }, [t, e]),
    i
  )
}

export const e = o
