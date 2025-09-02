import { Command } from "../core/command"
export class OrderedListNamedSaveCommand extends Command {
  constructor(e: string, t: { id: string; type: string }[]) {
    super()
    this.id = "ORDERED_LIST_NAMED_SAVE"
    this.payload = { name: e, entries: t }
  }
}
export class OrderedListCreateCommand extends Command {
  constructor(e: string, t: { id: string; type: string }[]) {
    super()
    this.id = "ORDERED_LIST_CREATE"
    this.payload = { name: e, entries: t }
  }
}
export class OrderedListUpdateCommand extends Command {
  constructor(e: string, t: string, i: { id: string; type: string }[]) {
    super()
    this.id = "ORDERED_LIST_UPDATE"
    this.payload = { id: e, name: t, entries: i }
  }
}
