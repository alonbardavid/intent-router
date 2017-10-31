import { IntentRouter } from "../core/intent-router"
import {
  Command,
  COMMAND_TYPE_CHANGE_MODE,
  COMMAND_TYPE_PUSH
} from "../core/command-resolver"
import { ScreenManager } from "./screen"
import { bindVisiblityChange, changeMode, push } from "./integration"
import { RNNModeConfig } from "./types"

export class RnnIntentRouter extends IntentRouter<RNNModeConfig> {
  screenManager = new ScreenManager()
  _currentMode: string = null

  constructor(onCurrentChange?) {
    super(onCurrentChange)
  }

  startApp() {
    this.routes.allRoutes.forEach(
      route => route.to && this.registerScreen(route.to)
    )
    bindVisiblityChange(this.onVisibilityChange)
    return super.startApp()
  }
  onVisibilityChange = (type, { screen, commandType }) => {
    if (type === "didAppear") {
      this._state = {
        screen: this.screenManager.getScreenFromName(screen),
        mode: this._currentMode
      }
      this.onCurrentChange(this._state)
    }
  }
  registerScreen(screen) {
    return this.screenManager.registerScreen(screen)
  }
  protected async _onIntent(command: Command) {
    switch (command.type) {
      case COMMAND_TYPE_CHANGE_MODE:
        this._currentMode = command.change.mode
        return changeMode(
          command,
          this.modes.getMode(this._currentMode),
          this.screenManager.getScreenName
        )
      case COMMAND_TYPE_PUSH:
        return push(
          command,
          this.screenManager.getScreenName,
          this.screenManager.navigator
        )
    }
  }
}
const instance = new RnnIntentRouter()

export default instance
