import { ComponentType } from "react"
export type IntentType = string
export type ModeType = string
export type ContainerType = string

export type ScreenType = ComponentType<any>
export interface NavState {
  mode: ModeType
  screen: ScreenType
  props?: () => Object
}
export interface RouteConfig {
  container?: ContainerType
  mode?: ModeType
  from?: ScreenType
  when?: IntentType
  to?: ScreenType
  match?: (current: NavState, intent: IntentType) => boolean
  resolve?: (
    current: NavState,
    intent: string,
    params?: any
  ) => Promise<ChangeRequest | boolean>
  props?: () => Object
  reset?: boolean
}
export interface ChangeRequest {
  screen: ScreenType
  mode?: ModeType
  props?: () => Object
  type?: string
}
export interface RouteResolution {
  route: RouteConfig
  params?: any
}
export class RouteManager {
  routes
  fromRoutes = new Map<ScreenType, RouteConfig[]>()
  whenRoutes = new Map<IntentType, RouteConfig>()
  matchRoutes: RouteConfig[] = []

  add = (route: RouteConfig) => {
    if (route.from) {
      this.fromRoutes.set(
        route.from,
        (this.fromRoutes.get(route.from) || []).concat(route)
      )
    } else if (route.when) {
      this.whenRoutes.set(route.when, route)
    } else {
      this.matchRoutes.push(route)
    }
  }
  resolve = (
    current: NavState,
    intent: IntentType,
    params?: any
  ): RouteResolution => {
    let route =
      this._resolveFrom(intent, current) ||
      this._resolveWhen(intent, current) ||
      this._resolveMatch(intent, current)
    if (!route) {
      throw new Error(
        `failed to match route for ${intent} from ${current.screen.displayName}`
      )
    }
    return {
      route,
      params
    }
  }
  private _resolveFrom(intent: IntentType, current: NavState): RouteConfig {
    let routes = current ? this.fromRoutes.get(current.screen) : []
    for (let route of routes) {
      if (this._matchRoute(route, intent, current)) {
        return route
      }
    }
  }
  private _resolveWhen(intent: IntentType, current: NavState): RouteConfig {
    return this.whenRoutes.get(intent)
  }
  private _resolveMatch(intent: IntentType, current: NavState): RouteConfig {
    for (let route of this.matchRoutes) {
      if (this._matchRoute(route, intent, current)) {
        return route
      }
    }
  }
  private _matchRoute(
    route: RouteConfig,
    intent: IntentType,
    current: NavState
  ): boolean {
    if (route.when === intent) {
      return true
    }
    return route.match && route.match(current, intent)
  }

  get allRoutes(): RouteConfig[] {
    const fromRoutes = Array.from(this.fromRoutes.values()).reduce(
      (arr, routes) => arr.concat(routes),
      []
    )
    const whenRoutes = Array.from(this.whenRoutes.values())
    return fromRoutes.concat(whenRoutes).concat(this.matchRoutes)
  }
}
