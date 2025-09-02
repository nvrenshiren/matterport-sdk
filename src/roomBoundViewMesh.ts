import { isPitchFactorOrtho } from "./math/59370"
import * as r from "./const/25869"
import { AnimationProgress } from "./webgl/animation.progress"
import { Color, Mesh } from "three"
export class RoomBoundViewMesh extends Mesh {
  constructor(t, e, i, s) {
    super(e, i),
      (this.roomBoundsId = t),
      (this.cameraData = s),
      (this.animation = new AnimationProgress(0)),
      (this.prevColorState = { opacity: 1, innerColor: new Color(), outerColor: new Color() }),
      (this.pitchFactor = 1),
      (this.raycastEnabled = !0),
      (this.opacity = 1),
      (this.selectState = {
        active: !1,
        on: () => {
          this.updateMaterial()
        },
        off: () => {
          this.updateMaterial()
        }
      }),
      (this.hoverState = {
        active: !1,
        on: () => {
          this.updateMaterial()
        },
        off: () => this.updateMaterial()
      }),
      (this.highlightState = { active: !1, on: () => this.updateMaterial(), off: () => this.updateMaterial() }),
      (this.dimState = { active: !1, on: () => this.updateMaterial(), off: () => this.updateMaterial() }),
      (this.name = t),
      (this.renderOrder = r.o.BASE)
  }
  updateMaterial() {
    var t
    let e = this.colors.baseState
    this.dimState.active && (e = this.colors.dimState),
      this.hoverState.active && (e = this.colors.hoverState),
      this.highlightState.active && (e = null !== (t = this.colors.highlightState) && void 0 !== t ? t : this.colors.selectState),
      this.selectState.active && (e = this.colors.selectState)
    e !== this.targetColorScheme && (this.targetColorScheme = e)
  }
  tickAnimations(t) {
    this.animation.tick(t)
  }
  dispose() {}
  raycast(t, e) {
    if (!this.raycastEnabled) return
    const i = []
    super.raycast(t, i), i.length > 0 && e.push(i[0])
  }
  setPitchFactor(t) {
    ;(this.pitchFactor = t), (this.raycastEnabled = isPitchFactorOrtho(this.pitchFactor))
  }
}
