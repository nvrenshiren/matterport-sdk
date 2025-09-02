import * as ii from "../const/51801"
function s(e) {
  if (!e) return ii.k$
  if (r(e)) return e
  const t = e.toLocaleLowerCase()
  if (t in ii.Xy) return ii.Xy[t]
  const [n] = t.split("-")
  return n in ii.Xy ? ii.Xy[n] : (ii.E7.find(e => e.startsWith(t)), ii.k$)
}
function r(e) {
  return ii.E7.includes(e)
}

export const i = s
export const y = r
