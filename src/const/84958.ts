export const PinDefaultSize = 1
export const PinConfig = Object.freeze({
  anchor: {
    size: 1
  },
  selection: {
    size: 1
  },
  stem: {
    length: 0.23,
    width: 1,
    opacity: 1,
    transparent: !0,
    color: "white",
    alphaTest: 0.05
  },
  pinHeadMesh: {
    scale: {
      nearBound: 1.5,
      farBound: 4.8,
      maxSize: 80,
      minSize: 40,
      baseViewportSize: 800,
      responsiveness: 100
    }
  }
})
