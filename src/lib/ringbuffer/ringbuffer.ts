export default class RingBuffer {
  _elements: any[]
  _first: number
  _last: number
  _size: number
  _evictedCb: any
  _end: number
  constructor(capacity?, evictedCb?) {
    this._elements = new Array(capacity || 50)
    this._first = 0
    this._last = 0
    this._size = 0
    this._evictedCb = evictedCb
  }
  capacity() {
    return this._elements.length
  }
  isEmpty() {
    return this.size() === 0
  }
  isFull() {
    return this.size() === this.capacity()
  }
  peek() {
    if (this.isEmpty()) throw new Error("RingBuffer is empty")

    return this._elements[this._first]
  }
  peekN(count) {
    if (count > this._size) throw new Error("Not enough elements in RingBuffer")

    var end = Math.min(this._first + count, this.capacity())
    var firstHalf = this._elements.slice(this._first, end)
    if (end < this.capacity()) {
      return firstHalf
    }
    var secondHalf = this._elements.slice(0, count - firstHalf.length)
    return firstHalf.concat(secondHalf)
  }
  size() {
    return this._size
  }
  enq(element) {
    this._end = (this._first + this.size()) % this.capacity()
    var full = this.isFull()
    if (full && this._evictedCb) {
      this._evictedCb(this._elements[this._end])
    }
    this._elements[this._end] = element

    if (full) {
      this._first = (this._first + 1) % this.capacity()
    } else {
      this._size++
    }

    return this.size()
  }
  deqN(count) {
    var elements = this.peekN(count)

    this._size -= count
    this._first = (this._first + count) % this.capacity()

    return elements
  }
  deq() {
    var element = this.peek()

    this._size--
    this._first = (this._first + 1) % this.capacity()

    return element
  }
}
