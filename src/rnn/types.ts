import { ScreenType } from "../core/routes"

export type ScreenConfig = {
  screen: ScreenType
  navigatorStyle?: any
}
export type TabConfig = ScreenConfig & {
  label?: string
  containerName: string
  badge?: () => {
    badge?: number
    badgeColor?: string
  }
  props?: any
  icon?: any
}
export type DrawerConfig = {
  left?: {
    screen: ScreenType
    props?: any
  }
  style?: any
}
export type RNNModeConfig = {
  tabs?: TabConfig[]
  screen?: ScreenConfig
  tabsStyle?: any
  animationType?: string
  drawer?: DrawerConfig
}
