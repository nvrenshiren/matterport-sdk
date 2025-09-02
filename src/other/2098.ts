import * as o from "./38613"
import * as a from "./60119"
import { Room } from "../webgl/room"
import * as s from "./1358"
function r() {
  const t = (function () {
    const t = (0, a.d)()
    return (null == t ? void 0 : t.editorState) || null
  })()
  return (0, o.h)(t, "selected", null)
}
function l() {
  const t = (function () {
    const t = (0, s.S)(),
      e = r()
    return e && t ? t.getEntity(e) : null
  })()
  return t && t instanceof Room ? t : null
}

export const n = l
