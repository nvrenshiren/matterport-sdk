import { Vector3 } from "three"
import { Command } from "../core/command"
export class RegisterRoomAssociationSourceCommand extends Command {
  static id: string
  constructor(e: {
    type: string
    getPositionId: () => Generator<{ id: string; roomId?: string; floorId: string; position: Vector3; layerId: string }, void, unknown>
    updateRoomForId: (e: string, t: string) => void
  }) {
    super()
    this.payload = { roomAssociation: e }
  }
}
RegisterRoomAssociationSourceCommand.id = "REGISTER_ROOM_ASSOCIATION_SOURCE"
export class RoomboundUnselectCommand extends Command {
  constructor(t: string) {
    super()
    this.id = "roombound_unselect"
    this.payload = { id: t }
  }
}
export class SetRoomboundVisibilityCommand extends Command {
  constructor(t = !1) {
    super()
    this.id = "set_roombound_visibility"
    this.payload = { visible: t }
  }
}
export class RoomBoundSetAllowRenderingCommand extends Command {
  constructor(t: boolean) {
    super()
    this.id = "room_bound_set_allow_rendering"
    this.payload = { allowRendering: t }
  }
}
export class RoomSelectorEnableCommand extends Command {
  constructor(e: boolean) {
    super()
    this.id = "ROOM_SELECTOR_ENABLE"
    this.payload = {
      enable: e
    }
  }
}
