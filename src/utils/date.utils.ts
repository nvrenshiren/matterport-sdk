const i = new Object()
export const toISOString = (e: Date | null) => {
  if (e) {
    const t = e.valueOf()
    if (!isNaN(t)) return e.toISOString()
  }
  return new Date().toISOString()
}
export const toDate = (e: string | null, t: Object | null = i) => {
  if (e) {
    const t = new Date(e)
    if (!isNaN(t.valueOf())) return t
  }
  return t === i ? new Date() : (t as Date)
}
export const DayTag = {
  TODAY: "TODAY",
  YESTERDAY: "YESTERDAY",
  THIS_WEEK: "THIS_WEEK",
  ONE_WEEK_AGO: "ONE_WEEK_AGO",
  TWO_WEEKS_AGO: "TWO_WEEKS_AGO",
  THREE_WEEKS_AGO: "THREE_WEEKS_AGO",
  OLDER: "OLDER"
}
export function getDayTag(e: Date) {
  const t = new Date()
  t.setHours(0, 0, 0, 0)
  e.setHours(0, 0, 0, 0)
  const i = (t.getTime() - e.getTime()) / 86400000
  if (0 === i) return DayTag.TODAY
  if (1 === i) return DayTag.YESTERDAY
  if (i < 7) return DayTag.THIS_WEEK
  const s = Math.floor(i / 7)
  return 1 === s ? DayTag.ONE_WEEK_AGO : 2 === s ? DayTag.TWO_WEEKS_AGO : 3 === s ? DayTag.THREE_WEEKS_AGO : DayTag.OLDER
}
