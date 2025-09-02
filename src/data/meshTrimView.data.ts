import { MeshTrimViewState } from "../webgl/49123"
import { EditorState } from "../const/24730"
import { Data } from "../core/data"
import { MeshTrimView } from "../modules/meshTrim.module"
import { MeshTrimObject } from "../object/meshTrim.object"
export class MeshTrimViewData extends Data {
  meshTrimViewsById: Record<string, MeshTrimView>
  viewState: MeshTrimViewState
  editorState: EditorState
  _selectedMeshTrim: MeshTrimObject | null
  constructor() {
    super(...arguments)
    this.meshTrimViewsById = {}
    this.viewState = MeshTrimViewState.PERSPECTIVE
    this.editorState = EditorState.IDLE
    this._selectedMeshTrim = null
  }
  getMeshTrimView(e: string) {
    return this.meshTrimViewsById[e]
  }
  setMeshTrimView(e: string, t: MeshTrimView) {
    this.meshTrimViewsById[e] = t
  }
  deleteMeshTrimView(e) {
    delete this.meshTrimViewsById[e]
  }
  forEachMeshTrimView(e) {
    for (const t in this.meshTrimViewsById) e(this.meshTrimViewsById[t])
  }
  get currentMeshTrimView() {
    return this._selectedMeshTrim ? this.getMeshTrimView(this._selectedMeshTrim.id) : null
  }
  set currentMeshTrimView(e) {
    this.currentMeshTrimView && (this.currentMeshTrimView.selected = !1)
    this._selectedMeshTrim = e?.meshTrim || null
    const t = this.currentMeshTrimView
    t && (t.selected = !0), this.commit()
  }
  get selectedMeshTrim() {
    return this._selectedMeshTrim
  }
  onSelectedMeshTrimChanged(e) {
    return this.onPropertyChanged("_selectedMeshTrim", e)
  }
}
