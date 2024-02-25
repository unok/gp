export type OptionTargetOnly = {
  target: string
}
export type OptionWithCount = {
  target: string
  count: number
}
export type Option = OptionTargetOnly | OptionWithCount
