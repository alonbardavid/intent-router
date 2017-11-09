import { IntentRouter, INTENT_INIT } from "../core/intent-router"
import {
  Command,
  COMMAND_TYPE_CHANGE_MODE,
  COMMAND_TYPE_PUSH
} from "../core/command-resolver"
import { ScreenManager } from "./screen"
import {
  bindVisiblityChange,
  changeMode,
  push,
  pop,
  lightbox
} from "./integration"
import { RNNModeConfig } from "./types"

export const COMMAND_TYPE_LIGHTBOX = "lightbox"

export class RnnIntentRouter {
  screenManager = new ScreenManager()
  _currentMode: string = null
  router: IntentRouter<RNNModeConfig>

  setRouter(router: IntentRouter<RNNModeConfig>) {
    this.router = router
    router.onIntent = this.onIntent
  }

  onIntent = (intent: string, command: Command) => {
    if (intent == INTENT_INIT) {
      this.startApp()
    }
    return this.doIntent(command)
  }
  startApp() {
    this.router.routes.allRoutes.forEach(
      route => route.to && this.registerScreen(route.to)
    )
    bindVisiblityChange(this.onVisibilityChange)
  }
  onVisibilityChange = (type, { screen, commandType }) => {
    if (type === "didAppear") {
      this.router.setState({
        screen: this.screenManager.getScreenFromName(screen),
        mode: this._currentMode
      })
    }
  }
  registerScreen(screen) {
    return this.screenManager.registerScreen(screen)
  }
  pop(toRoot) {
    return pop(this.screenManager.navigator, toRoot)
  }
  protected async doIntent(command: Command) {
    switch (command.type) {
      case COMMAND_TYPE_CHANGE_MODE:
        this._currentMode = command.change.mode
        return changeMode(
          command,
          this.router.modes.getMode(this._currentMode),
          this.screenManager.getScreenName
        )
      case COMMAND_TYPE_PUSH:
        return push(
          command,
          this.screenManager.getScreenName,
          this.screenManager.navigator
        )
      case COMMAND_TYPE_LIGHTBOX:
        return lightbox(
          command,
          this.screenManager.getScreenName,
          this.screenManager.navigator
        )
    }
  }
}
const instance = new RnnIntentRouter()

export default instance
