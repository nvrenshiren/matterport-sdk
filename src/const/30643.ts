export const mediaTypeList = {
  text: "text",
  link: "link",
  photo: "photo",
  video: "video",
  rich: "rich",
  none: "none",
  error: "error",
  parse: t => (null !== t && t in mediaTypeList ? mediaTypeList[t] : mediaTypeList.none)
}
