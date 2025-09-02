const charList: string[] = []
for (let e = 0; e < 256; e++) charList[e] = (e < 16 ? "0" : "") + e.toString(16)
export const randomUUID = () => {
  const crypto = window.crypto || window["msCrypto"]
  const random = crypto ? crypto.getRandomValues(new Uint8Array(16)) : new Uint8Array(16).map(() => 255 * Math.random())
  random[6] = (15 & random[6]) | 64
  random[8] = (63 & random[8]) | 128
  return (
    charList[random[0]] +
    charList[random[1]] +
    charList[random[2]] +
    charList[random[3]] +
    "-" +
    charList[random[4]] +
    charList[random[5]] +
    "-" +
    charList[random[6]] +
    charList[random[7]] +
    "-" +
    charList[random[8]] +
    charList[random[9]] +
    "-" +
    charList[random[10]] +
    charList[random[11]] +
    charList[random[12]] +
    charList[random[13]] +
    charList[random[14]] +
    charList[random[15]]
  )
}
