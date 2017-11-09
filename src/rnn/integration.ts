import { Navigation, ScreenVisibilityListener } from "react-native-navigation"
import { Command } from "../core/command-resolver"
import { ChangeRequest } from "../core/routes"
import { RNNModeConfig, TabConfig } from "./types"

export function bindVisiblityChange(onVisibilityChange) {
  const listener = new ScreenVisibilityListener({
    didAppear: onVisibilityChange.bind(this, "didAppear"),
    didDisappear: onVisibilityChange.bind(this, "didDisappear")
  })
  listener.register()
  return listener
}
export function registerComponent(name, component) {
  Navigation.registerComponent(name, () => component)
}
export async function push(
  command: Command,
  getScreenName: (screen) => string,
  navigator
) {
  const options = commandToPushOptions(command.change, getScreenName)
  navigator.push(options)
}

function buildTabConfig(
  tab: TabConfig,
  getScreenName: (screen) => string,
  change?: ChangeRequest
) {
  return {
    ...tab,
    screen: getScreenName(tab.screen),
    passProps: change && change.props ? buildProps(change) : buildProps(tab)
  }
}
function commandToStartOptions(
  change: ChangeRequest,
  mode: RNNModeConfig,
  getScreenName: (screen) => string
) {
  let config: any
  if (mode.tabs) {
    config = { ...mode }
    config.tabs = config.tabs.map(tab =>
      buildTabConfig(tab, getScreenName, change)
    )
    config.appStyle = config.tabsStyle
  } else {
    config = { ...mode }
    config.screen = {
      screen: getScreenName(change.screen),
      navigatorStyle: (change as any).navigatorStyle
    }
    config.passProps = buildProps(change)
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
  return config
}
export async function changeMode(
  command: Command,
  mode: RNNModeConfig,
  getScreenName: (screen) => string
) {
  const config = commandToStartOptions(command.change, mode, getScreenName)
  if (!mode.tabs) {
    Navigation.startSingleScreenApp(config)
  } else {
    Navigation.startTabBasedApp(config)
    return config
  }
}
let hasLightBox = false
export async function pop(navigator, toRoot) {
  if (hasLightBox) {
    navigator.dismissLightBox()
    hasLightBox = false
    if (toRoot) {
      navigator.popToRoot()
    }
  } else if (toRoot) {
    navigator.popToRoot()
  } else {
    navigator.pop()
  }
}
export async function lightbox(
  command: Command,
  getScreenName: (screen) => string,
  navigator
) {
  const options = commandToPushOptions(command.change, getScreenName)
  navigator.showLightBox(options)
  hasLightBox = true
}
function noop() {
  return {}
}
function buildProps(request: ChangeRequest) {
  if (request.props && typeof request.props !== "function") {
    throw new Error("props must be a function") // because react-native freezes items passed to native
  }
  return {
    _resolve: request.props || noop
  }
}

function commandToPushOptions(
  change: ChangeRequest,
  getScreenName: (screen) => string
) {
  return {
    ...change,
    screen: getScreenName(change.screen),
    passProps: buildProps(change)
  }
}
