function i(e) {
  const t = document.createElement("input")
  ;(t.type = "text"), (t.value = e), document.body.appendChild(t), t.select(), document.execCommand("copy"), document.body.removeChild(t)
}

export const v = i
