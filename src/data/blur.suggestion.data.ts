import * as aa from "../utils/func.utils"
import { Data } from "../core/data"
import { ObservableMap } from "../observable/observable.map"
import { randomString } from "../utils/func.utils"
export class BlurSuggestionData extends Data {
  suggestions: ObservableMap
  constructor(e) {
    super(), (this.name = "blur-suggestion-data"), (this.suggestions = new ObservableMap()), e && this.add(...e)
  }
  add(...e) {
    this.suggestions.atomic(() => {
      for (const t of e)
        t.atomic(() => {
          for (; !t.id || this.suggestions.has(t.id); ) (t.id = randomString(11)), t.commit()
          if (-1 === t.index || this.hasIndex(t.index)) {
            const e = this.suggestions.values.map(e => e.index).filter(e => "number" == typeof e),
              s = e.length ? Math.max(...e) : 0
            ;(t.index = s + 1), t.commit()
          }
        }),
          this.suggestions.set(t.id, t)
    }),
      this.commit()
  }
  has(e) {
    return this.suggestions.has(e)
  }
  hasIndex(e) {
    return !!this.suggestions.values.find(t => t.index === e)
  }
  get(e) {
    return this.suggestions.get(e)
  }
  getByAccepted(...e) {
    return this.suggestions.values.filter(t => e.includes(t.accepted))
  }
  accept(...e) {
    return this.updateAll(e, { accepted: !0 })
  }
  reject(...e) {
    return this.updateAll(e, { accepted: !1 })
  }
  reset(...e) {
    return this.updateAll(e, { accepted: null })
  }
  show(...e) {
    return this.updateAll(e, { visible: !0 })
  }
  hide(...e) {
    return this.updateAll(e, { visible: !1 })
  }
  updateAll(e, t) {
    const s = e.length ? e : this.suggestions.keys
    this.atomic(() => {
      this.suggestions.atomic(() => {
        for (const e of s)
          if (this.has(e)) {
            const s = this.get(e)
            Object.assign(s, t), s.commit()
          }
      }),
        this.commit()
    })
  }
}
