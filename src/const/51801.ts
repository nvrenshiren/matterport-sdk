export const E7 = ["en-US", "es", "fr", "de", "ru", "ja", "zh-CN", "zh-TW", "ko", "nl", "it", "pt"]
export const k$ = "en-US"
export const Xy = Object.assign(
  Object.assign(
    {},
    E7.reduce(
      (e, t) =>
        Object.assign(Object.assign({}, e), {
          [t.toLowerCase()]: t
        }),
      {}
    )
  ),
  {
    en: "en-US",
    zh: "zh-CN",
    cn: "zh-CN",
    jp: "ja"
  }
)
export const Zs = "language_code"
