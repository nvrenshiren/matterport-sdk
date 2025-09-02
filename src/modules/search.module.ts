import N from "classnames"
import * as f from "react"
import * as y from "react/jsx-runtime"
import * as S from "../const/25071"
import * as O from "../other/35290"
import * as x from "../other/36375"
import * as l from "../other/39866"
import * as D from "../other/46362"
import * as b from "../other/66102"
import * as T from "../other/73085"
import * as o from "../utils/80361"
import * as P from "../other/84426"
import {
  SearchFilterClearCommand,
  SearchFilterToggleCommand,
  SearchGroupDeregisterCommand,
  SearchGroupRegisterCommand,
  ChangeSearchGroupingCommand,
  SelectSearchResultCommand,
  ToggleSearchQueryKeywordCommand,
  UpdateSearchQueryCommand,
  UpdateSearchQueryKeywordsCommand
} from "../command/searchQuery.command"
import { ToolsList } from "../const/tools.const"
import { AppData, AppMode } from "../data/app.data"
import { SettingsData } from "../data/settings.data"

import * as I from "../other/95809"
import { AnalyticsSymbol, SearchSymbol } from "../const/symbol.const"
class v {
  constructor(e) {
    this.engine = e
  }
  async activate() {
    await this.engine.commandBinder.issueCommandWhenBound(new MeasureModeToggleCommand(!0, !1, !1))
  }
  async deactivate() {
    await this.engine.commandBinder.issueCommandWhenBound(new MeasureModeToggleCommand(!1, !1, !1))
  }
}
const E = (0, T.M)(SearchData, "grouping", SearchData.defaultGrouping)

import * as _ from "../other/24673"
import { ToolObject } from "../object/tool.object"
import * as R from "../other/62965"
import * as j from "../6550"
import * as U from "../other/73372"
import * as F from "../other/85351"
import * as H from "../other/97273"
import * as W from "../other/99930"
import { AnnotationsCloseAllCommand } from "../command/annotation.command"
import { MeasureModeToggleCommand } from "../command/measurement.command"
import { RegisterToolsCommand, ToggleToolCommand, ToolBottomPanelCollapseCommand } from "../command/tool.command"
import { PhraseKey } from "../const/phrase.const"
import { AppReactContext } from "../context/app.context"
import { Module } from "../core/module"
import { SearchData } from "../data/search.data"
import { ToolsData } from "../data/tools.data"
import { AppChangeMessage } from "../message/app.message"
declare global {
  interface SymbolModule {
    [SearchSymbol]: SearchModule
  }
}
const { SEARCH: L } = PhraseKey.SHOWCASE,
  V = ({ item: e }) => {
    const t = (0, b.b)()
    if (!e) {
      const e = t.t(L.EMPTY_LIST_MESSAGE)
      return (0, y.jsx)(P.gQ, { message: e })
    }
    const { dataTypeGroup: i } = e
    return (null == i ? void 0 : i.itemFC) ? (0, y.jsx)(i.itemFC, { item: e }) : (0, y.jsx)(B, { item: e }, e.id)
  }
