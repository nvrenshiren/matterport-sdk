import { BtnText } from "../data/player.options.data"
function s(e) {
  const t = e.tryGetProperty(BtnText.SpaceSearch, 0),
    n = e.getOverrideParam("search", 1)
  return t && !(0 === n)
}

export const J = s
