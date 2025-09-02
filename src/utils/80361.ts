const i = (e: Function, t = 250) => {
  let n
  return (...i: any[]) => {
    window.clearTimeout(n)
    n = window.setTimeout(() => e.apply(null, i), t)
  }
}

export const D = i
