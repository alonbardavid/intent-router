import { ScreenType, NavState, getScreenName, current } from "./screen"
import { NavigationCommand, SuccessfulNavigationCommand } from "./route"
import { cloneDeep } from "lodash"
const modes: {
  [key: string]: ModeConfig & { tabRef: { [key: string]: number } }
} = {}

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
export type ModeConfig = {
  tabs?: TabConfig[]
  screen?: ScreenConfig
  tabsStyle?: any
  animationType?: string
  drawer?: DrawerConfig
}
export type ScreenConfig = {
  screen?: ScreenType
  navigatorStyle?: any
  initialState?: NavState
}
export function addMode(name: string, modeConfig: ModeConfig) {
  const tabRef = (modeConfig.tabs || []).reduce((obj, tab, i) => {
    obj[tab.containerName] = i
    return obj
  }, {})
  modes[name] = {
    ...modeConfig,
    tabRef
  }
}

function buildProps(
  command: { props?: any; mode?: string },
  modeName?: string
) {
  const mode = modeName || (command as any).mode || (current && current.mode)
  if (typeof command.props == "function") {
    return {
      _resolve: command.props,
      mode
    }
  }
  return {
    ...command.props,
    mode
  }
}
function buildTabConfig(
  modeName: string,
  tab: TabConfig,
  command?: SuccessfulNavigationCommand
) {
  return {
    ...tab,
    screen: getScreenName((command && command.screen) || tab.screen),
    passProps: command ? buildProps(command) : buildProps(tab, modeName),
    navigatorStyle: buildNavigatorStyle(tab, command)
  }
}
function buildNavigatorStyle(
  style: { navigatorStyle? },
  command?: SuccessfulNavigationCommand
) {
  const navigatorStyle = {
    ...(style && style.navigatorStyle),
    ...(command.navigatorStyle || {})
  }
  navigatorStyle.navBarCustomView =
    navigatorStyle.navBarCustomView &&
    getScreenName(navigatorStyle.navBarCustomView)
  return navigatorStyle
}
export function buildConfigFromMode(
  modeName: string,
  command?: SuccessfulNavigationCommand
) {
  const mode = modes[modeName]
  let config: any
  if (mode.tabs) {
    config = { ...mode }
    config.tabs = config.tabs.map(tab =>
      buildTabConfig(
        modeName,
        tab,
        tab.containerName == command.container && command
      )
    )
    config.appStyle = config.tabsStyle
  } else {
    config = { ...mode }
    config.screen = {
      screen: getScreenName(command.screen),
      navigatorStyle: buildNavigatorStyle(mode.screen, command)
    }
    config.passProps = buildProps(command)
  }
  if (mode.drawer) {
    config.drawer = {
      ...mode.drawer,
      left: mode.drawer.left && {
        screen: getScreenName(mode.drawer.left.screen),
        passProps: buildProps(mode.drawer.left)
      }
    }
  }
  return cloneDeep(config)
}

export function getCurrentMode() {
  return modes[current && current.mode]
}

export { modes }
