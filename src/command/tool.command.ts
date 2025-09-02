import { ToolObject } from "../object/tool.object"
import { Command } from "../core/command"
export class ToolPanelToggleCollapseCommand extends Command {
  static id: string
  constructor(e: boolean) {
    super()
    this.payload = {
      collapse: e
    }
  }
}
ToolPanelToggleCollapseCommand.id = "TOOL_PANEL_TOGGLE_COLLAPSE"
export class ToolBottomPanelCollapseCommand extends Command {
  static id: string
  /**
   * 底部面板是否展开
   *
   * @param e 底部面板是否展开
   */
  constructor(e: boolean) {
    super()
    this.payload = {
      collapse: e
    }
  }
}
ToolBottomPanelCollapseCommand.id = "TOOL_BOTTOM_PANEL_COLLAPSE"
export class ToggleToolCommand extends Command {
  static id: string
  /**
   * 切换工具栏
   *
   * @param e 工具名称
   * @param t 切换该工具
   */
  payload: {
    toolName: string
    active: boolean
  }
  constructor(toolName: string, active: boolean) {
    super()
    this.payload = {
      toolName,
      active
    }
  }
}
ToggleToolCommand.id = "TOGGLE_TOOL"
export class CloseRemoveToolsCommand extends Command {
  static id: string
  constructor(e: boolean) {
    super()
    this.payload = {
      checkForEdits: e
    }
  }
}
CloseRemoveToolsCommand.id = "CLOSE_REMOVE_TOOLS"
export class RegisterToolsCommand extends Command {
  /**
   * 注册工具栏
   * @param e 工具对象
   */
  payload: {
    tools: ToolObject[]
  }
  static id: string
  constructor(e: ToolObject[]) {
    super()
    this.payload = {
      tools: e
    }
  }
}
RegisterToolsCommand.id = "REGISTER_TOOLS"
export class OpenPreviousToolCommand extends Command {
  static id: string
}
OpenPreviousToolCommand.id = "OPEN_PREVIOUS_TOOL"
export class OpenInitialToolCommand extends Command {
  static id: string
}
OpenInitialToolCommand.id = "OPEN_INITIAL_TOOL"
export class OpenToolCommand extends Command {
  static id: string
  /**
   * 打开工具栏
   *
   * @param e 工具名称
   * @param t 是否打开，默认为 false
   */
  constructor(e: string, t = !1) {
    super()
    this.payload = {
      toolName: e,
      softOpening: t
    }
  }
}
OpenToolCommand.id = "OPEN_TOOL"
export class CloseCurrentToolCommand extends Command {
  static id: string
}
CloseCurrentToolCommand.id = "CLOSE_CURRENT_TOOL"
export class CloseToolCommand extends Command {
  static id: string
  /**
   * 关闭侧边栏
   *
   * @param e 工具名称  //如："TAGS"
   */
  constructor(e: string) {
    super()
    this.payload = {
      toolName: e
    }
  }
}
CloseToolCommand.id = "CLOSE_TOOL"
