import { AttachmentCategory, MediaTypeList } from "../const/32347"
import { ExpiringResource } from "../utils/expiringResource"
import { ObservableObject } from "../observable/observable.object"
export class AttachmentsObject extends ObservableObject {
  category: string
  mediaType: string
  mimeType: string
  src: string
  height: number
  width: number
  id: string
  url: ExpiringResource
  thumbnailUrl: any
  created: Date
  parentId: string
  parentType: any
  filename: string
  bytes: number
  constructor(e?: Partial<AttachmentsObject>) {
    super()
    this.category = AttachmentCategory.EXTERNAL
    this.mediaType = MediaTypeList.IMAGE
    this.mimeType = ""
    this.src = ""
    this.height = 0
    this.width = 0
    e && Object.assign(this, e)
  }
  copy(e) {
    this.id = e.id
    this.src = e.src
    this.url = e.url
    this.thumbnailUrl = e.thumbnailUrl
    this.height = e.height
    this.width = e.width
    this.created = e.created
    this.category = e.category
    this.mediaType = e.mediaType
    this.parentId = e.parentId || ""
    this.parentType = e.parentType
    this.filename = e.filename
    this.bytes = e.bytes
    this.mimeType = e.mimeType || ""
    return this
  }
}
