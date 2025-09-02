import { ScheduleTaskCommand } from "../command/schedule.command"
import { Command } from "./command"
import { DebugInfo } from "./debug"
import { OpenDeferred } from "./deferred"
import { TypeLookup } from "./typeLookup"
const debugInfo = new DebugInfo("command-binder")
type Func = (...args: any) => any
export class CommandBinder {
  ignoreUnboundCommands: boolean
  typeLookup: TypeLookup
  bindings: Record<string, Func>
  queuedCommands: Record<string, Array<{ command: Command; deferred: OpenDeferred }>>
  hookedCommands: Record<string, { preCommandCallback: null | Func; postCommandCallback: null | Func; resolving: boolean }>
  resetHooks: () => void
  constructor(e = !1) {
    this.ignoreUnboundCommands = e
    this.typeLookup = new TypeLookup()
    this.bindings = {}
    this.queuedCommands = {}
    this.hookedCommands = {}
    this.resetHooks = () => {
      this.hookedCommands = {}
    }
    this.issueCommand = this.issueCommand.bind(this)
    this.issueCommandWhenBound = this.issueCommandWhenBound.bind(this)
  }
  addBinding<C extends typeof Command = typeof Command>(e: C, t: (e: C["prototype"]["payload"]) => any) {
    const n = this.typeLookup.getKeyByType(e, !0)
    if (this.bindings[n]) throw Error(`Command ${n} already bound to a callback`)
    this.bindings[n] = t
    this.callQueuedCommands(n)
    return {
      renew: () => {
        this.bindings[n] !== t && this.addBinding(e, t)
      },
      cancel: () => this.removeBinding(e, t),
      active: this.bindings[n] === t
    }
  }
  removeBinding<C extends typeof Command = typeof Command>(e: C, t: (e?: C["prototype"]["payload"]) => any) {
    const n = this.typeLookup.getKeyByType(e)
    if (!n) return void debugInfo.debug("Trying to unbind unbound command")
    this.bindings[n] === t ? delete this.bindings[n] : debugInfo.debug("Trying to unbind unbound callback")
  }
  issueCommand<C extends typeof Command = typeof Command>(e: InstanceType<C>, t = !0) {
    // if (e instanceof ScheduleTaskCommand) {
    // } else {
    //   console.log(e)
    // }
    const n = this.typeLookup.getKeyByInstance(e)
    const i = this.bindings[n]
    return i ? this.issueCommandHelper(e, n, i, t) : this.ignoreUnboundCommands ? Promise.resolve({}) : Promise.reject("Command not bound: " + e.id)
  }
  issueCommandHelper<C extends typeof Command = typeof Command>(
    e: InstanceType<C>,
    t: string,
    n: (e: C["prototype"]["payload"]) => any,
    i = !0
  ): Promise<ReturnType<typeof n>> {
    return this.hookedCommands[t] && !this.hookedCommands[t].resolving ? this.issueHookCommand(e, t) : n(e.payload)
  }
  issueCommandWhenBound<C extends typeof Command = typeof Command>(e: InstanceType<C>) {
    const t = new OpenDeferred()
    this.issueCommand(e)
      .then(e => {
        return t.resolve(e)
      })
      .catch(n => {
        const i = this.typeLookup.getKeyByInstance(e, !0)
        this.queuedCommands[i] || (this.queuedCommands[i] = [])
        this.queuedCommands[i].push({
          command: e,
          deferred: t
        })
      })
    return t.nativePromise()
  }
  callQueuedCommands(e: string) {
    const t: Promise<any>[] = []
    this.queuedCommands[e] &&
      (this.queuedCommands[e].forEach(e => {
        t.push(this.issueCommand(e.command).then(t => e.deferred.resolve(t)))
      }),
      Promise.all(t).then(() => {
        delete this.queuedCommands[e]
      }))
  }
  hookCommand<C extends typeof Command = typeof Command>(e: C, t: boolean, n: (e: C["prototype"]["payload"]) => any) {
    const i = this.typeLookup.getKeyByType(e, !0)
    if (this.hookedCommands[i]) {
      if (t && null !== this.hookedCommands[i].preCommandCallback) throw Error(`Command ${e.name} has already been pre hooked`)
      if (!t && null !== this.hookedCommands[i].postCommandCallback) throw Error(`Command ${e.name} has already been post hooked`)
    } else
      this.hookedCommands[i] = {
        preCommandCallback: null,
        postCommandCallback: null,
        resolving: !1
      }
    t ? (this.hookedCommands[i].preCommandCallback = n) : (this.hookedCommands[i].postCommandCallback = n)
  }
  async issueHookCommand<C extends typeof Command = typeof Command>(e: InstanceType<C>, t: string) {
    const n = this.hookedCommands[t],
      i = this.bindings[t],
      s = e.payload,
      r = n.preCommandCallback,
      a = n.postCommandCallback
    try {
      r && (await r(s)), (n.resolving = !0)
      const o = await this.issueCommandHelper(e, t, i, !0)
      n.resolving = !1
      a && (await a(s))
      return o
    } catch (e) {
      throw Error(`Could not completely issueHookCommand - ${e}`)
    }
  }
}
