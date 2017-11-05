import { RouteManager, RouteConfig, IntentType, NavState } from "./routes"
import { routeToCommand } from "./command-resolver"
import { ModeManager } from "./modes"
export const INTENT_INIT = "INIT"

export class IntentRouter<ModeConfig> {
  routes = new RouteManager()
  modes = new ModeManager<ModeConfig>()
  onCurrentChange: (state, prevState) => void
  private _state?: NavState = null

  onIntent = async (intent: string, command: any) => any

  constructor(onCurrentChange?) {
    this.onCurrentChange = onCurrentChange || (() => {})
  }
  route(route: RouteConfig) {
    this.routes.add(route)
  }

  setState = (newState: NavState) => {
    const oldState = this._state
    this._state = newState
    this.onCurrentChange(newState, oldState)
  }

  async startApp() {
    return this.intent(INTENT_INIT)()
  }
  intent = (intent: IntentType) => async (params?) => {
    const resolution = this.routes.resolve(this._state, intent, params)
    const command = await routeToCommand(null, resolution, intent)
    return await this.onIntent(intent, command)
  }
  addMode = (name: string, config: ModeConfig) => {
    this.modes.addMode(name, config)
  }
}
