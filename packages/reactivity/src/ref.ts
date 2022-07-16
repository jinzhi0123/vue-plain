import { isObject } from '@vue/shared'
import { reactive } from './reactive'

function toReactive(value) {
  return isObject(value) ? reactive(value) : value
}

class RefImpl {
  public _value
  constructor(public rawValue) {
    this._value = toReactive(rawValue)
  }

  get value() {
    return this._value
  }

  set value(newValue) {
    if (newValue !== this.rawValue) {
      this._value = toReactive(newValue)
      this.rawValue = newValue
    }
  }
}

export function ref(value) {
  return new RefImpl(value)
}
