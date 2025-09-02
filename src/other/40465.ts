import * as s from "react"
import * as i from "react/jsx-runtime"
import * as m from "./22410"
import * as u from "./51978"
import * as h from "./66102"
import * as l from "../const/73536"
import * as o from "./84426"
import { ToggleModalCommand } from "../command/ui.command"
import { ToggleModelRatingDialogCommand } from "../command/model.command"
import { PhraseKey } from "../const/phrase.const"
import { discoverSpaceUrlKey, presentationMlsModeKey } from "../const/settings.const"
import { AppReactContext } from "../context/app.context"
const f = () => {
    const e = (0, h.b)(),
      t = !(0, u.y)(presentationMlsModeKey, !1),
      n = (() => {
        const e = (0, m.n)(),
          t = (0, u.y)(discoverSpaceUrlKey, "")
        return t && (null == e ? void 0 : e.hasDiscoverUrl()) ? `${t}${e.model.sid}` : null
      })(),
      s = e.t(PhraseKey.ALT_MATTERPORT_LOGO),
      r = (0, i.jsx)("img", {
        className: "footer-logo",
        alt: s,
        src: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjAiIHk9IjAiIHZpZXdCb3g9IjAgMCAyMzAuMDUgNDkuNzUiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxzdHlsZT4uc3Qwe2ZpbGw6I2Y1ZjRmM30uc3Qye2ZpbGw6I2ZmZn0uc3Qze2ZpbGw6Izk5OX08L3N0eWxlPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik02MS4yOCAzNi4xNHYtOC44MmwtLjI0LTUuMDkuMTktLjA0IDIuMDUgNC41NCA0LjgyIDguODYgNC44Mi04Ljg2IDIuMDYtNC41NC4xOC4wNC0uMjQgNS4wOXY4LjgyaDUuMTRWMTQuNGgtNS44MWwtNi4xMSAxMS43N2gtLjA3TDYxLjk1IDE0LjRoLTUuODF2MjEuNzR6TTIxMi42OSAzMC42M2MwIDMuNiAxLjk0IDUuNSA1LjYxIDUuNWgzLjE3di00LjQ1aC0zLjQ1di05LjQ5aDMuNzR2LTQuMzZoLTQuMTV2LTQuMjFoLTQuOTF2MTcuMDF6TTIxMS4yNiAxNy44M2gtLjg3Yy0zLjAxIDAtNC40NCAyLjAzLTQuODkgMy40M2gtLjE4di0zLjQzSDIwMHYxOC4zMWg1LjMyVjI1LjcyYzAtMS4wOC40MS0xLjg0LjkzLTIuMzMuODktLjg2IDIuNzktMS4xMSA1LjAxLTEuMTF2LTQuNDV6TTE1OC42MyAxNy44M2gtLjg3Yy0zLjAxIDAtNC40NCAyLjAzLTQuODkgMy40M2gtLjE4di0zLjQzaC01LjMydjE4LjMxaDUuMzJWMjUuNzJjMC0xLjA4LjQxLTEuODQuOTMtMi4zMy44OS0uODYgMi43OS0xLjExIDUuMDEtMS4xMXYtNC40NXpNMTI3LjQ4IDI3LjI1YzAtNS45NyAzLjE3LTkuODYgOC44NS05Ljg2IDYuMjYgMCA4Ljc4IDQuNTMgOC43OCA5LjY0djEuNThoLTEyLjEydi4xOGMwIDIuMTIgMS4xNCAzLjYgNC4xNyAzLjYgMi4yMyAwIDMuNDUtMS4wNCA0LjY0LTIuMjdsMi42NiAzLjMxYy0xLjY5IDEuOTQtNC40NiAzLjEzLTcuOTEgMy4xMy01LjguMDEtOS4wNy0zLjI3LTkuMDctOS4zMXptNS41LTIuMDV2LjI5aDYuNjJ2LS4zMmMwLTIuMy0xLjA0LTMuODUtMy4xNy0zLjg1cy0zLjQ1IDEuNTQtMy40NSAzLjg4ek0xODAuMDQgMjcuMjVjMC02LjA4IDMuMzEtOS44NiA4Ljg1LTkuODYgNS41NCAwIDguODUgMy43OCA4Ljg1IDkuODZzLTMuMzEgOS4zMi04Ljg1IDkuMzJjLTUuNTUgMC04Ljg1LTMuMjQtOC44NS05LjMyem0xMi4xNSAxLjM3di0zLjI3YzAtMi4zNy0xLjIyLTMuNzQtMy4zMS0zLjc0cy0zLjMxIDEuMzctMy4zMSAzLjc0djMuMjdjMCAyLjM3IDEuMjIgMy43NCAzLjMxIDMuNzRzMy4zMS0xLjM3IDMuMzEtMy43NHpNMTIyLjQyIDEzLjYyaC00Ljc4djIuMTljMCAxLjMtLjQzIDIuMDEtMS44NyAyLjAxaC0xLjMzdjQuMzZoMi42NnY4LjQ0YzAgMy42IDEuOTQgNS41IDUuNjEgNS41aDMuMTd2LTQuNDVoLTMuNDV2LTkuNDloMy43NHYtNC4zNmgtMy43NHYtNC4yek0xMDkuMTcgMTMuNjJoLTQuNzh2Mi4xOWMwIDEuMy0uNDMgMi4wMS0xLjg3IDIuMDFoLTEuMzN2NC4zNmgyLjY2djguNDRjMCAzLjYgMS45NCA1LjUgNS42MSA1LjVoMy4xN3YtNC40NWgtMy40NXYtOS40OWgzLjc0di00LjM2aC0zLjc0di00LjJ6TTE3MC45IDE3LjM5Yy0yLjQ1IDAtNC41MyAxLjUxLTUuMDcgMy42aC0uMTh2LTMuMTdoLTUuMzJ2MjMuODJoNS4zMnYtOC42N2guMThjLjU0IDIuMDUgMi42MyAzLjYgNS4wNyAzLjYgNC43OCAwIDcuMjctMi45MSA3LjI3LTkuMzItLjAxLTYuNC0yLjQ5LTkuODYtNy4yNy05Ljg2em0xLjcyIDExLjUyYzAgMi4zNy0xLjQ4IDMuMzUtMy40OSAzLjM1LTIuMDEgMC0zLjQ5LTEuMDQtMy40OS0yLjc3di01YzAtMS43MyAxLjQ4LTIuNzcgMy40OS0yLjc3IDIuMDEgMCAzLjQ5IDEuNTUgMy40OSAzLjkydjMuMjd6TTk3LjgzIDM2LjE0Yy0xLjkxIDAtMy4yNy0xLjMtMy42LTMuMzFoLS4yMmMtLjU4IDIuNDUtMi42NiAzLjc0LTUuNTQgMy43NC0zLjc4IDAtNS44Ni0yLjIzLTUuODYtNS41IDAtMy45OSAzLjA5LTUuOSA4LjA5LTUuOWgyLjk5di0uNjFjMC0xLjgzLS45LTIuOTktMy4xMy0yLjk5LTIuMTIgMC0zLjI0IDEuMDgtNC4wNiAyLjIzbC0zLjE3LTIuODFjMS41MS0yLjIzIDMuNjctMy42IDcuNjMtMy42IDUuMzIgMCA4LjA2IDIuNDUgOC4wNiA2LjkxdjcuMzhoMS43NnY0LjQ1aC0yLjk1em0tNC4xMy01Ljcydi0yLjIzaC0yLjU5Yy0yLjA1IDAtMy4xMy43Ni0zLjEzIDIuMTJ2LjU0YzAgMS4zNy45IDIuMDEgMi40OCAyLjAxIDEuNzYgMCAzLjI0LS43MiAzLjI0LTIuNDR6Ii8+PGc+PHBhdGggZD0iTTM5LjA1IDYuOTFMMjYuMjQgMTAuNSAxMy40MiA2LjkxIDguMyA4LjM1djMzLjA2bDUuMTMgMS40NCAxMi44Mi0zLjU5IDEyLjgyIDMuNTkgNS4xMy0xLjQ0VjguMzVsLTUuMTUtMS40NHptLTUuMTIgMjQuNjdsLTcuNjktMi4xNS03LjY5IDIuMTV2LTEzLjRsNy42OSAyLjE1IDcuNjktMi4xNXYxMy40eiIgZmlsbD0iI2I3YmFiYiIvPjxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0yNi4yNCAxMy4zN3Y2Ljk2bC0xMi44Mi0zLjU5djI2LjFMOC4zIDQxLjQxVjguMzV6TTMzLjkzIDM0LjQ1bC03LjY5LTIuMTZ2Ni45NmwxMi44MSAzLjU5di0yNi4xbC01LjEyIDEuNDR6Ii8+PGc+PHBhdGggY2xhc3M9InN0MyIgZD0iTTM5LjA1IDYuOTFsNS4xMyAxLjQ0LTE3Ljk0IDUuMDJMOC4zIDguMzVsNS4xMi0xLjQ0IDEyLjgyIDMuNTl6TTI2LjI0IDI5LjQybDcuNjkgMi4xNnYyLjg3bC03LjY5LTIuMTYtNy42OSAyLjE2di0yLjg3eiIvPjwvZz48L2c+PC9zdmc+"
      })
    return t
      ? (0, i.jsx)(
          "a",
          Object.assign(
            {
              className: "link logo-link",
              href: n || "https://matterport.com",
              target: "_blank",
              "data-testid": "footer-logo-link"
            },
            {
              children: r
            }
          )
        )
      : r
  },
  g = "gui"
