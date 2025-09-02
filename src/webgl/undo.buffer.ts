export class UndoBuffer<T = any> {
  size: number
  index: number
  count: number
  buffer: T[]
  sorted: boolean
  constructor(e: number) {
    this.size = e
    this.index = 0
    this.count = 0
    this.buffer = []
    this.sorted = !1
    this.buffer = new Array(e)
  }
  push(e: T) {
    this.buffer[this.index] = e
    this.index = (this.index + 1) % this.size
    this.count++
    this.sorted = !1
  }
  get topIndex() {
    return 0 === this.index ? this.size - 1 : this.index - 1
  }
  pop() {
    if (this.count > 0) {
      const e = this.peek()
      return this.count--, 0 === this.index ? (this.index = this.size - 1) : this.index--, e
    }
    return null
  }
  peek() {
    return this.isEmpty() ? null : this.buffer[this.topIndex]
  }
  isEmpty() {
    return 0 === this.count
  }
  getList() {
    return this.count >= this.size ? this.buffer : this.buffer.slice(0, this.count)
  }
  median() {
    const e = Math.floor(this.count / 2),
      t = this.getList()
    return this.sorted || (t.sort(), t === this.buffer && (this.sorted = !0)), t[e]
  }
  *[Symbol.iterator]() {
    yield* this.buffer
  }
  clear() {
    this.count = 0
    this.index = 0
  }
}
