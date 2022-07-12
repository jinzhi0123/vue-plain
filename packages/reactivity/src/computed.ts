import { isFunction } from '@vue/shared'
import { ReactiveEffect } from './effect'

class ComputedRefImpl {
  public effect
  public _dirty = true
  public __v_isReadonly = true
  public __v_isRef = true
  public _value
  constructor(getter, public setter) {
    this.effect = new ReactiveEffect(getter, () => {
      // 收到后依赖的属性会执行此调度函数
    })
  }

  // 类中的属性访问器 底层是Object.defineProperty
  get value() {
    if (this._dirty)
      this._value = this.effect.run()
    return this._value
  }

  set value(newValue) {
    this.setter(newValue)
  }
}

export const computed = (getterOrOptions) => {
  const onlyGetter = isFunction(getterOrOptions)
  let getter
  let setter
  if (onlyGetter) {
    getter = getterOrOptions
    setter = () => { console.warn('no set') }
  }
  else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }
  return new ComputedRefImpl(getter, setter)
}
