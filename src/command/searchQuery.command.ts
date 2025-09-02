import { Command } from "../core/command"
export class UpdateSearchQueryCommand extends Command {
  /**
   * 更新搜索查询字符串命令
   *
   * @param e 查询字符串
   */
  constructor(query: string) {
    super()
    this.id = "UPDATE_SEARCH_QUERY"
    this.payload = { query }
  }
}
export class UpdateSearchQueryKeywordsCommand extends Command {
  /**
   * 更新搜索关键词命令
   *
   * @param e 搜索关键字
   */
  constructor(keywords: string[]) {
    super()
    this.id = "UPDATE_SEARCH_QUERY_KEYWORDS"
    this.payload = { keywords }
  }
}
export class ToggleSearchQueryKeywordCommand extends Command {
  /**
   * 切换搜索关键词命令
   *
   * @param e 关键字ID
   */
  constructor(keywordId: string) {
    super()
    this.id = "TOGGLE_SEARCH_QUERY_KEYWORD"
    this.payload = { keywordId }
  }
}
export class ChangeSearchGroupingCommand extends Command {
  /**
   * 修改搜索分组
   *
   * @param e 分组参数
   */
  constructor(grouping: boolean) {
    super()
    this.id = "CHANGE_SEARCH_GROUPING"
    this.payload = { grouping }
  }
}
export class SearchFilterClearCommand extends Command {
  /**
   * 搜索过滤结果清除命令
   *
   */
  constructor() {
    super()
    this.id = "SEARCH_FILTER_CLEAR"
  }
}
export class SearchFilterToggleCommand extends Command {
  /**
   * 搜索过滤切换
   *
   * @param e 分组ID
   * @param t 是否启用
   */
  constructor(e: string, t: boolean) {
    super()
    this.id = "SEARCH_FILTER_TOGGLE"
    this.payload = { groupId: e, enabled: t }
  }
}
export class SelectSearchResultCommand extends Command {
  /**
   * 选中搜索结果
   *
   * @param e 元素的ID
   * @param t 元素的类型ID
   */
  payload: { id: string | null; typeId?: string }
  constructor(id: string | null, typeId?: string) {
    super()
    this.id = "SELECT_SEARCH_RESULT"
    this.payload = { id, typeId }
  }
}
export class SearchGroupRegisterCommand extends Command {
  /**
   * 搜索组注册命令
   *
   */
  constructor(e: any) {
    super()
    this.payload = e
    this.id = "SEARCH_GROUP_REGISTER"
  }
}
export class SearchGroupDeregisterCommand extends Command {
  /**
   * 搜索组取消注册命令
   *
   * @param e 传入的参数，用于构造payload中的id属性
   */
  constructor(id: string) {
    super()
    this.id = "SEARCH_GROUP_DEREGISTER"
    this.payload = { id }
  }
}
