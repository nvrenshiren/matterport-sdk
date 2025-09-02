import { ResizeCanvasCommand, ResizeProperty } from "../command/screen.command"
import { ScreenToCanvasPointCommand } from "../command/screen.command"
import { CanvasSymbol } from "../const/symbol.const"
import { Command } from "../core/command"
import { OpenDeferred } from "../core/deferred"
import EngineContext from "../core/engineContext"
import { Module } from "../core/module"
import { CameraData } from "../data/camera.data"
import { CanvasData } from "../data/canvas.data"
import { BaseExceptionError } from "../error/baseException.error"
import { CanvasMessage } from "../message/canvas.message"
import { ContainerResizeMessage } from "../message/container.message"
import { SetCameraDimensionsMessage } from "../message/camera.message"
import { waitRun } from "../utils/func.utils"
declare global {
  interface SymbolModule {
    [CanvasSymbol]: CanvasModule
  }
}
class BlurCanvasCommand extends Command {
  name: string
  constructor(e, t) {
    super()
    this.name = "blur-canvas"
    this.payload = {
      duration: e,
      pixelBlur: t
    }
  }
}
class NoContainerForCanvas extends BaseExceptionError {}
const v = {
  [ResizeProperty.width]: "width",
  [ResizeProperty.height]: "height",
  [ResizeProperty.top]: "top",
  [ResizeProperty.left]: "left"
}

