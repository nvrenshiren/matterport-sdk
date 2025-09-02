export const VersionUtils = {
  parse: (e: string) => {
    return e.split(".").reduce((e, t) => {
      const n = parseInt(t, 10)
      isNaN(n) || e.push(n)
      return e
    }, [] as number[])
  },
  gt: (e: string, t: string) => {
    return 1 === VersionUtils.compare(e, t)
  },
  gte: (e: string, t: string) => {
    const i = VersionUtils.compare(e, t)
    return 0 === i || 1 === i
  },
  lt: (e: string, t: string) => {
    return -1 === VersionUtils.compare(e, t)
  },
  eq: (e: string, t: string) => {
    return 0 === VersionUtils.compare(e, t)
  },
  compare: (e: string, n: string) => {
    const i = VersionUtils.parse(e)
    const s = VersionUtils.parse(n)
    for (let e = 0; e < i.length; e++) {
      if (e >= s.length) return 1
      if (i[e] !== s[e]) return i[e] > s[e] ? 1 : -1
    }
    return s.length > i.length ? -1 : 0
  }
}
