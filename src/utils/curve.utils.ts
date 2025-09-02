export class CurveUtil {
  cx: number
  bx: number
  ax: number
  cy: number
  by: number
  ay: number
  p1x: number
  p1y: number
  p2x: number
  p2y: number
  constructor(e: number, t: number, i: number, n: number) {
    this.cx = 3 * e
    this.bx = 3 * (i - e) - this.cx
    this.ax = 1 - this.cx - this.bx
    this.cy = 3 * t
    this.by = 3 * (n - t) - this.cy
    this.ay = 1 - this.cy - this.by
    this.p1x = e
    this.p1y = n
    this.p2x = i
    this.p2y = n
  }

  sampleCurveX(e: number) {
    return ((this.ax * e + this.bx) * e + this.cx) * e
  }
  sampleCurveY(e: number) {
    return ((this.ay * e + this.by) * e + this.cy) * e
  }
  sampleCurveDerivativeX(e: number) {
    return (3 * this.ax * e + 2 * this.bx) * e + this.cx
  }
  solveCurveX(e: number, t = 1e-6) {
    var i, n, s, r, o
    s = e
    for (o = 0; o < 8; o++) {
      if (((r = this.sampleCurveX(s) - e), Math.abs(r) < t)) return s
      var a = this.sampleCurveDerivativeX(s)
      if (Math.abs(a) < 1e-6) break
      s -= r / a
    }
    if ((s = e) < (i = 0)) return i
    if (s > (n = 1)) return n
    for (; i < n; ) {
      r = this.sampleCurveX(s)
      if (Math.abs(r - e) < t) return s
      e > r ? (i = s) : (n = s)
      s = 0.5 * (n - i) + i
    }
    return s
  }
  solve(e: number, t?: number) {
    return this.sampleCurveY(this.solveCurveX(e, t))
  }
}
