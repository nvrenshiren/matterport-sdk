import { WebGL1Renderer, WebGLRenderer } from "three"
import Engine from "./engine"

export default class EngineTick {
  engine: Engine
  renderer: WebGLRenderer | WebGL1Renderer
  onErrorCallback: Function
  start: () => void
  stop: () => void
  tick: () => void
  constructor(e, t, n) {
    this.engine = e
    this.renderer = t
    this.onErrorCallback = n
    this.start = () => {
      this.renderer.setAnimationLoop(this.tick)
    }
    this.stop = () => {
      this.renderer.setAnimationLoop(null)
    }
    this.tick = () => {
      try {
        this.engine.tick()
      } catch (e) {
        this.stop()
        this.onErrorCallback(e)
      }
    }
  }
}
