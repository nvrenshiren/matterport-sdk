import { Module } from "../core/module"
import { LayersData } from "../data/layers.data"
import { AnnotationsViewData } from "../data/annotations.view.data"
import { AppData } from "../data/app.data"
import { AssetDockedMessage, AssetUndockedMessage } from "../message/panel.message"
import { AnnotationsSymbol } from "../const/symbol.const"
import { TourStartedMessage } from "../message/tour.message"
import {
  AnnotationCloseCommand,
  AnnotationDockCommand,
  AnnotationPreviewCommand,
  AnnotationSelectCommand,
  AnnotationsCloseAllCommand,
  AnnotationsCloseBillboardCommand,
  AnnotationsCloseDockedAnnotationCommand
} from "../command/annotation.command"
import EngineContext from "../core/engineContext"
import { TagsViewData } from "../data/tags.view.data"
declare global {
  interface SymbolModule {
    [AnnotationsSymbol]: AnnotationsModule
  }
}
export default class AnnotationsModule extends Module {
  handleDockAnnotation: (e: any) => Promise<void>
  viewData: TagsViewData & AnnotationsViewData
  handleSelectAnnotation: (e: any) => Promise<void>
  handlePreviewAnnotation: (e: any) => Promise<void>
  handleCloseBillboard: () => Promise<void>
  handleCloseDockedAnnotation: () => Promise<void>
  handleClosingOtherAnnotations: (e: any) => Promise<void>
  handleCloseAnnotation: (e: any) => Promise<void>
  handleDockedAnnotationChanged: () => void
  engine: EngineContext
  applicationData: AppData
  layersData: LayersData
  constructor() {
    super(...arguments)
    this.name = "annotations"
    this.handleDockAnnotation = async e => {
      const t = this.viewData,
        { dockedAnnotation: i } = t,
        { id: n, annotationType: s, force: a } = e
      ;(this.viewData.getCapabilities(n).dock || a) &&
        (i?.id !== n || i?.annotationType !== s
          ? t.atomic(() => {
              t.setDockedAnnotation(n, s)
              t.setBillboardAnnotation(null)
            })
          : this.log.debug("Annotation is already docked"))
    }
    this.handleSelectAnnotation = async e => {
      const t = this.viewData,
        { billboardAnnotation: i, billboardSelected: n } = t,
        { id: s, annotationType: a, force: o } = e
      ;(this.viewData.getCapabilities(s).preview || o) &&
        (n && i?.id === s && i?.annotationType === a
          ? this.log.debug("Annotation is already selected")
          : t.atomic(() => {
              t.setBillboardAnnotation(s, a, !0), t.setDockedAnnotation(null)
            }))
    }
    this.handlePreviewAnnotation = async e => {
      this.viewData.getCapabilities(e.id).preview && this.viewData.setBillboardAnnotation(e.id, e.annotationType, !1)
    }
    this.handleCloseBillboard = async () => {
      this.viewData.setBillboardAnnotation(null)
    }
    this.handleCloseDockedAnnotation = async () => {
      this.viewData.setDockedAnnotation(null)
    }
    this.handleClosingOtherAnnotations = async e => {
      const { exceptType: t, exceptId: i } = e
      this.closeOtherAnnotations(t, i)
    }
    this.closeOtherAnnotations = (e, t) => {
      const i = this.viewData,
        { billboardAnnotation: n, dockedAnnotation: s } = i,
        a = n && !this.isMatchingAnnotation(n, e, t),
        o = s && !this.isMatchingAnnotation(s, e, t)
      i.atomic(() => {
        n && a && i.setBillboardAnnotation(null), s && o && i.setDockedAnnotation(null)
      })
    }
    this.handleCloseAnnotation = async e => {
      const t = this.viewData,
        { billboardAnnotation: i, dockedAnnotation: n } = t,
        { id: s, annotationType: a } = e
      t.atomic(() => {
        s === i?.id && a === i?.annotationType && t.setBillboardAnnotation(null), s === n?.id && a === n?.annotationType && t.setDockedAnnotation(null)
      })
    }
    this.handleDockedAnnotationChanged = () => {
      this.viewData.dockedAnnotation ? this.engine.broadcast(new AssetDockedMessage()) : this.engine.broadcast(new AssetUndockedMessage())
    }
  }

  async init(e, t) {
    ;(this.viewData = new AnnotationsViewData()),
      (this.engine = t),
      ([this.applicationData, this.layersData] = await Promise.all([t.market.waitForData(AppData), t.market.waitForData(LayersData)])),
      this.bindings.push(
        t.commandBinder.addBinding(AnnotationDockCommand, this.handleDockAnnotation),
        t.commandBinder.addBinding(AnnotationSelectCommand, this.handleSelectAnnotation),
        t.commandBinder.addBinding(AnnotationPreviewCommand, this.handlePreviewAnnotation),
        t.commandBinder.addBinding(AnnotationCloseCommand, this.handleCloseAnnotation),
        t.commandBinder.addBinding(AnnotationsCloseBillboardCommand, this.handleCloseBillboard),
        t.commandBinder.addBinding(AnnotationsCloseDockedAnnotationCommand, this.handleCloseDockedAnnotation),
        t.commandBinder.addBinding(AnnotationsCloseAllCommand, this.handleClosingOtherAnnotations),
        t.subscribe(TourStartedMessage, this.handleCloseBillboard),
        this.applicationData.onPropertyChanged("application", this.closeOtherAnnotations),
        this.layersData.onPropertyChanged("currentViewId", this.handleCloseBillboard),
        this.viewData.onDockedAnnotationChanged(this.handleDockedAnnotationChanged)
      ),
      t.market.register(this, AnnotationsViewData, this.viewData)
  }
  dispose(e) {
    this.bindings.forEach(e => {
      e.cancel()
    })
    this.bindings = []
    super.dispose(e)
  }
  onUpdate() {}
  isMatchingAnnotation(e, t, i) {
    return !(!i && !t) && (!i || i === e.id) && (!t || t === e.annotationType)
  }
}
