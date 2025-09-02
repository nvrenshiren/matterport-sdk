import * as a from "./37034"
import * as s from "./37190"
import * as n from "./77230"
import * as r from "./96403"
import { ToolsList } from "../const/tools.const"
export function D() {
  const e = (0, n.A)(),
    t = (0, s.b)(),
    i = (0, a.f)(),
    d = (0, r.B)(),
    c = d === ToolsList.SEARCH || d === ToolsList.LAYERS
  return !!e || (c && t.length > 0) || i.length > 0
}