function v(e) {
  const { analytics: t, commandBinder: n, locale: u } = (0, s.useContext)(AppReactContext),
    { isWorkshop: h = !1, modelRatingEnabled: p, disabled: m } = e
  return h && !p
    ? null
    : (0, i.jsxs)(
        o.hE,
        Object.assign(
          {
            className: "JMYDCase-footer",
            "data-testid": "JMYDCase-footer"
          },
          {
            children: [
              !m &&
                p &&
                (0, i.jsx)(o.zx, {
                  variant: o.Wu.TERTIARY,
                  size: "small",
                  theme: "overlay",
                  onClick: () => {
                    n.issueCommand(new ToggleModelRatingDialogCommand()),
                      t.trackGuiEvent("click_feedback_button", {
                        interactionSource: g
                      })
                  },
                  className: "model-feedback-link",
                  ariaRole: "link",
                  ariaHasPopup: "dialog",
                  disabled: m,
                  label: u.t(PhraseKey.FEEDBACK)
                }),
              !m &&
                !h &&
                p &&
                (0, i.jsx)("span", {
                  children: " | "
                }),
              !m &&
                !h &&
                (0, i.jsx)(o.zx, {
                  variant: o.Wu.TERTIARY,
                  size: "small",
                  theme: "overlay",
                  onClick: () => {
                    const i = e.openModal === l.P.HELP
                    n.issueCommand(new ToggleModalCommand(l.P.HELP, !i)),
                      t.trackGuiEvent("click_help_button", {
                        interactionSource: g
                      })
                  },
                  ariaRole: "link",
                  disabled: m,
                  ariaHasPopup: "dialog",
                  label: u.t(PhraseKey.HELP)
                }),
              !m &&
                !h &&
                (0, i.jsx)("span", {
                  children: " | "
                }),
              !m &&
                !h &&
                (0, i.jsx)(o.zx, {
                  variant: o.Wu.TERTIARY,
                  size: "small",
                  theme: "overlay",
                  onClick: () => {
                    const i = e.openModal === l.P.TERMS
                    n.issueCommand(new ToggleModalCommand(l.P.TERMS, !i)),
                      t.trackGuiEvent("click_terms_button", {
                        interactionSource: g
                      })
                  },
                  ariaRole: "link",
                  disabled: m,
                  ariaHasPopup: "dialog",
                  label: u.t(PhraseKey.TERMS)
                }),
              !m && !h && (0, i.jsx)(f, {})
            ]
          }
        )
      )
}
export const $ = v
