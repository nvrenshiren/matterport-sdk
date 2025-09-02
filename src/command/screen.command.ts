import { Command } from "../core/command"
export class ScreenToCanvasPointCommand extends Command {
  name: string
  constructor(e: any) {
    super()
    this.name = "screen-to-canvas-point"
    this.payload = Object.assign({}, e)
  }
}
export enum ResizeProperty {
  left = "left",
  top = "top",
  width = "width",
  height = "height"
}
export interface ResizeDimensions {
  property: ResizeProperty
  setDimension: (e?: any) => number
  duration: number
}

export class ResizeCanvasCommand extends Command {
  name: string
  /**
   * canvas的尺寸改变命令
   * @param name 默认resize-canvas
   */
  constructor(e: { resizeDimensions: ResizeDimensions[] }) {
    super()
    this.name = "resize-canvas"
    this.payload = Object.assign({}, e)
  }
}
