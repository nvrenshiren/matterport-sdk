import * as n from "react"
import { useDataHook } from "./45755"
import { GuiViewData } from "../data/gui.view.data"
const o = useDataHook(GuiViewData)
function r() {
  const e = o(),
    [t, i] = (0, n.useState)((null == e ? void 0 : e.getAccordionGroupCollapsedStates()) || {})
  ;(0, n.useEffect)(() => {
    if (!e) return () => {}
    function t() {
      e && i(e.getAccordionGroupCollapsedStates())
    }
    const n = e.onAccordionCollapsedGroupsChanged(t)
    return t(), () => n.cancel()
  }, [e])
  return [
    t,
    (t, i) => {
      e && e.setAccordionGroupCollapsed(t, i)
    }
  ]
}
export const s = r
