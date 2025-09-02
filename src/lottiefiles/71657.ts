import json from "./86184"
import fallback from "./73355"
import json1 from "./55519"
import fallback1 from "./65338"
enum i {
  HandsRaised = "hands-raised",
  RotatePhone = "rotate-phone"
}
const s = new Map()
s.set(i.HandsRaised, {
  alt: "Hands Raised",
  json: json,
  fallback: fallback
})
s.set(i.RotatePhone, {
  alt: "Rotate your device to portrait orientation",
  json: json1,
  fallback: fallback1
})

export const F = i
export const W = s
