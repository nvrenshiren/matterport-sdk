import * as i from "react/jsx-runtime"
import * as s from "react"
import a from "classnames"

class o extends s.Component {
  render() {
    const { className: e, href: t, children: n, onClick: s } = this.props
    return (0, i.jsx)(
      "a",
      Object.assign(
        {
          className: a("link", {
            className: e
          }),
          href: t,
          target: "_blank",
          onClick: s
        },
        {
          children: n
        }
      )
    )
  }
}
export const r = o
