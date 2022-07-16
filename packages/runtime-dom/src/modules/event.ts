function createInvoker(callback) {
  const invoker = event => callback(event)
  invoker.value = callback
  return invoker
}

export function patchEvent(el, eventName, nextValue) {
  // vei = vue event invoker
  const invokers = el.vei || (el.vei = {})

  const exits = invokers[eventName]
  if (exits) {
    exits.value = nextValue
  }
  else {
    // 把onClick变成click
    const event = eventName.slice(2).toLowerCase()

    if (nextValue) {
      const invoker = invokers[eventName] = createInvoker(nextValue)
      el.addEventListener(event, invoker)
    }
    else if (exits) {
      // 如果没新值 有老值 就删掉
      el.removeEventListener(event, exits)
      invokers[eventName] = undefined
    }
  }
}
