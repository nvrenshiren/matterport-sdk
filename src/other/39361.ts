import * as n from "react/jsx-runtime"
import * as s from "react"
import * as a from "./38772"
import r from "classnames"

@a.Z
class c extends s.Component {
  constructor(e) {
    super(e),
      (this.handleUpload = e => {
        const t = e.target
        if (!t) return
        const i = t.files
        i && this.props.onUpload(i), (t.value = "")
      })
  }
  render() {
    const { accept: e, id: t, multi: i, enabled: s, children: a, className: o, tooltip: d } = this.props,
      c = `file-upload-${t}`
    return (0, n.jsxs)(
      "div",
      Object.assign(
        { className: r("file-upload-button", o, { disabled: !s }) },
        {
          children: [
            (0, n.jsx)(
              "label",
              Object.assign({ className: "file-upload-trigger", htmlFor: c, "data-balloon": d, "data-balloon-pos": "down" }, { children: a })
            ),
            s && (0, n.jsx)("input", { type: "file", className: "file-input", id: c, accept: e, multiple: !!i, onChange: this.handleUpload })
          ]
        }
      )
    )
  }
}

export const p = c
