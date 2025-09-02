import { DebugInfo } from "./debug"
const ABDebugInfo = new DebugInfo("AB")
export default class AB {
  values: Record<string, any>
  constructor(e: any) {
    this.values = {}
    for (const t in e) {
      const n = e[t]
      if (n && n.ab) {
        try {
          this.values[t] = K(n.ab)
        } catch (e) {
          ABDebugInfo.warn(`Skipping key ${t}, could not pick: ${e}`)
        }
      }
    }
  }
  get(e: string) {
    return this.values[e]
  }
  serialize() {
    return Object.keys(this.values).map(e => `${e}:${this.values[e]}`)
  }
}
function K(e) {
  if (0 === e.length) throw Error("A/B cannot choose from an empty choice array")
  let t = 0
  for (const n of e) {
    if (void 0 === n.value || void 0 === n.weight || n.weight < 0) throw Error(`Malformed AB choice: ${n}`)
    t += n.weight
  }
  const n = Math.random() * t
  let i = 0
  for (const t of e) if (((i += t.weight), n <= i)) return t.value
}
