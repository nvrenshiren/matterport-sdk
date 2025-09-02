import { Command } from "../core/command"
import { CubeTexture, Quaternion } from "three"
export class TogglePanoMarkerCommand extends Command {
  constructor(e: boolean) {
    super()
    this.id = "TOGGLE_PANO_MARKER"
    this.payload = { enabled: e }
  }
}
export class SetPanoOverlayCommand extends Command {
  payload: {
    sweepId: string
    texture: CubeTexture
    quaternion: Quaternion
  }
  constructor(sweepId: string, texture: CubeTexture, quaternion: Quaternion) {
    super()
    this.id = "SET_PANO_OVERLAY"
    this.payload = { sweepId, texture, quaternion }
  }
}
