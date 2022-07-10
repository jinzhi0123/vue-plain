import { isObject } from './../../shared/src/index'
// 将数据转换成响应式数据 只能做对象的代理
import { ReactiveFlags, mutableHandlers } from './baseHandler'
// weakMap的key只能是对象，没有内存泄漏风险，key是null的话会自动清除
const reactiveMap = new WeakMap()

export function reactive(target) {
  if (!isObject(target))
    return

  if (target[ReactiveFlags.IS_REACTIVE])
    return target

  // 如果从Map中找到了该对象，则返回该对象的代理
  const existingProxy = reactiveMap.get(target)
  if (existingProxy)
    return existingProxy

  // 并没有重新定义属性,只是代理
  // 在取值的时候,会调用getter
  // 在赋值的时候,会调用setter
  const proxy = new Proxy(target, mutableHandlers)
  reactiveMap.set(target, proxy)
  return proxy
}

