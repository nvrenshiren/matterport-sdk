import { toDate } from "./utils/date.utils"
import { ModelViewType } from "./const/63319"
import { DebugInfo } from "./core/debug"
import { ModelView } from "./modelView"
const MdsModelviewDeserializer = new DebugInfo("mds-modelview-deserializer")
export class ModelviewDeserializer {
  constructor() {}
  deserialize(e) {
    if (!e || !e.id || !e.type) return MdsModelviewDeserializer.debug("Deserialized invalid ModelView data from MDS", e), null
    return new ModelView({
      viewType: this.getModelViewType(e),
      rawViewType: e.type,
      name: e.name || "",
      enabled: !!e.enabled,
      created: toDate(e.created),
      modified: toDate(e.modified),
      id: e.id
    })
  }
  getModelViewType(e) {
    const t = {
      "matterport.workshop.session": ModelViewType.SESSION,
      "matterport.model.default": ModelViewType.BASE,
      "matterport.model.layered": ModelViewType.LAYERED_BASE,
      "matterport.user.insights": ModelViewType.INSIGHTS,
      "matterport.user.view": ModelViewType.USER,
      "trueplan.session": ModelViewType.TRUEPLAN
    }
    return e.type in t ? t[e.type] : ModelViewType.OTHER
  }
}
