export default function (r: string) {
  const o = self || window
  try {
    let i: Blob
    try {
      i = new o.Blob([r])
    } catch (t) {
      const BlobBuilder = new (o["BlobBuilder"] || o["WebKitBlobBuilder"] || o["MozBlobBuilder"] || o["MSBlobBuilder"])()
      BlobBuilder.append(r)
      i = BlobBuilder.getBlob()
    }
    const a = URL || webkitURL
    const f = a.createObjectURL(i)
    const s = new Worker(f)
    a.revokeObjectURL(f)
    return s
  } catch (n) {
    return new Worker("data:application/javascript,".concat(encodeURIComponent(r)))
  }
}
