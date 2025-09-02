import * as s from "react/jsx-runtime"
import * as r from "./66102"
import * as o from "./84426"
import { PhraseKey } from "../const/phrase.const"
function n({ room: t }) {
  const e = (0, r.b)().t(PhraseKey.WORKSHOP.ROOMS.ROOM_INACCESSIBLE_INFO)
  return t.accessible()
    ? null
    : (0, s.jsxs)(
        "div",
        Object.assign(
          { className: "room-inaccessible-container" },
          { children: [(0, s.jsx)(o.JO, { name: "public_symbols_exclamation-triangle", size: o.Jh.SMALL }), (0, s.jsx)("div", { children: e })] }
        )
      )
}
export const X = n
