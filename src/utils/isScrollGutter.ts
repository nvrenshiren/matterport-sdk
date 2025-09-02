import { MouseKeyCode, MouseKeyIndex } from "../const/mouse.const"
import { InputClickerEndEvent } from "../events/click.event"
const r = e => (e instanceof InputClickerEndEvent ? e.button === MouseKeyIndex.PRIMARY : e.buttons === MouseKeyCode.PRIMARY)
export const isScrollGutter = (e: number, t: HTMLElement) => {
  const i = t.parentElement?.clientWidth || 0,
    s = t.offsetLeft,
    r = t.offsetWidth,
    a = Math.max(60, Math.min(90, 0.08 * r))
  return (0 === s && e > 0 && e < a) || (!(s + r < i) && e > i - a)
}

export const _ = r
export const y = isScrollGutter
