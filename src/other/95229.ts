import * as i from "react/jsx-runtime"
import * as s from "react"
import a from "classnames"

import * as o from "./38772"

@o.Z
class c extends s.Component {
  constructor(e) {
    super(e),
      (this.onChange = e => {
        this.props.onChange(e)
      })
  }
  render() {
    const { id: e, name: t, value: n, checked: s, children: r, enabled: o } = this.props,
      l = !o
    return (0, i.jsxs)(
      "div",
      Object.assign(
        {
          className: a("radio-element", "radio-button", {
            disabled: l
          })
        },
        {
          children: [
            (0, i.jsx)("input", {
              type: "radio",
              id: e,
              name: t,
              value: n,
              checked: s,
              onChange: this.onChange
            }),
            (0, i.jsx)(
              "label",
              Object.assign(
                {
                  className: "radio-button-label",
                  htmlFor: e
                },
                {
                  children: r
                }
              )
            )
          ]
        }
      )
    )
  }
}

export const E = c