export default class CanvasModule extends Module {
  getNewX: ((e: DOMRect) => number) | (() => number)
  getNewY: ((e: DOMRect) => number) | (() => number)
  getNewWidth: ((e: DOMRect) => number) | (() => number)
  getNewHeight: ((e: DOMRect) => number) | (() => number)
  activeTransitions: string[]
  activeTransitionMap: { left: null; top: null; width: null; height: null }
  onResize: (e: any) => void
  _canvas: HTMLCanvasElement
  onContainerResize: () => void
  transitionDurations: { left: string; top: string; width: string; height: string; filter: string }
  resizeCanvas: (e: any) => Promise<any>
  cameraData: CameraData
  canvasBounds: DOMRect
  engine: EngineContext
  container: Element
  containerBounds: DOMRect
  data: CanvasData
  constructor() {
    super(...arguments)
    this.name = "canvas"
    this.getNewX = () => 0
    this.getNewY = () => 0
    this.getNewWidth = e => e.width
    this.getNewHeight = e => e.height
    this.activeTransitions = []
    this.activeTransitionMap = {
      left: null,
      top: null,
      width: null,
      height: null
    }
    this.onResize = e => {
      e.propertyName in ResizeProperty &&
        (this.resolveActiveTransition(e.propertyName), (this._canvas.style.transitionDuration = this.stringifyTransitionDurations()))
    }
    this.onContainerResize = () => {
      this.transitionDurations.left = this.transitionDurations.top = this.transitionDurations.width = this.transitionDurations.height = "0s"
      this._canvas.style.transitionDuration = this.stringifyTransitionDurations()
      this.applySize()
      this.applyPosition()
      this.activeTransitions.forEach(this.resolveActiveTransition.bind(this))
      this._canvas.style.transitionDuration = this.stringifyTransitionDurations()
    }
    this.resizeCanvas = async e => {
      if (0 !== e.resizeDimensions.length) {
        if (this.cameraData && !this.cameraData.canTransition()) {
          await this.cameraData.transition.promise
        }
        this.activeTransitions.forEach(this.resolveActiveTransition.bind(this))
        e.resizeDimensions.forEach(e => {
          const { property: t, setDimension: n, duration: i = 0 } = e,
            s = v[t],
            r = this._canvas.style[s]
          switch (t) {
            case ResizeProperty.height:
              this.setHeight(n, i)
              break
            case ResizeProperty.width:
              this.setWidth(n, i)
              break
            case ResizeProperty.top:
              this.setY(n, i)
              break
            case ResizeProperty.left:
              this.setX(n, i)
          }
          if (this._canvas.style[s] !== r && i > 0) {
            const e = new OpenDeferred()
            e.then(() => {
              clearTimeout(n)
            })
            const n = setTimeout(() => {
              this.resolveActiveTransition(t)
            }, i + 500)
            ;(this.activeTransitionMap[t] = e), this.activeTransitions.push(t)
          }
        })
        this.hasActiveTransitions() || (this.canvasBounds = this._canvas.getBoundingClientRect())
        return this.getTransitionPromise()
      }
    }
  }
  async init(e, t: EngineContext) {
    this.engine = t
    if (!e.container) throw new NoContainerForCanvas()
    this.container = e.container
    this.container.appendChild(e.canvas)
    this.containerBounds = this.container.getBoundingClientRect()
    this._canvas = e.canvas
    this._canvas.style.position = "absolute"
    this._canvas.style.left = "0"
    this._canvas.style.top = "0"
    this.transitionDurations = {
      left: "0s",
      top: "0s",
      width: "0s",
      height: "0s",
      filter: "0.4s"
    }
    this._canvas.style.transitionProperty = Object.keys(this.transitionDurations).join(",")
    this._canvas.style.transitionDuration = this.stringifyTransitionDurations()
    this.updateTransitions()

    this.bindings.push(
      t.subscribe(ContainerResizeMessage, this.onContainerResize),
      t.commandBinder.addBinding(ResizeCanvasCommand, this.resizeCanvas),
      this.makeTransitionEndSubscription(),
      t.commandBinder.addBinding(ScreenToCanvasPointCommand, async e => this.screenToCanvasPoint(e.x, e.y)),
      t.commandBinder.addBinding(BlurCanvasCommand, this.blur.bind(this))
    )
    for (const e of this.bindings) e.renew()
    this.canvasBounds = this._canvas.getBoundingClientRect()
    this.containerBounds = this.container.getBoundingClientRect()
    this.data = new CanvasData(this.canvasBounds.width, this.canvasBounds.height, this._canvas)
    t.market.register(this, CanvasData, this.data)
    this.cameraData = await this.engine.market.waitForData(CameraData)
  }
  makeTransitionEndSubscription() {
    let e = !1
    return {
      renew: () => {
        e || (this.element.addEventListener("transitionend", this.onResize), (e = !0))
      },
      cancel: () => {
        e && (this.element.removeEventListener("transitionend", this.onResize), (e = !1))
      }
    }
  }
  dispose(e) {
    super.dispose(e)
  }
  get element() {
    return this._canvas
  }
  get width() {
    return this.canvasBounds.width
  }
  get height() {
    return this.canvasBounds.height
  }
  get x() {
    return this.canvasBounds.left
  }
  get y() {
    return this.canvasBounds.top
  }
  onUpdate() {
    const e = this.container.getBoundingClientRect()
    const t = this.containerHasChanged(e)
    t && ((this.containerBounds = e), this.updateTransitions())
    ;(t || this.hasActiveTransitions()) && (this.canvasBounds = this._canvas.getBoundingClientRect())
    const n = this.data.width !== this.width || this.data.height !== this.height
    const i = this.data.x !== this.x || this.data.y !== this.y
    if (n) {
      this.data.width = this.width
      this.data.height = this.height
      this.data.commit()
      this.engine.broadcast(new SetCameraDimensionsMessage(this.width, this.height))
    }
    if (i) {
      this.data.x = this.x
      this.data.y = this.y
      this.data.commit()
      this.engine.broadcast(new CanvasMessage(this.x - this.containerBounds.left, this.y - this.containerBounds.top))
    }
  }
  containerHasChanged(e: DOMRect) {
    return (
      e.left !== this.containerBounds.left ||
      e.top !== this.containerBounds.top ||
      e.width !== this.containerBounds.width ||
      e.height !== this.containerBounds.height
    )
  }
  setX(e, t = 0) {
    this.getNewX = "number" == typeof e ? () => e : e
    this.transitionDurations.left = `${t}ms`
    this.updateTransitions()
  }
  setY(e, t = 0) {
    this.getNewY = "number" == typeof e ? () => e : e
    this.transitionDurations.top = `${t}ms`
    this.updateTransitions()
  }
  setWidth(e, t = 0) {
    this.getNewWidth = "number" == typeof e ? () => e : e
    this.transitionDurations.width = `${t}ms`
    this.updateTransitions()
  }
  setHeight(e, t = 0) {
    this.getNewHeight = "number" == typeof e ? () => e : e
    this.transitionDurations.height = `${t}ms`
    this.updateTransitions()
  }
  screenToCanvasPoint(e, t) {
    return {
      x: e - this.x,
      y: t - this.y
    }
  }
  async blur(e) {
    this.transitionDurations.filter = `${e.duration}ms`
    this._canvas.style.transitionDuration = this.stringifyTransitionDurations()
    this._canvas.style.filter = `blur(${e.pixelBlur}px)`
    await waitRun(e.duration)
    0 === e.pixelBlur && (this._canvas.style.filter = "")
  }
  getTransitionPromise() {
    return Promise.all(this.activeTransitions.map(e => this.activeTransitionMap[e]).filter(e => !!e))
  }
  updateTransitions() {
    this._canvas.style.transitionDuration = this.stringifyTransitionDurations()
    this.applySize()
    this.applyPosition()
  }
  applySize() {
    this._canvas.style.width = `${this.getNewWidth(this.containerBounds)}px`
    this._canvas.style.height = `${this.getNewHeight(this.containerBounds)}px`
  }
  applyPosition() {
    this._canvas.style.left = `${this.getNewX(this.containerBounds)}px`
    this._canvas.style.top = `${this.getNewY(this.containerBounds)}px`
  }
  stringifyTransitionDurations() {
    return Object.keys(this.transitionDurations)
      .map(e => this.transitionDurations[e])
      .join(",")
  }
  resolveActiveTransition(e) {
    this.canvasBounds = this._canvas.getBoundingClientRect()
    const t = this.activeTransitions.indexOf(e)
    ;-1 !== t && this.activeTransitions.splice(t, 1)
    const n = this.activeTransitionMap[e]
    n && n.resolve()
    this.activeTransitionMap[e] = null
    this.transitionDurations[e] = "0s"
  }
  hasActiveTransitions() {
    return this.activeTransitions.length > 0
  }
}
