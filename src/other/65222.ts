import * as r from "./21149"
import { toDate } from "../utils/date.utils"
import { AttachmentCategory } from "../const/32347"
import { DebugInfo } from "../core/debug"
import { ExpiringResource } from "../utils/expiringResource"
import { AttachmentsObject } from "../object/attachments.object"
const FileAttachmentDeserializer = new DebugInfo("file-attachment-deserializer")
export class FileDeserializer {
  constructor() {}
  deserialize(e) {
    if (!e || !this.validate(e)) return FileAttachmentDeserializer.debug("Deserialized invalid file attachment data from MDS", e), null
    const t = new AttachmentsObject()
    return (
      (t.id = e.id),
      (t.created = toDate(e.created)),
      e.mimeType && ((t.mimeType = e.mimeType), (t.mediaType = (0, r.id)(e.mimeType))),
      (t.category = AttachmentCategory.UPLOAD),
      (t.thumbnailUrl = new ExpiringResource(e.url || "", toDate(e.validUntil, null))),
      (t.url = new ExpiringResource(e.url || "", toDate(e.validUntil, null))),
      (t.filename = e.filename || ""),
      (t.bytes = e.bytes || 0),
      (t.width = e.imageWidth || 0),
      (t.height = e.imageHeight || 0),
      t
    )
  }
  validate(e) {
    if (!e) return !1
    return ["id", "created", "url", "mimeType", "filename"].every(t => t in e)
  }
}
export const CreateFileDeserializer = function () {
  return new FileDeserializer()
}
