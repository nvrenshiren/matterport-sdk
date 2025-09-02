declare global {
  interface Error {
    isMock?: boolean
    code?: string
    originalError?: Error
  }
}
export function hasCodeError(e: Error) {
  return !!(e && e instanceof Error && e.code)
}
export function isOriginalError(e: Error) {
  return !!(e && e instanceof Error && e.originalError)
}
export function isMockError(e: Error) {
  return !!(e && e instanceof Error && e.isMock)
}
export function getErrorCode(e) {
  return hasCodeError(e) ? e.code : ""
}
export function getErrorCodes(e?: Error) {
  const t: Array<string | undefined> = []
  let n = e
  for (; n; ) hasCodeError(n) && t.push(n.code), (n = isOriginalError(n) ? n.originalError : void 0)
  return t
}
