import * as i from "react/jsx-runtime"
import * as s from "react"
import * as r from "./38772"
import * as a from "../lottiefiles/71657"
import { LottiePlayer } from "lottie-web"

@r.Z
class l extends s.Component {
  lottieTargetRef: s.RefObject<unknown>
  isUnmounting: boolean
  loadLottie: () => Promise<LottiePlayer>
  lottieLib: any
  updateAnimation: () => Promise<undefined>
  renderFallback: () => s.ReactElement<any, string | s.JSXElementConstructor<any>> | null
  constructor(e) {
    super(e),
      (this.lottieTargetRef = (0, s.createRef)()),
      (this.isUnmounting = !1),
      (this.loadLottie = async () => (this.lottieLib ? this.lottieLib : await import("lottie-web"))),
      (this.updateAnimation = async () => {
        const { animation: e, loop: t = !1 } = this.props
        let n: LottiePlayer
        this.setState({
          fallbackActive: !1
        })
        try {
          n = await this.loadLottie()
        } catch (e) {
          if (this.isUnmounting) return
          return void this.setState({
            fallbackActive: !0
          })
        }
        const i = a.W.get(e)
        if (n && i && this.lottieTargetRef.current) {
          const e = n.loadAnimation({
            loop: t,
            container: this.lottieTargetRef.current,
            renderer: "svg",
            autoplay: !1,
            animationData: i.json
          })
          e.addEventListener("data_failed", () => {
            this.isUnmounting ||
              this.setState({
                fallbackActive: !0
              })
          }),
            setTimeout(() => {
              this.isUnmounting || e.play()
            }, 50)
        }
      }),
      (this.renderFallback = () => {
        const { animation: e } = this.props,
          t = a.W.get(e)
        return t
          ? (0, i.jsx)("img", {
              className: "lottie-fallback",
              src: t.fallback,
              alt: t.alt
            })
          : null
      }),
      (this.state = {
        fallbackActive: !1
      })
  }
  componentDidMount() {
    this.updateAnimation()
  }
  componentDidUpdate(e) {
    ;(e.animation === this.props.animation && e.loop === this.props.loop) || this.updateAnimation()
  }
  componentWillUnmount() {
    this.isUnmounting = !0
  }
  render() {
    return (0, i.jsxs)(
      "div",
      Object.assign(
        {
          className: "lottie"
        },
        {
          children: [
            (0, i.jsx)("div", {
              className: "lottie-animation",
              ref: this.lottieTargetRef
            }),
            this.state.fallbackActive && this.renderFallback()
          ]
        }
      )
    )
  }
}

export const ZP = l