function B({ item: e, className: t }) {
  const i = (0, x.k)(),
    n = e.id,
    s = !!i && n === i,
    { analytics: a, commandBinder: o } = (0, f.useContext)(AppReactContext),
    r = (0, y.jsx)(j.A, { item: e }),
    d = (0, y.jsx)(R.j, { item: e })
  return (0, y.jsx)(
    P.HC,
    {
      id: n,
      className: N("search-result-item", t),
      title: d,
      active: s,
      disabled: !e.enabled,
      onClick: async () => {
        const t = "search_item_" + e.typeId.toLowerCase() + "_click"
        a.track("JMYDCase_gui", { tool: "search", gui_action: t }),
          o.issueCommand(new ToolBottomPanelCollapseCommand(!0)),
          await o.issueCommand(new AnnotationsCloseAllCommand()),
          e.onSelect()
      },
      badge: r || void 0
    },
    n
  )
}
const { SEARCH: G } = PhraseKey.SHOWCASE
function z() {
  const { commandBinder: e } = (0, f.useContext)(AppReactContext),
    t = E(),
    i = (0, D.s)(),
    n = (0, x.k)(),
    s = (0, b.b)()
  const a = i.length,
    o = s.t(G.ITEMS, a),
    r = s.t(G.EMPTY_LIST_MESSAGE),
    d = (0, y.jsx)(H.B, { filter: (0, y.jsx)(_.a, {}), filterPills: !0, shareEnabled: !0 })
  return (0, y.jsxs)(
    U.L,
    Object.assign(
      { toolId: ToolsList.SEARCH, className: "search-tool-panel", title: o, subheader: d, subheaderCollapsedHeight: S.vH },
      {
        children: [
          (0, y.jsx)(
            P.w0,
            Object.assign(
              { className: "list-panel-controls" },
              {
                children: (0, y.jsx)(O.$, {
                  grouping: t,
                  onGroupBy: function (t) {
                    e.issueCommand(new ChangeSearchGroupingCommand(t))
                  }
                })
              }
            )
          ),
          (0, y.jsx)(
            "div",
            Object.assign(
              { className: "panel-list search-panel-list" },
              {
                children:
                  0 === a
                    ? (0, y.jsx)(P.gQ, { message: r })
                    : (0, y.jsx)(F.D, { renderGroup: I.v, renderItem: V, activeItemId: n, grouping: t, excludeEmptyGroups: !0 })
              }
            )
          )
        ]
      }
    )
  )
}
class $ {
  constructor() {
    ;(this.renderPanel = () => (0, y.jsx)(z, {})), (this.renderOverlay = () => (0, y.jsx)(W.F, {}))
  }
}
function K(...e) {
  return !0
}
function Z(...e) {
  return !1
}
class Y {
  constructor(e) {
    ;(this.searchData = e),
      (this.subscriptions = []),
      (this.isSearchingGroup = e => {
        const t = this.searchData.searchMode
        return !0 === t || t === e
      }),
      (this.onFiltersChanged = () => {
        this.updateAvailableKeywords(),
          this.clearUnavailableKeywordFilters(),
          this.searchData.getSearchDataTypeList().forEach(this.updateMatches),
          this.updateResults()
      }),
      (this.updateAvailableKeywords = () => {
        const e = this.getActiveSearchDataTypeList().reduce((e, { getKeywords: t }) => {
          if (t) {
            t().forEach(t => {
              e[t] ? e[t]++ : (e[t] = 1)
            })
          }
          return e
        }, {})
        this.searchData.setKeywordCounts(e)
      }),
      (this.updateMatches = e => {
        const { id: t, getSimpleMatches: i } = e,
          n = this.searchData.getTypeFilters(),
          s = this.searchData.getQuery(),
          a =
            0 === n.length || n.includes(t)
              ? (function (e) {
                  if (!e) return K
                  const t = e.toLowerCase()
                  return (...e) =>
                    (function (e, ...t) {
                      return t.some(t => t.toLowerCase().includes(e))
                    })(t, ...e)
                })(s)
              : Z,
          o = this.searchData.getKeywordFilters()

        e.matches = i(a, e, s, o)
      }),
      (this.activationChanged = e => {
        e ? this.updateAllMatchesAndResults() : this.searchData.getSearchDataTypeList().forEach(this.revealItems)
      }),
      (this.revealItems = e => {
        e.getSimpleMatches(K, e, "", [])
      }),
      (this.updateAllMatchesAndResults = (0, o.D)(() => {
        this.updateAvailableKeywords(), this.searchData.getSearchDataTypeList().forEach(this.updateMatches), this.updateResults()
      }, 200)),
      this.subscriptions.push(
        e.onPropertyChanged("query", this.updateAllMatchesAndResults),
        e.onPropertyChanged("keywordFilters", this.updateAllMatchesAndResults),
        e.onPropertyChanged("searchMode", this.activationChanged),
        e.typeFilters.onChanged(this.onFiltersChanged)
      )
  }
  dispose() {
    const e = e => e.cancel()
    this.subscriptions.forEach(e), this.searchData.getSearchDataTypeList().forEach(t => t.subscriptions.forEach(e))
  }
  registerSearchGroup(e, t, i) {
    const n = () => {
      this.updateMatches(e), this.updateResults(), this.updateAvailableKeywords()
    }
    let s = !1,
      a = !1
    const r = (0, o.D)(() => {
      a ? (n(), (s = !1)) : (s = !0)
    }, 200)
    t && e.subscriptions.push(t(r))
    const d = t => {
      const n = a
      a = this.isSearchingGroup(e.id)
      i && n !== a && i(a && t), a && s && r()
    }
    e.subscriptions.push(this.searchData.onPropertyChanged("searchMode", d))

    d(this.searchData.searchMode)
  }
  deregisterSearchGroup(e) {
    e.subscriptions.forEach(e => e.cancel()), this.updateResults()
  }
  clearUnavailableKeywordFilters() {
    const e = this.searchData.getTypeFilters().length > 0,
      t = this.getActiveSearchDataTypeList().find(e => !!e.getKeywords)
    e && !t && this.searchData.setKeywordFilters([])
  }
  getActiveSearchDataTypeList() {
    const e = this.searchData.typeFilters
    return this.searchData.getSearchDataTypeList().filter(t => 0 === e.length || e.includes(t.id))
  }
  updateResults() {
    const e = this.searchData.getSearchDataTypeList().reduce((e, t) => (e.push(...t.matches), e), [])
    this.searchData.setResults(e)
  }
}
const { TOOLS: J } = PhraseKey
export default class SearchModule extends Module {
  searchResultsUpdater: Y
  constructor() {
    super(...arguments),
      (this.name = "search"),
      (this.searchData = new SearchData()),
      (this.deactivateTimeout = 0),
      (this.hasStartedTrackingQueries = !1),
      (this.onApplicationChange = async () => {
        this.updateFeatureEnablement()
      }),
      (this.registerSearchGroup = async e => {
        const {
          id: t,
          groupPhraseKey: i,
          groupMatchingPhraseKey: n,
          getSimpleMatches: s,
          getKeywords: a,
          groupOrder: o,
          groupIcon: r,
          registerChangeObserver: d,
          onSearchActivatedChanged: c,
          itemFC: l,
          itemActionsFC: h,
          groupActionsFC: u,
          batchSupported: m = !1
        } = e
        if (this.searchData.dataTypeGroups[t]) return void this.log.debug("Search group already registered")
        const p = {
          id: t,
          groupPhraseKey: i,
          groupMatchingPhraseKey: n,
          getSimpleMatches: s,
          getKeywords: a,
          groupOrder: o,
          groupIcon: r,
          matches: [],
          subscriptions: [],
          itemFC: l,
          itemActionsFC: h,
          groupActionsFC: u,
          batchSupported: m
        }

        this.searchData.dataTypeGroups[t] = p
        this.searchResultsUpdater.registerSearchGroup(p, d, c)
      }),
      (this.deregisterSearchGroup = async e => {
        const { id: t } = e,
          i = this.searchData.dataTypeGroups[t]
        i
          ? (delete this.searchData.dataTypeGroups[t], this.searchResultsUpdater.deregisterSearchGroup(i))
          : this.log.debug("Search group not found to deregister")
      }),
      (this.updateQuery = async e => {
        this.searchData.setQuery(e.query), this.searchData.commit()
      }),
      (this.updateQueryKeywords = async e => {
        this.searchData.setKeywordFilters(e.keywords)
      }),
      (this.toggleQueryKeyword = async ({ keywordId: e }) => {
        const t = [...this.searchData.getKeywordFilters()]
        t.includes(e) ? t.splice(t.indexOf(e), 1) : t.push(e), this.searchData.setKeywordFilters(t)
      }),
      (this.selectSearchResult = async e => {
        const { id: t, typeId: i } = e,
          { activeItemId: n, selectedType: s } = this.searchData
        ;(t === n && i === s) || ((this.searchData.activeItemId = t), (this.searchData.selectedType = (t && i) || null), this.searchData.commit())
      }),
      (this.changeGrouping = async e => {
        ;(this.searchData.grouping = e.grouping), this.searchData.commit()
      }),
      (this.toggleSearchFilter = async e => {
        const { groupId: t, enabled: i } = e
        this.searchData.toggleSearchFilter(t, i)
        this.searchData.getTypeFilters().length === Object.keys(this.searchData.dataTypeGroups).length && this.searchData.clearTypeFilters()
      }),
      (this.onToolChanged = () => {
        const e = this.toolsData.getActiveTool(),
          t = null == e ? void 0 : e.searchModeType
        if ((window.clearTimeout(this.deactivateTimeout), t)) {
          const e = "string" == typeof t ? t : void 0
          this.activateSearchMode(e), e ? this.searchData.setTypeFilter(e) : this.searchData.clearTypeFilters()
        } else this.deactivateSearchMode()
      }),
      (this.trackQuery = (0, o.D)(() => {
        const e = this.searchData.query.substring(0, 1e3),
          t = this.searchData
            .getKeywordFilters()
            .map(e => e.trim())
            .sort()
            .join(",")
        if (!e && !t) return
        const i = !this.hasStartedTrackingQueries && e === this.config.urlQuery
        this.analytics.track("space_search_queried", { query: e, queryKeywords: t, submittedByUrlParam: i }), (this.hasStartedTrackingQueries = !0)
      }, 1e3))
  }
  async init(e, t) {
    if (
      ((this.config = e),
      (this.engine = t),
      ([this.toolsData, this.appData, this.settingsData, this.analytics] = await Promise.all([
        t.market.waitForData(ToolsData),
        t.market.waitForData(AppData),
        t.market.waitForData(SettingsData),
        t.getModuleBySymbol(AnalyticsSymbol)
      ])),
      (this.searchResultsUpdater = new Y(this.searchData)),
      this.bindings.push(
        t.subscribe(AppChangeMessage, this.onApplicationChange),
        this.searchData.onPropertyChanged("query", this.trackQuery),
        this.searchData.onPropertyChanged("keywordFilters", this.trackQuery),
        this.toolsData.onPropertyChanged("activeToolName", this.onToolChanged),
        t.commandBinder.addBinding(UpdateSearchQueryCommand, this.updateQuery),
        t.commandBinder.addBinding(UpdateSearchQueryKeywordsCommand, this.updateQueryKeywords),
        t.commandBinder.addBinding(ToggleSearchQueryKeywordCommand, this.toggleQueryKeyword),
        t.commandBinder.addBinding(ChangeSearchGroupingCommand, this.changeGrouping),
        t.commandBinder.addBinding(SearchFilterToggleCommand, this.toggleSearchFilter),
        t.commandBinder.addBinding(SearchFilterClearCommand, async () => this.searchData.clearTypeFilters()),
        t.commandBinder.addBinding(SelectSearchResultCommand, this.selectSearchResult),
        t.commandBinder.addBinding(SearchGroupRegisterCommand, this.registerSearchGroup),
        t.commandBinder.addBinding(SearchGroupDeregisterCommand, this.deregisterSearchGroup)
      ),
      this.updateFeatureEnablement(),
      (0, l.J)(this.settingsData) && (void 0 !== e.urlQuery || void 0 !== e.urlQueryKeywords || void 0 !== e.urlQueryFilters))
    ) {
      const t = decodeURIComponent(e.urlQuery || "")
      this.searchData.setQuery(t), this.searchData.commit()
      const i = decodeURIComponent(e.urlQueryFilters || "").trim(),
        n = i ? i.split(",") : []
      n.length > 0 && this.searchData.setTypeFilters(n)
      const s = decodeURIComponent(e.urlQueryKeywords || "").trim(),
        a = s ? s.split(",") : []
      a.length > 0 && this.searchData.setKeywordFilters(a)
      const o = this.toolsData.getTool(ToolsList.LAYERS) ? ToolsList.LAYERS : ToolsList.SEARCH
      this.engine.commandBinder.issueCommand(new ToggleToolCommand(o, !0))
    }
    t.market.register(this, SearchData, this.searchData)
  }
  dispose(e) {
    super.dispose(e), window.clearTimeout(this.deactivateTimeout), this.searchResultsUpdater && this.searchResultsUpdater.dispose()
  }
  updateFeatureEnablement() {
    if (!(this.appData.application === AppMode.WORKSHOP) && (0, l.J)(this.settingsData) && !this.toolsData.getTool(ToolsList.SEARCH)) {
      const e = new ToolObject({
        id: ToolsList.SEARCH,
        searchModeType: !0,
        namePhraseKey: J.SEARCH,
        panel: !0,
        panelLeft: !0,
        icon: "icon-magnifying-glass",
        analytic: "search",
        dimmed: !1,
        enabled: !0,
        hidesAppBar: !0,
        order: 1,
        ui: new $(),
        manager: new v(this.engine)
      })
      this.engine.commandBinder.issueCommand(new RegisterToolsCommand([e]))
    }
  }
  activateSearchMode(e) {
    const t = e || !0
    this.searchData.searchMode !== t && ((this.searchData.searchMode = t), this.searchData.commit())
  }
  deactivateSearchMode() {
    this.searchData.searchMode &&
      (this.searchData.setKeywordFilters([]),
      (this.searchData.searchMode = !1),
      (this.searchData.activeItemId = null),
      this.searchData.commit(),
      (this.deactivateTimeout = window.setTimeout(() => {
        this.searchData.clearTypeFilters()
      }, 300)))
  }
}

// export const ClearSearchFiltersCommand = SearchFilterClearCommand
// export const DeregisterSearchGroupCommand = SearchGroupDeregisterCommand
// export const RegisterSearchGroupCommand = SearchGroupRegisterCommand
// export const ToggleSearchFilterCommand = SearchFilterToggleCommand
