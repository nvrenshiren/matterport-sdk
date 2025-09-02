// 定义一个用于回调的类型，TS 使得可以明确指定回调的参数以及返回类型
type CallbackFunction = (value?: any) => void

export class OpenDeferred<T = any> {
  private base: Promise<T>
  private resolver: (value?: T | PromiseLike<T>) => void
  private rejecter: (reason?: any) => void
  private progressCallbacks: CallbackFunction[] = []

  private _promise: DeferredPromise<T>

  constructor() {
    // 初始空括号内的分号只是语法偏好，不是必需的，已移除
    this.base = new Promise<T>((resolve, reject) => {
      this.resolver = resolve
      this.rejecter = reject
    })

    this._promise = new DeferredPromise<T>(this.base, this)
  }

  then(onfulfilled?: (value?: T) => T | PromiseLike<T> | void, onrejected?: (reason: any) => PromiseLike<never>): OpenDeferred<T> {
    this.base.then(onfulfilled, onrejected)
    return this
  }

  catch(onrejected?: (reason: any) => T | PromiseLike<T>): OpenDeferred<T> {
    this.base.catch(onrejected)
    return this
  }

  resolve(value?: T): OpenDeferred<T> {
    this.resolver(value)
    return this
  }

  reject(reason?: any): OpenDeferred<T> {
    this.rejecter(reason)
    return this
  }

  notify(value: any): void {
    for (const callback of this.progressCallbacks) callback(value)
  }

  progress(callback: CallbackFunction): OpenDeferred<T> {
    this.progressCallbacks.push(callback)
    return this
  }

  promise(): DeferredPromise<T> {
    return this._promise
  }

  nativePromise(): Promise<T> {
    return this.base
  }

  static resolve<U>(value?: U): DeferredPromise<U> {
    const deferred = new OpenDeferred<U>()
    deferred.resolve(value!)
    return deferred.promise()
  }

  static reject<U>(reason?: any): DeferredPromise<U> {
    const deferred = new OpenDeferred<U>()
    deferred.reject(reason)
    return deferred.promise()
  }

  static all<U>(deferreds: Array<OpenDeferred<U> | Promise<U>>): DeferredPromise<U[]> {
    const promises = deferreds.map(d => (d instanceof OpenDeferred ? d.nativePromise() : d))
    const allDeferred = new OpenDeferred<U[]>()

    Promise.all(promises).then(
      values => {
        allDeferred.resolve(values)
      },
      reason => {
        allDeferred.reject(reason)
      }
    )
    return allDeferred.promise()
  }
}

export class DeferredPromise<T> {
  private basePromise: Promise<T>
  private baseDeferred: OpenDeferred<T>

  constructor(promise: Promise<T>, deferred: OpenDeferred<T>) {
    this.basePromise = promise
    this.baseDeferred = deferred
  }

  then(onfulfilled?: (value: T) => T | PromiseLike<T>, onrejected?: (reason: any) => PromiseLike<never>): DeferredPromise<T> {
    this.baseDeferred.then(onfulfilled, onrejected)
    return this
  }

  catch(onrejected?: (reason: any) => T | PromiseLike<T>): DeferredPromise<T> {
    this.baseDeferred.catch(onrejected)
    return this
  }

  progress(callback: CallbackFunction): DeferredPromise<T> {
    this.baseDeferred.progress(callback)
    return this
  }

  nativePromise(): Promise<T> {
    return this.basePromise
  }
}
