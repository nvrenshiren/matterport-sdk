export function SetHas<T = any>(e: Set<T>, t: Set<T>) {
  return e.size === t.size && [...e].every(e => t.has(e))
}
export function MergeSets<T = any>(...e: Set<T>[]) {
  const t = new Set<T>()
  for (const o of e) for (const e of o.values()) t.add(e)
  return t
}
export function ADDSets<T = any>(e: Set<T>, t: Set<T>) {
  for (const o of t) e.add(o)
  return e
}
