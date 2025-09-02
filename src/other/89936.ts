import o from "classnames"
import * as s from "react"
import * as n from "react/jsx-runtime"

import * as d from "./38772"
import * as g from "./43415"
import { LinkType } from "./52528"
import * as v from "./6608"
import * as c from "../utils/80361"
import * as h from "./98813"
import { UserSearchCommand } from "../command/users.command"
import { BlockTypeList } from "../const/block.const"
import { KeyboardCode } from "../const/keyboard.const"
import { AppReactContext } from "../context/app.context"

const f = "​"
@d.A
class w extends s.Component {
  constructor(e) {
    super(e),
      (this.emailMention = !1),
      (this.wordToken = null),
      (this.endTokens = { "@": [",", " ", "!", "?", "/", ";", ":", "(", ")"], "#": [",", " ", ".", "!", "?", "/", ";", ":"] }),
      (this.wordElement = null),
      (this.linkElement = null),
      (this.onClickAnchor = e => {
        const t = e.target,
          i = t.dataset.blocktype
        this.props.active
          ? (e.preventDefault(), i === BlockTypeList.LINK && this.prepareLinkForEdit(t))
          : i && this.props.onClickBlock({ blockType: i, text: t.innerText, value: t.dataset.value, id: t.dataset.id }, e)
      }),
      (this.onSelectionChange = () => {
        const e = this.getCurrentRange()
        if (e) {
          this.range = e.cloneRange()
          const t = this.wordElement && null === this.wordElement.parentElement,
            i = !!this.wordElement && this.wordElement !== this.getAnchorFromSelection()
          ;(t || i) && this.wordElement && (this.wordElement.classList.add("link-annotation-active"), this.endWordMatching()), this.insertFocusNodeIfNeeded()
        }
      }),
      (this.addFauxHighlight = () => {
        this.execCommand("backColor", "#ff315840")
      }),
      (this.removeFauxHighlight = () => {
        this.execCommand("backColor", "transparent")
      }),
      (this.isEmailMention = (e = "") => e.lastIndexOf("@") > 0),
      (this.onInput = e => {
        var t
        const i = e.nativeEvent,
          n = i.inputType,
          s = n.startsWith("insert"),
          a = "insertLineBreak" === n,
          o = i.data,
          r = this.startTokens
        e.stopPropagation()
        const { isLinkNode: d, isSpecialNode: c, anchorNode: l } = this.tryGetAnchorNode()
        if (r.length && !d && !a) {
          let a = o && o.length > 0 ? o.charAt(o.length - 1) : ""
          const d = this.getTextElement(),
            h = ((null == d ? void 0 : d.innerText) || "").trim().length
          if (
            (d && n.startsWith("delete") && 0 === h && (d.innerHTML = ""),
            this.updateWordElement(i, c, l),
            !this.wordToken && r.includes(a)
              ? (e.preventDefault(), (this.wordToken = a), (this.emailMention = !1), this.createWordElement(a), this.updateSuggestions())
              : !this.wordToken &&
                o &&
                o.length > 1 &&
                r.includes(o[0]) &&
                (e.preventDefault(),
                (this.wordToken = o[0]),
                (a = o[o.length - 1]),
                (this.emailMention = this.isEmailMention(o)),
                this.createWordElement(o),
                this.updateSuggestions()),
            this.wordToken && this.wordElement)
          ) {
            const i = this.wordElement.textContent || "",
              n = this.getMatches(i),
              o = n.length,
              r = null === (t = this.endTokens[this.wordToken]) || void 0 === t ? void 0 : t.includes(a)
            1 === o && this.sanitizeForSearch(i) === this.sanitizeForSearch(n[0].text) && s
              ? (e.preventDefault(), this.chooseMatch(n[0].text, n[0].value, n[0].id))
              : r && "#" === this.wordToken
                ? (e.preventDefault(), this.finishWordElement(!0))
                : r && "@" === this.wordToken
                  ? (e.preventDefault(), this.emailMention ? this.finishWordElement(!0) : 0 === o && this.clearWordElement())
                  : "@" === this.wordToken
                    ? (this.updateUserMatches(), this.isEmailMention(i) && (this.wordElement.classList.add("link-annotation-active"), (this.emailMention = !0)))
                    : this.filterSuggestions()
          }
        }
        this.props.onInput(this.getMarkdown())
      }),
      (this.updateUserMatches = (0, c.D)(() => this.fetchUserMatches(), 350)),
      (this.onClickMatch = e => {
        const t = e.currentTarget
        if (t) {
          const i = t.dataset.value,
            n = t.dataset.id,
            s = t.dataset.text || t.innerText
          e.stopPropagation(), e.preventDefault(), this.chooseMatch(s, i, n)
        }
      }),
      (this.onHoverMatch = e => {
        const t = e.currentTarget
        if (t) {
          const e = parseInt(t.dataset.index || "0", 10)
          this.setState({ activeMatch: e })
        }
      }),
      (this.onClick = e => {
        const { active: t, clickToEdit: i, onStartEditing: n } = this.props
        t ? (this.removeFauxHighlight(), (this.range = null)) : i && n && n(e)
      }),
      (this.handleFocus = () => {
        const { onFocusChange: e } = this.props
        e && e(!0)
      }),
      (this.onBlur = () => {
        this.endWordMatching(), this.setState({ sortedSuggestions: [] })
        const { onFocusChange: e } = this.props
        e && e(!1)
      }),
      (this.onDone = () => {
        const { onDoneEditing: e } = this.props
        e ? e() : this.toggleEditing(!1)
      }),
      (this.onKeyDown = e => {
        const { onCancelEditing: t, allowTabbing: i, allowReturnKey: n } = this.props,
          { matches: s, activeMatch: a } = this.state
        e.stopPropagation(), this.range || (this.range = this.getCurrentRange())
        const o = e.which || e.keyCode
        switch (o) {
          case KeyboardCode.ESCAPE:
            return void (t && t())
          case KeyboardCode.TAB:
          case KeyboardCode.RETURN:
            if (s.length && a > -1) e.preventDefault(), this.chooseMatch(s[a].text, s[a].value, s[a].id)
            else {
              const { isSpecialNode: t, anchorNode: s } = this.tryGetAnchorNode()
              if (
                (t && s && this.range && (e.preventDefault(), this.insertAndFocusCharacter(s, !1, "\n​")),
                this.wordToken && (e.preventDefault(), this.finishWordElement(!1, !0)),
                !e.shiftKey)
              ) {
                const t = o === KeyboardCode.TAB && i,
                  s = o === KeyboardCode.RETURN && n
                t || s || (e.preventDefault(), this.onDone())
              }
            }
            return
          case KeyboardCode.DOWNARROW:
            return void (
              s.length &&
              (e.preventDefault(),
              this.setState(e => {
                const t = (e.activeMatch + 1) % s.length
                return this.ensureActiveMatchIsVisible(t), { activeMatch: t }
              }))
            )
          case KeyboardCode.UPARROW:
            return void (
              s.length &&
              (e.preventDefault(),
              this.setState(e => {
                const t = 0 === e.activeMatch ? s.length - 1 : e.activeMatch - 1
                return this.ensureActiveMatchIsVisible(t), { activeMatch: t }
              }))
            )
          case KeyboardCode.B:
          case KeyboardCode.I:
          case KeyboardCode.U:
            if (e.ctrlKey || e.metaKey) return void e.preventDefault()
            break
          case KeyboardCode.BACKSPACE:
          case KeyboardCode.SHIFT:
          case KeyboardCode.CONTROL:
          case KeyboardCode.ALT:
          case KeyboardCode.LEFTARROW:
          case KeyboardCode.RIGHTARROW:
          case KeyboardCode.DELETE:
            return
        }
      }),
      (this.saveRef = e => {
        this.textBox = e
      }),
      (this.bindSuggestionMenuRef = e => {
        this.suggestionMenuRef = e
      }),
      (this.state = { activeMatch: -1, matches: [], sortedSuggestions: [] })
  }
  componentDidMount() {
    this.props.active && this.toggleEditing(!0, this.props.focusOnMount)
  }
  componentWillUnmount() {
    this.toggleEditing(!1), (this.wordElement = null)
  }
  componentDidUpdate(e, t) {
    const { active: i } = this.props
    i !== e.active && this.toggleEditing(i)
  }
  toggleEditing(e, t) {
    this.textBox && this.textBox.toggleEditing(e, t),
      this.endWordMatching(),
      this.setState({ sortedSuggestions: [] }),
      e ? document.addEventListener("selectionchange", this.onSelectionChange) : document.removeEventListener("selectionchange", this.onSelectionChange)
  }
  ensureActiveMatchIsVisible(e) {
    if (!this.suggestionMenuRef) return
    const { scrollTop: t, offsetHeight: i } = this.suggestionMenuRef,
      n = this.suggestionMenuRef.querySelector(`[data-index="${e}"]`)
    if (!n) return
    const { offsetTop: s, offsetHeight: a } = n,
      o = t > s
    if (t + i < s + a || o) {
      const e = o
      n.scrollIntoView(e)
    }
  }
  getTextElement() {
    var e
    return null === (e = this.textBox) || void 0 === e ? void 0 : e.getTextElement()
  }
  focus() {
    this.textBox && this.textBox.focus()
  }
  getMarkdown() {
    const e = this.getTextElement()
    return e ? this.props.textParser.serialize(e) : ""
  }
  hasTextSelected() {
    return !(!this.range || this.range.startOffset === this.range.endOffset)
  }
  createAnchor(e, t) {
    const i = document.createElement("a")
    return (i.href = t), (i.text = this.props.textParser.sanitizeText(e)), i.classList.add(LinkType.LINK), i.setAttribute("data-value", t), i
  }
  prepareLinkForEdit(e) {
    const t = e || this.getAnchorFromSelection()
    let i = ""
    const n = window.getSelection()
    if (n) {
      const e = this.getTextElement()
      t || this.range || !e
        ? (this.addFauxHighlight(), t || (i = this.range ? this.range.toString() : n.toString()))
        : (this.focus(), n.selectAllChildren(e), n.collapseToEnd(), (this.range = n.getRangeAt(0)), (i = this.range.toString()))
    }
    i === f && (i = ""), (this.linkElement = t)
    const s = t ? t.innerText : i,
      a = t ? t.dataset.value || t.href : ""
    this.props.onClickBlock({ blockType: BlockTypeList.LINK, text: s, value: a })
  }
  saveLink(e, t) {
    this.linkElement ? ("" !== t ? this.updateLink(this.linkElement, e, t) : this.unlink(this.linkElement)) : this.linkify(e, t)
  }
  updateLink(e, t, i) {
    const n = this.createAnchor(t, i)
    return (e.href = n.href), (e.text = n.text), e.setAttribute("data-value", i), !0
  }
  cancelLink() {
    this.focus(), this.removeFauxHighlight()
  }
  linkify(e, t) {
    this.removeFauxHighlight(), this.execCommand("createLink", t)
    let i = this.getAnchorFromSelection()
    !i && this.range && ((i = document.createElement("a")), (i.href = t), this.range.insertNode(i)),
      i &&
        ((i.text = e),
        (i.className = `link-annotation ${LinkType.LINK}`),
        i.setAttribute("data-blocktype", BlockTypeList.LINK),
        i.setAttribute("data-value", t),
        (i.onclick = this.onClickAnchor),
        this.insertAndFocusCharacter(i))
  }
  insertAndFocusCharacter(e, t = !1, i = "​") {
    if (((this.range = this.getCurrentRange()), this.range)) {
      const n = document.createTextNode(i),
        s = t ? "setStartBefore" : "setStartAfter",
        a = t ? "setEndBefore" : "setEndAfter"
      this.range[s](e), this.range[a](e), this.range.insertNode(n), this.range.selectNodeContents(n), i !== f && this.range.collapse(!1), this.applyRange()
    }
  }
  unlink(e) {
    const t = e.parentNode,
      i = e.textContent
    t && (t.removeChild(e), i && !(0, h.j)(i) && this.execCommand("insertText", i))
  }
  execCommand(e, t) {
    this.range && (this.applyRange(), document.execCommand(e, !1, t), this.onSelectionChange())
  }
  applyRange() {
    if (this.range) {
      const e = window.getSelection()
      e && (e.removeAllRanges(), e.addRange(this.range))
    }
  }
  getAnchorFromSelection() {
    const e = this.getCurrentRange()
    if (!e) return null
    let t = e.commonAncestorContainer
    for (; t && "A" !== t.nodeName; ) {
      if (t === this.getTextElement()) return null
      t = t.parentNode
    }
    return t || null
  }
  insertFocusNodeIfNeeded() {
    var e, t
    const i = window.getSelection()
    if (!i || !this.range) return
    const { anchorNode: n, isLinkNode: s } = this.tryGetAnchorNode()
    if (n) {
      const a = null !== (t = null === (e = n.textContent) || void 0 === e ? void 0 : e.length) && void 0 !== t ? t : 0,
        o = 0 === i.focusOffset && a > 0,
        r = null === n.nextSibling && a === i.focusOffset && s
      ;(o || r) && this.insertAndFocusCharacter(n, o)
    }
  }
  getCurrentRange() {
    const e = window.getSelection()
    if (e && e.rangeCount > 0) {
      const t = e.getRangeAt(0),
        i = this.getTextElement()
      if (i && (i === t.commonAncestorContainer || i.compareDocumentPosition(t.commonAncestorContainer) & Node.DOCUMENT_POSITION_CONTAINED_BY)) return t
    }
    return null
  }
  sortWords(e) {
    return e.sort((e, t) => (e.text.toLowerCase() < t.text.toLowerCase() ? -1 : 1))
  }
  tryGetAnchorNode() {
    var e
    const t = this.getAnchorFromSelection()
    if (t && t instanceof HTMLAnchorElement) {
      const i = null === (e = t.dataset) || void 0 === e ? void 0 : e.blocktype,
        n = i === BlockTypeList.USER || i === BlockTypeList.HASH,
        s = i === BlockTypeList.LINK
      return { isSpecialNode: n, isLinkNode: s, anchorNode: n || s ? t : null }
    }
    return { isSpecialNode: !1, isLinkNode: !1, anchorNode: null }
  }
  updateWordElement(e, t, i) {
    const n = e.inputType.startsWith("delete"),
      s = window.getSelection(),
      a = this.startTokens
    if (!this.wordElement || this.wordElement.parentElement) {
      if (t && i && i.parentElement && s) {
        const e = i.textContent || ""
        if (!a.includes(e[0] || "")) return void this.clearWordElement()
        const t = e.substr(0, s.focusOffset),
          o = s && s.focusOffset < e.length,
          r = n || o
        if (
          ((this.wordElement = i),
          (this.wordToken = t[0]),
          (this.emailMention = this.isEmailMention(t)),
          this.updateSuggestions(),
          (this.range = this.getCurrentRange()),
          r && this.range)
        ) {
          this.range.selectNode(i)
          const n = this.range.extractContents()
          if (n && n.firstElementChild && n.firstElementChild instanceof HTMLElement) {
            const i = e.substring(t.length),
              s = document.createTextNode(i)
            ;(n.firstElementChild.innerText = t),
              n.firstElementChild.classList.remove("link-annotation-active"),
              n.firstElementChild.removeAttribute("data-value"),
              n.firstElementChild.removeAttribute("data-id"),
              n.appendChild(s),
              this.range.insertNode(n),
              this.range.setStartBefore(s),
              this.range.setEndBefore(s),
              this.range.collapse(!1),
              this.range.selectNodeContents(this.wordElement),
              this.range.collapse(!1),
              this.applyRange()
          }
        }
      }
    } else this.endWordMatching()
  }
  get startTokens() {
    const { hashtags: e, userMentions: t } = this.props,
      i = []
    return t && i.push("@"), e && i.push("#"), i
  }
  fetchUserMatches() {
    const e = this.wordElement ? this.wordElement.textContent : null
    if (this.props.active && this.wordToken && e) {
      const t = this.sanitizeForSearch(e, !0)
      this.context.commandBinder.issueCommand(new UserSearchCommand(t)).then(() => {
        this.updateSuggestions()
      })
    }
  }
  filterSuggestions() {
    const { wordToken: e, wordElement: t } = this
    if (e && t && t.textContent) {
      const e = this.sanitizeForSearch(t.textContent),
        i = this.getMatches(e),
        n = i.length > 0 ? 0 : -1
      this.setState({ matches: i, activeMatch: n })
    }
  }
  sanitizeForSearch(e = "", t) {
    if (!this.wordToken) return e
    let i = (e.startsWith(this.wordToken) ? e.substr(1) : e).toLowerCase().trim().replace(/\s\s+/g, " ")
    if (t) {
      const e = /([^\s]+)/.exec(i)
      i = (e && e[0]) || ""
    }
    return i
  }
  getMatches(e) {
    const { sortedSuggestions: t = [] } = this.state,
      i = this.sanitizeForSearch(e) || ""
    return 0 === i.length
      ? t
      : t.filter(e => {
          let t = 0 === this.sanitizeForSearch(e.text).indexOf(i)
          return !t && "@" === this.wordToken && e.value && (t = 0 === this.sanitizeForSearch(e.value).indexOf(i)), t
        })
  }
  chooseMatch(e, t, i) {
    const n = this.wordElement
    if (n) {
      const s = this.wordToken && !e.startsWith(this.wordToken) ? this.wordToken : ""
      ;(n.innerText = `${s}${e}`),
        n.classList.add("link-annotation-active"),
        t && n.setAttribute("data-value", t),
        i && n.setAttribute("data-id", i),
        this.finishWordElement(!1, !0),
        this.props.onInput(this.getMarkdown())
    }
  }
  updateSuggestions() {
    const { wordToken: e } = this,
      { hashtags: t, userMentions: i } = this.props
    let n = []
    if ("#" === e && t) n = this.sortWords(t.map(e => ({ text: e, blockType: BlockTypeList.HASH })))
    else if ("@" === e && i) {
      const e = this.context.userData.getKnownUsers()
      n = this.sortWords(e.map(e => ({ text: e.name, id: e.id, value: e.email, blockType: BlockTypeList.USER })))
    }
    this.setState({ sortedSuggestions: n }, this.filterSuggestions)
  }
  endWordMatching() {
    this.setState({ matches: [], activeMatch: -1 }), (this.wordToken = null), (this.wordElement = null), (this.emailMention = !1)
  }
  createWordElement(e) {
    const t = window.getSelection(),
      i = this.range
    if (!i || !t || !this.wordToken) return
    const n = document.createElement("a")
    n.removeAttribute("href"),
      (n.innerText = e),
      "#" === this.wordToken
        ? ((n.className = `link-annotation ${LinkType.HASH}`), n.setAttribute("data-blocktype", BlockTypeList.HASH))
        : "@" === this.wordToken && ((n.className = `link-annotation ${LinkType.USER}`), n.setAttribute("data-blocktype", BlockTypeList.USER))
    const s = i.startContainer,
      a = i.startOffset,
      o = i.endOffset + e.length,
      r = Math.max(0, (s.textContent || "").length)
    try {
      i.setStart(s, Math.min(a, r)), i.setEnd(s, Math.min(o, r))
    } catch (e) {
      i.selectNodeContents(s)
    }
    i.deleteContents(), i.insertNode(n), i.selectNodeContents(n), i.collapse(!1), this.applyRange(), (this.wordElement = n)
  }
  clearWordElement() {
    const e = this.range,
      t = window.getSelection()
    e && t && this.wordElement && this.wordToken && (this.stripAnchorFromNode(this.wordElement), this.endWordMatching())
  }
  stripAnchorFromNode(e) {
    const t = this.range
    if (!t) return
    const i = e.textContent
    if ((this.focus(), t.selectNode(e), t.deleteContents(), t.collapse(!1), i)) {
      const e = document.createTextNode(i)
      t.insertNode(e), t.selectNodeContents(e), t.collapse(!1)
    }
    this.applyRange()
  }
  isValidSpecialWord(e, t) {
    return 0 !== this.sanitizeForSearch(t).length || (this.clearWordElement(), !1)
  }
  finishWordElement(e, t) {
    const { range: i, wordElement: n, wordToken: s } = this,
      a = window.getSelection()
    if (!(i && a && n && s)) return
    ;(n.contentEditable = "true"), n.classList.add("link-annotation-active")
    let o = ""
    const r = n.textContent
    if (this.isValidSpecialWord(s, r || "")) {
      if ((e && r && r.length > 1 ? ((o = r.charAt(r.length - 1)), (n.textContent = r.slice(0, -1))) : t && (o = " "), this.focus(), i.setStartAfter(n), o)) {
        const e = document.createTextNode(o)
        i.insertNode(e), i.selectNodeContents(e), i.collapse(!1)
      }
      this.applyRange(), this.endWordMatching()
    } else this.clearWordElement()
  }
  renderMatch(e, t) {
    const { activeMatch: i } = this.state,
      s = t === i,
      a = e.blockType === BlockTypeList.USER,
      r = a && e.value ? this.context.userData.getUserDisplay(e.value) : null,
      d = a ? e.value : void 0,
      c = `${e.text}-${t}`
    return (0, n.jsxs)(
      "div",
      Object.assign(
        {
          className: o("suggestion", { selected: s }),
          onMouseDown: this.onClickMatch,
          onMouseEnter: this.onHoverMatch,
          "data-value": e.value,
          "data-id": e.id,
          "data-text": e.text,
          "data-index": t
        },
        {
          children: [
            a && r && (0, n.jsx)(v.C, { badgeStyle: { color: r.color, borderColor: r.color, backgroundColor: "transparent" }, label: r.initials }),
            (0, n.jsx)("span", Object.assign({ className: "suggestion-text" }, { children: e.text })),
            d && (0, n.jsxs)("p", Object.assign({ className: "suggestion-hint" }, { children: ["(", d, ")"] }))
          ]
        }
      ),
      c
    )
  }
  renderMatches() {
    if (!this.props.active) return null
    const { matches: e } = this.state,
      t = e.length > 0
    return (0, n.jsx)(
      "div",
      Object.assign(
        { className: o("suggestion-menu", { open: t }), ref: this.bindSuggestionMenuRef },
        { children: t && e.map((e, t) => this.renderMatch(e, t)) }
      )
    )
  }
  render() {
    const { text: e, textParser: t, clickToEdit: i, placeholder: s, tabIndex: a, className: r, active: d } = this.props
    return (0, n.jsxs)(
      "div",
      Object.assign(
        { className: o("smart-text-box", r) },
        {
          children: [
            (0, n.jsx)(g.Z, {
              ref: this.saveRef,
              text: e,
              textParser: t,
              active: d,
              placeholder: s,
              tabIndex: a,
              clickToEdit: i && !d,
              onClick: this.onClick,
              onInput: this.onInput,
              onKeyDown: this.onKeyDown,
              onBlur: this.onBlur,
              onFocus: this.handleFocus,
              onClickAnchor: this.onClickAnchor
            }),
            this.renderMatches()
          ]
        }
      )
    )
  }
}
w.contextType = AppReactContext

export const b = w
