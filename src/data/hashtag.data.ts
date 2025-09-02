import { Data } from "../core/data"
import { ObservableArray, createObservableArray } from "../observable/observable.array"
export class HashtagData extends Data {
  name: string
  hashtags: ObservableArray<any>
  constructor() {
    super(...arguments)
    this.name = "hashtag-data"
    this.hashtags = createObservableArray([])
  }
  addHashtags(e) {
    this.atomic(() => {
      e.forEach(e => {
        this.addHashtag(e)
      })
    })
  }
  addHashtag(e) {
    const t = e.trim().toLowerCase()
    ;-1 === this.hashtags.map(e => e.trim().toLowerCase()).indexOf(t) && this.hashtags.push(e)
  }
  getHashtags() {
    return this.hashtags.values()
  }
}
