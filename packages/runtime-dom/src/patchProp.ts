import { patchAttr } from './modules/attr'
import { patchClass } from './modules/class'
import { patchEvent } from './modules/event'
import { patchStyle } from './modules/style'

// DOM属性操作API
export function patchProp(el, key, prevValue, nextValue) {
  // 类名 el.className
  if (key === 'class')
    patchClass(el, nextValue)
  // 样式
  else if (key === 'style')
    patchStyle(el, prevValue, nextValue)
  // events
  else if (/^on[^a-z]/.test(key))
    patchEvent(el, key, nextValue)
  // 普通属性
  else
    patchAttr(el, key, nextValue)
}
