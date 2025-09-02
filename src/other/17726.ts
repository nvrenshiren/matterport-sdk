import * as i from "react/jsx-runtime"
import * as s from "./73085"

import u from "classnames"
import * as c from "react"
import * as l from "./96403"

import * as g from "./10119"
import * as f from "./26340"
import * as m from "./38490"
import * as A from "./38772"
import * as v from "./84426"
import { SubmitModelRatingCommand, ToggleModelRatingDialogCommand } from "../command/model.command"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"
import { ModelRatingViewData } from "../data/model.rating.view.data"
const a = (0, s.M)(ModelRatingViewData, "isDialogVisible", !1)

var o = {
  Disappointed: 0,
  Happy: 4,
  Neutral: 2,
  Satisfied: 3,
  Unsatisfied: 1
}
const { MODEL_RATING: b } = PhraseKey.WORKSHOP,
  E = {
    HAPPINESS: "happiness",
    QUALITY: "quality",
    NAVIGATION: "navigation",
    FEEDBACK: "feedback"
  },
  S = E.HAPPINESS,
  O = {
    [E.HAPPINESS]: b.HAPPINESS_TITLE,
    [E.QUALITY]: b.QUALITY_ISSUES_TITLE,
    [E.NAVIGATION]: b.NAVIGATION_ISSUES_TITLE,
    [E.FEEDBACK]: b.FEEDBACK_TITLE
  },
  T = {
    [E.HAPPINESS]: b.HAPPINESS_BODY
  },
  _ = {
    [E.QUALITY]: [
      {
        text: b.QUALITY_ISSUES_LIGHTING,
        value: "lighting"
      },
      {
        text: b.QUALITY_ISSUES_3D_MESH,
        value: "3d_mesh"
      },
      {
        text: b.QUALITY_ISSUES_COLORING,
        value: "coloring"
      },
      {
        text: b.QUALITY_ISSUES_IMAGE_QUALITY,
        value: "image_quality"
      }
    ],
    [E.NAVIGATION]: [
      {
        text: b.NAVIGATION_ISSUES_BLOCKED_DOORWAYS,
        value: "blocked_doorways"
      },
      {
        text: b.NAVIGATION_ISSUES_OBSTRUCTIONS,
        value: "obstructions"
      },
      {
        text: b.NAVIGATION_ISSUES_MISALIGNED_SCANS,
        value: "misaligned_scans"
      },
      {
        text: b.NAVIGATION_ISSUES_FLOOR_SEPARATION,
        value: "floor_separation"
      },
      {
        text: b.NAVIGATION_ISSUES_DISAPPEARING_FLOORS,
        value: "disappearing_floors"
      }
    ]
  },
  w = [
    {
      value: 1,
      altText: PhraseKey.REUSABLES.EMOJI_ALT_DISAPPOINTED,
      icon: o.Disappointed
    },
    {
      value: 2,
      altText: PhraseKey.REUSABLES.EMOJI_ALT_UNSATISFIED,
      icon: o.Unsatisfied
    },
    {
      value: 3,
      altText: PhraseKey.REUSABLES.EMOJI_ALT_NEUTRAL,
      icon: o.Neutral
    },
    {
      value: 4,
      altText: PhraseKey.REUSABLES.EMOJI_ALT_SATISFIED,
      icon: o.Satisfied
    },
    {
      value: 5,
      altText: PhraseKey.REUSABLES.EMOJI_ALT_HAPPY,
      icon: o.Happy
    }
  ]
