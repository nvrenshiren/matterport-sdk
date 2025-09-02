import { Texture } from "three"
import { Data } from "../core/data"
import { AnimationProgress } from "../webgl/animation.progress"
export class CursorData extends Data {
  name: string
  opacity: AnimationProgress
  texture: null | Texture
  constructor() {
    super()
    this.name = "cursor"
    this.opacity = new AnimationProgress(0)
    this.texture = null
  }
}
