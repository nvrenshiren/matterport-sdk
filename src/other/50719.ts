import * as i from "react/jsx-runtime"
import * as s from "react"
import a from "classnames"

import * as o from "./38772"
import * as l from "./86941"
import * as c from "./14355"

@o.Z
class u extends s.Component {
  constructor(e) {
    super(e)
  }
  render() {
    const { showing: e } = this.props
    return (0, i.jsx)(
      c.N,
      Object.assign(
        {
          open: e,
          className: a("load-indicator", {
            "fade-in": e,
            "fade-out": !e
          })
        },
        {
          children: (0, i.jsx)(
            "div",
            Object.assign(
              {
                className: "center-container"
              },
              {
                children: (0, i.jsx)(l.$, {
                  progress: 33,
                  barWidth: 4,
                  progressColor: "#ffffff"
                })
              }
            )
          )
        }
      )
    )
  }
}

export const Z = u
