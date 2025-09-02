const i = {
    bgPrimary: "#0F1011",
    bgSecondary: "#1e2023",
    gridPrimary: "#2d3035",
    gridSecondary: "#171a1c"
  },
  s = {
    black: i,
    grey: {
      bgPrimary: "#c9cbcc",
      bgSecondary: "#9d9d9e",
      gridPrimary: "#c9cbcc",
      gridSecondary: "#b0b1b1"
    },
    white: {
      bgPrimary: "#fcfdff",
      bgSecondary: "#ced0d3",
      gridPrimary: "#fcfdff",
      gridSecondary: "#e2e3e5"
    },
    default: i
  }

export const K = s
export enum BackgroundColorDefault {
  black= "black",
  grey= "grey",
  white= "white",
  default= "black"
}
