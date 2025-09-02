import * as i from "react"
import { deepDiffers } from "../utils/object.utils"
function r(e) {
  if (!e.prototype || !e.prototype.render) return e.__scuWrap || (e.__scuWrap = o(e, u))
  e.prototype.shouldComponentUpdate = c
}
function a(e) {
  if (!e.prototype || !e.prototype.render) return e.__scuWrap || (e.__scuWrap = o(e, deepDiffers))
  e.prototype.shouldComponentUpdate = d
}
function o(e, t) {
  class n extends l {}
  return (n.prototype.renderChild = e), (n.prototype.diffFunc = t), n
}
class l extends i.Component {
  shouldComponentUpdate(e) {
    return this.diffFunc(e, this.props)
  }
  render() {
    return this.renderChild(this.props, this.context)
  }
}
function c(e, t) {
  return u(e, this.props) || u(t, this.state)
}
function d(e, t) {
  return u(e, this.props) || deepDiffers(t, this.state)
}
function u(e, t) {
  for (const n in e) if (e[n] !== t[n]) return !0
  for (const n in t) if (!(n in e)) return !0
  return !1
}
export const A = a
export const Z = r
