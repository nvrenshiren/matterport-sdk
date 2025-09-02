import { ResizeDimensions, ResizeProperty } from "../command/screen.command"
export const createAspectRatioBasedResizeDimensions = (t, duration = 200) => {
  let i = 0
  let o = 0
  const n = 1 / t
  const a = t => t.width / t.height
  return {
    resizeDimensions: [
      { property: ResizeProperty.width, setDimension: e => ((i = a(e) < t ? e.width : e.height * t), i), duration },
      { property: ResizeProperty.height, setDimension: e => ((o = a(e) < t ? e.width * n : e.height), o), duration },
      { property: ResizeProperty.top, setDimension: e => (a(e) < t ? (e.height - o) / 2 : 0), duration },
      { property: ResizeProperty.left, setDimension: e => (a(e) < t ? 0 : (e.width - i) / 2), duration }
    ]
  }
}
export const createSimpleResizeDimensions = (duration = 200) => ({
  resizeDimensions: [
    { property: ResizeProperty.width, setDimension: t => t.width, duration },
    { property: ResizeProperty.height, setDimension: t => t.height, duration },
    { property: ResizeProperty.top, setDimension: () => 0, duration },
    { property: ResizeProperty.left, setDimension: () => 0, duration }
  ]
})
export const createOffsetBasedResizeDimensions = (t, e, i, duration = 200) => {
  const resizeDimensions: ResizeDimensions[] = []
  void 0 !== t && resizeDimensions.push({ property: ResizeProperty.width, setDimension: e => e.width + t, duration })
  void 0 !== e && resizeDimensions.push({ property: ResizeProperty.height, setDimension: t => t.height + e, duration })
  void 0 !== i && resizeDimensions.push({ property: ResizeProperty.left, setDimension: () => i, duration })
  return { resizeDimensions }
}
