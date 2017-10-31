export class ModeManager<ModeConfig> {
  private _mode = new Map<string, ModeConfig>()

  addMode(name: string, config: ModeConfig) {
    this._mode.set(name, config)
  }
  getMode(name: string) {
    return this._mode.get(name)
  }
}
