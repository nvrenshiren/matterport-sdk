export enum MediaTypeList {
  IMAGE = "image",
  PDF = "pdf",
  VIDEO = "video",
  RICH = "rich",
  ZIP = "zip",
  TEXT = "text",
  AUDIO = "audio",
  MODEL = "model",
  APPLICATION = "application"
}
export enum AttachmentCategory {
  EXTERNAL = "external",
  UPLOAD = "upload",
  SANDBOX = "sandbox"
}
export enum AttachmentEmbedStatus {
  EMBED_FAIL = "embedFail",
  EMBED_SUCCESS = "success"
}
export enum AttachmentUploadError {
  FILE_TOO_LARGE = "oversize",
  EMPTY_FILE = "empty",
  OVER_QUOTA = "overQuota",
  UPLOAD_FAILED = "failed",
  PERMISSION_DENIED = "permission"
}
