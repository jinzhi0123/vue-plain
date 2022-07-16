// 节点操作API
export const nodeOps = {
  // 增删改查

  // 插入节点
  insert(child, parent, anchor = null) {
    parent.insertBefore(child, anchor) // 没有anchor的话就相当于appendChild
  },
  // 创建元素节点
  createElement(tagName) {
    return document.createElement(tagName)
  },
  // 创建文本节点
  createText(text) {
    return document.createTextNode(text)
  },
  // 删除节点
  remove(child) {
    const parentNode = child.parentNode
    if (parentNode)
      parentNode.removeChild(child)
  },
  // 设置元素内容
  setElementText(el, text) {
    el.textContent = text
  },
  // 设置文本节点内容
  setText(node, text) {
    node.nodeValue = text
  },
  // 查询
  querySelector(selector) {
    return document.querySelector(selector)
  },
  // 查询父节点
  parentNode(node) {
    return node.parentNode
  },
  // 查询兄弟节点
  nextSibling(node) {
    return node.nextSibling
  },
}
