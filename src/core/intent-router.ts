import { RouteManager, RouteConfig, IntentType, NavState } from "./routes"
import { routeToCommand } from "./command-resolver"
import { ModeManager } from "./modes"

export const INTENT_INIT = "INIT"
export class IntentRouter<ModeConfig> {
  routes = new RouteManager()
  modes = new ModeManager<ModeConfig>()
  onCurrentChange: (state) => void
  protected _state?: NavState = null

  constructor(onCurrentChange?) {
    this.onCurrentChange = onCurrentChange || (() => {})
  }
  route(route: RouteConfig) {
    this.routes.add(route)
  }

  async startApp() {
    return this.intent(INTENT_INIT)()
  }
  intent = (intent: IntentType) => async (params?) => {
    const resolution = this.routes.resolve(this._state, intent, params)
    const command = await routeToCommand(null, resolution, intent)
    const newState = await this._onIntent(command)
    return newState
  }
  protected async _onIntent(command) {}
  addMode = (name: string, config: ModeConfig) => {
    this.modes.addMode(name, config)
  }
}
