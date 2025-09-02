import { Color, Vector3 } from "three"
import * as l from "./47620"
import { CreateFileDeserializer } from "./65222"
import { parentType } from "../const/typeString.const"
import { DebugInfo } from "../core/debug"
import { VisionParase } from "../math/2569"
import { TagObject, ICON, AssetTypes } from "../object/tag.object"
import { CreateEmbedDeserializer } from "../parser/embedDeserializer"
import { noNull } from "../utils/29282"
import { isRealNumber } from "../utils/37519"
import { toDate } from "../utils/date.utils"

const MdsMattertagSerializerDebugInfo = new DebugInfo("mds-mattertag-serializer")
export class TagDeserializer {
  constructor(e, t) {
    ;(this.fileAttachmentDeserializer = e), (this.externalAttachmentDeserializer = t)
  }
  deserialize(e) {
    var t, n
    if (!e || !this.validate(e)) return MdsMattertagSerializerDebugInfo.debug("Deserialized invalid Mattertag data from MDS", e), null
    const i = e.anchorPosition ? VisionParase.fromVisionVector(e.anchorPosition) : void 0,
      r = e.stemNormal ? VisionParase.fromVisionVector(e.stemNormal) : void 0,
      h = new TagObject()
    const { color, stemEnabled, showTitle, iconSize, iconUrl, stemLength } = e.hotPoint || {}
    // const {color,stemEnabled,showTitle,iconSize,iconUrl,stemLength} = e.hotPoint || e || {}

    if (
      ((h.sid = e.id),
      (h.layerId = (null === (t = e.layer) || void 0 === t ? void 0 : t.id) || ""),
      (h.label = e.label || ""),
      (h.description = e.description || ""),
      (h.enabled = !!e.enabled),
      color && (h.color = new Color(color)),
      (h.created = toDate(e.created)),
      (h.modified = toDate(e.modified)),
      e.floor && e.floor.id && (h.floorId = e.floor.id),
      e.room && e.room.id && (h.roomId = e.room.id),
      i && (h.anchorPosition = i),
      e.media && (h.mediaSrc = e.media),
      e.mediaType && (h.mediaType = (0, l.m7)(e.mediaType)),
      h.fileAttachments.replace(this.getFileAttachments(h, e)),
      h.externalAttachments.replace(this.getExternalAttachments(h, e)),
      isRealNumber(stemLength) && (h.stemHeight = stemLength),
      r && r instanceof Vector3)
    ) {
      const t = r.clone().setLength(h.stemHeight)
      ;(h.anchorNormal = r), (h.stemVector = t), (h.stemVisible = !!stemEnabled)
    } else (h.stemVector = new Vector3(0, 0, 0)), (h.stemVisible = !!stemEnabled)
    h.objectAnnotationId = null === (n = e.objectAnnotation) || void 0 === n ? void 0 : n.id
    h.keywords = e.keywords || []
    noNull(e.icon) && (h.icon = e.icon)
    //新加入的字段 用于实现改造的业务
    h.iconSize = iconSize || 1
    h.iconUrl = iconUrl || ICON
    h.showTitle = showTitle === undefined ? true : showTitle
    h.openMode = e.openMode || 1
    h.link = e.link
    h.openDetail = e.openDetail
    h.assetType = e.assetType || AssetTypes.hotPoint

    return h
  }
  validate(e) {
    if (!e) return !1
    return ["id", "created", "modified", "enabled"].every(t => t in e)
  }
  getFileAttachments(e, t) {
    return this.fileAttachmentDeserializer ? this.deserializeFileAttachments(t).sort((e, t) => e.created.getTime() - t.created.getTime()) : []
  }
  getExternalAttachments(e, t) {
    if (!this.externalAttachmentDeserializer) return []
    const n = this.deserializeExternalAttachments(t)
    if (t.media && t.mediaType) {
      const i = (0, l.Nc)(e.sid, t.media, t.mediaType)
      i && n.push(i)
    }
    return n.sort((e, t) => e.created.getTime() - t.created.getTime())
  }
  deserializeExternalAttachments(e) {
    const t = e.externalAttachments || [],
      n = []
    return (
      t.forEach(t => {
        var s
        const r = null === (s = this.externalAttachmentDeserializer) || void 0 === s ? void 0 : s.deserialize(t)
        r && ((r.parentId = e.id), (r.parentType = parentType.MATTERTAG), n.push(r))
      }),
      n
    )
  }
  deserializeFileAttachments(e) {
    const t = e.fileAttachments || [],
      n = []
    return (
      t.forEach(t => {
        var s
        const r = null === (s = this.fileAttachmentDeserializer) || void 0 === s ? void 0 : s.deserialize(t)
        r && ((r.parentId = e.id), (r.parentType = parentType.MATTERTAG), n.push(r))
      }),
      n
    )
  }
}
export const makeMattertagDeserializer = function () {
  const e = CreateFileDeserializer()
  const t = CreateEmbedDeserializer()
  return new TagDeserializer(e, t)
}
export const d = TagDeserializer
