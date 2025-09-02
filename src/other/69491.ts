import * as n from "react/jsx-runtime"
import * as s from "react"
import * as a from "@rmwc/slider"
import r from "classnames"

let d = 0
class c extends s.Component {
  constructor(e) {
    super(e),
      (this.mdcRef = (0, s.createRef)()),
      (this.setValue = e => {
        this.setState({ value: e })
      }),
      (this.onSliderInput = e => {
        var t
        const i = e.detail.value
        this.layoutRecalculated || (null === (t = this.mdcRef.current) || void 0 === t || t.layout(), (this.layoutRecalculated = !0)),
          this.setState({ value: i }),
          this.props.onInput && this.props.onInput(i)
      }),
      (this.onSliderChange = e => {
        const t = e.detail.value
        this.setState({ value: t }), this.props.onChange && this.props.onChange(t)
      }),
      (this.getLeftOffset = () => (100 * (this.state.value - this.props.min)) / (this.props.max - this.props.min) + "%"),
      (this.getSliderId = () => `slider-with-tooltip-${this.id}`),
      (this.getStyleElement = () => `#${this.getSliderId()} .mdc-slider__thumb-container {\n        left: ${this.getLeftOffset()}\n    }`),
      (this.getDisplayValue = e => {
        const { formatNumbers: t, units: i } = this.props
        return (t ? t(e) : e) + (i || "")
      }),
      (this.setActive = e => () => this.setState({ active: e })),
      (this.hasChanged = () => {
        this.setState({ hasChanged: !1 })
      }),
      (this.onMouseDown = e => {
        this.props.onInputStart && this.props.onInputStart()
      }),
      (this.onEventMouseUp = e => {
        this.props.onInputEnd && this.props.onInputEnd()
      }),
      (this.onMouseUp = e => {
        this.props.onInputEnd && this.props.onInputEnd()
      }),
      (this.id = d++),
      (this.state = { value: void 0 !== e.initialValue ? e.initialValue : (e.max + e.min) / 2, active: !1, hasChanged: !1 }),
      (this.setActiveSlider = this.setActive(!0)),
      (this.setInactiveSlider = this.setActive(!1))
  }
  componentDidMount() {
    document.addEventListener("mouseup", this.onEventMouseUp), document.addEventListener("mouseleave", this.onEventMouseUp)
  }
  componentWillUnmount() {
    document.removeEventListener("mouseup", this.onEventMouseUp), document.removeEventListener("mouseleave", this.onEventMouseUp)
  }
  componentDidUpdate(e, t) {
    t.value !== this.state.value &&
      (clearTimeout(this.hasChangedTimeout), this.setState({ hasChanged: !0 }), (this.hasChangedTimeout = window.setTimeout(this.hasChanged, 450)))
  }
  render() {
    const {
        width: e,
        displayBounds: t,
        min: i,
        max: s,
        discrete: o,
        tooltipPosition: d = l.DOWN,
        variant: c = "default",
        disabled: h,
        tabIndex: u
      } = this.props,
      { active: m, hasChanged: p, value: g } = this.state,
      v = { left: this.getLeftOffset() },
      y = "inline-value" === c,
      f = !y && t,
      w = !y,
      b = void 0 !== u ? u : 0
    return (0, n.jsxs)(
      "div",
      Object.assign(
        {
          id: this.getSliderId(),
          className: r("slider-with-tooltip", { displayBounds: t, disabled: h }),
          style: { width: `${e}px` },
          onMouseEnter: this.setActiveSlider,
          onMouseLeave: this.setInactiveSlider
        },
        {
          children: [
            w &&
              d === l.UP &&
              (0, n.jsx)("div", {
                className: r("slider-tooltip", { active: m || p }),
                "data-balloon": this.getDisplayValue(g),
                "data-balloon-pos": l.UP,
                style: v
              }),
            f && (0, n.jsx)("div", Object.assign({ className: "min-amount" }, { children: this.getDisplayValue(i) })),
            y && (0, n.jsx)("div", Object.assign({ className: "min-amount" }, { children: this.getDisplayValue(g) })),
            (0, n.jsx)(a.Slider, {
              discrete: o,
              min: i,
              max: s,
              value: g,
              onInput: this.onSliderInput,
              onChange: this.onSliderChange,
              onMouseDown: this.onMouseDown,
              onMouseUp: this.onMouseUp,
              foundationRef: this.mdcRef,
              disabled: h,
              tabIndex: b
            }),
            f && (0, n.jsx)("div", Object.assign({ className: "max-amount" }, { children: this.getDisplayValue(s) })),
            (0, n.jsx)("style", { dangerouslySetInnerHTML: { __html: this.getStyleElement() } }),
            w &&
              d === l.DOWN &&
              (0, n.jsx)("div", {
                className: r("slider-tooltip", { active: m || p }),
                "data-balloon": this.getDisplayValue(g),
                "data-balloon-pos": l.DOWN,
                style: v
              })
          ]
        }
      )
    )
  }
}

enum l {
  DOWN = "down",
  UP = "up"
}

export const h = l
export const S = c
