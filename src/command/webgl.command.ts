import { Command } from "../core/command"
import { RenderingMode } from "../const/22533"
import { RenderTarget } from "../modules/renderToTexture.module"
import { Texture } from "three"
export class SetChunkRenderModeCommand extends Command {
  static modes = RenderingMode
  payload: {
    mode: RenderingMode | null
  }
  constructor(e: RenderingMode | null) {
    super()
    this.id = "SET_CHUNK_RENDER_MODE"
    this.payload = { mode: e }
  }
}
export class RequestRenderTargetCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "RequestRenderTargetCommand"
  }
}
export class RequestRenderContextCommand extends Command {
  constructor(e: RenderTarget, t: string) {
    super()
    this.payload = {
      renderTarget: e,
      context: t
    }
  }
}
export class RequestRenderCameraCommand extends Command {
  constructor(e: RenderTarget, t: any, n: any) {
    super()
    this.payload = {
      renderTarget: e,
      sceneObject: t,
      camera: n
    }
  }
}
export class RequestRenderTargetCameraCommand extends Command {
  constructor(e: RenderTarget, t: any, n: any) {
    super()
    this.payload = {
      renderTarget: e,
      sceneObject: t,
      camera: n
    }
  }
}
export class RequestRenderTargetHeadingCommand extends Command {
  constructor(e: RenderTarget, t: Texture, n = 0) {
    super()
    this.payload = {
      renderTarget: e,
      texture: t,
      heading: n
    }
  }
}
export class RequestTargetCommand extends Command {
  constructor(e: string, t: string) {
    super()
    this.payload = {
      target1: e,
      target2: t
    }
  }
}
export class WorldPositionChangeCommand extends Command {
  constructor(e: { worldPosition: number }) {
    super()
    this.payload = Object.assign({}, e)
  }
}
