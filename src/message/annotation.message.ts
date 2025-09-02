import { Message } from "../core/message"
import { LabelObject } from "../object/label.object"

enum DetailType {
  LABEL = "Label"
}

class AnnotationDetailsMessage extends Message {
  details: LabelObject
  type: DetailType
  constructor(e: LabelObject) {
    super()
    this.details = e
    this.type = DetailType.LABEL
  }
}
export class AnnotationAddMessage extends AnnotationDetailsMessage {}
export class AnnotationCanceled extends AnnotationDetailsMessage {}
export class AnnotationPlaced extends AnnotationDetailsMessage {
  position: number[]
  constructor(e: LabelObject, t: number[]) {
    super(e)
    this.details = e
    this.position = t
  }
}
export class AnnotationRemove extends AnnotationDetailsMessage {}
export class AnnotationText extends AnnotationDetailsMessage {}
export class FocusLabelEditorMessage extends Message {
  type: string
  constructor() {
    super(...arguments)
    this.type = "FocusLabelEditorMessage"
  }
}
export class AnnotationAttachmentClickedMessage extends Message {
  annotationType: number
  id: string
  attachmentId: string
  constructor(e: number, t: string, n: string) {
    super()
    this.annotationType = e
    this.id = t
    this.attachmentId = n
  }
}
export class AnnotationBlockClickedMessage extends Message {
  block: number
  id: string
  annotationType: string
  constructor(e: string, t: string, n: number) {
    super()
    this.block = n
    this.id = t
    this.annotationType = e
  }
}
