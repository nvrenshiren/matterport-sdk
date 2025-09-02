import { Vector3 } from "three"
import { Command } from "../core/command"

enum MeshColorBy {
  explicit = "explicit",
  random = "random"
}

enum MeshSelectBy {
  all = "all",
  byMeshGroup = "byMeshGroup",
  byMeshSubGroup = "byMeshSubGroup"
}

export class SetMeshOverLayColorCommand extends Command {
  static selectBy: typeof MeshSelectBy
  static colorBy: typeof MeshColorBy
  static COLOR_DIM: { x: number; y: number; z: number; w: number }
  /**
   * 设置网格覆盖颜色
   *
   * @param t 颜色样式配置
   * @param e 选择配置项
   * @param t.style 颜色样式，默认为显式样式（explicit）
   * @param t.color 颜色值，默认为null
   * @param t.alpha 透明度，默认为0.5
   * @param e.style 选择方式，默认为选择所有（all）
   * @param e.index 索引值，默认为null
   */
  constructor(t?: { color: string; style?: string; alpha?: number }, e?: { style: string; index?: number }) {
    super()
    this.id = "SET_MESH_OVERLAY_COLOR"
    this.payload = {
      selectBy: e?.style || MeshSelectBy.all,
      colorStyle: t?.style || MeshColorBy.explicit,
      color: t?.color || null,
      alpha: t?.alpha || 0.5,
      index: e?.index
    }
  }
}
SetMeshOverLayColorCommand.selectBy = MeshSelectBy
SetMeshOverLayColorCommand.colorBy = MeshColorBy
SetMeshOverLayColorCommand.COLOR_DIM = { x: 0, y: 0, z: 0, w: 0.3 }
export class ToggleMeshOverlayColorCommand extends Command {
  /**
   *
   * @param t 布尔值，表示是否启用网格覆盖层颜色
   */
  constructor(t: boolean) {
    super()
    this.id = "TOGGLE_MESH_OVERLAY_COLOR"
    this.payload = { enabled: t }
  }
}
export class MeshPreviewPositionCommand extends Command {
  /**
   *
   * @param e 是否启用预览
   * @param t 预览圆圈的位置
   * @param i 预览圆圈的大小
   */
  payload: {
    enabled: boolean
    previewCirclePosition?: Vector3
    size?: number
  }
  constructor(e: boolean, t?: Vector3, i?: number) {
    super()
    this.id = "MESH_PREVIEW_POSITION"
    this.payload = { enabled: e, previewCirclePosition: t, size: i }
  }
}
