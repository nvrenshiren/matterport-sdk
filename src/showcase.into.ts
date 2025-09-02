//开始

import Engine from "./core/engine"
import ShowCase from "./core/showcase"

export const initShowCase = (e: any) => {
  const engine = new Engine()
  const app = new ShowCase(!1, e.detail.config || {})
  engine.loadApplication(app, app.setError.bind(app), !1)
  return engine
}
