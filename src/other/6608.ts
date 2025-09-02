import * as n from "react/jsx-runtime"
import * as s from "react"
import * as r from "./38772"
import o from "classnames"

@r.Z
class l extends s.Component {
  constructor(e) {
    super(e)
  }
  render() {
    const { iconClass: e, label: t, badgeStyle: i, onClick: s, className: r, imageUrl: a } = this.props
    return (0, n.jsxs)(
      "span",
      Object.assign(
        { className: o("badge", r, { clickable: !!s }), style: i, onClick: s },
        {
          children: [
            e && (0, n.jsx)("span", { className: `icon badge-icon ${e}` }),
            t && (0, n.jsx)("span", Object.assign({ className: "badge-label" }, { children: t })),
            a && (0, n.jsx)("span", Object.assign({ className: "badge-img" }, { children: (0, n.jsx)("img", { src: a }) }))
          ]
        }
      )
    )
  }
}

export const C = l
