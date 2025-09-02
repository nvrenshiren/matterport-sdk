import { ViewChangeState } from "../webgl/49123"
import { Command } from "../core/command"
import { MeshTrimObject } from "../object/meshTrim.object"
export class ChangeMeshTrimEditorViewCommand extends Command {
  payload: {
    viewChange: ViewChangeState
  }
  constructor(e: ChangeMeshTrimEditorViewCommand["payload"]) {
    super()
    this.payload = e
    this.id = "CHANGE_MESH_TRIM_EDITOR_VIEW"
  }
}
export class SelectMeshTrimCommand extends Command {
  payload: { meshTrimId: string }
  constructor(e: SelectMeshTrimCommand["payload"]) {
    super()
    this.payload = e
    this.id = "SELECT_MESH_TRIM"
  }
}
export class UnselectMeshTrimCommand extends Command {
  constructor() {
    super()
    this.id = "UNSELECT_MESH_TRIM"
  }
}
export class ActivateMeshTrimEditorCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "ACTIVATE_MESH_TRIM_EDITOR"
  }
}
export class DeactivateMeshTrimEditorCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "DEACTIVATE_MESH_TRIM_EDITOR"
  }
}
export class DeleteMeshTrimCommand extends Command {
  payload: { meshTrimId: string }
  constructor(e: { meshTrimId: string }) {
    super()
    this.payload = e
    this.id = "DELETE_MESH_TRIM"
  }
}
export class CreateMeshTrimCommand extends Command {
  constructor() {
    super()
    this.id = "CREATE_MESH_TRIM"
  }
}
export class ChangeTrimMeshGroupCommand extends Command {
  constructor(e: any) {
    super()
    this.payload = e
    this.id = "CHANGE_TRIM_MESH_GROUP"
  }
}
export class RecenterMeshTrimEditorCommand extends Command {
  constructor() {
    super()
    this.id = "RECENTER_MESH_TRIM_EDITOR"
  }
}
export class EditMeshTrimCommand extends Command {
  constructor() {
    super()
    this.id = "EDIT_MESH_TRIM"
  }
}
export class CreateMeshTrimDataCommand extends Command {
  payload: MeshTrimObject
  constructor(t: MeshTrimObject) {
    super()
    this.payload = t
    this.id = "CREATE_MESH_TRIM"
  }
}
export class DeleteMeshTrimDataCommand extends Command {
  payload: MeshTrimObject
  constructor(t: MeshTrimObject) {
    super()
    this.payload = t
    this.id = "DELETE_MESH_TRIM"
  }
}
export class MoveMeshTrimAllFloorsCommand extends Command {
  constructor(t: any) {
    super()
    this.payload = t
    this.id = "MOVE_MESH_TRIM_ALL_FLOORS"
  }
}
