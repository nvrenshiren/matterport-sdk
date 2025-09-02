import { Command } from "../core/command"
export class AnnotationDockCommand extends Command {
  constructor(e: string, t: string, n = !1) {
    super()
    this.id = "ANNOTATION_DOCK"
    this.payload = {
      id: e,
      annotationType: t,
      force: n
    }
  }
}
export class AnnotationSelectCommand extends Command {
  /**
   * @param e 备注的ID
   * @param t 备注类型
   * @param n 是否强制，默认为false
   */
  constructor(e: string, t: string, n = !1) {
    super()
    this.id = "ANNOTATION_SELECT"
    this.payload = {
      id: e,
      annotationType: t,
      force: n
    }
  }
}
export class AnnotationPreviewCommand extends Command {
  constructor(e: string, t: string) {
    super()
    this.id = "ANNOTATION_PREVIEW"
    this.payload = {
      id: e,
      annotationType: t
    }
  }
}
export class AnnotationsCloseBillboardCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "ANNOTATIONS_CLOSE_BILLBOARD"
  }
}
export class AnnotationsCloseDockedAnnotationCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "ANNOTATIONS_CLOSE_DOCKED_ANNOTATION"
  }
}
export class AnnotationsCloseAllCommand extends Command {
  /**
   * 关闭所有备注
   *
   * @param e 需要排除的类型
   * @param t 需要排除的ID
   */
  payload: {
    exceptType?: string
    exceptId?: string
  }
  constructor(e?: string, t?: string) {
    super()
    this.id = "ANNOTATIONS_CLOSE_ALL"
    this.payload = {
      exceptType: e,
      exceptId: t
    }
  }
}
export class AnnotationCloseCommand extends Command {
  /**
   * 关闭某个备注
   *
   * @param e 注释的ID
   * @param t 注释的类型
   */
  constructor(e: string, t: string) {
    super()
    this.id = "ANNOTATION_CLOSE"
    this.payload = {
      id: e,
      annotationType: t
    }
  }
}
