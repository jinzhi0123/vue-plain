export function patchClass(el, nextValue) {
  // 不需要比对，直接覆盖即可（如果说考虑优化的问题，浏览器已经帮我们做了优化）
  if (nextValue == null)
    el.removeAttribute('class')

  else
    el.className = nextValue
}
