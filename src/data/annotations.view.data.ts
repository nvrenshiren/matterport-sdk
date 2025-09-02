import { Data } from "../core/data"
import { ChangeObserver } from "../observable/observable"
import { ObservableProxy, createObservableProxy } from "../observable/observable.proxy"
import { ObservableValue, createObservableValue } from "../observable/observable.value"
export class AnnotationsViewData extends Data {
  name: string
  dockedAnnotationObservable: ObservableValue<null | {
    id: string
    annotationType: string
  }>
  billboardAnnotationObservable: ObservableValue<null | {
    id: string
    annotationType: string
  }>
  billboardSelectedObservable: ObservableValue<boolean>
  capabilities: Map<any, ObservableProxy<{ dock: boolean; preview: boolean; select: boolean; share: boolean }>>
  constructor() {
    super()
    this.name = "annotations-view-data"
    this.dockedAnnotationObservable = createObservableValue(null)
    this.billboardAnnotationObservable = createObservableValue(null)
    this.billboardSelectedObservable = createObservableValue(!1)
    this.capabilities = new Map()
  }
  setDockedAnnotation(e: any, t?: any) {
    const n =
      e && t
        ? {
            id: e,
            annotationType: t
          }
        : null
    this.isEqual(n, this.dockedAnnotation) ||
      this.atomic(() => {
        this.dockedAnnotationObservable.value = n
        n && this.billboardSelected && (this.billboardSelectedObservable.value = !1)
      })
  }
  get dockedAnnotation() {
    return this.dockedAnnotationObservable.value
  }
  onDockedAnnotationChanged(e: ChangeObserver<{ id: string; annotationType: string }>) {
    return this.dockedAnnotationObservable.onChanged(e)
  }
  setBillboardAnnotation(e?: string | null, t?: string, n?: boolean) {
    const i =
      e && t
        ? {
            id: e,
            annotationType: t
          }
        : null
    this.atomic(() => {
      this.isEqual(i, this.billboardAnnotation) || (this.billboardAnnotationObservable.value = i)
      ;(void 0 === n && i) || ((this.billboardSelectedObservable.value = !!n), n && this.dockedAnnotation && (this.dockedAnnotationObservable.value = null))
    })
  }
  get billboardAnnotation() {
    return this.billboardAnnotationObservable.value
  }
  get billboardSelected() {
    return this.billboardSelectedObservable.value
  }
  get selectedAnnotation() {
    return this.billboardSelected ? this.billboardAnnotation : null
  }
  updateCapabilities(e: any, t: { dock: boolean; preview: boolean; share: boolean }) {
    const n = this.getCapabilities(e)
    n.atomic(() => {
      n.dock = t.dock
      n.preview = t.preview
      n.share = t.share
    })
  }
  getCapabilities(e: any) {
    const t = {
      dock: !0,
      preview: !0,
      select: !0,
      share: !0
    }
    this.capabilities.has(e) || this.capabilities.set(e, createObservableProxy(t))
    return this.capabilities.get(e) || createObservableProxy(t)
  }
  isEqual(e: { id: string; annotationType: string }, t: { id: string; annotationType: string }) {
    return (null == e ? void 0 : e.id) === (null == t ? void 0 : t.id) && (null == e ? void 0 : e.annotationType) === (null == t ? void 0 : t.annotationType)
  }
}
