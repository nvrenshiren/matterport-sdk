import { Command } from "../core/command"
export class DefaultErrorCommand extends Command {
  /**
   * @param e 错误消息键
   * @param t 错误选项
   */
  constructor(e: string, t: { throttle: number; timeout?: number; type: string; error?: any }) {
    super()
    this.id = "DEFAULT_ERROR"
    this.payload = {
      messagePhraseKey: e,
      options: t
    }
  }
}
