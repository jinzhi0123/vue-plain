export let activeEffect

class ReactiveEffect {
  // public修饰符表示在实例上新增了一个属性，自动this.xxx=xxx
  // active = true 和 public active = true 是一样的
  active = true // 默认激活状态
  parent = null
  deps = [] // 用于收集关联的属性
  constructor(public fn) {}

  run() {
    // 如果未激活，则直接执行函数，不需要进行依赖收集
    if (!this.active)
      this.fn()

    try {
      // 记录一下parent
      this.parent = activeEffect
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      activeEffect = this
      // 当稍后进行取值时，就可以获取到这个全局的activeEffect了
      return this.fn()
    }
    finally {
      activeEffect = this.parent
    }
  }
}

export function effect(fn) {
  // 这里的fn可以根据状态变化重新调用

  const _effect = new ReactiveEffect(fn)
  _effect.run()
}

// 依赖收集
const targetMap = new WeakMap()
export function track(target, type, key) {
  if (!activeEffect)
    return
  let depsMap = targetMap.get(target)
  if (!depsMap)
    targetMap.set(target, (depsMap = new Map()))
  let dep = depsMap.get(key)
  if (!dep)
    depsMap.set(key, (dep = new Set()))
  const shouldTrack = !dep.has(activeEffect)
  if (shouldTrack) {
    dep.add(activeEffect)
    // 将dep关联到activeEffect中
    activeEffect.deps.push(dep)
  }
  console.log(targetMap)
}

export function trigger(target, type, key, value, oldValue) {
  const depsMap = targetMap.get(target)
  if (!depsMap) // 该target不在模板中使用
    return
  const deps = depsMap.get(key) // 找到对应的effect
  deps && deps.forEach((effect) => {
    if (effect !== activeEffect)
      effect.run()
  })
}
