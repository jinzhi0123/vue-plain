export let activeEffect

class ReactiveEffect {
  // public修饰符表示在实例上新增了一个属性，自动this.xxx=xxx
  active = true // 默认激活状态
  constructor(public fn) {

  }

  run() {
    // 如果未激活，则直接执行函数，不需要进行依赖收集
    if (!this.active)
      this.fn()

    try {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      activeEffect = this
      // 当稍后进行取值时，就可以获取到这个全局的activeEffect了
      return this.fn()
    }
    finally {
      activeEffect = undefined
    }
  }
}

export function effect(fn) {
  // 这里的fn可以根据状态变化重新调用

  const _effect = new ReactiveEffect(fn)
  _effect.run()
}
