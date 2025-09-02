import { Data } from "../core/data"
import { ObjectTagObject } from "../modules/objectTagSuggestionsData.module"
import { ObservableMap, createObservableMap } from "../observable/observable.map"
export class ObjectTagsData extends Data {
  suggestions: ObservableMap<ObjectTagObject>
  constructor() {
    super()
    this.name = "object-tags"
    this.suggestions = createObservableMap()
  }
  get collection() {
    return this.suggestions
  }
  iterate(e: (e: ObjectTagObject) => void) {
    for (const t of this.suggestions) e(t)
  }
  getObjectTag(e: string) {
    return this.suggestions.get(e)
  }
  getObjectTagIds() {
    return this.suggestions.keys
  }
  updateObjectTag(e: ObjectTagObject) {
    this.suggestions.set(e.id, e)
  }
  removeObjectTag(e: string) {
    return this.suggestions.delete(e)
  }
}
