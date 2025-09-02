import { CameraData } from "../data/camera.data"
import { ViewmodeData } from "../data/viewmode.data"

export async function StartTransition(t: CameraData, e: ViewmodeData) {
  await t.transition.promise
  if (!e.canStartTransition()) {
    const t = new Promise(t => {
      const i = e.onChanged(() => {
        e.canStartTransition() && (i.cancel(), t(void 0))
      })
    })
    await t
  }
}
