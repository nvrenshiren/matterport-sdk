export class RenderLayer {
  _mask: number
  constructor(e: number) {
    this._mask = e
  }
  get mask() {
    return this._mask
  }
  addLayers(e: RenderLayer) {
    this._mask |= e.mask
  }
  removeLayers(e: RenderLayer) {
    return (this._mask &= ~e.mask)
  }
  clone() {
    return new RenderLayer(this._mask)
  }
}
export class RenderLayers {
  layerRegistry: string[]
  unusedLayers: number[]
  constructor() {
    this.layerRegistry = []
    this.unusedLayers = []
    for (let e = 1; e < 32; e++) this.unusedLayers.push(e)
  }
  static get ALL() {
    return new RenderLayer(-1)
  }
  static get NONE() {
    return new RenderLayer(0)
  }
  static get DEFAULT() {
    return new RenderLayer(1)
  }
  claimLayer(e: string) {
    const t = this.getLayer(e)
    if (t.mask) return t
    if (0 === this.unusedLayers.length) throw Error("All render layers have already been claimed")
    const n = this.unusedLayers[0]
    this.layerRegistry[n] = e
    this.unusedLayers.shift()
    return new RenderLayer(1 << n)
  }
  getLayer(e: string) {
    const t = this.layerRegistry.indexOf(e)
    return -1 !== t ? new RenderLayer(1 << t) : RenderLayers.NONE
  }
  disposeLayer(e) {
    const t = this.layerRegistry.indexOf(e)
    ;-1 !== t && this.unusedLayers.push(t)
  }
}
