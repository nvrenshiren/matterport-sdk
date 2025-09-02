export class CreateOffScreenCanvas {
  offScreenCanvas: HTMLCanvasElement
  _context: CanvasRenderingContext2D | null
  constructor(e, t, n) {
    this.offScreenCanvas = document.createElement("canvas")
    this._context = this.offScreenCanvas.getContext("2d")
    "number" == typeof e && "number" == typeof t && this.resize(e, t)
    n && this.applyContextConfig(n)
  }
  resize(e: number, t: number) {
    this.offScreenCanvas.width = e
    this.offScreenCanvas.height = t
  }
  get width() {
    return this.offScreenCanvas.width
  }
  get height() {
    return this.offScreenCanvas.height
  }
  get context() {
    if (!this._context) throw Error("Couldn't create a 2d rendering context")
    return this._context
  }
  applyContextConfig(e: CanvasRenderingContext2D) {
    const t = this.context
    for (const n in e) t[n] = e[n]
  }
}
