export const delArrayItem = <T = any>(e: T[], t: T) => {
  if (0 !== e.length)
    for (let n = 0; n < e.length; n++) {
      e[n] === t && e.splice(n, 1)
    }
}
export const sameArray = (e: any[] = [], t: any[] = []) =>
  e.length === t.length && ((e = e.slice().sort()), (t = t.slice().sort()), e.every((e, n) => t[n] === e))
