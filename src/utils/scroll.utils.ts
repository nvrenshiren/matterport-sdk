const i = 250,
  s = () => ({
    wrapperLength: 1,
    childLength: 1,
    scrollOffset: 1,
    isVisible: !1
  }),
  r = () => ({
    scrollbar: null,
    animation: null,
    dragStartScroll: 0
  })
enum a {
  horizontal = "horizontal",
  vertical = "vertical"
}
enum o {
  x = "x",
  y = "y"
}

const l = e => {
    switch (e) {
      case a.horizontal:
        return o.x
      case a.vertical:
        return o.y
    }
    throw Error()
  },
  c = e => {
    switch (e) {
      case o.x:
        return a.horizontal
      case o.y:
        return a.vertical
    }
    throw Error()
  },
  d = {
    [a.horizontal]: {
      scrollOffset: "scrollLeft",
      offsetLength: "offsetWidth",
      clientLength: "clientWidth",
      positionOffset: "offsetLeft",
      lengthName: "width",
      offsetName: "left",
      eventPosition: "clientX",
      delta: o.x
    },
    [a.vertical]: {
      scrollOffset: "scrollTop",
      offsetLength: "offsetHeight",
      clientLength: "clientHeight",
      positionOffset: "offsetTop",
      lengthName: "height",
      offsetName: "top",
      eventPosition: "clientY",
      delta: o.y
    }
  }

enum u {
  Beginning = "Beginning",
  End = "End",
  Middle = "Middle",
  None = "None"
}

const h = (e, t) => (t ? (e < 0.01 ? u.Beginning : 1 - e < 0.01 ? u.End : u.Middle) : u.None)
export const Ij = u
export const Nm = a
export const O1 = l
export const RD = o
export const Sv = r
export const UC = c
export const UI = i
export const cL = s
export const uG = d
export const w5 = h
