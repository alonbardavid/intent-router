import {
  getScreenName,
  WrapComponent,
  screens,
  current,
  currentNavigator,
  NavState
} from "./screen"
import { SuccessfulNavigationCommand, resolveNext } from "./route"
import { buildConfigFromMode, getCurrentMode } from "./mode"
import { Navigation } from "react-native-navigation"
import { merge, isPlainObject } from "lodash"

function noop() {
  return {}
}
function buildProps(command: SuccessfulNavigationCommand, extra: any) {
  if (command.props && typeof command.props !== "function") {
    throw new Error("props must be a function") //because react-native freezes items passed to native
  }
  const mode = command.mode || (current && current.mode)
  return {
    ...(extra || {}),
    _resolve: command.props || noop,
    mode
  }
}
function commandToPushOptions(
  command: SuccessfulNavigationCommand,
  extra?: Object
) {
  const mode = getCurrentMode()
  return {
    ...command,
    screen: getScreenName(command.screen),
    passProps: buildProps(command, extra),
    navigatorStyle: merge(
      mode.screen && mode.screen.navigatorStyle,
      command.navigatorStyle || {}
    )
  }
}

export type AppConfig = {
  mode?: string
}

export async function startApp(config?: AppConfig) {
  screens.forEach(({ screen, name }) =>
    Navigation.registerComponent(name, () => WrapComponent(screen))
  )
  const initCommand = await resolveNext("INIT")
  if (initCommand == false) {
    throw new Error("must always have a default route - handle the INIT route")
  }
  setAppMode(initCommand)
}

function setAppMode(command: SuccessfulNavigationCommand, extra?: Object) {
  const navConfig = buildConfigFromMode(command.mode, command)
  try {
    if (!navConfig.tabs) {
      Navigation.startSingleScreenApp(navConfig)
    } else {
      Navigation.startTabBasedApp(navConfig)
    }
  } catch (e) {
    console.error(e)
  }
}
export function intent(intent: string) {
  return async function(params?) {
    params = isPlainObject(params) ? params : {}
    const command = await resolveNext(intent, current, params)
    if (command == false) {
      return
    }
    if (command.mode && command.mode != current.mode) {
      setAppMode(command, params)
    }
    if (command.reset) {
      currentNavigator.resetTo(commandToPushOptions(command, params))
    } else {
      currentNavigator.push(commandToPushOptions(command, params))
    }
  }
}
export function switchToTab(containerName: string) {
  const mode = getCurrentMode()
  currentNavigator.switchToTab({
    tabIndex: mode.tabRef[containerName]
  })
}

export function showModal(command: SuccessfulNavigationCommand): () => void {
  const pushOptions = commandToPushOptions(command)
  pushOptions.navigatorStyle.navBarHidden =
    pushOptions.navigatorStyle.navBarHidden == null
      ? true
      : pushOptions.navigatorStyle.navBarHidden
  currentNavigator.showModal(pushOptions)
  return currentNavigator.dismissModal.bind(currentNavigator)
}

export function pop() {
  currentNavigator.pop()
}
export function popToRoot() {
  currentNavigator.popToRoot()
}
export function toggleDrawer(props) {
  currentNavigator.toggleDrawer(props)
}
