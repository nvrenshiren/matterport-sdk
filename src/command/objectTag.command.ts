import { Color } from "three"
import { Command } from "../core/command"
export class ObjectsAnnotationsEnabledCommand extends Command {
  constructor(e: boolean) {
    super()
    this.id = "OBJECTS_ANNOTATIONS_ENABLED"
    this.payload = { enabled: e }
  }
}
export class FilterTagSuggestionCommand extends Command {
  constructor(e: string[]) {
    super()
    this.id = "FILTER_TAG_SUGGESTION"
    this.payload = { ids: e }
  }
}
export class NavigateToTagSuggestionCommand extends Command {
  constructor(e: string) {
    super()
    this.id = "NAVIGATE_TO_TAG_SUGGESTION"
    this.payload = { id: e }
  }
}
export class ToggleObjectEnabledCommand extends Command {
  constructor(e: string, t: boolean) {
    super()
    this.id = "TOGGLE_OBJECT_ENABLED"
    this.payload = { id: e, enabled: t }
  }
}
export class ToggleObjectTagEnabledCommand extends Command {
  constructor(e: boolean, ...t: string[]) {
    super()
    this.id = "TOGGLE_OBJECT_TAG_ENABLED"
    this.payload = { ids: t, enabled: e }
  }
}
export class DismissObjectTagCommand extends Command {
  constructor(...e: string[]) {
    super()
    this.id = "DISMISS_OBJECT_TAG"
    this.payload = { ids: e }
  }
}
export class CreateObjectTagCommand extends Command {
  constructor(
    e: string,
    t: {
      position: number[]
      normal: string
      floorId: string
      roomId: string
      description: string
      label: string
      keywords: string
      color: Color
      stemHeight: number
      stemVisible: boolean
      icon: string
      enabled: boolean
      objectAnnotationId: string
    },
    i: string,
    n: boolean
  ) {
    super()
    this.id = "CREATE_OBJECT_TAG"
    this.payload = { id: e, options: t, pendingAttachments: i, embed: n }
  }
}
export class DockObjectTagCommand extends Command {
  constructor(e: string) {
    super()
    this.id = "DOCK_OBJECT_TAG"
    this.payload = { id: e }
  }
}
