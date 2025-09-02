export class ArrayDeserializer {
  constructor(e) {
    this.config = e
  }
  serialize(e) {
    const { serializer: t } = this.config
    if (!e || !Array.isArray(e) || !t) return null
    const i = []
    for (const n of e) {
      const e = t.serialize(n)
      e && i.push(e)
    }
    return i
  }
  deserialize(e) {
    const { deserializer: t } = this.config
    if (!e || !Array.isArray(e) || !t) return null
    const i = []
    for (const n of e) {
      const e = t.deserialize(n)
      e && i.push(e)
    }
    return i
  }
}
