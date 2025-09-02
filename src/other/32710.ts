import * as s from "react"
import * as i from "react/jsx-runtime"
import * as c from "./38490"
import * as h from "./58740"
import * as d from "./71215"
import * as p from "../lottiefiles/71657"
import * as o from "../const/73536"
import * as u from "./84426"
import { ToggleModalCommand } from "../command/ui.command"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"
const { MODEL_RATING: m } = PhraseKey.WORKSHOP
class f extends s.Component {
  constructor() {
    super(...arguments),
      (this.onClose = () => {
        this.context.commandBinder.issueCommand(new ToggleModalCommand(o.P.RATING_THANK_YOU, !1))
      })
  }
  render() {
    const { locale: e } = this.context
    return (0, i.jsxs)(
      u.Vq,
      Object.assign(
        {
          className: "model-rating-thank-you open",
          onClose: this.onClose
        },
        {
          children: [
            (0, i.jsx)(c.P, {
              onClose: this.onClose
            }),
            (0, i.jsx)("h4", {
              children: e.t(m.THANK_YOU_HEADING)
            }),
            (0, i.jsx)(h.ZP, {
              animation: p.F.HandsRaised
            }),
            (0, i.jsx)(
              "p",
              Object.assign(
                {
                  className: "p4"
                },
                {
                  children: e.t(m.THANK_YOU_BODY)
                }
              )
            ),
            (0, i.jsxs)(
              "small",
              Object.assign(
                {
                  className: "model-rating-cta"
                },
                {
                  children: [
                    e.t(m.THANK_YOU_CTA),
                    " ",
                    (0, i.jsx)(
                      d.r,
                      Object.assign(
                        {
                          href: "//matterport.com/resources/support",
                          onClick: this.onClose
                        },
                        {
                          children: e.t(m.THANK_YOU_CTA_LINK_TEXT)
                        }
                      )
                    )
                  ]
                }
              )
            )
          ]
        }
      )
    )
  }
}
f.contextType = AppReactContext
export const B = f