@A.Z
class I extends c.Component {
  render() {
    switch (this.props.icon) {
      case o.Disappointed:
        return (0, i.jsxs)(
          "svg",
          Object.assign(
            {
              width: "29",
              height: "29",
              viewBox: "0 0 29 29",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg"
            },
            {
              children: [
                (0, i.jsx)("path", {
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                  d: "M14.5 28C21.9557 28 28 21.9557 28 14.5C28 7.04503 21.9557 1 14.5 1C7.04506 1 1 7.04506 1 14.5C1 21.9557 7.04503 28 14.5 28ZM14.5 29C22.508 29 29 22.508 29 14.5C29 6.49278 22.508 0 14.5 0C6.49278 0 0 6.49278 0 14.5C0 22.508 6.49278 29 14.5 29Z",
                  fill: "#222222"
                }),
                (0, i.jsx)("path", {
                  d: "M9.26389 16.1111C10.3761 16.1111 11.2778 14.8488 11.2778 13.2917C11.2778 11.7345 10.3761 10.4722 9.26389 10.4722C8.15165 10.4722 7.25 11.7345 7.25 13.2917C7.25 14.8488 8.15165 16.1111 9.26389 16.1111Z",
                  fill: "#222222"
                }),
                (0, i.jsx)("path", {
                  d: "M19.7361 16.1111C20.8484 16.1111 21.75 14.8488 21.75 13.2917C21.75 11.7345 20.8484 10.4722 19.7361 10.4722C18.6239 10.4722 17.7222 11.7345 17.7222 13.2917C17.7222 14.8488 18.6239 16.1111 19.7361 16.1111Z",
                  fill: "#222222"
                }),
                (0, i.jsx)("path", {
                  d: "M4.83253 9.66666C4.66497 9.66666 4.495 9.6143 4.35 9.50555C3.99394 9.23891 3.92225 8.73383 4.18889 8.37777C6.81661 4.87361 10.324 4.83333 10.4722 4.83333C10.9169 4.83333 11.2778 5.19422 11.2778 5.63888C11.2778 6.08274 10.9193 6.44283 10.4754 6.44444C10.3506 6.44605 7.60122 6.51372 5.47778 9.34444C5.31989 9.5555 5.07742 9.66666 4.83253 9.66666ZM24.1675 9.66666C23.9218 9.66666 23.6809 9.5555 23.5222 9.34444C21.3956 6.50808 18.6397 6.44605 18.5229 6.44444C18.0799 6.43961 17.7222 6.07711 17.7246 5.63486C17.7271 5.19099 18.0847 4.83333 18.5278 4.83333C18.676 4.83333 22.1826 4.87361 24.8111 8.37777C25.0786 8.73383 25.0061 9.23891 24.65 9.50555C24.505 9.6143 24.3358 9.66666 24.1675 9.66666V9.66666ZM18.9185 22.4581C18.9096 22.4226 17.9961 18.9306 14.5 18.9306C11.0039 18.9306 10.0904 22.4226 10.0815 22.4581C10.0388 22.6297 10.117 22.8053 10.2684 22.8963C10.4199 22.9865 10.6172 22.9656 10.7485 22.848C10.7558 22.8415 11.5646 22.1528 14.5 22.1528C17.3919 22.1528 18.2192 22.8214 18.2507 22.848C18.3272 22.9205 18.4271 22.9583 18.5278 22.9583C18.5954 22.9583 18.6639 22.9414 18.7259 22.9068C18.8838 22.8166 18.9628 22.6337 18.9185 22.4581V22.4581Z",
                  fill: "#222222"
                })
              ]
            }
          )
        )
      case o.Unsatisfied:
        return (0, i.jsxs)(
          "svg",
          Object.assign(
            {
              width: "30",
              height: "29",
              viewBox: "0 0 30 29",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg"
            },
            {
              children: [
                (0, i.jsx)("path", {
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                  d: "M15.125 28C22.5808 28 28.625 21.9558 28.625 14.5C28.625 7.04416 22.5808 1 15.125 1C7.66916 1 1.625 7.04416 1.625 14.5C1.625 21.9558 7.66916 28 15.125 28ZM29.625 14.5C29.625 22.5081 23.1331 29 15.125 29C7.11687 29 0.625 22.5081 0.625 14.5C0.625 6.49187 7.11687 0 15.125 0C23.1331 0 29.625 6.49187 29.625 14.5Z",
                  fill: "#222222"
                }),
                (0, i.jsx)("path", {
                  d: "M21.1546 22.0553C21.1183 21.9111 20.2137 18.5278 15.125 18.5278C10.0355 18.5278 9.13167 21.9111 9.09542 22.0553C9.05111 22.2301 9.13006 22.4114 9.28633 22.5016C9.44342 22.591 9.63997 22.5644 9.76967 22.4395C9.78497 22.4242 11.3437 20.9444 15.125 20.9444C18.9063 20.9444 20.4658 22.4242 20.4803 22.4387C20.5577 22.5153 20.6608 22.5555 20.7639 22.5555C20.8316 22.5555 20.9 22.5386 20.9621 22.504C21.1199 22.4138 21.1989 22.2309 21.1546 22.0553Z",
                  fill: "#222222"
                }),
                (0, i.jsx)("path", {
                  d: "M10.2917 13.6944C11.4039 13.6944 12.3055 12.4321 12.3055 10.875C12.3055 9.31787 11.4039 8.05556 10.2917 8.05556C9.17942 8.05556 8.27777 9.31787 8.27777 10.875C8.27777 12.4321 9.17942 13.6944 10.2917 13.6944Z",
                  fill: "#222222"
                }),
                (0, i.jsx)("path", {
                  d: "M19.9583 13.6944C21.0706 13.6944 21.9722 12.4321 21.9722 10.875C21.9722 9.31787 21.0706 8.05556 19.9583 8.05556C18.8461 8.05556 17.9444 9.31787 17.9444 10.875C17.9444 12.4321 18.8461 13.6944 19.9583 13.6944Z",
                  fill: "#222222"
                })
              ]
            }
          )
        )
      case o.Neutral:
        return (0, i.jsxs)(
          "svg",
          Object.assign(
            {
              width: "30",
              height: "29",
              viewBox: "0 0 30 29",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg"
            },
            {
              children: [
                (0, i.jsx)("path", {
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                  d: "M14.75 28C22.2057 28 28.25 21.9557 28.25 14.5C28.25 7.04503 22.2057 1 14.75 1C7.29506 1 1.25 7.04506 1.25 14.5C1.25 21.9557 7.29503 28 14.75 28ZM14.75 29C22.758 29 29.25 22.508 29.25 14.5C29.25 6.49278 22.758 0 14.75 0C6.74278 0 0.25 6.49278 0.25 14.5C0.25 22.508 6.74278 29 14.75 29Z",
                  fill: "#222222"
                }),
                (0, i.jsx)("path", {
                  d: "M9.51389 16.1111C10.6261 16.1111 11.5278 14.8488 11.5278 13.2917C11.5278 11.7345 10.6261 10.4722 9.51389 10.4722C8.40165 10.4722 7.5 11.7345 7.5 13.2917C7.5 14.8488 8.40165 16.1111 9.51389 16.1111Z",
                  fill: "#222222"
                }),
                (0, i.jsx)("path", {
                  d: "M19.9861 16.1111C21.0984 16.1111 22 14.8488 22 13.2917C22 11.7345 21.0984 10.4722 19.9861 10.4722C18.8739 10.4722 17.9722 11.7345 17.9722 13.2917C17.9722 14.8488 18.8739 16.1111 19.9861 16.1111Z",
                  fill: "#222222"
                }),
                (0, i.jsx)("path", {
                  d: "M20.3889 20.9444H9.11111C8.66645 20.9444 8.30556 20.5844 8.30556 20.1389C8.30556 19.6934 8.66645 19.3333 9.11111 19.3333H20.3889C20.8344 19.3333 21.1944 19.6934 21.1944 20.1389C21.1944 20.5844 20.8344 20.9444 20.3889 20.9444Z",
                  fill: "#222222"
                })
              ]
            }
          )
        )
      case o.Satisfied:
        return (0, i.jsxs)(
          "svg",
          Object.assign(
            {
              width: "30",
              height: "29",
              viewBox: "0 0 30 29",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg"
            },
            {
              children: [
                (0, i.jsx)("path", {
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                  d: "M15.375 28C22.8308 28 28.875 21.9558 28.875 14.5C28.875 7.04416 22.8308 1 15.375 1C7.91916 1 1.875 7.04416 1.875 14.5C1.875 21.9558 7.91916 28 15.375 28ZM29.875 14.5C29.875 22.5081 23.3831 29 15.375 29C7.36687 29 0.875 22.5081 0.875 14.5C0.875 6.49187 7.36687 0 15.375 0C23.3831 0 29.875 6.49187 29.875 14.5Z",
                  fill: "#222222"
                }),
                (0, i.jsx)("path", {
                  d: "M9.34541 19.028C9.38166 19.1722 10.2863 22.5555 15.375 22.5555C20.4645 22.5555 21.3683 19.1722 21.4046 19.028C21.4489 18.8532 21.3699 18.672 21.2137 18.5817C21.0566 18.4923 20.86 18.5189 20.7303 18.6438C20.715 18.6591 19.1563 20.1389 15.375 20.1389C11.5937 20.1389 10.0342 18.6591 10.0197 18.6446C9.94233 18.568 9.83922 18.5278 9.73611 18.5278C9.66844 18.5278 9.59997 18.5447 9.53794 18.5793C9.38005 18.6695 9.30111 18.8524 9.34541 19.028V19.028Z",
                  fill: "#222222"
                }),
                (0, i.jsx)("path", {
                  d: "M10.5417 13.6944C11.6539 13.6944 12.5556 12.4321 12.5556 10.875C12.5556 9.31787 11.6539 8.05556 10.5417 8.05556C9.42943 8.05556 8.52778 9.31787 8.52778 10.875C8.52778 12.4321 9.42943 13.6944 10.5417 13.6944Z",
                  fill: "#222222"
                }),
                (0, i.jsx)("path", {
                  d: "M20.2083 13.6944C21.3206 13.6944 22.2222 12.4321 22.2222 10.875C22.2222 9.31787 21.3206 8.05556 20.2083 8.05556C19.0961 8.05556 18.1944 9.31787 18.1944 10.875C18.1944 12.4321 19.0961 13.6944 20.2083 13.6944Z",
                  fill: "#222222"
                })
              ]
            }
          )
        )
      case o.Happy:
        return (0, i.jsxs)(
          "svg",
          Object.assign(
            {
              width: "30",
              height: "29",
              viewBox: "0 0 30 29",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg"
            },
            {
              children: [
                (0, i.jsx)("path", {
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                  d: "M15 28C22.4558 28 28.5 21.9558 28.5 14.5C28.5 7.04416 22.4558 1 15 1C7.54416 1 1.5 7.04416 1.5 14.5C1.5 21.9558 7.54416 28 15 28ZM29.5 14.5C29.5 22.5081 23.0081 29 15 29C6.99187 29 0.5 22.5081 0.5 14.5C0.5 6.49187 6.99187 0 15 0C23.0081 0 29.5 6.49187 29.5 14.5Z",
                  fill: "#222222"
                }),
                (0, i.jsx)("path", {
                  d: "M8.97042 19.028C9.00667 19.1722 9.9113 22.5555 15 22.5555C20.0895 22.5555 20.9933 19.1722 21.0296 19.028C21.0739 18.8532 20.9949 18.672 20.8387 18.5817C20.6816 18.4923 20.485 18.5189 20.3553 18.6438C20.34 18.6591 18.7813 20.1389 15 20.1389C11.2187 20.1389 9.65917 18.6591 9.64467 18.6446C9.56733 18.568 9.46422 18.5278 9.36111 18.5278C9.29344 18.5278 9.22497 18.5447 9.16294 18.5793C9.00505 18.6695 8.92611 18.8524 8.97042 19.028V19.028Z",
                  fill: "#222222"
                }),
                (0, i.jsx)("path", {
                  d: "M15 17.6006C12.6107 17.6006 11.0246 17.3218 9.06388 16.9408C8.61519 16.8554 7.74438 16.9408 7.74438 18.2603C7.74438 20.8985 10.7757 24.1965 15 24.1965C19.2244 24.1965 22.2557 20.8985 22.2557 18.2603C22.2557 16.9408 21.3841 16.8546 20.9362 16.9408C18.9754 17.3218 17.3901 17.6006 15 17.6006Z",
                  fill: "#222222"
                }),
                (0, i.jsx)("path", {
                  d: "M10.1667 13.6944C11.2789 13.6944 12.1806 12.4321 12.1806 10.875C12.1806 9.31787 11.2789 8.05556 10.1667 8.05556C9.05443 8.05556 8.15278 9.31787 8.15278 10.875C8.15278 12.4321 9.05443 13.6944 10.1667 13.6944Z",
                  fill: "#222222"
                }),
                (0, i.jsx)("path", {
                  d: "M19.8333 13.6944C20.9456 13.6944 21.8472 12.4321 21.8472 10.875C21.8472 9.31787 20.9456 8.05556 19.8333 8.05556C18.7211 8.05556 17.8194 9.31787 17.8194 10.875C17.8194 12.4321 18.7211 13.6944 19.8333 13.6944Z",
                  fill: "#222222"
                })
              ]
            }
          )
        )
    }
  }
}

