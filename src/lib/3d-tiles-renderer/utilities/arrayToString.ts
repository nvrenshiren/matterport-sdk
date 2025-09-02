const utf8decoder = new TextDecoder()

export function arrayToString(array?: AllowSharedBufferSource) {
  return utf8decoder.decode(array)
}
