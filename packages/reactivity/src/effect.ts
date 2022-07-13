export let activeEffect

function cleanupEffect(effect) {
  // deps里面装的是属性对应的Set，
  // Set里面装的是对应的ReactiveEffect对象（即effect）
  const { deps } = effect
  deps.forEach((dep) => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}

export class ReactiveEffect {
  // public修饰符表示在实例上新增了一个属性，自动this.xxx=xxx
  // active = true 和 public active = true 是一样的
  active = true // 默认激活状态
  parent = null
  deps = [] // 用于收集关联的属性
  constructor(public fn, public scheduler) {}

  run() {
    // 如果未激活，则直接执行函数，不需要进行依赖收集
    if (!this.active)
      this.fn()

    try {
      // 记录一下parent
      this.parent = activeEffect
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      activeEffect = this
      // 清除依赖，重新收集依赖
      cleanupEffect(this)
      // 当稍后进行取值时，就可以获取到这个全局的activeEffect了
      return this.fn()
    }
    finally {
      activeEffect = this.parent
    }
  }

  stop() {
    if (this.active) {
      this.active = false // 失活
      cleanupEffect(this) // 清除依赖
    }
  }
}

export function effect(fn, options: any = {}) {
  // 这里的fn可以根据状态变化重新调用

  const _effect = new ReactiveEffect(fn, options.scheduler)
  _effect.run()

  const runner = _effect.run.bind(_effect) // 绑定this
  runner.effect = _effect // 将effect挂在到runner函数上
  // 不绑定的话 runner()运行时，this就是window了
  return runner // 将runner函数返回
}

const targetMap = new WeakMap()

// 依赖收集
export function track(target, type, key) {
  if (!activeEffect)
    return
  let depsMap = targetMap.get(target)
  if (!depsMap)
    targetMap.set(target, (depsMap = new Map()))
  let dep = depsMap.get(key)
  if (!dep)
    depsMap.set(key, (dep = new Set()))
  trackEffects(dep)
}

export function trackEffects(dep) {
  const shouldTrack = !dep.has(activeEffect)
  if (shouldTrack) {
    dep.add(activeEffect)
    // 将dep关联到activeEffect中
    activeEffect.deps.push(dep)
  }
}

// 更新渲染触发函数
export function trigger(target, type, key, value, oldValue) {
  const depsMap = targetMap.get(target)
  if (!depsMap) // 该target不在模板中使用
    return
  const dep = depsMap.get(key) // 找到对应的effect
  if (dep)
    triggerEffects(dep)
}

export function triggerEffects(dep) {
  dep = new Set(dep)
  dep.forEach((effect) => {
    // 如果是自己执行自己，就什么都不做
    if (effect !== activeEffect) {
      if (effect.scheduler)
        // 如果有调度器，则调度器执行
        effect.scheduler()
      else effect.run()
    }
  })
}
