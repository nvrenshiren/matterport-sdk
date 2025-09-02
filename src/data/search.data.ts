import * as o from "../other/31855"
import { BaseParser } from "../parser/baseParser"
import { AnnotationGrouping } from "../const/63319"
import { Data } from "../core/data"
import { ChangeObserver } from "../observable/observable"
import { ObservableArray, createObservableArray } from "../observable/observable.array"
import { ObservableMap, createObservableMap } from "../observable/observable.map"
export class SearchData extends Data {
  searchMode: boolean
  query: string
  typeFilters: ObservableArray<string>
  keywordFilters: ObservableArray<string>
  grouping: any
  static defaultGrouping = AnnotationGrouping.TYPE
  results: ObservableMap<BaseParser>
  dataTypeGroups: {}
  keywordCounts: ObservableMap<number>
  activeItemId: null | string
  selectedType: null | string
  constructor() {
    super(...arguments)
    this.searchMode = !1
    this.query = ""
    this.typeFilters = createObservableArray()
    this.keywordFilters = createObservableArray()
    this.grouping = SearchData.defaultGrouping
    this.results = createObservableMap()
    this.dataTypeGroups = {}
    this.keywordCounts = createObservableMap({})
    this.activeItemId = null
    this.selectedType = null
  }
  getSearchDataTypeList() {
    return Object.values(this.dataTypeGroups)
  }
  getSearchDataTypeGroup(e) {
    return this.dataTypeGroups[e]
  }
  getQuery() {
    return this.query
  }
  getTypeFilters() {
    return this.typeFilters.values()
  }
  setTypeFilters(e: string[]) {
    this.typeFilters.replace(e)
  }
  setTypeFilter(e: string) {
    this.setTypeFilters([e])
  }
  clearTypeFilters() {
    this.getTypeFilters().length > 0 && this.typeFilters.replace([])
  }
  toggleSearchFilter(e: string, t?: boolean) {
    t ? this.typeFilters.push(e) : this.typeFilters.remove(this.typeFilters.indexOf(e))
  }
  hasActiveQuery() {
    return "" !== this.query || this.keywordFilters.length > 0
  }
  setQuery(e: string) {
    this.query = e
  }
  getKeywordFilters() {
    return this.keywordFilters.values()
  }
  setKeywordFilters(e: string[]) {
    this.keywordFilters.replace(e)
  }
  setKeywordCounts(e: Record<string, number>) {
    this.keywordCounts.replace(e)
  }
  getKeywordSummaries() {
    const e: Record<string, { id: string; text: string; count: number; isSelected: boolean }> = {}
    this.getKeywordFilters().forEach(t => {
      e[t] = {
        id: t,
        text: t,
        count: 0,
        isSelected: !0
      }
    })
    this.keywordCounts.keys.forEach(t => {
      const n = this.keywordCounts.get(t)
      e[t]
        ? (e[t].count = n)
        : (e[t] = {
            id: t,
            text: t,
            count: n,
            isSelected: !1
          })
    })
    return Object.values(e)
  }
  hasSearchResultItem(e: BaseParser) {
    const t = (0, o.w)(e)
    return this.results.has(t)
  }
  getSearchResultItem(e: BaseParser) {
    const t = (0, o.w)(e)
    return this.results.get(t)
  }
  getResultsMap() {
    return this.results
  }
  getResults() {
    return this.results.values
  }
  onSearchResultsChanged(e: ChangeObserver<BaseParser>) {
    return this.results.onChanged(e)
  }
  setResults(e: BaseParser[]) {
    this.getResults().forEach(e => e.cancelBindings())
    const t = e.reduce((e, t) => ((e[(0, o.w)(t)] = t), t.registerBindings(), e), {})
    this.atomic(() => {
      this.results.replace(t)
    })
  }
}
