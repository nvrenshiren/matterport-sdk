import * as i from "react/jsx-runtime"
import * as s from "./39361"
import * as r from "./84426"
import o from "classnames"

function l({ addFileLabel: e, enabled: t, id: n, onUpload: a, showAddFileLable: l, tooltip: c, multi: d }) {
  const u = o("file-upload-btn", "mp-nova-btn", "mp-nova-btn-dark", {
    "mp-nova-btn-icon": !l,
    "mp-nova-disabled": !t,
    "mp-nova-btn-large": !l,
    "mp-nova-btn-small": l,
    "mp-nova-btn-primary": l,
    "mp-nova-btn-multi": l
  })
  return (0, i.jsx)(
    s.p,
    Object.assign(
      {
        id: n,
        multi: null == d || d,
        enabled: t,
        onUpload: a,
        tooltip: c
      },
      {
        children: (0, i.jsxs)(
          "div",
          Object.assign(
            {
              className: u
            },
            {
              children: [
                (0, i.jsx)(r.JO, {
                  name: "plus"
                }),
                l &&
                  (0, i.jsx)("span", {
                    children: e
                  })
              ]
            }
          )
        )
      }
    )
  )
}
export const p = l
