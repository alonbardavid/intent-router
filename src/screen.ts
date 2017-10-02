import React, { ComponentType } from "react"
import { autorun } from "mobx"
export type ScreenType = ComponentType<any>

export const screens = new Map<
  ScreenType,
  { screen: ScreenType; name: string }
>()

export type NavState = {
  screen: ScreenType
  mode?: string
  props?: () => Object
}

export let current: NavState
export let currentNavigator = null

export function WrapComponent(Component: ScreenType) {
  return class WrappedComponent extends React.Component<any, any> {
    state: any
    dismissAutorun: any
    componentRef: any

    constructor(props = {} as any) {
      super(props)
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
    }
    _resolveState(props) {
      const { _resolve, ...restProps } = props
      if (_resolve) {
        const resolved = _resolve()
        return { props: { ...restProps, ...resolved } }
      } else {
        return { props: restProps }
      }
    }
    onNavigatorEvent = (event: any) => {
      const {
        children,
        navigatorEventID,
        rootTag,
        navigatorID,
        screenInstanceID,
        testID,
        navigator,
        mode,
        ...props
      } = this.props
      switch (event.id) {
        case "didAppear":
          current = {
            screen: screens.get(Component).screen,
            mode: mode || (current && current.mode),
            props
          }
          currentNavigator = navigator
          this.componentRef.componentDidAppear &&
            this.componentRef.componentDidAppear()
          break
        case "bottomTabSelected":
          break
      }
    }
    componentWillMount() {
      let firstRun = true
      this.state = this._resolveState(this.props)
      this.dismissAutorun = autorun(() => {
        const newState = this._resolveState(this.props)
        if (!firstRun) {
          this.setState(newState)
        }
        firstRun = false
      })
    }
    componentWillUnmount() {
      this.dismissAutorun && this.dismissAutorun()
    }
    render() {
      return React.createElement(Component, {
        ...this.state.props,
        ref: (ref: any) => (this.componentRef = ref)
      })
    }
  }
}
export function registerScreen(screen: ScreenType): void
export function registerScreen(
  name: string | ScreenType,
  screen?: ScreenType
): void {
  if (typeof name !== "string") {
    screen = name
    name = screen.name
  }
  name = name + "#" + Math.floor(Math.random() * 10000)
  screens.set(screen, { screen, name })
}
export function getScreenName(screen: ScreenType): string {
  const screenData = screens.get(screen)
  if (!screenData) {
    throw new Error(
      `${screen} cannot be found. Make sure to use registerScreen`
    )
  }
  return screenData.name
}
