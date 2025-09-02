import { AnnotationGrouping } from "../const/63319"
import { Command } from "../core/command"
export class ViewIdCommand extends Command {
  constructor(e: string) {
    super()
    this.payload = {
      viewId: e
    }
  }
}
export class ViewIdNameCommand extends Command {
  constructor(e: string, t: string) {
    super()
    this.payload = {
      viewId: e,
      name: t
    }
  }
}
export class ConvertModelToLayeredCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "MODEL_TO_LAYERED_COMMAND"
  }
}
export class CheckForProxyLayerCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "CHECK_FOR_PROXY_LAYER_COMMAND"
  }
}
export class DisableWorkshopSessionCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "DISABLE_WORKSHOP_SESSION_COMMAND"
  }
}
export class ModelViewSetCommand extends ViewIdCommand {
  constructor(e: string) {
    super(e)
    this.id = "MODEL_VIEW_SET_COMMAND"
  }
}
export class AddUserViewCommand extends Command {
  constructor(e: string) {
    super()
    this.id = "USER_VIEW_ADD_COMMAND"
    this.payload = {
      name: e
    }
  }
}
export class ViewDeleteCommand extends ViewIdCommand {
  constructor(e) {
    super(e)
    this.id = "VIEW_DELETE_COMMAND"
  }
}
export class ViewRenameCommand extends ViewIdNameCommand {
  constructor(e, t) {
    super(e, t)
    this.id = "VIEW_RENAME_COMMAND"
  }
}
export class ViewToggleEnableCommand extends Command {
  constructor(e: string, t: boolean) {
    super()
    this.id = "VIEW_TOGGLE_ENABLE_COMMAND"
    this.payload = {
      viewId: e,
      enabled: t
    }
  }
}
export class ViewDuplicateCommand extends ViewIdNameCommand {
  constructor(e: string, t: string) {
    super(e, t)
    this.id = "VIEW_DUPLICATE_COMMAND"
  }
}
export class RegisterConfirmViewChangeCommand extends Command {
  constructor(e: any) {
    super()
    this.id = "REGISTER_CONFIRM_VIEW_CHANGE"
    this.payload = {
      confirmViewChange: e
    }
  }
}
export class RegisterDuplicateViewHelperCommand extends Command {
  payload: { beforeDuplicate: Function; afterDuplicate: Function }
  constructor(e: { beforeDuplicate: Function; afterDuplicate: Function }) {
    super()
    this.id = "REGISTER_DUPLICATE_VIEW_HELPER_COMMAND"
    this.payload = e
  }
}
export class UnregisterDuplicateViewHelperCommand extends Command {
  payload: { beforeDuplicate: Function; afterDuplicate: Function }
  constructor(e: { beforeDuplicate: Function; afterDuplicate: Function }) {
    super()
    this.id = "UNREGISTER_DUPLICATE_VIEW_HELPER_COMMAND"
    this.payload = e
  }
}
export class LayerItemsCopyCommand extends Command {
  constructor(e: string, t: any[]) {
    super()
    this.id = "LAYER_ITEMS_COPY_COMMAND"
    this.payload = {
      layerId: e,
      items: t
    }
  }
}
export class LayerItemsCopyNewCommand extends Command {
  constructor(e: string, t: any[]) {
    super()
    this.id = "LAYER_ITEMS_COPY_NEW_COMMAND"
    this.payload = {
      name: e,
      items: t
    }
  }
}
export class LayerItemsMoveCommand extends Command {
  constructor(e: string, t: any[]) {
    super()
    this.id = "LAYER_ITEMS_MOVE_COMMAND"
    this.payload = {
      layerId: e,
      items: t
    }
  }
}
export class ViewItemsDeleteCommand extends Command {
  constructor(e: any[]) {
    super()
    this.id = "VIEW_ITEMS_DELETE_COMMAND"
    this.payload = {
      items: e
    }
  }
}
export class AddUserLayerCommand extends Command {
  constructor(e: string, t: boolean) {
    super()
    this.id = "ADD_LAYER_COMMAND"
    this.payload = {
      label: e,
      common: t
    }
  }
}
export class AddInMemoryLayerCommand extends Command {
  constructor(e: any) {
    super()
    this.id = "ADD_INMEMORY_LAYER_COMMAND"
    this.payload = {
      layerProps: e
    }
  }
}
export class DataLayerDuplicateCommand extends Command {
  constructor(e: string, t: string) {
    super()
    this.id = "DATA_LAYER_DUPLICATE_COMMAND"
    this.payload = {
      layerId: e,
      label: t
    }
  }
}
export class DeleteLayerCommand extends Command {
  constructor(e: string) {
    super()
    this.id = "DELETE_LAYER_COMMAND"
    this.payload = {
      layerId: e
    }
  }
}
export class RemoveLayerCommand extends Command {
  constructor(e: string) {
    super()
    this.id = "REMOVE_LAYER_COMMAND"
    this.payload = {
      layerId: e
    }
  }
}
export class RenameLayerCommand extends Command {
  constructor(e: string, t: string) {
    super()
    this.id = "RENAME_LAYER_COMMAND"
    this.payload = {
      layerId: e,
      label: t
    }
  }
}
export class LayerToggleVisibleCommand extends Command {
  constructor(e: string, t: boolean) {
    super()
    this.id = "LAYER_TOGGLE_VISIBLE_COMMAND"
    this.payload = {
      layerId: e,
      visible: t
    }
  }
}
export class LayerToggleCommonCommand extends Command {
  constructor(e: string, t: boolean) {
    super()
    this.id = "LAYER_TOGGLE_COMMON_COMMAND"
    this.payload = {
      layerId: e,
      common: t
    }
  }
}
export class SetLayerPositionCommand extends Command {
  constructor(e: string, t: number) {
    super()
    this.id = "SET_LAYER_POSITION_COMMAND"
    this.payload = {
      layerId: e,
      position: t
    }
  }
}
export class LayerSelectCommand extends Command {
  constructor(e: string, t: boolean) {
    super()
    this.id = "LAYER_SELECT_COMMAND"
    this.payload = {
      layerId: e,
      selected: t
    }
  }
}
export class LayerToggleCommand extends Command {
  constructor(e: string, t: boolean) {
    super()
    this.id = "LAYER_TOGGLE_COMMAND"
    this.payload = {
      layerId: e,
      on: t
    }
  }
}
export class SearchBatchToggleCommand extends Command {
  constructor(e: boolean) {
    super()
    this.id = "SEARCH_BATCH_TOGGLE"
    this.payload = {
      batchMode: e
    }
  }
}
export class BatchSelectionItemToggleCommand extends Command {
  constructor(e: any, t: boolean) {
    super()
    this.id = "BATCH_SELECTION_ITEM_TOGGLE_COMMAND"
    this.payload = {
      item: e,
      selected: t
    }
    console.log(e, t)
  }
}
export class BatchSelectionAddItemsCommand extends Command {
  constructor(e) {
    super()
    this.id = "BATCH_SELECTION_ADD_ITEMS_COMMAND"
    this.payload = {
      items: e
    }
  }
}
export class BatchSelectionRemoveItemsCommand extends Command {
  constructor(e) {
    super()
    this.id = "BATCH_SELECTION_REMOVE_ITEMS_COMMAND"
    this.payload = {
      items: e
    }
  }
}
export class BatchSelectionSelectAllCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "BATCH_SELECTION_SELECT_ALL_COMMAND"
  }
}
export class BatchSelectionClearAllCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "BATCH_SELECTION_CLEAR_ALL_COMMAND"
  }
}
export class LayerNewCommand extends Command {
  constructor(e: never[], t: string) {
    super()
    this.id = "LAYER_NEW_COMMAND"
    this.payload = {
      items: e,
      action: t
    }
  }
}
export class LayerNewSaveCommand extends Command {
  constructor(e: any, t: boolean) {
    super()
    this.id = "LAYER_NEW_SAVE_COMMAND"
    this.payload = {
      name: e,
      common: t
    }
  }
}
export class LayerNewCancelCommand extends Command {
  constructor() {
    super(...arguments)
    this.id = "LAYER_NEW_CANCEL_COMMAND"
  }
}
export class LayersToolSetGroupingCommand extends Command {
  constructor(e: AnnotationGrouping) {
    super()
    this.id = "LAYERS_TOOL_SET_GROUPING"
    this.payload = {
      grouping: e
    }
  }
}
