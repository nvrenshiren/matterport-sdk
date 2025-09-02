import { gql } from "@apollo/client"
import * as p from "../22001"
import { OrderedListNamedSaveCommand } from "../command/orderedList.command"
import { SaveCommand } from "../command/save.command"
import { DataType } from "../const/79728"
import { OrderedListsSymbol, StorageSymbol } from "../const/symbol.const"
import { DebugInfo } from "../core/debug"
import { MdsStore } from "../core/mds.store"
import { Module } from "../core/module"
import { LayersData } from "../data/layers.data"
import { OrderedListData } from "../data/ordered.list.data"
import { MdsWriteError } from "../error/mdsRead.error"
import { ObservableObject } from "../observable/observable.object"
import { dataFromJsonByString } from "../utils/object.utils"
declare global {
  interface SymbolModule {
    [OrderedListsSymbol]: OrderedListsModule
  }
}
class OrderedList extends ObservableObject {
  constructor(e) {
    super(), (this.id = ""), (this.name = ""), (this.description = ""), (this.entries = []), (this.layerId = ""), e && Object.assign(this, e)
  }
  copy(e) {
    return (this.id = e.id), (this.name = e.name), e.description && (this.description = e.description), (this.entries = e.entries.slice()), this.commit(), this
  }
}
const g = new DebugInfo("ordered-list-deserializer")
class MdsOrderedListDeserializer {
  deserialize(e) {
    var t, i, n
    return e && this.validate(e)
      ? new OrderedList({
          id: e.id,
          name: null !== (t = e.label) && void 0 !== t ? t : "",
          layerId: null !== (n = null === (i = e.layer) || void 0 === i ? void 0 : i.id) && void 0 !== n ? n : "",
          entries: e.entries.filter(e => !!e).map(e => ({ id: e.id, type: e.type }))
        })
      : (g.debug("Deserialized invalid ordered list data from Mds", e), null)
  }
  validate(e) {
    return ["id", "label", "entries"].every(t => t in e)
  }
}
const y = new DebugInfo("MdsOrderedListStore")
class MdsOrderedListStore extends MdsStore {
  constructor(e) {
    super(e), (this.prefetchKey = "data.model.orderedLists"), (this.deserializer = new MdsOrderedListDeserializer())
  }
  async read() {
    const e = { modelId: this.getViewId(), includeLayers: this.readLayerId() }
    //pw
    // return this.query(p.GetOrderedLists, e).then(e => {
    //   var t, i
    //   const n = null === (i = null === (t = e.data) || void 0 === t ? void 0 : t.model) || void 0 === i ? void 0 : i.orderedLists
    //   if (!n || !Array.isArray(n)) return y.debug("GetOrderedLists failed"), {}
    //   return n.reduce((e, t) => {
    //     const i = this.deserializer.deserialize(t)
    //     return i && (e[i.name] && y.debug(`Duplicate orderedList found with label: ${i.name}`), (e[i.name] = i)), e
    //   }, {})
    // })
    return {}
  }
  async create(e, t) {
    return 0 === e.length ? [] : Promise.all(e.map(e => this.createOrderedList(e, t)))
  }
  async createOrderedList(e, t) {
    var i
    const n = { modelId: this.getViewId(), label: e.name, description: e.description, entries: e.entries, includeLayers: this.readLayerId() }
    let s
    //pw
    // if (t && this.writeLayerId(t)) {
    //   const e = Object.assign({ layerId: t }, n)
    //   s = await this.mutate(p.AddOrderedListWithLayer, e).catch(e => {
    //     throw new MdsWriteError(e)
    //   })
    // } else
    //   s = await this.mutate(p.AddOrderedList, n).catch(e => {
    //     throw new MdsWriteError(e)
    //   })
    if (s?.data?.addOrderedList) {
      const e = this.deserializer.deserialize(s.data.addOrderedList)
      if (e) return e.layerId && (await this.context.updateForAutoProvisionedLayer(e.layerId)), e
    }
    throw new Error("Unable to create new OrderedList")
  }
  async update(e) {
    if (0 === e.length) return
    // const t = this.getViewId()
    // let i = ""
    // const n = {}
    // n.modelId = t
    // let s = ""
    // for (const t of e) {
    //   const e = t.id
    //   ;(i += `\n        , $label${e}: String!\n        , $description${e}: String!\n        , $entries${e}: [EntryInput!]\n      `),
    //     (n[`label${e}`] = t.name),
    //     (n[`description${e}`] = t.description),
    //     (n[`entries${e}`] = t.entries),
    //     (s += `\n        update${e}:\n        patchOrderedList(modelId: $modelId,\n                         orderedListId: "${e}",\n                         label: $label${e},\n                         description: $description${e},\n                         entries: $entries${e}) {\n          id\n          label\n          entries {\n            id\n            type\n          }\n        }\n      `)
    // }
    // const a = gql`
    //   mutation orderedListsUpdate($modelId: ID! ${i}) {
    //     ${s}
    //   }
    // `
    // return this.mutate(a, n).then(e => {
    //   y.debug(Object.assign({ type: "patchOrderedList" }, Object.values(dataFromJsonByString(e, "data"))))
    // })
    //pw
    return Promise.resolve()
  }
}
export default class OrderedListsModule extends Module {
  constructor() {
    super(...arguments),
      (this.name = "ordered-lists"),
      (this.saveNamedOrderedList = async e => {
        const { name: t, entries: i } = e
        let n = this.data.getOrderedList(t)
        return (
          n ? (n.entries = i) : (n = new OrderedList({ name: t, entries: i })),
          this.data.updateOrderedList(n),
          this.engine.commandBinder.issueCommand(new SaveCommand({ dataTypes: [DataType.ORDERED_LISTS] }))
        )
      })
  }
  async init(e, t) {
    const { baseUrl: i, workshop: n } = e
    if (
      ((this.engine = t),
      (this.layersData = await t.market.waitForData(LayersData)),
      (this.store = new MdsOrderedListStore({ context: this.layersData.mdsContext, baseUrl: i, readonly: !n })),
      this.bindings.push(
        this.store.onNewData(async e => {
          this.data.replace(e)
        })
      ),
      (this.data = new OrderedListData({})),
      // await this.store.refresh(),
      n)
    ) {
      const e = await t.getModuleBySymbol(StorageSymbol)
      this.bindings.push(
        t.commandBinder.addBinding(OrderedListNamedSaveCommand, this.saveNamedOrderedList),
        e.onSave(() => this.save(), { dataType: DataType.ORDERED_LISTS })
      )
    }
    t.market.register(this, OrderedListData, this.data)
  }
  dispose(e) {
    this.store.dispose(), super.dispose(e)
  }
  onUpdate() {}
  async save() {
    const e = this.data.getOrderedLists(),
      t = [],
      i = []
    e.forEach(e => {
      "" === e.id ? t.push(e) : i.push(e)
    })
    return Promise.all([this.store.create(t, this.layersData.getOrderedListsLayerId()), this.store.update(i)]).then(e => {
      e[0].forEach(e => {
        e && this.data.updateOrderedList(e)
      })
    })
  }
}

// export const CreateOrderedListCommand = OrderedListCreateCommand
// export const OrderedListData = OrderedListData
// export const OrderedListEntryType = E.l
// export const SaveNamedOrderedListCommand = OrderedListNamedSaveCommand
// export const TAG_ORDERED_LIST_NAME = TAG_ORDERED_LIST_NAME
// export const UpdateOrderedListCommand = OrderedListUpdateCommand
