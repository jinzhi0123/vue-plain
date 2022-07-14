import { isFunction, isObject } from './../../shared/src/index'
import { ReactiveEffect } from './effect'
import { isReactive } from './reactive'

// 循环遍历
function traversal(value, set = new Set()) {
  // 第一步 递归要有终止条件 不是对象就终止
  if (!isObject(value))
    return value
  if (set.has(value))
    return value
  set.add(value)
  for (const key in value)
    traversal(value[key], set)
  return value
}

/**
 * @param {Object} source 用户传入的对象
 * @param {Function} cb 用户传入的回调函数（调度器）
**/
export function watch(source, cb) {
  let getter
  let oldValue
  let cleanup
  if (isReactive(source)) {
    // 如果传入的是一个reactive对象
    // 对传入的数据进行递归循环（只要循环，就会访问对象上的每一个数据，访问属性的时候会收集effect）
    getter = () => traversal(source) // 这里需要进行循环遍历
  }
  else if (isFunction(source)) {
    // 如果传入的是一个函数，getter函数就是这个函数
    getter = source
  }
  else {
    return
  }
  const onCleanup = fn => cleanup = fn // 保存用户的函数
  const job = () => {
    if (cleanup)
      cleanup() // 下一次watch触发这一次的cleanup
    const newValue = effect.run()
    cb(newValue, oldValue, onCleanup)
    oldValue = newValue
  }
  const effect = new ReactiveEffect(getter, job)
  oldValue = effect.run()
}
