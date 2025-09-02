import { Data } from "../core/data"
export class CanvasData extends Data {
  name: string
  x: number
  y: number
  width: number
  height: number
  canvas: HTMLCanvasElement
  constructor(e: number, t: number, n: HTMLCanvasElement) {
    super()
    this.name = "canvas"
    this.x = 0
    this.y = 0
    this.width = e || 0
    this.height = t || 0
    this.canvas = n || null
  }
  get aspectRatio() {
    const e = this.width / this.height
    return isFinite(e) ? e : 1
  }
}
