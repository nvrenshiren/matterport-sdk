import * as s from "react/jsx-runtime"
import * as r from "react"
import o from "classnames"

import * as l from "./38772"

enum i {
  DEFAULT = 0,
  FILTER = 1
}
@l.Z
class d extends r.Component {
  constructor(e) {
    super(e),
      (this.onChange = e => {
        this.props.stopPropagation && e.stopPropagation(),
          this.setState(
            e => ({
              checkedValue: !e.checkedValue
            }),
            () => {
              this.props.onChange && this.props.onChange(this.checkboxElement, ...(this.props.onChangeArgs || []))
            }
          )
      }),
      (this.setCheckboxRef = e => {
        this.checkboxElement = e
      }),
      (this.state = {
        checkedValue: e.checked
      })
  }
  UNSAFE_componentWillReceiveProps(e) {
    this.setState({
      checkedValue: e.checked
    })
  }
  render() {
    const { checkboxStyle: e = i.DEFAULT, className: t, dataValue: n, enabled: r, error: a, helpText: l, id: c, label: d } = this.props,
      { checkedValue: u } = this.state,
      h = !r
    return (0, s.jsxs)(
      "div",
      Object.assign(
        {
          ref: this.setCheckboxRef,
          id: c,
          role: "checkbox",
          "aria-checked": u ? "true" : "false",
          "aria-disabled": h,
          "data-value": n,
          className: o(
            "checkbox-element",
            `checkbox-style-${i[e].toLowerCase()}`,
            {
              checked: u,
              disabled: h,
              error: a
            },
            t
          ),
          onClick: this.onChange,
          tabIndex: 0
        },
        {
          children: [
            e !== i.FILTER &&
              (0, s.jsx)("div", {
                className: "checkbox icon-checkmark"
              }),
            (0, s.jsx)(
              "div",
              Object.assign(
                {
                  className: "checkbox-text"
                },
                {
                  children: d
                }
              )
            ),
            l &&
              (0, s.jsx)(
                "span",
                Object.assign(
                  {
                    className: "help-text"
                  },
                  {
                    children: l
                  }
                )
              )
          ]
        }
      )
    )
  }
}
d.defaultProps = {
  enabled: !0,
  error: !1
}

export const C = i
export const X = d
