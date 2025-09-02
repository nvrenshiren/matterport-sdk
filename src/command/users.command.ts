import { Command } from "../core/command"
export class UserSearchCommand extends Command {
  constructor(e: string) {
    super()
    this.id = "USERS_SEARCH"
    this.payload = {
      search: e
    }
  }
}
export class UserMentionsFetchCommand extends Command {
  constructor(e: { email: string; userStatus: string }[]) {
    super()
    this.id = "USERS_MENTIONS_FETCH"
    this.payload = {
      userMentions: e
    }
  }
}
export class UserInviteCommand extends Command {
  /**
   * 用户邀请
   *
   * @param e 电子邮件列表
   * @param t 消息内容
   * @param n 模型访问权限
   * @param i 笔记ID
   */
  constructor(e: any, t: any, n: string, i: string) {
    super()
    this.id = "USERS_INVITE"
    this.payload = {
      emails: e,
      message: t,
      modelAccess: n,
      noteId: i
    }
  }
}
