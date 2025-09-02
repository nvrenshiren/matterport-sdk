import { Command } from "../core/command"
export class ToggleModelRatingDialogCommand extends Command {
  static id: string
  /**
   * @param e 可见性标志，表示是否将组件设置为可见
   */
  constructor(e: boolean) {
    super()
    this.payload = {
      toVisible: e
    }
  }
}
ToggleModelRatingDialogCommand.id = "TOGGLE_MODEL_RATING_DIALOG"
export class SubmitModelRatingCommand extends Command {
  static id: string
  /**
   * @param e 评分值
   * @param t 是否完成，默认为false
   */
  constructor(e: { happiness?: number }, t = !1) {
    super()
    this.payload = {
      rating: e,
      didFinish: t
    }
  }
}
SubmitModelRatingCommand.id = "SUBMIT_MODEL_RATING"
