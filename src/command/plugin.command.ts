import { Command } from "../core/command"
export class PluginResetAllCommand extends Command {
  constructor() {
    super()
    this.id = "PLUGIN_RESET_ALL"
    this.payload = {}
  }
}
export class PluginReloadCommand extends Command {
  constructor(t: string, i: any, e: any, n?: any) {
    super()
    this.id = "PLUGIN_RELOAD"
    this.payload = { name: t, config: i, configMeta: e, permissions: n || {} }
  }
}
export class PluginLoadCommand extends Command {
  constructor(t: string, i: any, e: any, n?: any) {
    super()
    this.id = "PLUGIN_LOAD"
    this.payload = { name: t, config: i, configMeta: e, permissions: n || {} }
  }
}
export class PluginUnloadCommand extends Command {
  constructor(t: string) {
    super()
    this.id = "PLUGIN_UNLOAD"
    this.payload = { name: t }
  }
}
export class PluginConfigFetchDataCommand extends Command {
  constructor(t: string, i: { (e: any): void; (e: any): void }) {
    super()
    this.id = "PLUGIN_CONFIG_FETCH_DATA"
    this.payload = { operation: t, callback: i }
  }
}
export class AttachmentAssociateWithPluginCommand extends Command {
  constructor(t: string, i: string) {
    super()
    this.id = "ATTACHMENT_ASSOCIATE_WITH_PLUGIN"
    this.payload = { attachmentId: t, pluginId: i }
  }
}
export class ChangePluginVisibilityCommand extends Command {
  ids: string[]
  value: string
  static id: string
  constructor(e: string[], t: string) {
    super()
    this.ids = e
    this.value = t
    this.payload = {
      ids: e,
      value: t
    }
  }
}
ChangePluginVisibilityCommand.id = "CHANGE_PLUGIN_VISIBILITY_COMMAND"
