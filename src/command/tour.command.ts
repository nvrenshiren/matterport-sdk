import { Command } from "../core/command"
export class DeleteTourStopCommand extends Command {
  /**
   * 删除导览亮点并暂停
   *
   */
  constructor(e: string[]) {
    super()
    this.id = "DELETE_TOUR_STOP"
    this.payload = {
      sid: e
    }
  }
}

export class MoveTourStopCommand extends Command {
  /**
   * 移动导览亮点并暂停
   * @param e 起始位置的SID
   * @param t 目标位置的SID
   * @param n 需要高亮显示的SID
   */
  constructor(e: string, t: string, n: string) {
    super()
    this.id = "MOVE_TOUR_STOP"
    this.payload = {
      fromSid: e,
      toSid: t,
      highlightedSid: n
    }
  }
}
export class TourStopOverridesCommand extends Command {
  /**
   * 导览路径暂停并覆盖
   *
   * @param e 导览路径亮点ID
   * @param t 覆盖项
   */
  constructor(e: string, t: any) {
    super()
    this.id = "TOUR_STOP_OVERRIDES"
    this.payload = {
      sid: e,
      overrides: t
    }
  }
}
export class TourStopClearOverridesCommand extends Command {
  /**
   * 导览路径暂停并清除覆盖
   *
   * @param e 会话ID
   * @param t 过渡效果
   * @param n 平移参数
   */
  constructor(e: string, t: string, n: number) {
    super()
    this.id = "TOUR_STOP_CLEAR_OVERRIDES"
    this.payload = {
      sid: e,
      transition: t,
      pan: n
    }
  }
}
export class AddPhotosToTourCommand extends Command {
  /**
   * 添加图片到导览路径
   *
   * @param e 图片ID的数组
   */
  constructor(e: string[]) {
    super()
    this.id = "ADD_PHOTOS_TO_TOUR"
    this.payload = {
      photoIds: e
    }
  }
}
export class TourClearAllTransitionTypesCommand extends Command {
  /**
   * 导览路径清除所有过渡类型
   *
   */
  constructor() {
    super(...arguments)
    this.id = "TOUR_CLEAR_ALL_TRANSITION_TYPES"
  }
}
export class TourClearAllPanningSettingsCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "TOUR_CLEAR_ALL_PANNING_SETTINGS"
  }
}
export class TourStopClearAllOverridesCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "TOUR_STOP_CLEAR_ALL_OVERRIDES"
  }
}
export class CreateTourStopCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "CREATE_TOUR_STOP"
  }
}
export class ClearTourCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "CLEAR_TOUR"
  }
}
export class TourSetTourModeCommand extends Command {
  constructor(e: string) {
    super()
    this.id = "TOUR_SET_TOUR_MODE"
    this.payload = {
      tourMode: e
    }
  }
}
export class TourRenameCommand extends Command {
  constructor(e: string, t: string) {
    super()
    this.id = "TOUR_RENAME"
    this.payload = {
      sid: e,
      name: t
    }
  }
}
export class TourChangeTitleCommand extends Command {
  constructor(e: string, t: string) {
    super()
    this.id = "TOUR_CHANGE_TITLE"
    this.payload = {
      sid: e,
      title: t
    }
  }
}
export class TourChangeDescriptionCommand extends Command {
  constructor(e: string, t: string) {
    super()
    this.id = "TOUR_CHANGE_DESCRIPTION"
    this.payload = {
      sid: e,
      description: t
    }
  }
}
export class HighlightReelToggleOpenCommand extends Command {
  static id: string
  /**
   * 导览路径亮点列表打开或关闭
   *
   * @param e 是否打开
   */
  constructor(e: boolean) {
    super()
    this.payload = {
      open: e
    }
  }
}
HighlightReelToggleOpenCommand.id = "HIGHLIGHT_REEL_TOGGLE_OPEN"
export class HighlightReelShowStoryTextCommand extends Command {
  static id: string
  constructor(e: boolean) {
    super()
    this.payload = {
      show: e
    }
  }
}
HighlightReelShowStoryTextCommand.id = "HIGHLIGHT_REEL_SHOW_STORY_TEXT"
export class TourStartCommand extends Command {
  /**
   * 导览路径开始播放事件
   *
   * @param id 索引值
   */
  payload: {
    index?: number
    loop?: boolean
    steps?: number
  }
  constructor(e: TourStartCommand["payload"] = {}) {
    super()
    this.id = "TOUR_START"
    this.payload = e
  }
}
export class TourStopCommand extends Command {
  /**
   * 导览路径暂停事件
   *
   * @param id 索引值
   */
  constructor(e = {}) {
    super()
    this.id = "TOUR_STOP"
    this.payload = e
  }
}
export class TourStepCommand extends Command {
  /**
   * 导览路径切换事件
   *
   * @param index 索引值
   * @param instant 是否立即执行，默认为false
   */
  constructor(e: number, t = !1) {
    super()
    this.id = "TOUR_STEP"
    this.payload = {
      index: e,
      instant: t
    }
  }
}
export class TourRelativeCommand extends Command {
  /**
   * @param forward 前进标识
   * @param instant 是否立即执行标识，默认为false
   */
  constructor(e: boolean, t = !1) {
    super()
    this.id = "TOUR_RELATIVE"
    this.payload = {
      forward: e,
      instant: t
    }
  }
}
export class TourNextStepCommand extends Command {
  /**
   * 导览路径切换下一个
   */
  constructor() {
    super()
    this.id = "TOUR_NEXT_STEP"
  }
}
export class TourPreviousStepCommand extends Command {
  /**
   * 导览路径切换上一个
   */
  constructor() {
    super()
    this.id = "TOUR_PREVIOUS_STEP"
  }
}
