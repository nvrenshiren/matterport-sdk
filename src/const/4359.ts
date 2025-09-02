import { Texture } from "three"
import { LoadTexture } from "../utils/loadTexture"

import s from "../images/exterior.png"
import a from "../images/exterior_hover.png"
import o from "../images/interior.png"
import r from "../images/interior_hover.png"
let d: {
  toExteriorTexture: Texture
  toExteriorHoverTexture: Texture
  toInteriorTexture: Texture
  toInteriorHoverTexture: Texture
}
const c = {
  get: () =>
    d ||
    ((d = {
      toExteriorTexture: LoadTexture(s),
      toExteriorHoverTexture: LoadTexture(a),
      toInteriorTexture: LoadTexture(o),
      toInteriorHoverTexture: LoadTexture(r)
    }),
    d)
}

export const P = c
