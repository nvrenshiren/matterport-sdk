import { Vector3 } from "three"
import { Command } from "../core/command"
export class NoneSweepCommand extends Command {}
export class SetFocusSweepCommand extends Command {
  sweepId: string | undefined
  /**
   * 设置获取焦点的点位
   *
   * @param sweepId 点位ID
   */
  constructor(e?: string) {
    super()
    this.sweepId = e
    this.payload = {
      sweepId: e
    }
  }
}
export class SelectSweepCommand extends Command {
  /**
   * 选中点位命令
   *
   * @param id 点位ID
   * @param selected 是否被选中
   * @param duration 持续时间，默认为500毫秒
   */
  constructor(e: string, t: boolean, n = 500) {
    super()
    this.id = "SELECT_SWEEP"
    this.payload = {
      id: e,
      selected: t,
      duration: n
    }
  }
}
export class HoverSweepCommand extends Command {
  /**
   * 滑过点位圆圈命令
   *
   * @param id 点位ID
   * @param hovered 是否处于悬停状态
   * @param duration 悬停持续时间的默认值，默认为500毫秒
   */
  constructor(e: string, t: boolean, n = 500) {
    super()
    this.id = "HOVER_SWEEP"
    this.payload = {
      id: e,
      hovered: t,
      duration: n
    }
  }
}
export class ModifySweepNeighborsCommand extends Command {
  /**
   * 修改相邻点位命令
   *
   * @param id 唯一标识
   * @param added 添加的数组，默认为空数组
   * @param removed 移除的数组，默认为空数组
   */
  constructor(e: string, t: string[] = [], n: string[] = []) {
    super()
    this.id = "MODIFY_SWEEP_NEIGHBORS"
    this.payload = {
      id: e,
      added: t,
      removed: n
    }
  }
}
export class ToggleNonPanoCurrentPuckCommand extends Command {
  /**
   * 切换当前点位
   *
   * @param e 控制按钮可见性的布尔值
   */
  constructor(e: boolean) {
    super()
    this.id = "TOGGLE_NON_PANO_CURRENT_PUCK"
    this.payload = {
      visible: e
    }
  }
}
export class EnableSweepSelectionCommand extends Command {
  /**
   * 允许点位选择命令
   *
   */
  constructor() {
    super(...arguments)
    this.id = "ENABLE_SWEEP_SELECTION"
  }
}
export class DisableSweepSelectionCommand extends Command {
  /**
   * 禁止点位选择命令
   * @param arguments 传递给父类的参数（可选）
   */
  constructor() {
    super(...arguments)
    this.id = "DISABLE_SWEEP_SELECTION"
  }
}
export class TogglePuckEditingCommand extends Command {
  payload: {
    enabled: boolean
  }
  constructor(enabled: boolean) {
    super()
    this.id = "TOGGLE_PUCK_EDITING"
    this.payload = { enabled }
  }
}
export class PlaceSweepCommand extends Command {
  /**
   * 放置点位事件
   *
   * @param e 点位ID
   * @param t 点位位置
   * @param n 楼层ID
   */
  constructor(e: string, t: Vector3, n: string) {
    super()
    this.id = "PLACE_SWEEP"
    this.payload = {
      sweepId: e,
      pos: t,
      floorId: n
    }
  }
}
export class UnplaceSweepCommand extends Command {
  /**
   * 取消放置点位命令
   *
   * @param e 点位ID
   */
  constructor(e: string) {
    super()
    this.id = "UNPLACE_SWEEP"
    this.payload = {
      sweepId: e
    }
  }
}
export class RenameSweepCommand extends Command {
  /**
   * 重命名点位命令
   *
   * @param e 点位ID
   * @param t 点位名称
   */
  constructor(e: string, t: string) {
    super()
    this.id = "RENAME_SWEEP"
    this.payload = {
      sweepId: e,
      name: t
    }
  }
}
export class ToggleSweepCommand extends Command {
  /**
   *
   * @param enabled 点位是否启用
   * @param sweepIds 可变参数列表，包含需要切换的 sweepIds
   */
  constructor(enabled: boolean, ...sweepIds: string[]) {
    super()
    this.id = "TOGGLE_SWEEP"
    this.payload = {
      sweepIds,
      enabled
    }
  }
}
export class ToggleSweepNumbersCommand extends Command {
  /**
   * 切换点位数是否可见
   *
   * @param e 是否启用
   */
  constructor(e: boolean) {
    super()
    this.id = "TOGGLE_SWEEP_NUMBERS"
    this.payload = {
      enabled: e
    }
  }
}
export class InitRotateSweepCommand extends Command {
  /**
   * 初始化旋转点位
   *
   * @param e 点位ID
   */
  constructor(e: string) {
    super()
    this.id = "INIT_ROTATE_SWEEP"
    this.payload = {
      sweepId: e
    }
  }
}
export class EndRotateSweepCommand extends Command {
  /**
   * 点位停止旋转
   *
   * @param e 点位ID
   */
  constructor(e: string) {
    super()
    this.id = "END_ROTATE_SWEEP"
    this.payload = {
      sweepId: e
    }
  }
}
export class InitPinConnectionCommand extends Command {
  constructor(e: any) {
    super()
    this.id = "INIT_PIN_CONNECTION"
    this.payload = {
      collider: e
    }
  }
}
export class MovePinConnectionCommand extends Command {
  constructor(e: any) {
    super()
    this.id = "MOVE_PIN_CONNECTION"
    this.payload = {
      collider: e
    }
  }
}
export class EndPinConnectionCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "END_PIN_CONNECTION"
  }
}
export class FinRotateSweepCommand extends Command {
  /**
   * 点位完成旋转
   *
   * @param e 点位ID
   */
  constructor(e: string) {
    super()
    this.id = "FIN_ROTATE_SWEEP"
    this.payload = {
      sweepId: e
    }
  }
}
import { PanoSizeKey } from "../const/76609"

export class SetEavPanoSizeCommand extends Command {
  payload: {
    navSize: PanoSizeKey
  }
  constructor(navSize: PanoSizeKey) {
    super()
    this.id = "SET_NAV_PANO_SIZE"
    this.payload = { navSize }
  }
}
