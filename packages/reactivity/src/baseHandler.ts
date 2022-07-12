import { isObject } from './../../shared/src/index'
import { track, trigger } from './effect'
import { reactive } from './reactive'
export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
}

export const mutableHandlers = {
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE)
      return true
    // 依赖收集
    track(target, 'get', key)
    // 用Reflect更改this指向
    const res = Reflect.get(target, key, receiver)
    if (isObject(res))
      return reactive(res)
    return res
  },
  set(target, key, value, receiver) {
    const oldValue = target[key]
    const result = Reflect.set(target, key, value, receiver) // 会返回是否成功
    if (oldValue !== value)
      trigger(target, 'set', key, value, oldValue)
    return result
  },
}
