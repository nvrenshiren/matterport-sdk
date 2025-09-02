import * as a from "../other/21149"
import { toDate } from "../utils/date.utils"
import { AttachmentCategory } from "../const/32347"
import { DebugInfo } from "../core/debug"
import { ExpiringResource } from "../utils/expiringResource"
import { AttachmentsObject } from "../object/attachments.object"
const ExternalAttachmentDeserializer = new DebugInfo("external-attachment-deserializer")
export class EmbedDeserializer {
  constructor() {}
  deserialize(e) {
    if (!e || !this.validate(e)) return ExternalAttachmentDeserializer.debug("Deserialized invalid external attachment data from MDS", e), null
    const t = new AttachmentsObject()
    return (
      (t.id = e.id),
      (t.created = toDate(e.created)),
      (t.src = e.url || ""),
      (t.thumbnailUrl = new ExpiringResource(e.thumbnailUrl || "", toDate(e.validUntil, null))),
      (t.url = new ExpiringResource(e.url || "", toDate(e.validUntil, null))),
      e.mediaType && (t.mediaType = (0, a.bY)(e.mediaType)),
      (t.category = AttachmentCategory.EXTERNAL),
      e.width && (t.width = e.width),
      e.height && (t.height = e.height),
      (t.parentType = e.parentDetails.type),
      (t.parentId = e.parentDetails.parent.id),
      t
    )
  }
  validate(e) {
    if (!e) return !1
    const t = ["id", "created", "modified", "mediaType", "parentDetails"].filter(t => !(t in e)),
      n = 0 === t.length
    return (
      n ||
        ExternalAttachmentDeserializer.debug("Attachment invalid:", {
          missingFields: t
        }),
      n
    )
  }
}
export const CreateEmbedDeserializer = function () {
  return new EmbedDeserializer()
}
