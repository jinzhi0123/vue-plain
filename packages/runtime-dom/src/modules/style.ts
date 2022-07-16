export function patchStyle(el, prevValue, nextValue) {
  // 需要去除旧的中存在而新的中不存在的样式
  // 那直接style=nextValue呢？style只支持赋值
  for (const key in nextValue)
    el.style[key] = nextValue[key]
  if (prevValue) {
    for (const key in prevValue) {
      if (!(key in nextValue))
        el.style[key] = null
    }
  }
}
