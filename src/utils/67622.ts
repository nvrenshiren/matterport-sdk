import * as i from "./92558"
import { UserStatus } from "../const/66197"
import { modelAccessType } from "../const/typeString.const"
const a = [
  "#d44441",
  "#f44336",
  "#e91e63",
  "#f78da7",
  "#9c4b92",
  "#673ab7",
  "#5c7fff",
  "#03a9f4",
  "#417505",
  "#00bcd4",
  "#51a868",
  "#37d67a",
  "#cddc39",
  "#fbcd00",
  "#ffac17",
  "#ff6900",
  "#abb8c3",
  "#607d8b"
]
export function defaultUserColor(e?: string) {
  const t = a.length
  return a[(0, i.Wm)(e || "", t)]
}
export function UnkownUser(e?: string) {
  return {
    email: e,
    id: "",
    firstName: "",
    lastName: "",
    name: "Unknown",
    initials: "?",
    color: defaultUserColor(e),
    userStatus: UserStatus.UNKNOWN,
    modelAccess: modelAccessType.PUBLIC
  }
}
