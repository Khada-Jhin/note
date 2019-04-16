// 递归查找网页内是否出现了想要的文本内容
function talksAbout(node, text) {
  for (const el of node.childNodes) {
    if (el.nodeType === document.ELEMENT_NODE) {
      if (talksAbout(el, text)) {
        return true
      }
    } else if (el.nodeType === document.TEXT_NODE) {
      if (el.nodeValue.indexOf(text) >= 0) {
        return true
      }
    }
  }
  return false
}