const { MODEL_RATING: P } = PhraseKey.WORKSHOP,
  x = Object.values(E)
class k extends c.Component {
  constructor(e) {
    super(e),
      (this.submitCurrentRating = (e = !1) => {
        const { currentQuestionId: t } = this.state
        let n = {}
        switch (t) {
          case E.QUALITY:
            n = {
              quality: this.state.quality
            }
            break
          case E.NAVIGATION:
            n = {
              navigation: this.state.navigation
            }
            break
          case E.FEEDBACK:
            ;(n = {
              feedback: this.state.feedback
            }),
              this.resetValues()
        }
        n && this.context.commandBinder.issueCommand(new SubmitModelRatingCommand(n, e))
      }),
      (this.resetValues = () => {
        this.setState({
          happiness: void 0,
          quality: void 0,
          navigation: void 0,
          feedback: void 0
        })
      }),
      (this.hasPerfectHappinessRating = () => 5 === this.state.happiness),
      (this.handleButtonClick = () => {
        const { currentQuestionId: e } = this.state
        let t
        switch ((this.submitCurrentRating(e === E.FEEDBACK), e)) {
          case E.QUALITY:
            t = E.NAVIGATION
            break
          case E.NAVIGATION:
            t = E.FEEDBACK
        }
        t &&
          this.setState({
            currentQuestionId: t
          })
      }),
      (this.handleHappinessClick = e => {
        this.context.commandBinder.issueCommand(
          new SubmitModelRatingCommand({
            happiness: e
          })
        ),
          5 !== e
            ? this.setState({
                happiness: e,
                currentQuestionId: E.QUALITY
              })
            : this.submitCurrentRating(!0)
      }),
      (this.handleCheckboxChange = (e, t, n) => {
        const i = n.value,
          s = {},
          r = (this.state[t] || []).slice()
        r.includes(i) ? r.splice(r.indexOf(i), 1) : r.push(i), (s[t] = r), this.setState(s)
      }),
      (this.handleFeedbackChange = e => {
        this.setState({
          feedback: e
        })
      }),
      (this.handleClose = () => {
        this.context.commandBinder.issueCommand(new ToggleModelRatingDialogCommand(!1))
      }),
      (this.renderProgress = () => {
        const { locale: e } = this.context,
          { currentQuestionId: t } = this.state
        if (!t) return null
        if (t === E.HAPPINESS || this.hasPerfectHappinessRating()) return
        const n = x.indexOf(t)
        return (0, i.jsx)(
          "span",
          Object.assign(
            {
              className: "model-rating-progress"
            },
            {
              children: e.t(P.PROGRESS, {
                "current-question-number": n,
                "max-question-number": x.length - 1
              })
            }
          )
        )
      }),
      (this.state = {
        currentQuestionId: S
      })
  }
  componentWillUnmount() {
    this.submitCurrentRating(), this.context.commandBinder.issueCommand(new ToggleModelRatingDialogCommand(!1))
  }
  renderCurrentQuestion() {
    const { locale: e } = this.context,
      { currentQuestionId: t, happiness: n } = this.state
    if (t === E.FEEDBACK)
      return (0, i.jsx)(
        "div",
        Object.assign(
          {
            className: "question-type text-entry"
          },
          {
            children: (0, i.jsx)(g.Z, {
              text: this.state.feedback || "",
              label: e.t(P.FEEDBACK_LABEL),
              onInput: this.handleFeedbackChange,
              onDone: this.handleFeedbackChange,
              maxLength: 200,
              rows: 3,
              focusOnMount: !0,
              scrollIntoViewOnMount: !0
            })
          }
        )
      )
    if (t === E.HAPPINESS)
      return (0, i.jsx)(
        "div",
        Object.assign(
          {
            className: "question-type emoji-select"
          },
          {
            children: (0, i.jsx)(v.hE, {
              children: w.map(t =>
                (0, i.jsx)(
                  Ll,
                  {
                    emoji: t,
                    active: n === t.value,
                    onClick: this.handleHappinessClick,
                    label: e.t(t.altText)
                  },
                  t.value
                )
              )
            })
          }
        )
      )
    if (t === E.QUALITY || t === E.NAVIGATION) {
      const n = (t === E.QUALITY ? this.state.quality : this.state.navigation) || [],
        s = _[t]
      return (0, i.jsx)(
        "div",
        Object.assign(
          {
            className: "question-type multi-select"
          },
          {
            children: s.map(s =>
              (0, i.jsx)(
                f.X,
                {
                  enabled: !0,
                  checkboxStyle: f.C.FILTER,
                  onChange: this.handleCheckboxChange,
                  onChangeArgs: [t, s],
                  checked: n.includes(s.value),
                  label: e.t(s.text)
                },
                s.text
              )
            )
          }
        )
      )
    }
    return null
  }
  render() {
    const { locale: e } = this.context,
      { currentQuestionId: t } = this.state,
      n = t === S,
      s = O[t],
      r = T[t],
      a = t === E.FEEDBACK ? P.SAVE : P.NEXT
    return (0, i.jsxs)(
      v.Vq,
      Object.assign(
        {
          className: u("model-rating-dialog", {
            "in-progress": !n
          }),
          onClose: this.handleClose
        },
        {
          children: [
            (0, i.jsx)(m.P, {
              onClose: this.handleClose
            }),
            (0, i.jsxs)(
              "div",
              Object.assign(
                {
                  className: "model-rating-form"
                },
                {
                  children: [
                    (0, i.jsxs)(
                      "div",
                      Object.assign(
                        {
                          className: "model-rating-question"
                        },
                        {
                          children: [
                            (0, i.jsx)(
                              "h3",
                              Object.assign(
                                {
                                  className: "question-title"
                                },
                                {
                                  children: e.t(s)
                                }
                              )
                            ),
                            r &&
                              (0, i.jsx)(
                                "p",
                                Object.assign(
                                  {
                                    className: "question-body"
                                  },
                                  {
                                    children: e.t(r)
                                  }
                                )
                              ),
                            this.renderCurrentQuestion()
                          ]
                        }
                      )
                    ),
                    (0, i.jsxs)(
                      "footer",
                      Object.assign(
                        {
                          className: "model-rating-footer"
                        },
                        {
                          children: [
                            (0, i.jsx)("div", {
                              children:
                                t !== E.HAPPINESS &&
                                (0, i.jsx)(v.zx, {
                                  onClick: this.handleButtonClick,
                                  variant: v.Wu.TERTIARY,
                                  label: e.t(a)
                                })
                            }),
                            this.renderProgress()
                          ]
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
function Ll({ emoji: e, label: t, active: n, onClick: s }) {
  return (0, i.jsx)(
    v.zx,
    Object.assign(
      {
        ariaLabel: t,
        active: n,
        variant: v.Wu.TERTIARY,
        size: "small",
        onClick: () => s(e.value)
      },
      {
        children: (0, i.jsx)(I, {
          icon: e.icon
        })
      }
    )
  )
}
function C() {
  const e = a(),
    t = (0, l.B)()
  return !e || t ? null : (0, i.jsx)(k, {})
}
k.contextType = AppReactContext

export const L = C
