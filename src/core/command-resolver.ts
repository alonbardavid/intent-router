import { RouteResolution, IntentType, NavState, ChangeRequest } from "./routes"
import { merge } from "lodash"
export const COMMAND_TYPE_NOOP = "NOOP"
export const COMMAND_TYPE_PUSH = "PUSH"
export const COMMAND_TYPE_POP = "POP"
export const COMMAND_TYPE_CHANGE_MODE = "CHANGE_MODE"

export interface Command {
  type: string
  change?: ChangeRequest
}
export async function routeToCommand(
  current: NavState | null,
  resolution: RouteResolution,
  intent: IntentType
): Promise<Command> {
  const { route, params } = resolution
  let resolved = {}
  if (route.resolve) {
    resolved = await route.resolve(current, intent, params)
    if (typeof resolved != "object") {
      return {
        type: COMMAND_TYPE_NOOP
      }
    }
  }
  const { when, from, to, resolve, match, ...customProps } = route
  const changeRequest = merge(
    {},
    current || {},
    { screen: to },
    customProps,
    resolved
  ) as ChangeRequest
  const type =
    current && current.mode === changeRequest.mode
      ? COMMAND_TYPE_PUSH
      : COMMAND_TYPE_CHANGE_MODE
  return {
    type: changeRequest.type || type,
    change: changeRequest
  }
}
