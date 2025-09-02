import o from "classnames"
import * as r from "react"
import * as s from "react/jsx-runtime"

import * as l from "./38772"
import { CheckThreshold } from "../utils/49827"

@l.Z
class u extends r.Component {
  constructor(e) {
    super(e),
      (this.strokePattern = [0, 100]),
      (this.strokeOffset = 0),
      (this.innerRadius = 15.92),
      (this.strokeWidth = 1),
      (this.drawRadius = this.innerRadius + this.strokeWidth / 2),
      this.updateSvgAttributes(e),
      (this.elementId = this.props.id || "circle-progress-" + u.id++)
  }
  UNSAFE_componentWillReceiveProps(e) {
    this.updateSvgAttributes(e)
  }
  updateSvgAttributes(e) {
    ;(this.strokeWidth = e.barWidth || this.strokeWidth),
      (this.innerRadius = e.innerRadius || this.innerRadius),
      (this.drawRadius = this.innerRadius + this.strokeWidth / 2)
    const t = 2 * this.drawRadius * Math.PI
    ;(this.strokeOffset = t * (e.startPosition || this.strokeOffset)),
      (this.strokePattern[0] = (t * CheckThreshold(e.progress, 0, 100)) / 100),
      (this.strokePattern[1] = t - this.strokePattern[0])
  }
  render() {
    const { progressColor: e } = this.props,
      t = 2 * (this.innerRadius + this.strokeWidth),
      n = t / 2
    return (0, s.jsxs)(
      "svg",
      Object.assign(
        {
          id: this.elementId,
          className: o("circular-progress", this.props.className),
          viewBox: `${-n} ${-n} ${t} ${t}`
        },
        {
          children: [
            (0, s.jsx)("circle", {
              className: "bar-bg",
              cx: "0",
              cy: "0",
              r: this.drawRadius,
              transform: "rotate(-90) " + (this.props.ccw ? "scale(-1 1)" : ""),
              strokeDasharray: `${this.strokePattern[1]} ${this.strokePattern[0]}`,
              strokeDashoffset: this.strokeOffset - this.strokePattern[0],
              strokeWidth: this.strokeWidth,
              fill: "none"
            }),
            (0, s.jsx)("circle", {
              className: e ? void 0 : "progress",
              cx: "0",
              cy: "0",
              r: this.drawRadius,
              transform: "rotate(-90) " + (this.props.ccw ? "scale(-1 1)" : ""),
              strokeDasharray: `${this.strokePattern[0]} ${this.strokePattern[1]}`,
              strokeWidth: this.strokeWidth,
              stroke: e,
              fill: "none"
            }),
            this.props.children
          ]
        }
      )
    )
  }
}
u.id = 0

export const $ = u
