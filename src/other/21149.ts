import { AttachmentCategory, MediaTypeList } from "../const/32347"
import * as s from "../const/36892"
import { attachmentMediaType } from "../const/typeString.const"
function a(e) {
  return !(e.category !== AttachmentCategory.UPLOAD || !e.mimeType) && s.t8.includes(e.mimeType)
}
function o(e) {
  return e.category === AttachmentCategory.EXTERNAL || e.category === AttachmentCategory.SANDBOX || (!!e.mimeType && s.Aw.includes(e.mimeType))
}
function l(e) {
  return e.filter(e => o(e))
}
function c(e) {
  return e.filter(e => !o(e))
}
function d(e) {
  return e.startsWith("image")
    ? MediaTypeList.IMAGE
    : e.startsWith("video")
      ? MediaTypeList.VIDEO
      : e.startsWith("audio")
        ? MediaTypeList.AUDIO
        : e.startsWith("model")
          ? MediaTypeList.MODEL
          : e.startsWith("text")
            ? MediaTypeList.TEXT
            : "application/pdf" === e
              ? MediaTypeList.PDF
              : MediaTypeList.APPLICATION
}
function u(e) {
  switch (e) {
    case attachmentMediaType.IMAGE:
      return MediaTypeList.IMAGE
    case attachmentMediaType.PDF:
      return MediaTypeList.PDF
    case attachmentMediaType.VIDEO:
      return MediaTypeList.VIDEO
    case attachmentMediaType.RICH:
      return MediaTypeList.RICH
    case attachmentMediaType.ZIP:
      return MediaTypeList.ZIP
    default:
      throw Error(`Unknown attachment media type ${e}`)
  }
}
function h(e) {
  switch (e) {
    case MediaTypeList.IMAGE:
      return attachmentMediaType.IMAGE
    case MediaTypeList.PDF:
      return attachmentMediaType.PDF
    case MediaTypeList.VIDEO:
      return attachmentMediaType.VIDEO
    case MediaTypeList.RICH:
      return attachmentMediaType.RICH
    case MediaTypeList.ZIP:
      return attachmentMediaType.ZIP
    default:
      throw Error(`Unknown media type ${e}`)
  }
}
function p(e) {
  if (!e) return "0"
  const t = Math.min(Math.floor(Math.log(e) / Math.log(1e3)), 3),
    n = ["B", "kB", "MB", "GB"][t]
  return `${Number((e / Math.pow(1e3, t)).toFixed(1))}${n}`
}

export const Ug = l
export const Uq = a
export const VV = p
export const ae = c
export const bY = u
export const id = d
export const lV = o
export const m = h
