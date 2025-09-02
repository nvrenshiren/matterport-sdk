import * as s from "react"
import * as i from "react/jsx-runtime"
import * as l from "./84426"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"
import { exitFullscreen, hasFullscreenElement, requestFullscreen } from "../utils/browser.utils"
class c extends s.Component {
  constructor(e) {
    super(e),
      (this.handleButtonClick = () => {
        const { analytics: e } = this.context
        hasFullscreenElement()
          ? (e.trackGuiEvent("click_exit_fullscreen", {
              interactionSource: "gui"
            }),
            exitFullscreen())
          : (e.trackGuiEvent("click_enter_fullscreen", {
              interactionSource: "gui"
            }),
            requestFullscreen(document.body))
      }),
      (this.onFullScreenChange = e => {
        const { mainDiv: t } = this.context,
          n = hasFullscreenElement()
        n ? t.classList.add("full-screen") : t.classList.remove("full-screen"),
          this.setState({
            fullscreen: n
          })
      }),
      (this.state = {
        fullscreen: hasFullscreenElement()
      }),
      document.addEventListener("fullscreenchange", this.onFullScreenChange),
      document.addEventListener("webkitfullscreenchange", this.onFullScreenChange),
      document.addEventListener("MSFullscreenChange", this.onFullScreenChange),
      document.addEventListener("mozfullscreenchange", this.onFullScreenChange)
  }
  componentWillUnmount() {
    document.removeEventListener("fullscreenchange", this.onFullScreenChange),
      document.removeEventListener("webkitfullscreenchange", this.onFullScreenChange),
      document.removeEventListener("MSFullscreenChange", this.onFullScreenChange),
      document.removeEventListener("mozfullscreenchange", this.onFullScreenChange)
  }
  render() {
    const { fullscreen: e } = this.state,
      t = e ? this.context.locale.t(PhraseKey.EXIT_FULLSCREEN) : this.context.locale.t(PhraseKey.VIEW_FULLSCREEN),
      n = e ? "fullscreen-exit" : "fullscreen"
    return (0, i.jsx)(
      "div",
      Object.assign(
        {
          className: "fullscreen-mode"
        },
        {
          children: (0, i.jsx)(l.zx, {
            onClick: this.handleButtonClick,
            ariaLabel: t,
            tooltip: t,
            tooltipOptions: {
              placement: "top"
            },
            icon: n,
            theme: "overlay",
            variant: l.Wu.TERTIARY
          })
        }
      )
    )
  }
}
c.contextType = AppReactContext
export const Z = c
