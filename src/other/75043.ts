import * as i from "react/jsx-runtime"
import r from "classnames"

function a({ children: e, className: t }) {
  return (0, i.jsx)(
    "div",
    Object.assign(
      {
        className: r("overlay-top-center", t)
      },
      {
        children: (0, i.jsx)(
          "div",
          Object.assign(
            {
              className: "overlay-info"
            },
            {
              children: e
            }
          )
        )
      }
    )
  )
}
export const u = a
