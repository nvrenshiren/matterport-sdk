import { Data } from "../core/data"
export class VisionCatalogData extends Data {
  catalog: Array<{
    name: string
    contentType: string
    format: string
    url: string
    validUntil: Date
  }>
  constructor(e: VisionCatalogData["catalog"] = []) {
    super()
    this.catalog = e
  }
  get objectAnnotations() {
    return this.catalog.find(e => "objectAnnotations" === e.name)
  }
  get semantic() {
    return this.catalog.find(e => "semantic" === e.name)
  }
  get detectedObjects() {
    return this.catalog.find(e => "detectedObjects" === e.name)
  }
  get objectBlur() {
    return this.catalog.find(e => "objectBlur" === e.name)
  }
  getCatalog() {
    return this.catalog
  }
  getAsset(e: string) {
    return this.catalog.find(t => t.name === e)
  }
  findFilename(e: string) {
    return this.catalog.find(t => t.url.includes(e))
  }
}
