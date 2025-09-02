import * as n from "react/jsx-runtime"
import * as s from "react"
import * as a from "./38772"

@a.Z
class r extends s.Component {
  constructor(e) {
    super(e),
      (this.active = !1),
      (this.dropZone = null),
      (this.onDragOver = e => {
        e.dataTransfer && e.dataTransfer.types && e.dataTransfer.types.includes("Files") && (e.preventDefault(), e.stopPropagation(), this.activate())
      }),
      (this.onDrop = e => {
        e.preventDefault(), e.stopPropagation(), e.dataTransfer && e.dataTransfer.files && this.props.onDropped(e.dataTransfer.files), this.deactivate()
      }),
      (this.onDragEnd = e => {
        e.preventDefault(), e.stopPropagation(), this.deactivate()
      }),
      (this.onDragLeave = e => {
        e.preventDefault(), e.stopPropagation(), this.deactivate()
      }),
      (this.setDropZoneRef = e => {
        this.dropZone = e
      })
  }
  activate() {
    !this.active && this.dropZone && (this.props.onActivate && this.props.onActivate(!0), (this.active = !0), this.dropZone.classList.add("active"))
  }
  deactivate() {
    this.active && this.dropZone && ((this.active = !1), this.dropZone.classList.remove("active"), this.props.onDone && this.props.onDone())
  }
  render() {
    const { className: e, children: t, disabled: i } = this.props
    return (0, n.jsxs)(
      "div",
      Object.assign(
        {
          className: e,
          onDragEnter: i ? void 0 : this.onDragOver,
          onDragLeave: i ? void 0 : this.onDragLeave,
          onDragOver: i ? void 0 : this.onDragOver,
          onDragEnd: i ? void 0 : this.onDragEnd,
          onDrop: i ? void 0 : this.onDrop
        },
        {
          children: [
            (0, n.jsxs)(
              "div",
              Object.assign(
                { className: "file-drop-zone", ref: this.setDropZoneRef },
                { children: [(0, n.jsx)("span", { className: "icon icon-attach" }), (0, n.jsx)("label", { children: "Upload file" })] }
              )
            ),
            t
          ]
        }
      )
    )
  }
}

export const Z = r
