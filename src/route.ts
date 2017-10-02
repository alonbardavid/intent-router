import { ScreenType, NavState } from "./screen"

export type NavigationCommand = false | SuccessfulNavigationCommand
export type SuccessfulNavigationCommand = NavState & {
  mode?: string
  navigatorStyle?: any
  container?: string
  reset?: boolean
}
export type AddRouteOptions = {
  container?: string
  mode?: string
  from?: ScreenType
  when?: string
  to?: ScreenType
  navigatorStyle?: any
  match?: (current: NavState, intent: string) => boolean
  resolve?: (
    current: NavState,
    intent: string,
    params?: any
  ) => Promise<NavState | boolean>
  showTabs?: boolean
  showNav?: boolean
  props?: () => Object
  reset?: boolean
}

const fromRoutes = new Map<ScreenType, AddRouteOptions[]>()
const whenRoutes = new Map<string, AddRouteOptions>()
const matchRoutes: AddRouteOptions[] = []

export function addRoute(options: AddRouteOptions) {
  if (options.from) {
    fromRoutes.set(
      options.from,
      (fromRoutes.get(options.from) || []).concat(options)
    )
  } else if (options.when) {
    whenRoutes.set(options.when, options)
  } else {
    matchRoutes.push(options)
  }
}
async function processResolve(
  route: AddRouteOptions,
  state: NavState,
  intent: string,
  params?: any
): Promise<NavigationCommand> {
  state = state || ({} as any)
  if (route.resolve) {
    const resolved = await route.resolve(state, intent, params)
    if (typeof resolved != "object") {
      return false
    }
    return {
      navigatorStyle: route.navigatorStyle,
      ...resolved,
      mode: resolved.mode || route.mode,
      reset: route.reset
    }
  }
  return {
    ...state,
    screen: route.to,
    props: route.props,
    mode: route.mode,
    navigatorStyle: route.navigatorStyle,
    reset: route.reset
  }
}
export async function resolveNext(
  intent: string,
  current?: NavState,
  params?: any
): Promise<NavigationCommand> {
  let routes = current ? fromRoutes.get(current.screen) : []
  let route: AddRouteOptions = null
  if (routes) {
    for (route of routes) {
      if (route.when == intent) {
        return await processResolve(route, current, intent, params)
      } else {
        if (route.match && route.match(current, intent)) {
          return await processResolve(route, current, intent, params)
        }
      }
    }
  }
  route = whenRoutes.get(intent)
  if (route) {
    return await processResolve(route, current, intent, params)
  }
  for (route of matchRoutes) {
    if (route.when == intent) {
      return await processResolve(route, current, intent, params)
    } else {
      if (route.match && route.match(current, intent)) {
        return await processResolve(route, current, intent, params)
      }
    }
  }
}
