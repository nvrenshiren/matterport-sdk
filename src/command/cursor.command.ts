import { Command } from "../core/command"
export class DisableCursorMeshCommand extends Command {
  /**
   * 禁用光标
   *
   * @param t 禁用光标
   */
  constructor(t: boolean) {
    super()
    this.id = "DISABLE_CURSOR_MESH"
    this.payload = { disable: t }
  }
}
export class SetMouseCursorCommand extends Command {
  /**
   * 设置鼠标光标的样式
   *
   * @param e 鼠标光标的样式，默认为null
   */
  payload: {
    cursor: string | null
  }
  constructor(cursor: string | null) {
    super()
    this.id = "SET_MOUSE_CURSOR"
    this.payload = { cursor }
  }
}
