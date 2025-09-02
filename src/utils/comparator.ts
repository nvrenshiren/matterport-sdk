export class Comparator {
  matcher: ComparatorAny | ComparatorValue | ComparatorType | ComparatorInstance | ComparatorIS
  constructor(e: ComparatorAny | ComparatorValue | ComparatorType | ComparatorInstance | ComparatorIS) {
    this.matcher = e
  }
  static isValue(e) {
    return new Comparator(new ComparatorValue(e))
  }
  static isType(e) {
    return new Comparator(new ComparatorType(e))
  }
  static isInstanceOf(e) {
    return new Comparator(new ComparatorInstance(e))
  }
  static is(e) {
    return new Comparator(new ComparatorIS(e))
  }
  static isAny() {
    return new Comparator(new ComparatorAny())
  }
  compare(e) {
    return this.matcher.matches(e)
  }
}
class ComparatorValue {
  value: any
  constructor(e) {
    this.value = e
  }
  matches(e) {
    return this.value === e
  }
}
class ComparatorType {
  type: any
  constructor(e) {
    this.type = e
  }
  matches(e) {
    return Object.getPrototypeOf(e).constructor === this.type
  }
}
class ComparatorInstance {
  type: any
  constructor(e) {
    this.type = e
  }
  matches(e) {
    if (
      (function (e) {
        return "object" == typeof e
      })(e)
    )
      return e instanceof this.type
    const t = this.type
    switch (typeof e) {
      case "number":
        return t === Number
      case "string":
        return t === String
      case "boolean":
        return t === Boolean
      case "function":
        return t === Function
    }
    return !1
  }
}
class ComparatorIS {
  predicate: any
  constructor(e) {
    this.predicate = e
  }
  matches(e) {
    return this.predicate(e)
  }
}
class ComparatorAny {
  constructor() {}
  matches() {
    return !0
  }
}
