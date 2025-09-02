import * as i from "react/jsx-runtime"
import * as s from "react"
import a from "classnames"

function o({ children: e, className: t }) {
  const n = (0, s.useCallback)(e => {
    e.stopPropagation()
  }, [])
  return (0, i.jsx)(
    "div",
    Object.assign(
      {
        className: a("settings-container settings-box", t),
        onClick: n
      },
      {
        children: e
      }
    )
  )
}
export const J = o
